const { Thought, User } = require("../models")

const thoughtController = {
    // Get all thoughts route.
    getAllThoughts(req, res) {
        Thought.find({})
            .then(Data => res.json(Data))
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Get a user by Id.
    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.thoughtId })
            .then(Data => {
                if (!Data) {
                    res.status(404).json({ message: 'No thought found with this id.' });
                    return;
                }
                res.json(Data);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },

    // Add a thought to the user.
    addThought({ params, body }, res) {
        console.log(body);
        Thought.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $push: { thoughts: _id } },
                    { new: true }
                );
            })
            .then(Data => {
                if (!Data) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json(Data);
            })
            .catch(err => res.json(err));
    },

    // Update the thought by Id.
    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.thoughtId }, body, { new: true, runValidators: true })
            .then(Data => {
                if (!Data) {
                    res.status(404).json({ message: 'No thought found with this id.' });
                    return;
                }
                res.json(Data);
            })
            .catch(err => res.status(400).json(err));
    },

    // Remove the thought.
    removeThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.thoughtId })
            .then(removedThought => {
                if (!removedThought) {
                    return res.status(404).json({ message: 'No thought with this id.' });
                }
                return User.findOneAndUpdate(
                    { _id: params.userId },
                    { $pull: { thoughts: params.thoughtId } },
                    { new: true }
                );
            })
            .then(Data => {
                if (!Data) {
                    res.status(404).json({ message: 'No user found with this id.' });
                    return;
                }
                res.json(Data);
            })
            .catch(err => res.json(err));
    },

    // Add a reaction.
    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $addToSet: { reactions: body } },
            { new: true, runValidators: true }
        )
            .then(Data => {
                if (!Data) {
                    return res.status(404).json({ message: 'No thought found with this id.' });
                }
                res.json(Data);
            })
            .catch(err => res.json(err));
    },

    // Remove a reaction.
    removeReaction({ params }, res) {
        console.log(params.thoughtId, params.reactionId);
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;