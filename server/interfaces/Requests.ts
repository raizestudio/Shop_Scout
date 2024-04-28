import { Request } from "express";
import { User } from "@/interfaces/User";

export interface AuthMiddlewareUserRequest extends Request {
  user: User 
}