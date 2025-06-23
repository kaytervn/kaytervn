import mongoose from "mongoose";

const EmbeddingSchema = new mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  embedding: {
    type: Array,
  },
});

const Embedding = mongoose.model("Embedding", EmbeddingSchema);
export default Embedding;
