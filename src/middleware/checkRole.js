const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized - User tidak terautentikasi" });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Forbidden - Anda tidak memiliki akses untuk melakukan operasi ini",
      });
    }

    next();
  };
};

module.exports = checkRole;
