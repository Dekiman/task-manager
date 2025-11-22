import Node from '../models/Node.js';
import mongoose from 'mongoose';

export const getAllChildren = async (req, res) => {
    if (req.body.type !== 'folder') {
        return res.status(400).json({ error: 'Only folders can have children' });
    }
    try {
        const children = await Node.find({ parent: req.params.folderId });
        res.status(200).json(children);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTasksByUser = async (req, res) => {
    try {
        const tasks = await Node.find({ user: req.user._id });
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export const getTasksAssignedToUser = async (req, res) => {
  try { 
    const tasks = await Node.find({ assignedTo: req.user._id }).populate('assignedBy', 'fullName email');
    console.log('fetching assigned to')
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export const createNode = async (req, res) => {
    try {
      if(req.body.type !== 'task' && req.body.type !== 'folder') {
        return res.status(400).json({ error: 'Invalid node type' });
      }
      const newNode = new Node({
            name: req.body.name,
            type: req.body.type,
            parent: req.body.parent,
            createdBy: req.user._id,
      })
        if (req.body.type === 'task') {
            newNode.text = req.body.text;
            newNode.steps = req.body.steps;
            
        }
        await newNode.save();
        return res.status(201).json(`new ${newNode.type}: "${newNode.name}" created ${newNode}`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getNodeWithPath = async (nodeId) => {
  // Validate ID first to avoid ObjectId errors
  if (!mongoose.Types.ObjectId.isValid(nodeId)) {
    throw new Error("Invalid nodeId");
  }

  const [result] = await Node.aggregate([
    // 1) Start from the node we care about
    {
      $match: { _id: new mongoose.Types.ObjectId(nodeId) },
    },

    // 2) Walk up the tree using parent references
    {
      $graphLookup: {
        from: "nodes",        // collection name (Node -> "nodes")
        startWith: "$parent", // start from THIS node's parent
        connectFromField: "parent",
        connectToField: "_id",
        as: "ancestors",
        depthField: "level",
      },
    },

    // 3) If $sortArray is not available, we can just reverse ancestors.
    //    In many Mongo setups, ancestors come in parent→grandparent order;
    //    reversing gives root→...→parent. This is "good enough" for now.
    {
      $addFields: {
        ancestorsSorted: { $reverseArray: "$ancestors" },
      },
    },

    // 4) Build pathArray & pathString
    {
      $addFields: {
        pathArray: {
          $concatArrays: [
            {
              $map: {
                input: "$ancestorsSorted",
                as: "a",
                in: "$$a.name",
              },
            },
            ["$name"], // add current node
          ],
        },
        pathString: {
          $reduce: {
            input: {
              $concatArrays: [
                {
                  $map: {
                    input: "$ancestorsSorted",
                    as: "a",
                    in: "$$a.name",
                  },
                },
                ["$name"],
              ],
            },
            initialValue: "",
            in: {
              $cond: [
                { $eq: ["$$value", ""] },
                "$$this",
                { $concat: ["$$value", " / ", "$$this"] },
              ],
            },
          },
        },
      },
    },

    // 5) Return only what we need
    {
      $project: {
        _id: 1,
        name: 1,
        type: 1,
        parent: 1,
        pathArray: 1,
        pathString: 1,
      },
    },
  ]);

  return result || null;
};

// Express handler
export const getNodeWithPathHandler = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid node id" });
    }

    const node = await getNodeWithPath(id);

    if (!node) {
      return res.status(404).json({ message: "Node not found" });
    }

    res.status(200).json(node);
  } catch (err) {
    console.error("Error in getNodeWithPathHandler:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


export const getDirectChildren = async (req, res) => {
    try {
        const children = await Node.find({ parent: req.params.folderId });
        res.status(200).json(children);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const assignTask = async (req, res) => {
    try {
        const task = await Node.findById(req.params.taskId);
        task.assignedTo = req.params.userId;
        task.assignedBy = req.user._id;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
} 

export const toggleTask = async (req, res) => {
    try {
        const task = await Node.findById(req.params.taskId);
        task.completed = !task.completed;
        await task.save();
        res.status(200).json(task);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}



// export const createNode = async (req, res) => {
//     if(req.body.type === 'folder') {
//         try {
//             const newNode = await Node.create(req.body);
//             res.status(201).json(newNode);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
    
//     } else if (req.body.type === 'task') {
//         try {
//             const newNode = await Node.create(req.body);
//             res.status(201).json(newNode);
//         } catch (error) {
//             res.status(500).json({ error: error.message });
//         }
//     }
// }


// Generic request

// models/Request.js

// export class Request {
//   constructor({
//     body = {},
//     params = {`specific resource (`thisuser`, `this `)`},
//     query = {`filtering params (type, name, etc)`},
//     headers = {},
//     cookies = {},
//     user = null,
//     ip = "127.0.0.1",
//     method = "GET",
//     url = "/",
//   } = {}) {
//     this.body = body;
//     this.params = params;
//     this.query = query;
//     this.headers = headers;
//     this.cookies = cookies;
//     this.user = user;
//     this.ip = ip;
//     this.method = method;
//     this.url = url;
//   }
// }

// Generic Response (chainable like in express)

// models/Response.js
// export class Response {
//   constructor() {
//     this.statusCode = 200;
//     this.headers = {};
//     this.body = undefined;
//     this.finished = false;
//   }

//   status(code) {
//     this.statusCode = code;
//     return this; // chainable
//   }

//   set(field, value) {
//     this.headers[field.toLowerCase()] = value;
//     return this;
//   }

//   json(data) {
//     this.body = data;
//     this.finished = true;
//     return this;
//   }

//   send(data) {
//     this.body = data;
//     this.finished = true;
//     return this;
//   }

//   end() {
//     this.finished = true;
//     return this;
//   }
// }

