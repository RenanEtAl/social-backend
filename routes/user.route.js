const express = require("express");
const {
  userById,
  allUsers,
  getUser,
  updateUser,
  deleteUser,
  userPhoto,
  addFollowing,
  addFollower,
  removeFollowing,
  removeFollower,
  findPeople,
  hasAuthorization,
} = require("../controllers/user.controller");
const { requireSignin } = require("../controllers/auth.controller");

const router = express.Router();

// following and followers
router.put("/user/follow", requireSignin, addFollowing, addFollower);
// unfollowing
router.put("/user/unfollow", requireSignin, removeFollowing, removeFollower);

router.get("/user/:userId", requireSignin, getUser);
router.get("/users", allUsers);

// update = put, patch for small update
router.put("/user/:userId", requireSignin, hasAuthorization, updateUser);
router.delete("/user/:userId", requireSignin, hasAuthorization, deleteUser);
router.get("/user/photo/:userId", userPhoto);

router.get("/user/findpeople/:userId", requireSignin, findPeople);

// any route containing: userId, our app will first execute userByID()
router.param("userId", userById);

module.exports = router;
