const SessionService = require('../services/session');
const FileUploadService = require('../services/file-upload');

module.exports = class PostVocabController {

    constructor(
        vocabulary, submission, user
    ) {
        this.vocabulary = vocabulary;
        this.submission = submission;
        this.user = user;
    }

    async post(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const body = req.body;

        const tts = body.tts;
        if (tts) {
            const file = req.files.audio;
            if (!file.name.endsWith(".mp3")) {
                return res.redirect("queue");
            }
            const filename = template.userId + "-" + new Date().getTime() + ".mp3";
            const success = (await FileUploadService.upload(file, filename));
            console.log(success);
            if (!success) {
                return res.status(500).render("404");
            }
            await this.submission.createSubmission(
                template.userId,
                body.request_id,
                null,
                filename,
            );
            res.redirect('/queue');
        } else {
            await this.submission.createSubmission(
                template.userId,
                body.request_id,
                body.content,
            );
        }
        res.redirect("/queue");
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const request = (await this.vocabulary.getVocab(req.params.id));
        if (request === null) {
            return res.render("404");
        }
        res.render('vocabulary-post', {
            ...template,
            id: req.params.id,
            tts: request.content !== "undefined",
        });
    }

}
