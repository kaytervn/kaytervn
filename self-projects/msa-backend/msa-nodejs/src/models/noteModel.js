import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  note: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model("Note", NoteSchema);

export default Note;
