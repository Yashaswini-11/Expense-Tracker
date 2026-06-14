const express = require("express");
const Expense = require("../models/Expense");
const auth = require("../middleware/auth");

const router = express.Router();

// Add Expense
router.post("/", auth, async (req, res) => {
  try {
    const expense = await Expense.create({
      title: req.body.title,
      amount: req.body.amount,
      category: req.body.category,
      user: req.user.id,
    });

    res.status(201).json(expense);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Get Expenses
router.get("/", auth, async (req, res) => {
  try {
    const expenses = await Expense.find({
      user: req.user.id,
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Update Expense
router.put("/:id", auth, async (req, res) => {
  try {
    const updatedExpense =
      await Expense.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );

    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete Expense
router.delete("/:id", auth, async (req, res) => {
  try {
    await Expense.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message: "Expense deleted",
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;