import mongoose from "mongoose";
import PaymentMethod from "./PaymentMethodEnum.js";

const InvoiceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    paymentMethod: {
        type:String,
        enum: Object.values(PaymentMethod),
        default: PaymentMethod.PAYPAL,
    },
  },
  {
    timestamps: true,
  }
);

const Invoice = mongoose.model("Invoice", InvoiceSchema);

export default Invoice;