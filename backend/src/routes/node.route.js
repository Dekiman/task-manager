import express from 'express';
import { 
     getAllChildren,
     getNodeWithPath,
     getTasksByUser,
     createNode,
     getDirectChildren
 } from '../controllers/node.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protectRoute);

router.post("/", createNode);
router.get("/:folderId/allChildren", getAllChildren);
router.get("/:folderId/children", getDirectChildren);
router.get("/:nodeId/path", getNodeWithPath);
router.get("/:userId/tasks", getTasksByUser);


export default router;