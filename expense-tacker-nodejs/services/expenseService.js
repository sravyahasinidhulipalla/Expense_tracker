import Expense from "../models/expense.js";

// Get all expenses
const getAllExpenses = async () => {
    return await Expense.find();
};

// Get expense by ID
const getExpenseById = async (id) => {
    return await Expense.findById(id);
};

// Get expenses by user
const getExpensesByUser = async (userId) => {
    return await Expense.find({ createdby: userId });
};

// Get expenses by category
const getExpensesByCategory = async (category) => {
    return await Expense.find({ category: category });
};

// Create expense
const createExpense = async (data) => {
    const expense = new Expense(data);
    return await expense.save();
};

// Update expense
const updateExpense = async (id, data) => {
    return await Expense.findByIdAndUpdate(id, data, { new: true });
};

// Delete expense
const deleteExpense = async (id) => {
    return await Expense.findByIdAndDelete(id);
};

export default {
    getAllExpenses,
    getExpenseById,
    getExpensesByUser,
    getExpensesByCategory,
    createExpense,
    updateExpense,
    deleteExpense
};
