//const expressValidator = require('express-validator')
// const server= express()

// server.use(expressValidator())

// new way for 6.0 version
// exports.createPostValidator = (req, res, next) => {
//     // check for errors
//     const errors = validationResult(req);
//     // if error show the first one as they happen
//     if(!errors.isEmpty()){
//         return res.status(422).json({
//             errors: errors.array()
//         })
//     }
//     // proceed to next middleware
//     next();
// }

// old way
exports.createPostValidator = (req, res, next) => {
    // check req
    // title
    req.check('title', "Write a title").notEmpty()
    req.check('title', "Title is too short. It must be between 4 to 150 characters").isLength({
        min: 4,
        max: 150
    });
    // body
    req.check("body", "Write a body").notEmpty()
    req.check("body", "Title is too short. It must be between 4 to 2000 chars").isLength({
        min: 4,
        max: 2000
    });
    // check for errors
    const errors = req.validationErrors()
    // if error show the first one as they happen
    if (errors) {
        // map errors
        const firstError = errors.map(error => error.msg)[0];
        // extract the first error
        return res.status(400).json({ error: firstError })

    }
    // proceed to next middleware
    next();
}



exports.userSignupValidator = (req, res, next) => {
    // name is not null and between 4-10 chars
    req.check("name", "Name is required").notEmpty();
    // email is not null, valid and normalized
    req.check("email", "Email must be between 3 to 32 characters")
        // regular expressions from MDN
        .matches(/.+\@.+\..+/)
        .withMessage("Email must contain @")
        .isLength({
            min: 4,
            max: 2000
        })
    // check for password
    // password is not null and between 4-10 chars
    req.check("password", "Password is required").notEmpty();
    // password is not null, valid and normalized
    req.check("password")
        .isLength({
            min: 6
        })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")

    // check for errors
    // check for errors
    const errors = req.validationErrors()
    // if error show the first one as they happen
    if (errors) {
        // map errors
        const firstError = errors.map((error) => error.msg)[0]
        // extract the first error
        return res.status(400).json({ error: firstError })

    }
    // proceed to next middleware
    next();

}

exports.passwordResetValidator = (req, res, next) => {
    // check for password
    req.check("newPassword", "Password is required").notEmpty

    req.check("newPassword")
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters")
        .matches(/\d/)
        .withMessage("Password must contain a number")

    // check for errors
    // check for errors
    const errors = req.validationErrors()
    // if error show the first one as they happen
    if (errors) {
        // map errors
        const firstError = errors.map((error) => error.msg)[0]
        // extract the first error
        return res.status(400).json({ error: firstError })

    }
    // proceed to next middleware
    next();
}