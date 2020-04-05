const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema

// 
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        //required: "Title is required",
        required: true
        // minlength: 4,
        // maxlength: 150
    },
    body: {
        type: String,
        //required: "Body is required",
        required: true
        // minlength: 4,
        // maxlength: 2000

    },
    photo: {
        //type: String
        data: Buffer,
        contentType: String

    },
    postedBy: {
        type: ObjectId,
        ref: "User"
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,
    // array of all the users a certain user likes
    likes: [{ type: ObjectId, ref: "User" }],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now },
            postedBy: { type: ObjectId, ref: "User" }
        }
    ]
});
// args: model name, Schema
module.exports = mongoose.model("Post", postSchema)

