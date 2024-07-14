const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401); // No token, unauthorized

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token, forbidden
        req.user = user; // Attach decoded user information to request
        next(); // Proceed to the next middleware/route handler
    });
};

module.exports = authenticateToken;
