import mongoose from "mongoose";
const InvoiceItemSchema = new mongoose.Schema(
  {
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Invoice",
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Course",
    },
  },
  {
    timestamps: true,
  }
);

const InvoiceItem = mongoose.model("InvoiceItem", InvoiceItemSchema);
export default InvoiceItem;
