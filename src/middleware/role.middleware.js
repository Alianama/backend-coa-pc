const { ROLE_PERMISSIONS } = require("../constants/roles");

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role;
    const permissions = ROLE_PERMISSIONS[userRole];

    if (!permissions) {
      return res.status(403).json({ message: "Akses ditolak" });
    }

    if (permissions.includes("*") || permissions.includes(requiredPermission)) {
      next();
    } else {
      res
        .status(403)
        .json({ message: "Anda tidak memiliki akses untuk operasi ini" });
    }
  };
};

module.exports = checkPermission;
