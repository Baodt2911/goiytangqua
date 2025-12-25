import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { _user } from "src/models";
import { User } from "src/types";
GoogleStrategy.prototype.authorizationParams = function () {
  return {
    access_type: "offline", // Yêu cầu refreshToken
    prompt: "consent", // Hiển thị hộp thoại xin cấp quyền lại
  };
};
export const configPassport = () => {
  // Serialize và deserialize user
  passport.serializeUser((user: any, done) => {
    done(null, user);
  });
  passport.deserializeUser(async (data: any, done) => {
    try {
      const user = await _user
        .findOne({ googleId: data.googleId })
        .lean<User>();
      done(null, { userId: user?._id, role: user?.role });
    } catch (error) {
      done(error, null);
    }
  });
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.URL_ORIGIN + "/auth/google/callback",
        passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
        try {
          const user = {
            googleId: profile.id,
            name: profile.displayName,
            email: profile._json.email,
            googleRefreshToken: refreshToken,
          };
          const existingUser = await _user
            .findOneAndUpdate(
              { email: user.email },
              { $setOnInsert: user },
              {
                upsert: true,
                new: true,
              }
            )
            .lean();
          return done(null, {
            userId: existingUser._id,
            role: existingUser.role,
          });
        } catch (error) {
          return done(error, undefined);
        }
      }
    )
  );
};
