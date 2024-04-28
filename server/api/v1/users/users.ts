import express, { Request, Response } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

// Schemas
import { AnonymousUser, RegularUser } from "@/models/userSchema";
import { Token, TokenRefresh, TokenBlacklist } from "@/models/tokenSchema";

// Interfaces
import { User } from "@/interfaces/User";
import { AuthMiddlewareUserRequest } from "@/interfaces/Requests";

// Middleware
import authMiddleware from "@/middleware/authMiddleware";

const authRouter = express.Router();
const secret = process.env.TOKEN_SECRET



/*
 * Issue a uuid and token for an anonymous user, 
 * the goal is to keep track of the user's session and activities 
 * and if the user decides to sign up, we can associate 
 * the activities with the user's account.
 *
 * POST /temp-user
 * Request body:
 * {
 *   "email": "
 * }
 */
authRouter.post("/anon/gen", async (req: Request, res: Response) => {
  const newId = new mongoose.Types.ObjectId();

  const user = await AnonymousUser.create({
    _id: newId,
  })

  res.status(201).send(user);
});

/*
 * Register a new user
 *
 * POST /register
 * Request body:
 *  {
 *    "email": ""
 *    "password": ""
 *    "username": ""
 *  }
 * 
 * Response:
 */
authRouter.post("/register", async (req: Request, res: Response) => {
  const { username, email, password, firstName, lastName } = req.body;

  // hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  console.log(hashedPassword);

  const newUser = await RegularUser.create({
    "email": email,
    "password": hashedPassword,
    "username": username,
    "firstName": firstName,
    "lastName": lastName,
  })
  .then((user) => {
    
  })
  .catch((err) => {
    if (err.code === 11000) {
      if (err.keyValue.email) {
        res.status(400).send({
          error: "Email already exists",
        });
      } else if (err.keyValue.username) {
        res.status(400).send({
          error: "Username already exists",
        });
      }
    }
  });

  res.status(201).send(newUser);
});

/*
 * Authenticate a user
 *
 * POST /auth
 * Request body:
 *  {
 *    "email": ""
 *    "password": ""
 *  }
 * 
 * Response:
 */
authRouter.post("/auth", async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if ((!email && !username) || !password) {
    res.status(400).send({
      error: "Email and password are required",
    });
    return;
  }
  let user = {} as User | null;
  if (!email) {
    user = await RegularUser.findOne({ username: username });
  } else {
    user = await RegularUser.findOne({ email: email });
  }

  if (!user) {
    res.status(200).send({
      error: "User not found",
    });
    return;
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    res.status(200).send({
      error: "Invalid password",
    });
    return;
  }

  // TODO: We probably need to check if the user already has a valid token or refresh token before issuing a new one.
  // We can do this by checking the Token and TokenRefresh collections for the user's ID

  if (user && result) {
    const accessToken = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET, { expiresIn: "30m" });
    const refreshToken = crypto.randomBytes(64).toString("hex");
    const expires = new Date();
    expires.setHours(expires.getHours() + 2);
    
    await Token.create({
      token: accessToken,
      userId: user._id,
    });

    await TokenRefresh.create({
      token: refreshToken,
      userId: user._id,
    });
    
    res.header("auth-token", accessToken).send({accessToken, refreshToken});
  }
});

/*
 * Identify a user based on the token
 *
 * POST /identify
 * Request body:
 *  {
 *    "token": ""
 *  }
 * 
 * Response:
 *  {
 *    "_id": "",
 *    "username": "",
 *    "email": "",
 *    "createdAt": "",
 *    "updatedAt": ""
 *  }
 * 
 */
authRouter.post("/identify", authMiddleware, async (req: Request, res: Response) => {
  const reqWithUser = req as AuthMiddlewareUserRequest;
  const user = reqWithUser.user;

  try {
    const userDocument = await RegularUser.findOne({ _id: user._id });
    res.send(userDocument);
  } catch (err) {
    console.log("Error", err)
    res.status(400).send({
      error: "Invalid token",
    });
  }
});

export default authRouter;

authRouter.post("/refresh", async (req: Request, res: Response) => {
  const { refreshToken, force } = req.body;
  const token = req.header("auth-token");

  if (!refreshToken || !token) {
    res.status(400).send({
      error: "Refresh and/or token is required",
    });
    return;
  }

  const refresh = await TokenRefresh.findOne({ token: refreshToken });

  if (!refresh) {
    res.status(400).send({
      error: "Refresh token is not valid",
    });
    return;
  }

  let userId: string | null = null;
  let userDocument: any = {};
  let decodedUser: any = {};

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);  // TODO: add a force refresh option
    decodedUser = jwt.decode(token);
    console.log("decodedUser fisrt", decodedUser)
    if (!force) {
      res.status(400).send({
        error: "Token is still valid",
      });
      return;
    }
    userDocument = await RegularUser.findOne({ _id: decodedUser._id });

  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      decodedUser = jwt.decode(token);
      console.log("decodedUser", decodedUser)
      userDocument = await RegularUser.findOne({ _id: decodedUser._id });
    }
  }
  
  console.log("userId", userDocument._id)
  console.log(refresh.userId)
  if (!userDocument._id) {
    res.status(400).send({
      error: "Token is was not issued to a valid user",
    });
    return;
  }

  if (String(userDocument._id) !== String(refresh.userId)) {
    res.status(400).send({
      error: "Token does not match refresh token user",
    });
    return;
  }

  const accessToken = jwt.sign({ _id: userDocument._id }, process.env.TOKEN_SECRET, { expiresIn: "30m" });
  const newRefreshToken = crypto.randomBytes(64).toString("hex");

  await Token.create({
    token: accessToken,
    userId: userDocument._id,
  });

  await TokenBlacklist.create({
    token: token,
    userId: userDocument._id,
    firstIssuedAt: decodedUser.iat,
  });

  await Token.deleteOne({ token: token }).exec();

  await TokenRefresh.findOneAndUpdate({ token: refreshToken }, { token: newRefreshToken });

  res.send({ accessToken, refreshToken: newRefreshToken });
});