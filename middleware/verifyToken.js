import jwt from "jsonwebtoken";

const verifyTokenMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; // Store the decoded token in the request object
      next(); // Proceed to the next middleware or route handler
    } catch (error) {
      res.sendStatus(403); // Token is invalid or expired
    }
  } else {
    res.sendStatus(401); // No token provided
  }
};

export default verifyTokenMiddleware;
