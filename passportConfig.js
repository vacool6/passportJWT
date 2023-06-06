const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;
const User = require("./user");

const opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "12345@abc";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    // console.log(jwt_payload);
    User.findById(jwt_payload.id, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        // console.log(user);
        return done(null, user);
      } else {
        return done(null, false);
      }
    });
  })
);
