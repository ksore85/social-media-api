const router = require('express').Router();
const {
  getAllThought,
  getThoughtById,
  createThought,
  updateThought,
  deleteThought,
  createReactionByThoughtId,
  deleteReactionByThoughtId
} = require('../../controllers/thought-controller');


router.route("/").get(getAllThought);
router.route("/:thoughtId").get(getThoughtById);
router.route("/").post(createThought);
router.route("/:thoughtId").put(updateThought).delete(deleteThought);
router.route("/:thoughtId/reactions/").post(createReactionByThoughtId);
router.route("/:thoughtId/reactions/:userReactionId").delete(deleteReactionByThoughtId);

// // /api/Thoughts
// router
//   .route('/')
//   .get(getAllThought)
//   .post(createThought);

// // /api/Thoughts/:id
// router
//   .route('/:id')
//   .get(getThoughtById)
//   .put(updateThought)
//   .delete(deleteThought);

//   router.route("/:thoughtId/reactions")
//   .post(createReactionByThoughtId)
//   .delete(deleteReactionByThoughtId);

module.exports = router;