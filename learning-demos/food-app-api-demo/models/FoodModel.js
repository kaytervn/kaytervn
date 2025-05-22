import mongoose from "mongoose";

const FoodSchema = new mongoose.Schema(
  {
    cloudinary: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", FoodSchema);

export default Food;
