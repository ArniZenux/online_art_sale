import rateLimit from 'express-rate-limit';

export const loginLimier = rateLimit( {  
  windowMs: 1 * 60 * 1000, // 1 min  
  max: 5, // limit to 5 attemts
  message: 'Too many attempts.... wait and try again after 1 minutes..', 
});