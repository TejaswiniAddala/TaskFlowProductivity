// middleware/roleGuard.js
// Role-based access control middleware for Express.js
// Assumes JWT authentication middleware has already decoded token
// and attached `req.user` with properties { id, name, email, role }

module.exports = function allowedRoles(...permittedRoles) {
  // return middleware function
  return function (req, res, next) {
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized: No user context' });
    }
    const userRole = req.user.role;
    if (permittedRoles.includes(userRole)) {
      // role is allowed, continue
      return next();
    }
    // role not permitted
    return res.status(403).json({ error: `Forbidden: ${userRole} role cannot access this resource` });
  };
};
