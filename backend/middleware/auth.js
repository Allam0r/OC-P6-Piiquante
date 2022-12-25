const jwt = require("jsonwebtoken");

module.export = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodeToken = jwt.verify(token, process.env.TOKEN_SECRET_KEY);
    const userId = decodeToken.userId;
    req.auth = {
      userId: userId,
    };
  } catch (error) {
    res.status(401).json({ message: "Token non valide !!" });
  }
};
