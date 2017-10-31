const b58 = require('base58');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URL, { useMongoClient: true });
mongoose.Promise = global.Promise;

const UrlSchema = new mongoose.Schema({
    long_url: String,
    short_url: String
});
UrlSchema.pre('save', function (next) {
    var self = this;
    self.constructor.count(function (err, data) {
        if (err)
            return next(err);
        let now = new Date();
        let key = b58.encode('' + now.getSeconds() + now.getDate() + now.getMonth() + data);
        self.short_url = key;
        return next();
    });
});
const Url = mongoose.model('Url', UrlSchema);

async function get(short_url) {
    return await Url.findOne({ short_url });
}
async function save(long_url) {
    let url = new Url({
        long_url
    });
    return await url.save();
}
module.exports = { get, save }