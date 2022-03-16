const { User } = require("../models");

const userController = {
  // Get all users.
  getAllUsers(req, res) {
    User.find({})
      .then((Data) => res.json(Data))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Get one user by Id.
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate("thoughts")
      .populate("friends")
      .select("-__v")
      .then((Data) => {
        if (!Data) {
          res.status(404).json({ message: "No user found with this id." });
          return;
        }
        res.json(Data);
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // Create a user.
  createUser({ body }, res) {
    User.create(body)
      .then((Data) => res.json(Data))
      .catch((err) => res.status(400).json(err));
    1;
  },

  // Update a user by Id.
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({ _id: params.id }, body, {
      new: true,
      runValidators: true,
    })
      .then((Data) => {
        if (!Data) {
          res.status(404).json({ message: "No user found with this .d!" });
          return;
        }
        res.json(Data);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Delete a user.
  deleteUser({ params }, res) {
    User.findOneAndDelete({ _id: params.id })
      .then((Data) => {
        if (!Data) {
          return res
            .status(404)
            .json({ message: "No user found with this .d!" });
        }
      })
      .then(() => {
        res.json({ message: "user has been deleted." });
      })
      .catch((err) => res.status(400).json(err));
  },

  // Add a friend.
  addFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $addToSet: { friends: params.friendId } },
      { runValidators: true }
    )
      .then((Data) => {
        if (!Data) {
          res.status(404).json({ message: "No user found with this .d!" });
          return;
        }
        res.json(Data);
      })
      .catch((err) => res.status(400).json(err));
  },

  // Remove a friend.
  removeFriend({ params }, res) {
    User.findOneAndUpdate(
      { _id: params.id },
      { $pull: { friends: params.friendId } },
      { runValidators: true }
    )
      .then((Data) => {
        if (!Data) {
          res.status(404).json({ message: "No user found with this .d!" });
          return;
        }
        res.json(Data);
      })
      .catch((err) => res.status(400).json(err));
  },
};

module.exports = userController;
