import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
//this part is for the auth middleware that will be used to verify the JWT token sent by the client in the Authorization header.
//  It will check if the token is valid and not expired, and if so, it will allow the request to proceed to the next middleware or route handler.
//  If the token is invalid or missing, it will return an error response.

// Define the secret key for signing and verifying JWT tokens. In a production environment, this should be stored securely in environment variables.
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_crypto_key';

// Middleware function to verify JWT token in the Authorization header
export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if(!authHeader){
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token =authHeader.split(' ')[1];
  try{
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } 
  catch(err){
    res.status(403).json({error: 'Invalid or expired token'});
  }
};