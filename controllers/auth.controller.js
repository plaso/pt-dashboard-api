const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User.model");
const {
  getAccessToken,
  getUser,
  getUserByUsername,
} = require("../services/GHAuthService");

const signToken = (user) => {
  return jwt.sign({ ...user }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

module.exports.login = (req, res, next) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&scope=user:email`
  );
};

module.exports.loginCb = async (req, res, next) => {
  try {
    const result = await getAccessToken(req.body.code);

    console.log({ result });

    const user = await getUser(result.access_token);

    console.log({ user });

    const dbUser = await User.findOne({ githubID: user.id });

    console.log({ dbUser });

    if (dbUser) {
      res.json({
        access_token: signToken(dbUser),
      });
    } else {
      const createdUser = await User.create({
        displayName: user.name,
        githubID: user.id,
        userName: user.login,
      });

      console.log({ createdUser });

      res.json({
        access_token: signToken(createdUser),
      });
    }
  } catch (e) {
    next(createError(401));
  }
};

module.exports.getMe = async (req, res, next) => {
  console.log(req.currentUser);
  try {
    const user = await User.findById(req.currentUser);

    const result = await getUserByUsername(user.userName);
    res.json(result);
  } catch (e) {
    next(e);
  }
};
