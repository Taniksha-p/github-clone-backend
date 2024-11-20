// const express = require("express");
// const userController = require("../controllers/userController");

// const userRouter = express.Router();

// userRouter.get("/allUsers", userController.getAllUsers);
// userRouter.post("/signup", userController.signup);
// userRouter.post("/login", userController.login);
// userRouter.get("/userProfile", userController.getUserProfile);
// userRouter.put("/updateProfile", userController.updateUserProfile);
// userRouter.delete("/deleteProfile", userController.deleteUserProfile);

// module.exports = userRouter;

const express = require("express");
const userController = require("../controllers/userController");

const userRouter = express.Router();

userRouter.get("/allUsers", userController.getAllUsers);
userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.get("/userProfile/:id", userController.getUserProfile);
userRouter.put("/updateProfile/:id", userController.updateUserProfile);
userRouter.delete("/deleteProfile/:id", userController.deleteUserProfile);

module.exports = userRouter;