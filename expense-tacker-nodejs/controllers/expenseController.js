import expenseService from "../services/expenseService.js";

// GET all expenses
export const getAllExpenses = async (req, res) => {
    try {
        const expenses = await expenseService.getAllExpenses();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET expense by ID
export const getExpenseById = async (req, res) => {
    try {
        const expense = await expenseService.getExpenseById(req.params.id);
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET expenses by user
export const getExpensesByUser = async (req, res) => {
    try {
        const expenses = await expenseService.getExpensesByUser(req.params.userId);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET expenses by category
export const getExpensesByCategory = async (req, res) => {
    try {
        const expenses = await expenseService.getExpensesByCategory(req.params.category);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST create expense
export const createExpense = async (req, res) => {
    try {
        const expense = await expenseService.createExpense(req.body);
        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// PUT update expense
export const updateExpense = async (req, res) => {
    try {
        const expense = await expenseService.updateExpense(req.params.id, req.body);
        if (!expense) return res.status(404).json({ message: "Expense not found" });
        res.status(200).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// DELETE expense
export const deleteExpense = async (req, res) => {
    try {
        await expenseService.deleteExpense(req.params.id);
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
