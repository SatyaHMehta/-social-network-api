const { Schema, model } = require('mongoose');

// User schema for the table
const userSchema = new Schema(
    {
    username: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/]
    },
    thoughts: [{
        type: Schema.Types.ObjectId,
        ref: 'Thoughts'
    }],
    friends: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }]
    },
    {
    toJSON: {
        getters: true,
        virtuals: true,
    },
    id: false
    }
)

// Get the total number of friends. 
userSchema.virtual('friendCount').get(function() {
    return this.friends.length;
})

// Create the Users model using the Users Schema.
const User = model('user', userSchema);

// Export the 'User'  model.
module.exports = User;