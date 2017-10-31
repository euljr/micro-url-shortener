require('dotenv').config();
const { send, json } = require('micro');
const micro = require('micro');
const { get, save } = require('./database');

const server = micro(async (req, res) => {
    switch (req.method) {
        case 'POST':
            return await handlePost(req, res);
        case 'GET':
            return await handleGet(req, res);
    }
    return send(res, 405);
})

async function handleGet(req, res) {
    let data = req.url.split('/').filter(u => u !== '');
    if(data.length !== 1)
        return send(res, 400);
    let shortUrl = await get(data[0]);
    if(!shortUrl)
        return send(res, 404);
    return shortUrl;
}

async function handlePost(req, res) {
    if(req.url !== '/')
        return send(res, 400);
    let data = await json(req);
    if(!data.long_url)
        return send(res, 400);
    return await save(data.long_url);
}

server.listen(3000);