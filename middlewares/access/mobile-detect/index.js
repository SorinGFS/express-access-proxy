'use strict';
// the main goal is to provide faster fingerprint parameters without loosing accuracy
// the secondary goal is to detect device type in order to be able to provide customized content
// all the extra information should be used only for logging metrics purposes
const MobileDetect = require('mobile-detect');

// default uaPattern, may be overwritten in server config
const uaPattern = {
    assumedBot: 'bot',
    serpBot: 'google|facebook|twitter|wordpress|yahoo|bing|yandex|baidu|duck|linkedin|msn|aol|aws|sogou|naver|ecosia',
    tracker: 'ahrefs|alexa|semrush|similarweb|voluum',
    crawler: 'scan|spider|crawl|slurp|feed|reader|archive',
    allowedBot: '',
};

function device(req, res, next) {
    req.performer = 'mobileDetect';
    if (req.server.mobileDetect) {       
        const detect = new MobileDetect(req.headers['user-agent']);
        const device = {};
        device.isPhone = detect.phone();
        device.isTablet = detect.tablet();
        device.isMobile = !!device.isPhone || !!device.isTablet;
        device.isComputer = !device.isMobile;
        device.type = device.isComputer ? 'computer' : device.isTablet ? 'tablet' : device.isPhone ? 'phone' : 'unidentified';
        
        if (req.server.mobileDetect.client) {
            const customUaPattern = Object.assign({}, uaPattern, req.server.mobileDetect.client);
            device.client = 'maybeHuman';
            if (detect.match(customUaPattern.assumedBot)) device.client = 'assumedBot';
            if (detect.match(customUaPattern.serpBot)) device.client = 'serpBot';
            if (detect.match(customUaPattern.tracker)) device.client = 'tracker';
            if (detect.match(customUaPattern.crawler)) device.client = 'crawler';
            if (customUaPattern.allowedBot && detect.match(customUaPattern.allowedBot)) device.client = 'allowedBot';
        }

        if (req.server.mobileDetect.browser) {
            device.browser = {};
            device.browser.userAgent = detect.userAgent();
            device.browser.version = detect.version(device.browser.userAgent);
            device.browser.os = detect.os();
        }

        req.device = device;
    }
    next();
}

module.exports = device;
