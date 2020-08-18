const SessionService = require('../services/session');

module.exports = class RequestVocabController {

    constructor(vocabularyModel) {
        this.vocabulary = vocabularyModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const vocab = (await this.vocabulary.getVocab(req.params.id || 0));
        if (vocab === null) {
            return res.render("404");
        }
        res.render("details", {
            ...template,
            ...vocab
        });
    }
}
