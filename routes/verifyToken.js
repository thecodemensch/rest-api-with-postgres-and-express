const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  console.log(req.header);
  const token = req.header("auth-token");

  if (!token)
    return res.status(401).json({ message: "Not Authorized! Access Denied!" });

  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET);
    req.user = verified;
    next();
  } catch (e) {
    res.status(404).json({ error: e });
  }
};
