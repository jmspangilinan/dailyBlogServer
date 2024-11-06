const jwt = require('jsonwebtoken');
const secret = "FitnessTracker"; 


module.exports.createAccessToken = (user) => {

    const data = {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
    };

    return jwt.sign(data, secret, {});
}



module.exports.errorHandler = (err, req, res, next) => {
    
    console.log(err);

    const statusCode = err.status || 500;

    const errorMessage = err.message || 'Internal Server Error';

    res.json({
        error: {
            message: errorMessage,
            errorCode: err.code || 'SERVER ERROR',
            details: err.details || null
        }
    })
}


// auth.js
module.exports.isLoggedIn = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
        return res.status(401).send({ message: "Unauthorized: No token provided" });
    }
    
    jwt.verify(token, secret, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized: Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

