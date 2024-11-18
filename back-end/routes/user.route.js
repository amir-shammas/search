const express = require("express");

const userController = require("./../controllers/user.controller");
const isAuthenticated = require("./../middlewares/isAuthenticated.middleware");
const isAdmin = require("./../middlewares/isAdmin.middleware");
const isNotBan = require("./../middlewares/isNotBan.middleware");


const router = express.Router();


// ////////////////////////////////////////////  USER - ROUTES  ///////////////////////////////////////////


router.route("/")
 .patch(isAuthenticated, isNotBan, userController.updateUser);


router.route("/change-password")
 .patch(isAuthenticated, isNotBan, userController.changeUserPassword);


// ////////////////////////////////////////////  ADMIN - ROUTES  ///////////////////////////////////////////


router.route("/")
 .post(isAuthenticated, isAdmin, userController.createUserByAdmin);


 router.route("/get-all")
 //  .get(isAuthenticated, isAdmin, userController.getAllUsersByAdmin)
 .post(isAuthenticated, isAdmin, userController.getAllUsersByAdmin);


router.route("/:id")
 .patch(isAuthenticated, isAdmin, userController.updateUserByAdmin)
 .delete(isAuthenticated, isAdmin, userController.removeUserByAdmin);


router.route("/change-role/:id")
 .patch(isAuthenticated, isAdmin, userController.changeUserRoleByAdmin);


router.route("/change-password/:id")
 .patch(isAuthenticated, isAdmin, userController.changeUserPasswordByAdmin);


router.route("/ban/:id")
 .patch(isAuthenticated, isAdmin, userController.banUserByAdmin);


router.route("/unban/:id")
 .patch(isAuthenticated, isAdmin, userController.unbanUserByAdmin);


// ////////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;
