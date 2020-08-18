const config = require('../config');

module.exports = class FileUploadService {
    static upload(file, name) {
        return new Promise(async (resolve) => {
            const dir = config.pth
            file.mv(config.audiodir + name, (err) => {
                if (err) {
                    console.error(err);
                    return resolve(false);
                }
                return resolve(true);
            });
        })
    }
}
