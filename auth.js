const jwt = require("jsonwebtoken");

const SECRET = "super_secret_key";

function generateToken(user) {
    return jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        SECRET,
        { expiresIn: "2h" }
    );
}

function verifyToken(req, res, next) {
    const header = req.headers["authorization"];

    if (!header) return res.status(401).send("No token");

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, SECRET);
        req.user = decoded;
        next();
    } catch {
        res.status(403).send("Invalid token");
    }
}

module.exports = { generateToken, verifyToken };