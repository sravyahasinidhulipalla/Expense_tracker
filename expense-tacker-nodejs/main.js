import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import {
    getAllExpenses,
    getExpenseById,
    getExpensesByUser,
    getExpensesByCategory,
    createExpense,
    updateExpense,
    deleteExpense
} from "./controllers/expenseController.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.get("/expenses",                        getAllExpenses);
app.get("/expenses/:id",                    getExpenseById);
app.get("/expenses/user/:userId",           getExpensesByUser);
app.get("/expenses/category/:category",     getExpensesByCategory);
app.post("/expenses",                       createExpense);
app.put("/expenses/:id",                    updateExpense);
app.delete("/expenses/:id",                 deleteExpense);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Expense Service running on port ${PORT}`);
});
