import express from 'express';
import passport from 'passport';
import { registerUser, loginUser, adminLogin } from '../controllers/userControllers.js';
import { googleAuthCallback } from '../controllers/userControllers.js';


const userRouter = express.Router();
userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/admin', adminLogin);

userRouter.get('/google', passport.authenticate("google", { scope: ["profile", "email"] }));
userRouter.get(
    '/google/callback',
    passport.authenticate("google", { session: false }),
    googleAuthCallback
);

export default userRouter;
