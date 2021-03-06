const jwt = require("jsonwebtoken");
const createError = require("http-errors");
const User = require("../models/User.model");
const {
  getAccessToken,
  getUser,
  getUserByUsername,
  getUserByUsernameRepos,
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

    const user = await getUser(result.access_token);

    const dbUser = await User.findOne({ githubID: user.id });

    if (dbUser) {
      console.log("DBB");
      res.json({
        access_token: signToken(dbUser),
      });
    } else {
      console.log("DBB1");
      const createdUser = await User.create({
        displayName: user.name,
        githubID: user.id,
        userName: user.login,
      });

      console.log("DBB2");

      res.json({
        access_token: signToken(createdUser),
      });
    }
  } catch (e) {
    next(e);
  }
};

module.exports.getMe = async (req, res, next) => {
  console.log(req.currentUser);
  try {
    const user = await User.findById(req.currentUser);

    const result = await getUserByUsername(user.userName);
    const repos = await getUserByUsernameRepos(user.userName);
    res.json({ ...result, repos });
  } catch (e) {
    next(e);
  }
};
