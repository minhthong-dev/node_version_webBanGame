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
// xac thuc email
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
// xac thuc otp forgot password
exports.sendForgotPasswordOTP = async (userEmail, otpCode) => {
    try {
        const response = await fetch('https://email-tan-ten.vercel.app/api/sendResetMail', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userEmail,
                otpCode
            })
        });

        if (!response.ok) {
            const errText = await response.text();
            console.error('Error from Vercel API:', errText);
            return false;
        }

        // console.log('Reset email request sent successfully via Vercel API');
        return true;

    } catch (err) {
        console.error('Failed to send reset email via Vercel API:', err);
        return false;
    }
}
exports.sendBuyGameSuccessEmail = async (userEmail, boughtGames) => {
    try {
        const gameRows = boughtGames.map((item, index) => `
        <tr>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">${index + 1}</td>
            <td style="padding: 12px; border-bottom: 1px solid #eee;"><strong>${item.name}</strong></td>
            <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center;">
                <code style="background: #fff5f5; color: #e74c3c; padding: 5px 10px; border-radius: 4px; font-weight: bold; border: 1px solid #ffc9c9; font-size: 16px;">
                    ${item.key}
                </code>
            </td>
        </tr>
    `).join('');
        await fetchFunc(`https://email-tan-ten.vercel.app/api/sendVerificationEmail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: userEmail,
                subject: `Xác nhận đơn hàng - ${boughtGames.length} Game đã được thanh toán`,
                html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; color: #333; border: 1px solid #e1e4e8; border-radius: 10px; overflow: hidden;">
                    <div style="background: #2c3e50; padding: 25px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Giao Dịch Thành Công!</h1>
                    </div>
                    
                    <div style="padding: 30px;">
                        <p>Chào bạn, cảm ơn bạn đã tin tưởng <strong>Web Bán Game Cho Người Nghèo</strong>. Dưới đây là danh sách mã kích hoạt (Key) các bản game bạn đã mua:</p>
                        
                        <table style="width: 100%; border-collapse: collapse; margin: 25px 0;">
                            <thead>
                                <tr style="background-color: #f8f9fa; color: #555;">
                                    <th style="padding: 12px; border-bottom: 2px solid #dee2e6; width: 40px;">#</th>
                                    <th style="padding: 12px; border-bottom: 2px solid #dee2e6; text-align: left;">Tên Game</th>
                                    <th style="padding: 12px; border-bottom: 2px solid #dee2e6;">Mã Kích Hoạt</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${gameRows}
                            </tbody>
                        </table>

                        <div style="background: #fff9db; padding: 15px; border-radius: 5px; border-left: 5px solid #fcc419; margin-top: 20px;">
                            <p style="margin: 0; font-size: 13px; color: #856404;">
                                <strong>Lưu ý:</strong> Nếu bạn mua nhiều bản của cùng một game, hãy sử dụng các mã key khác nhau cho mỗi tài khoản kích hoạt.
                            </p>
                        </div>
                        
                        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
                            <p style="color: #7f8c8d; font-size: 14px;">Chúc bạn có những giây phút chơi game vui vẻ!</p>
                        </div>
                    </div>
                </div>
            `
            })
        });
        return true;
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
exports.sendUpdatePassEmail = async (userEmail, otpCode) => {
    try {
        await fetchFunc(`https://email-tan-ten.vercel.app/api/sendVerificationEmail`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                to: userEmail,
                subject: `OTP YÊU CẦU CẬP NHẬT MẬT KHẨU`,
                html: `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; max-width: 600px; margin: auto; color: #333; border: 1px solid #e1e4e8; border-radius: 10px; overflow: hidden;">
    <div style="background: #2c3e50; padding: 25px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 24px;">Xác Nhận Thay Đổi Mật Khẩu</h1>
    </div>
    
    <div style="padding: 30px;">
        <p>Chào bạn,</p>
        <p>Chúng tôi nhận được yêu cầu thiết lập lại mật khẩu cho tài khoản của bạn tại <strong>Web Bán Game Cho Người Nghèo</strong>. Vui lòng sử dụng mã xác thực (OTP) dưới đây để hoàn tất quá trình:</p>
        
        <div style="text-align: center; margin: 30px 0;">
            <div style="display: inline-block; background: #f8f9fa; border: 2px dashed #2c3e50; padding: 15px 40px; font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #e67e22; border-radius: 8px;">
                ${otpCode}
            </div>
            <p style="font-size: 13px; color: #7f8c8d; margin-top: 10px;">Mã này có hiệu lực trong vòng 15 phút.</p>
        </div>

        <div style="background: #fff5f5; padding: 15px; border-radius: 5px; border-left: 5px solid #ff6b6b; margin-top: 20px;">
            <p style="margin: 0; font-size: 13px; color: #c92a2a;">
                <strong>Cảnh báo bảo mật:</strong> Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này hoặc liên hệ hỗ trợ ngay lập tức để bảo vệ tài khoản. <strong>Tuyệt đối không chia sẻ mã này với bất kỳ ai.</strong>
            </p>
        </div>
        
        <div style="margin-top: 40px; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">
            <p style="color: #7f8c8d; font-size: 14px;">Hệ thống hỗ trợ game thủ vượt khó!</p>
        </div>
    </div>
</div>
            `
            })
        });
    } catch (error) {
        return false;
    }
}