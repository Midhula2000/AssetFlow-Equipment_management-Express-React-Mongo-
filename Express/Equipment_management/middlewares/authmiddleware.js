// for verifying token for protected route

var jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;
    console.log("token", token);
 
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized - Missing token' });
    }
 
    jwt.verify(token.split(' ')[1], process.env.JWT_SECRET , (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized - Invalid token' });
      }
 
      req.user = { id: decoded.userId , role: decoded.role};
      next();
    });
  };

module.exports = verifyToken;