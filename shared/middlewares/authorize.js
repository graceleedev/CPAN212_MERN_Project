const { decodeToken } = require("../jwt-utils");

const adminStrategy = (authData) => {
  const { roles } = authData;
  return roles && roles.includes("admin");
};

const userStrategy = (authData) => {
  const isAdmin = adminStrategy(authData);
  if (isAdmin) return true;
  const { roles } = authData;
  return roles && roles.includes("user");
};

const authStrategies = {
  admin: adminStrategy,
  user: userStrategy,
};

function authorize(requiredRoles = ["user"]) {
  function authorizeMiddleware(req, res, next) {
    try {
      const encoded = req.get("Authorization");
      const decoded = decodeToken(encoded); 
      if (!decoded || !decoded.roles) {
        return res.status(401).json({
          errorMessage: "You don't have permission to access this page",
        });
      }

      for (const role of requiredRoles) {
        if (authStrategies[role](decoded)) {
          req.account = decoded;
          return next();
        }
      }

      return res.status(401).json({
        errorMessage: "You don't have permission to access this page",
      });
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        errorMessage: "You don't have permission to access this page",
        action: "login",
      });
    }
  }
  return authorizeMiddleware;
}

module.exports = authorize;
