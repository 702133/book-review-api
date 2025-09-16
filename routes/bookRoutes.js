const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { addBook, getBooks, getBookById, searchBooks } = require("../controllers/bookController");
const { addReview } = require("../controllers/reviewController");

router.post("/", auth, addBook);
router.get("/", getBooks);
router.get("/search", searchBooks);
router.get("/:id", getBookById);
router.post("/:id/reviews", auth, addReview);

module.exports = router;