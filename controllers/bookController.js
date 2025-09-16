const Book = require("../models/Book");
const Review = require("../models/Review");

exports.addBook = async (req, res) => {
  try {
    const { title, author, genre } = req.body;
    const book = new Book({ title, author, genre });
    await book.save();
    res.status(201).json(book);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, author, genre } = req.query;
    const filter = {};
    if (author) filter.author = new RegExp(author, "i");
    if (genre) filter.genre = new RegExp(genre, "i");

    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const count = await Book.countDocuments(filter);
    res.json({ total: count, page, books });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 5 } = req.query;
    const book = await Book.findById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const reviews = await Review.find({ book: id })
      .populate("user", "username")
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    res.json({ book, avgRating, reviews });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.searchBooks = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Missing query" });

    const books = await Book.find({
      $or: [
        { title: new RegExp(q, "i") },
        { author: new RegExp(q, "i") },
      ],
    });
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};