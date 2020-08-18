const SessionService = require('../services/session');
const Submission = require('../models/submission');

module.exports = class QueueController {

    constructor(submission, userModel) {
        this.submission = submission;
        this.user = userModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const queueItems = (await this.submission.
            getAllSubmissions());
        for (let queueItem of queueItems) {
            queueItem.author = (await this.user.getUsernameById(
                queueItem.author_uuid)) || 'error';
        }
        res.json(queueItems);
    }
}

