const jwt = require("jsonwebtoken");
const createError = require("http-errors");

module.exports.isAuthenticated = (req, res, next) => {
  // check there's an Authorization header
  const authorization = req.header("Authorization");
  if (authorization) {
    // check Authorization is Bearer
    const [type, token] = authorization.split(" ");
    if (type === "Bearer") {
      // get token, verify it's correct
      jwt.verify(
        token,
        process.env.JWT_SECRET || "changeme",
        (error, decodedJwt) => {
          if (error) {
            throw createError(401);
          }
          if (decodedJwt) {
            // store user id in request
            req.currentUser = decodedJwt._doc._id;
            next();
            return;
          }
        }
      );
    } else {
      throw createError(401);
    }
  } else {
    throw createError(401);
  }
};

module.exports.isNotAuthenticated = (req, res, next) => {
  const authorization = req.header("Authorization");
  if (!authorization) {
    next();
  } else {
    next(createError(401));
  }
};
