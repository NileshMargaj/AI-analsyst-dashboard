import jwt from "jsonwebtoken";

const ensureIsUserAuthenticated = async (req, res, next) => {
    try {
        // Check authorization header first (for API requests)
        let token = null;
        const authHeader = req.headers.authorization;
        
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.substring(7);  // Remove "Bearer " prefix
        } else if (req.cookies && req.cookies.token) {
            // Fall back to cookies (for browser sessions)
            token = req.cookies.token;
        }
        
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