/*
call like:

route('*', plugin('cors'({
    methods: ['GET', 'POST'],
    origin: /yourDomain.tld/
})));

if you want CORS everywhere, just pass '*'

*/

module.exports = function (opt) {
    opt = opt || {};

    // GET is supported by default
    opt.methods = (opt.methods && opt.methods.length ?
        opt.methods : ['GET']).join(',');

    // allow any origin by default
    opt.origin = opt.origin || '*';

    opt.headers = opt.headers || 'X-Requested-With';

    return function (req, res, next) {
        var CORS;

        if (opt.origin === '*' ) {
            CORS = '*';
        } else if (req.headers && req.headers.origin &&
            opt.origin.test(req.headers.origin)) {
            CORS = req.headers.origin;
        }

        if (CORS) {
            res.setHeader("Access-Control-Allow-Origin", CORS);
            res.setHeader("Access-Control-Allow-Methods", opt.methods);
            res.setHeader("Access-Control-Allow-Headers", opt.headers);
        }

        next();
    };
};
