import jwt from "jsonwebtoken";

const isAuth = (req, res, next) => {
    console.log("AUTH MIDDLEWARE")
    const authHeader = req.get("Authorization");
    if(!authHeader) {
        req.isAuth = false;
        return next();
    }
    const token = authHeader.split(' ')[1];
    if(!token || token === "") {
        req.isAuth = false;
        return next();
    }
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, "somesupersecretkey")
    } catch (err) {
        req.isAuth = false;
        return next();
    }
    if(!decodedToken) {
        req.isAuth = false;
        return next();
    }
    console.log("SUCCESS GET TOKEN")
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
}

export default isAuth;