import express from 'express';
import { 
     getAllChildren,
     getNodeWithPath,
     getTasksByUser,
     createNode,
     getDirectChildren,
     getTasksAssignedToUser,
     assignTask,
     toggleTask,
     getNodeWithPathHandler
 } from '../controllers/node.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
import { get } from 'mongoose';

const router = express.Router();

router.use(protectRoute);

router.post("/", createNode);
router.put("/:userId/:taskId/assign", assignTask);
router.put("/:taskId/toggle", toggleTask)
router.get("/:id/path", getNodeWithPathHandler);
router.get("/:folderId/allChildren", getAllChildren);
router.get("/:folderId/children", getDirectChildren);
router.get("/:nodeId/path", getNodeWithPath);
router.get("/:userId/tasks", getTasksByUser);
router.get("/assigned", getTasksAssignedToUser);


export default router;