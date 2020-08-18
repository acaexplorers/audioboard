module.exports = class User {

    constructor(dbInstance) {
        this.database = dbInstance;
    }

    createSubmission(
        author_id,
        request_id,
        content,
        audiofilepath,
    ) {
        return new Promise((resolve, reject) => {
            this.database.query(
                `INSERT INTO vocab_submissions (
            request_id,
            author_uuid,
            content,
            audiofilepath
        ) VALUES(
            '${request_id}',
            '${author_id}',
            '${content}',
            '${audiofilepath}'
        )`).then(() => resolve(undefined));
        });
    }

    getAllSubmissions() {
        return new Promise(async (resolve, reject) => {
            const result = (await this.database.query(
                `SELECT
                    s.author_uuid as submission_author,
                    r.author_uuid as request_author,
                    s.content,
                    r.title,
                    s.audiofilepath,
                    r.tags,
                    r.notes,
                    r.transcription,
                    s.request_id,
                    s.id
                FROM vocab_submissions as s
                JOIN vocab_requests as r
                    ON s.request_id=r.id;
                `
            ));
            const prepared = [];
            for (let data of result) {
                prepared.push({
                    id: data.id,
                    request_id: data.request_id,
                    title: data.title,
                    words: data.content.split(" ").length,
                    requester_uuid: data.request_author,
                    submitter_uuid: data.submission_author,
                    tags: data.tags,
                    notes: data.notes,
                    content: data.content,
                    transcription: data.transcription,
                    audiofilepath: data.audiofilepath,
                    request_id: data.request_id,
                });
            }
            resolve(prepared);
        });
    }

    getSubmission(id) {
        return new Promise(async (resolve, reject) => {
            const result = (await this.database.query(
                `SELECT
                    s.author_uuid as submission_author,
                    r.author_uuid as request_author,
                    s.content,
                    r.title,
                    s.audiofilepath,
                    r.tags,
                    r.notes,
                    r.transcription,
                    s.request_id,
                    s.id
                FROM vocab_submissions as s
                JOIN vocab_requests as r
                    ON s.request_id=r.id
                WHERE s.id='${id}';
                `
            ));
            console.log(result);
            if (!result[0]) {
                return resolve(null);
            }
            resolve(result[0]);
        });
    }

    accept(id) {
        return new Promise(async (resolve, reject) => {
            const result = (await this.database.query(
                `
                UPDATE vocab_submissions
                SET accepted='1'
                WHERE id='${id}';
                `
            ));
            resolve();
        });
    }

}

