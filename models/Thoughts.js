const { Schema, model, Types } = require('mongoose');
const moment = require('moment');
const ReactionSchema = require("./Reactions")



// ThoughtsSchema
const ThoughtsSchema = new Schema(
    {
    thoughtText: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    createdAt: {
        type: Date,
        default: Date.now,
        // Moment
        get: (createdAtVal) => moment(createdAtVal).format('MMM DD, YYYY [at] hh:mm a')
    },
    username: {
        type: String,
        required: true
    },
    // Use ReactionsSchema to validate data
    reactions: [ReactionSchema]
    },
    {
    toJSON: {
        virtuals: true,
        getters: true
    },
    id: false
    }
)

// get total count of reactions
ThoughtsSchema.virtual('reactionCount').get(function() {
    return this.reactions.length;
});

// create the Thoughts model using the Thoughts Schema
const Thought = model('Thoughts', ThoughtsSchema);

// Export Thoughts Module
module.exports = Thought;