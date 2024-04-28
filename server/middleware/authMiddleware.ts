import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Interfaces 
import { AuthMiddlewareUserRequest } from "@/interfaces/Requests";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const reqWithUser = req as AuthMiddlewareUserRequest;
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).send("Access Denied");
  }
  
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log("verified", verified);
    reqWithUser.user = verified;
    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).send({error: "Token expired"});
    }
    console.log(err);
    res.status(400).send(err);
  }
}

export default authMiddleware;