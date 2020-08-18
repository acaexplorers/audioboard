const SessionService = require('../services/session');

module.exports = class SingleSubmissionController {

    constructor(submissionModel, userModel) {
        this.submission = submissionModel;
        this.user = userModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const singleSubmission = (await this.submission.
            getSubmission(req.params.id || 0));
        if (singleSubmission === null) {
            return res.render("404");
        }
        res.render('single-submission', {
            ...template,
            ...singleSubmission,
        });
    }
}
