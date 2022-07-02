/* jshint esversion : 8 */

const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");


router.post("/signup", authController.singnup);
router.post("/login", authController.login);
router.get("/logout", authController.logOut);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Protect all routes after this middleware
router.use(authController.protect);

router.get("/me", userController.getMe, userController.getUser);
router.patch("/updateMyPassword", authController.updatePassword);

router.patch("/updateMe",userController.uploadUserPhoto, userController.updateMe);
router.delete("/deleteMe", userController.deleteMe);

// Protect all routes after this middleware
router.use(authController.restrictTo("admin"));
router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;