const passport = require("passport")
const LocalStrategy=require('passport-local').Strategy
const bcrypt=require('bcrypt')
const User=require('./models/user')

// Use the LocalStrategy for Passport
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({ email }, (err, user) => {
        // If there is an error, return it
        if (err) {
          return done(err);
        }
        // If there is no user with the given email, return false
        if (!user) {
          return done(null, false);
        }
        // Compare the password entered by the user with the hashed password stored in the database
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) {
            return done(err)
          }
          // If the passwords don't match, return false
          if (!isMatch) {
            return done(null, false)
          }
          // If the passwords match, return the user
          return done(null, user)
        })
      })
    }
  )
)

// Serialize the user to store in the session
passport.serializeUser((user, done) => {
  done(null, user.id)
});

// Deserialize the user from the session
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

// Export the Passport configuration
module.exports=passport
