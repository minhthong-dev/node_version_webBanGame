const cors = require('cors');
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174', 'https://uiux-version-react.vercel.app'];
const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};
module.exports = cors(corsOptions);