// config/passport.js
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import bcrypt from "bcryptjs";
import userModel from "../models/userModels.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL}/api/users/google/callback`,
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user = await userModel.findOne({ email: profile.emails[0].value });

        if (!user) {
          const randomPassword = Math.random().toString(36).slice(-8);
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(randomPassword, salt);
          user = await userModel.create({
            name: profile.displayName,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            password: hashedPassword,
            role: 0, 
          });
        }

        return cb(null, user);
      } catch (error) {
        return cb(error, null);
      }
    }
  )
);

export default passport;
