var qs = require("querystring");

module.exports = function (opt) {
    opt = opt || {};
    var debug = opt.debug || false;
    var log = opt.log || console.log;
    var pattern = /\?(.*)$/;
    return function (req,res,next) {
        req.url = req.url.replace(pattern, function (all, q) {
            req.query = qs.parse(q);
            if(debug) log(req.query);
            return '';
        });
        next();
    };
};
