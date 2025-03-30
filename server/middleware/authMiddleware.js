// Middleware to verify if the user is a manager
exports.verifyManager = (req, res, next) => {
    if (req.user && req.user.account_type === 'Manager') {
      return next();
    }
    return res.status(403).send('Forbidden');
  };
  