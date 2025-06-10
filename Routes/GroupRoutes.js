import { Router } from "express";
import { verifyToken } from "../Middleware/AuthMiddleware.js";
import { createGroup, getGroupMessage } from "../Controller/GroupController.js";

const groupRouter=Router();


groupRouter.post('/Create_group',verifyToken,createGroup);
groupRouter.get('/get_group_messages/:groupID',verifyToken,getGroupMessage);

export default groupRouter;