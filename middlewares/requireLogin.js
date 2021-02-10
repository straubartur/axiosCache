require('dotenv').config()
const jwt = require('jsonwebtoken');
const decode = require('jsonwebtoken/decode');

module.exports = (req, res, next) => {
  try {
    const authorizationHeader = (req.headers.authorization || '').split(/\s/)
    const token = authorizationHeader && (authorizationHeader.length > 0) && authorizationHeader[1]
    jwt.verify(token, process.env.AUTH_CONFIG, function(err, decoded) {
      if (decoded && decoded.id) {
        if(decoded.tid && (decoded.tid !== 'null') && (decoded.tid !== 'undefined')) {
          req.tenantId = decoded.tid; 
        }

        if(decoded.resId && (decoded.resId !== 'null') && (decoded.resId !== 'undefined')) {
          req.resellerId = decoded.resId;
        }

        next();      
      } else {
        res.status(403).json({
          message: 'Voce precisa estar logado para seguir'
        });
      }
  });
  } catch {
        res.status(401).json({
          message: new Error('Invalid request!')
        });
  }
};