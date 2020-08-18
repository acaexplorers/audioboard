const SessionService = require('../services/session');

module.exports = class QueueController {

    constructor(vocabularyModel) {
        this.vocabulary = vocabularyModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const queueItems = (await this.vocabulary.
            getAllVocabs());
        res.render('queue', {
            ...template,
            queueItems,
        });
    }
}
