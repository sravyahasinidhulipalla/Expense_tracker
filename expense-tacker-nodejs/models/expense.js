import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
    title:       { type: String, required: true },
    description: { type: String, required: true },
    amount:      { type: Number, required: true },
    category:    { type: String, required: true },
    paymentmode: { type: String, required: true },
    date:        { type: String, required: true },
    status:      { type: Number, required: true },
    createdby:   { type: Number, required: true }
},{
    timestamps: { createdAt: 'createdat', updatedAt: 'updatedat' }
});

const Expense = mongoose.model("expenses", expenseSchema);

export default Expense;
