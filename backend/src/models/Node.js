import mongoose from "mongoose";

const NodeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["folder", "task"],
      required: true,
    },

    // tree
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Node",
      default: null,
      index: true,
    },

    // task-specific
    text: {
      type: String, 
    },
    steps: {
      type: [String],
    },
    completed: {
      type: Boolean,
      default: false,
    },
    dueDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Task-specific method


const Node = mongoose.model("Node", NodeSchema);

export default Node;



// Folder: 

// folder_example = { 
//   "name": "folder1",
//   "type": "folder",
//   "parent": null,
//   "createdBy": "req.user._id",
// }

// task_example = {
//   "name": "task1",
//   "type": "task",
//   "parent": "folder1",
//   "text": "This is a task",
//   "steps": ["Step 1", "Step 2"],
//   "completed": false,
//   "dueDate": "2023-01-01",
//   "createdBy": "user1",
//   "assignedBy": "user1",
//   "assignedTo": "user2",
// }