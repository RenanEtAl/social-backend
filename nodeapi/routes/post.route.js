// imports
const { check } = require('express-validator')
const express = require('express')
//const postController = require('../controllers/post')
const { getPosts, createPost, postsByUser, postById,
    isPoster, deletePost, updatePost, photo, singlePost, like, unlike,
    comment, uncomment } = require('../controllers/post.controller')
const { requireSignin } = require('../controllers/auth.controller')
// don't need to add index at the end because it's named index.js
const { createPostValidator } = require('../validator')
const { userById } = require('../controllers/user.controller')
const router = express.Router()



// anything we get will be handled by controllers
router.get('/posts', getPosts)

// like and unlike post
router.put("/post/like", requireSignin, like)
router.put("/post/unlike", requireSignin, unlike)

// comments
router.put("/post/comment", requireSignin, comment)
router.put("/post/uncomment", requireSignin, uncomment)

// post routes
// get a single post
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator)
router.get("/posts/by/:userId", requireSignin, postsByUser)
router.get("/post/:postId", singlePost)
router.put("/post/:postId", requireSignin, isPoster, updatePost)
router.delete("/post/:postId", requireSignin, isPoster, deletePost)

router.get("/post/photo/:postId", photo)





// any route containing: userId, our app will first execute userByID()
router.param("userId", userById)
// any route containing: postId, our app will first execute postByID()
router.param("postId", postById)


// new way for 6 and above express-validator
// router.post(
//     '/post', [
//         // tile
//         check('title')
//         .notEmpty()
//         .withMessage('write a title'),
//         check('title')
//         .isLength({
//             min: 4,
//             max: 150
//         })
//         .withMessage('Title must be between 4 to 150 chars'),
//         // body
//         check('body')
//         .notEmpty()
//         .withMessage('write a body'),
//         check('title')
//         .isLength({
//             min: 4,
//             max: 150
//         })
//         .withMessage('Body must bet between 4 to 1500 chars')
//     ],
//     validator.createPostValidator,
//     postController.createPost
// );

module.exports = router;

// route
// const getPosts = (request, response)=>{
//     response.send("hell, world");
// };

// module.exports = {
//     getPosts
// };
// other way
// exports.getPosts = (request, response) => {
//     response.send("hell, world");
// };


// using controllers and post.js
// old way
//router.post("/post", validator.createPostValidator, postController.createPost)