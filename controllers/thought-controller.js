const { Thought, User } = require("../models");

const thoughtController = {
  // get all Thoughts
  getAllThought(req, res) {
    Thought.find({})
      .populate({
        path: "reactions",
        select: "-__v",
      })
      .select("-__v")
      .sort({ _id: -1 })
      .then((dbThoughtData) => res.json(dbThoughtData))
      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
  },

  // get one Thought by id
  getThoughtById({params}, res) {
    Thought.findOne({_id: params.thoughtId})
    .populate({
      path: "reactions",
      select: "-__v",
    })
    .select("-__v")
    .then((dbThoughtData) => {
      if (!dbThoughtData) {
        res.status(404).json({message: "No thought found with this id"});
        return;
      }
      res.json(dbThoughtData);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
  },

  // createThought
  createThought({ body }, res) {
    Thought.create(body)
      .then(( dbThoughtData ) => {
        console.log(`dbThoughtData:`, dbThoughtData)
        return User.findOneAndUpdate(
          { username: dbThoughtData.username },
          { $push: { thoughts: dbThoughtData._id } },
          { new: true }
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({message: "No user found with this id!"});
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },

  // update Thought by id
  updateThought({params, body}, res) {
    Thought.findOneAndUpdate({_id: params.id}, body, {
      new: true,
      runValidators: true,
    })
      .then((dbThoughtData) => {
        if (!dbThoughtData) {
          res.status(404).json({message: "No Thought found with this id!"});
          return;
        }
        res.json(dbThoughtData);
      })
      .catch((err) => res.json(err));
  },

  // delete Thought
  deleteThought({params}, res) {
    Thought.findOneAndDelete({_id: params.thoughtId})
      .then((deletedThought) => {
        if (!deletedThought) {
          res.status(404).json({message: "No thought with this id!"});
          return
        }
        return User.findOneAndUpdate(
          {username: deletedThought.username},
          {$pull: {thoughts: deletedThought.thoughtId}},
          {new: true}
        );
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({message: "No user found with this id!"});
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // create Reaction
  createReactionByThoughtId({params, body}, res) {
    console.log(body);
    Thought.findOneAndUpdate(
      {_id: params.thoughtId},
      {$push: {reactions: body}},
      {new: true, runValidators: true}
    )
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({message: "No user found with this id!"});
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
  // delete Reaction
  deleteReactionByThoughtId({ params, body }, res) {
    Thought.findOneAndDelete(
      {_id: params.thoughtId },
      {$pull: {reactions: {reactionId: params.userReactionId}}},
      {new: true}
    )
      .then((dbUserData) => res.json(dbUserData))
      .catch((err) => res.json(err));
  },

};

module.exports = thoughtController;
