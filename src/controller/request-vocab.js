const SessionService = require('../services/session');
const FileUploadService = require('../services/file-upload');

module.exports = class RequestVocabController {

    constructor(vocabularyModel) {
        this.vocabulary = vocabularyModel;
    }

    async stepOne(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        return res.render('vocabulary-request', {
            ...template,
            is_first_step: false,
            audio_requested: req.body.selection === 'audio',
        });
    }

    async stepTwo(req, res) {
        const data = req.body;
        const template = (await SessionService.viewParamsTemplate(req.session));
        if (data.type === 'tts') {
            this.vocabulary.
                createVocabulary(
                    template.userId,
                    true,
                    data.title,
                    data.text,
                    data.notes,
                    null,
                    data.tags,
                ).then(() => {
                    return res.redirect('/queue');
                });
        } else {
            const filename = template.userId + "-" + new Date().getTime() + ".mp3";
            const success = (await FileUploadService.upload(
                req.files.audio,
                filename,
            ));
            this.vocabulary.
                createVocabulary(
                    template.userId,
                    true,
                    data.title,
                    null,
                    data.notes,
                    filename,
                    data.tags,
                ).then(() => {
                    return res.redirect('/queue');
                });
        }
    }

    post(req, res) {
        if (req.body.step === 'one') {
            return this.stepOne(req, res);
        } else {
            return this.stepTwo(req, res);
        }
    }

    async get(req, res) {
        const template = (SessionService.viewParamsTemplate(req.session));
        res.render('vocabulary-request', {
            ...template,
            is_first_step: true,
        });
    }

}
