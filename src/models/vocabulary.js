module.exports = class Vocabulary {

    constructor(dbInstance) {
        this.database = dbInstance;
    }

    createVocabulary(
        author_id,
        isTranscription,
        title,
        content,
        notes,
        audiofilepath,
        tags,
    ) {
        return new Promise((resolve, reject) => {
            this.database.query(`INSERT INTO vocab_requests(
            author_uuid,
            transcription,
            title,
            content,
            notes,
            audiofilepath,
            tags
        ) VALUES(
            '${author_id}',
            '${isTranscription ? 0 : 1}',
            '${title}',
            '${content}',
            '${notes}',
            '${audiofilepath}',
            '${tags}'
        )`).then(() => resolve(undefined));
        });
    }

    getAllVocabs() {
        return new Promise(async (resolve, reject) => {
            const result = (await this.database.query(
                `SELECT *, r.id as id FROM vocab_requests as r
                JOIN users as u on r.author_uuid=u.id;`
            ));
            const prepared = [];
            for (let data of result) {
                prepared.push({
                    id: data.id,
                    title: data.title,
                    author_uuid: data.author_uuid,
                    author: data.name,
                    words: data.content.split(" ").length || 0,
                });
            }
            resolve(prepared);
        });
    }

    getVocab(id) {
        return new Promise(async (resolve, reject) => {
            const result = (await this.database.query(
                `SELECT
                    *,
                    r.id,
                    u.name as author
                FROM
                vocab_requests as r
                JOIN users AS u
                WHERE r.id='${id}'
                `
            ));
            if (!result[0]) {
                return resolve(null);
            }
            resolve(result[0]);
        });
    }

    submitted(requestId, submissionId) {
        return new Promise(async (resolve, reject) => {
            const result = (await this.database.query(
                `
                UPDATE vocab_requests
                SET submitted='1',
                    submission_id='${submissionId}'
                WHERE id='${requestId}';
                `
            ));
            resolve();
        });
    }

}
