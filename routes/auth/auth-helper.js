module.exports = (req, res, next) => {
  const { username, password, email } = req.body
  if (password && email && req.url == "/login")
    next()
  else if (password && email && username && req.url == "/register")
    next();

  else
    res.status(400).json({ message: "Please fill out all required fields" });

}
