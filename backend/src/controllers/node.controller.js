import Node from '../models/Node.js';

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
        return res.status(201).json(`new ${newNode.type}: "${newNode.name}" created`);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

export const getNodeWithPath = async (nodeId) => {
  const [result] = await Node.aggregate([
    // 1) Start from the node we care about
    {
      $match: { _id: new mongoose.Types.ObjectId(nodeId) }
    },

    // 2) Walk up the tree using parent references
    {
      $graphLookup: {
        from: "nodes",           // same collection
        startWith: "$parent",    // start from THIS node's parent
        connectFromField: "parent",
        connectToField: "_id",
        as: "ancestors",         // all ancestors up to the root
        depthField: "level"      // (optional) 0 = parent, 1 = grandparent, etc.
      }
    },

    // 3) Sort ancestors from root → parent → this node
    {
      $addFields: {
        ancestorsSorted: {
          $reverseArray: {
            $sortArray: {        // requires MongoDB 5+, otherwise use $map + $sort
              input: "$ancestors",
              sortBy: { level: 1 }
            }
          }
        }
      }
    },

    // 4) Build a clean path array of names
    {
      $addFields: {
        pathArray: {
          $concatArrays: [
            {
              $map: {
                input: "$ancestorsSorted",
                as: "a",
                in: "$$a.name"
              }
            },
            ["$name"] // finally add the current node itself
          ]
        },
        pathString: {
          $reduce: {
            input: {
              $concatArrays: [
                {
                  $map: {
                    input: "$ancestorsSorted",
                    as: "a",
                    in: "$$a.name"
                  }
                },
                ["$name"]
              ]
            },
            initialValue: "",
            in: {
              $cond: [
                { $eq: ["$$value", ""] },
                "$$this",
                { $concat: ["$$value", " / ", "$$this"] }
              ]
            }
          }
        }
      }
    },

    // 5) Decide what you want to return
    {
      $project: {
        _id: 1,
        name: 1,
        type: 1,
        parent: 1,
        pathArray: 1,
        pathString: 1
      }
    }
  ]);

  return result;
};

export const getDirectChildren = async (req, res) => {
    try {
        const children = await Node.find({ parent: req.params.folderId });
        res.status(200).json(children);
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

