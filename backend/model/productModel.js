import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter product name"],
  },

  description: {
    type: String,
    required: [true, "Please enter product description"],
  },

  price: {
    type: Number,
    required: [true, "Please enter product price"],
    maxLength: [7, "Price cannot exceed 7 digits"],
  },

  mrp: {
    type: Number,
    required: [true, "Please enter MRP"],
    maxLength: [7, "MRP cannot exceed 7 digits"],
  },

  category: {
    type: String,
    required: [true, "Please enter product category"],
  },

  stock: {
    type: Number,
    required: [true, "Please enter product stock"],
    default: 1,
  },

  ratings: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

  numOfReviews: {
    type: Number,
    default: 0,
  },

  images: [
    {
      public_id: {
        type: String,
        default: null,
      },
      url: {
        type: String,
        required: [true],
      },
    },
  ],

  reviews: {
    type: [
      new mongoose.Schema(
        {
          user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          name: { type: String, required: true },
          avatar: {
            public_id: { type: String, default: null },
            url: { type: String },
          },
          rating: { type: Number, required: true },
          comment: { type: String, required: true },
        },
        { timestamps: true },
      ),
    ],
    default: [],
  },

  //which user created this new product like brand new watches wheather admin or stock manager
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
