import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_crypto_key';

export const verifyToken = (req: any, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid or expired token' });
  }
};