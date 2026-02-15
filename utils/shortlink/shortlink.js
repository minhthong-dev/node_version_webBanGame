const express = require('express');

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "shortlinks.json");

function loadJson() {
    if (!fs.existsSync(DB_PATH)) return {};
    const data = fs.readFileSync(DB_PATH, "utf8").trim();
    return data ? JSON.parse(data) : {};
}
function saveJson(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf8");
}
exports.createShortLink = function({ shortId: providedShortId, targetUrl, type, payload, ttlSeconds }) {
    const shortId = providedShortId || crypto.randomBytes(4).toString("hex");
    const db = loadJson();

    db[shortId] = {
        targetUrl,
        type,
        payload,
        expiresAt: Date.now() + ttlSeconds * 1000
    };

    saveJson(db);

    return { shortId };
}

exports.getShortLink = function(shortId) {
    const list = loadJson();
    // console.log("list", list);
    const doc = list[shortId];
    // console.log("doc:", doc);
    if (!doc) return null;
    if (doc.expiresAt && doc.expiresAt < Date.now()) {
        delete list[shortId];
        saveJson(list);
        return null;
    }

    return doc;
}
exports.deleteShortLink = function(shortId) {
    const list = loadJson();

    if (list[shortId]) {
        delete list[shortId];
        saveJson(list);
    }

    return true;
}