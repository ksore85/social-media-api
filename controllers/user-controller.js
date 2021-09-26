const { User } = require('../models');

const userController = {
    
  // get all Users
  getAllUser(req, res) {
    User.find({})
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .sort({ _id: -1 })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // get one User by id
  getUserById({ params }, res) {
    User.findOne({ _id: params.id })
      .populate({
        path: 'thoughts',
        select: '-__v'
      })
      .populate({
        path: 'friends',
        select: '-__v'
      })
      .select('-__v')
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
        console.log(err);
        res.sendStatus(400);
      });
  },

  // createUser
  createUser({ body }, res) {
    User.create(body)
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // update User by id
  updateUser({ params, body }, res) {
    User.findOneAndUpdate({_id: params.id}, body, {new: true, runValidators: true})
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({message: 'No User found with this id!'});
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => res.json(err));
  },

  // delete User
  deleteUser({params}, res) {
    User.findOneAndDelete({ _id: params.id })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => res.json(err));
  },

  // add Friend
  addFriend({params}, res) {
    console.log(`params:`, params)
    User.findOneAndUpdate({ _id: params.sourceId },{$push:{friends: params.targetId}},{new: true})
      .then((sourceUser) => {
        console.log(`sourceUser ID:`, sourceUser._id);
        console.log(`params.sourceId:`, params.sourceId);
        return User.findOneAndUpdate({ _id: params.targetId },{ $push: {friends: params.sourceId}},{new: true});
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

  // remove Friend
  removeFriend({ params }, res) {
    User.findOneAndUpdate({_id: params.sourceId},{$pull: {friends: params.targetId}},{new: true})
      .then((removedFriend) => {
        if (!removedFriend) {
          return res
            .status(404)
            .json({ message: "User has no friend with this id!" });
        }
        return User.findOneAndUpdate({_id: params.targetId },{ $pull: {friends: params.sourceId}},{new: true});
      })
      .then((dbUserData) => {
        if (!dbUserData) {
          res.status(404).json({ message: "No user found with this id!" });
          return;
        }
        res.json(dbUserData);
      })
      .catch((err) => res.json(err));
  },
};

module.exports = userController;