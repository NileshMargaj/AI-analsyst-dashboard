import jwt from "jsonwebtoken";

const ensureIsUserAuthenticated = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        
        if (!token) {
            return res.status(401).json({ 
                message: "No token provided. Please login." 
            });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(403).json({ 
            message: "Invalid or expired token, Please! login first" 
        });
    }
};

export default ensureIsUserAuthenticated;