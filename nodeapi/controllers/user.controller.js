const formidable = require('formidable')
// node file system
const fs = require("fs")
const User = require('../models/user.model')

// _ whenever you use lodash
const _ = require('lodash')

exports.userById = (req, res, next, id) => {
    User.findById(id)
        // populate followers and following users' array
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, user) => {
            if (err || !user) {
                return res.status(400).json({
                    error: "User not found"
                })
            }
            // if user is found append the user object to the request
            req.profile = user // adds profile object in req with user info
            next();
        })
};

exports.hasAuthorization = (req, res, next) => {
    let sameUser = req.profile && req.auth && req.profile._id == req.auth._id;
    let adminUser = req.profile && req.auth && req.auth.role === 'admin';

    const authorized = sameUser || adminUser;
    if (!authorized) {
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        })
    }
    next()
}

exports.allUsers = (req, res) => {
    User.find((err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(users)

    }).select("name email updated created role")
}

exports.getUser = (req, res) => {
    // don't get hashed password and salt
    req.profile.hashed_password = undefined
    req.profile.salt = undefined
    return res.json(req.profile)
}


// exports.updateUser = (req, res, next) => {
//     // create user object from user profile
//     let user = req.profile
//     // extend the user obj
//     user = _.extend(user, req.body) // extend - mutate the source object
//     user.updated = Date.now()
//     user.save((err) => {
//         if (err) {
//             return res.status(400).json({
//                 error: "You are not authorized to perform this action"
//             })
//         }
//         // hashed password and salt are not given to frontend
//         user.hashed_password = undefined
//         user.salt = undefined
//         res.json({ user: user })
//     })
// }

// handles the photo
exports.updateUser = (req, res, next) => {
    // parse the file upload
    let form = new formidable.IncomingForm()
    form.keepExtensions = true
    form.parse(req, (err, fields, files) => {
        if (err) {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        // save the updated user info
        let user = req.profile
        user = _.extend(user, fields)
        user.updated = Date.now()

        if (files.photo) {
            user.photo.data = fs.readFileSync(files.photo.path)
            user.photo.contentType = files.photo.type
        }

        user.save((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            user.hashed_password = undefined
            user.salt = undefined
            res.json(user)

        })
    })

}

exports.deleteUser = (res, req, next) => {
    let user = req.profile;
    user.remove((err, user) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }

        res.json({ message: "User deleted successfully" });

    })
}

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.contentType)
        return res.send(req.profile.photo.data)

    }
    next()
}

// follow and unfollow

exports.addFollowing = (req, res, next) => {
    // followId will come from the front end client
    User.findByIdAndUpdate(req.body.userId, { $push: { following: req.body.followId } }, (
        err, result) => {
        if (err) {
            return res.status(400).json({ error: err })
        }

        next()
    })
}

exports.addFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId } },
        { new: true }, // so mongodb return the updated data
    )
        // populate
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            result.hashed_password = undefined
            result.salt = undefined
            res.json(result)
        })

}

exports.removeFollowing = (req, res, next) => {
    // unfollowId will come from the front end client
    User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId } }, (
        err, result) => {
        if (err) {
            return res.status(400).json({ error: err })
        }
        next()
    })

}


exports.removeFollower = (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, { $pull: { followers: req.body.userId } },
        { new: true }, // so mongodb return the updated data
    )
        // populate
        .populate('following', '_id name')
        .populate('followers', '_id name')
        .exec((err, result) => {
            if (err) {
                return res.status(400).json({
                    error: err
                })
            }
            result.hashed_password = undefined
            result.salt = undefined
            res.json(result)
        })

}

exports.findPeople = (req, res) => {
    // get all the users this user is following and the user itself
    let following = req.profile.following
    following.push(req.profile._id)
    // find users based on id not in included= nin the current users following
    User.find({ _id: { $nin: following } }, (err, users) => {
        if (err) {
            return res.status(400).json({
                error: err
            })
        }
        res.json(users)
    }).select('name') // just select user name

}