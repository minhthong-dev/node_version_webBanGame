const { getShortLink, deleteShortLink } = require('../utils/shortlink/shortlink');
const express = require('express');

exports.handleShortLink = async (req, res) => {
    const { shortId } = req.params;
    const doc = getShortLink(shortId);
    if (!doc) {
        return res.status(404).json({ error: "loi khi xac thuc" });
    }
    res.redirect(doc.targetUrl);
}   