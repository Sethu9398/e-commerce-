const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            enum: [
                "Electronics",
                "Home & Kitchen",
                "Personal Care",
                "Clothing",
                "Jewelry",
                "Health",
                "Games",
                "Sports"
            ],
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        category: {
            type: String,
            required: true
        },
        stock: {
            type: Number,
            required: true,
            default: 0
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
