const axios = require("axios");

const http = axios.create();

http.interceptors.response.use((res) => res.data);

module.exports.getAccessToken = (code) => {
  return http.post(
    "https://github.com/login/oauth/access_token",
    {},
    {
      params: {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      },
      headers: {
        Accept: "application/json",
      },
    }
  );
};

module.exports.getUser = (accessToken) => {
  return http.get("https://api.github.com/user", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
};

module.exports.getUserByUsername = (userName) => {
  return http.get(`https://api.github.com/users/${userName}`);
};
