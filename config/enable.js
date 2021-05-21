'use strict';
// enabling config files (to be used in config folders having available and enabled dirs)
const fs = require('../base/fs');

module.exports = (workdir, filenames) => {
    // check if links are valid, renew if not
    let linksToEnable = [];
    if (filenames instanceof Array && filenames.length > 0) {
        filenames.forEach((file) => {
            const target = fs.pathResolve(workdir, 'available', file);
            const link = fs.pathResolve(workdir, 'enabled', file);
            fs.link(target, link);
            linksToEnable.push(file);
        });
    }
    // detect links removed in config in order to remove related files
    const existingLinks = fs.files(workdir, 'enabled');
    const linksToRemove = existingLinks.filter((file) => !linksToEnable.includes(file));
    if (linksToRemove.length > 0) {
        linksToRemove.forEach((file) => {
            fs.unlink(workdir, 'enabled', file);
        });
    }
};
