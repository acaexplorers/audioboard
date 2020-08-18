const SessionService = require("../services/session");

module.exports = class LoginController {

    constructor(userModel, submissionModel, vocabularyModel) {
        this.user = userModel;
        this.submission = submissionModel;
        this.vocabulary = vocabularyModel;
    }

    async get(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const submissions = (await this.submission.getAllSubmissions());
        const requests = (await this.vocabulary.getAllVocabs());
        for (const submission of submissions) {
            submission.author = (await this.user.getUsernameById(submission.requester_uuid));
        }
        return res.render("dashboard", {
            ...template,
            submissions,
            requests,
        });
    }

    async accept(req, res) {
        const template = (await SessionService.viewParamsTemplate(req.session));
        const id = req.params.id;

        const paramsSubmission = (await this.submission.getSubmission(id));
        if (paramsSubmission === null) {
            return res.render("404");
        }
        await this.submission.accept(id);
        await this.vocabulary.submitted(paramsSubmission.request_id, id);
        res.redirect("/dashboard");
    }
}
