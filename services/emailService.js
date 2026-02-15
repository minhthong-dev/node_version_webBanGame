const express = require('express');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { createShortLink, deleteShortLink } = require('../utils/shortlink/shortlink');
const User = require('../models/User');
const path = require('path');

let fetchFunc;
if (typeof fetch === "function") {
    fetchFunc = fetch;
} else {
    try {
        fetchFunc = require("node-fetch");
    } catch (err) {
        throw new Error("No fetch available. Install node-fetch or use Node 18+.");
    }
}
exports.sendEmailVerification = async (userId, email, verifyToken) => {
    try {
        const shortId = crypto.randomBytes(4).toString("hex");
        const verifyUrl = `${process.env.BACKEND_URL}/api/users/verify-email?token=${verifyToken}&shortId=${shortId}`;

        await createShortLink({
            shortId,
            type: "verify_email",
            payload: { userId },
            targetUrl: verifyUrl,
            ttlSeconds: 3600
        });

        const shortUrl = `${process.env.BACKEND_URL}/v/${shortId}`;

        await fetchFunc(`https://email-tan-ten.vercel.app/api/sendVerificationEmail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: email,
                subject: "Xác thực tài khoản",
                html: `Bấm vào đây để xác thực tài khoản: <a href="${shortUrl}">${shortUrl}</a>`
            })
        });

        return { shortUrl };
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.verifyEmail = async (token, shortId, res) => {
    try {
        if (!token) return res.status(400).send("Missing token");
        const user = await User.findOne({ verifyToken: token });
        if (!user) {
            return res.status(400).send("Invalid or expired token.");
        }
        user.isVerified = true;
        user.verifyToken = null;
        await user.save();
        if (shortId) {
            await deleteShortLink(shortId);
        }

        return res.status(200).send("xin chao em iu");
    } catch (err) {
        return res.status(500).send(err.message);
    }
}
