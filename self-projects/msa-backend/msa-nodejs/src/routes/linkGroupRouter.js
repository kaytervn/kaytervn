import express from "express";
import { bearerAuth } from "../middlewares/auth.js";
import {
  createLinkGroup,
  deleteLinkGroup,
  getLinkGroup,
  getListLinkGroups,
  updateLinkGroup,
} from "../controllers/linkGroupController.js";

const router = express.Router();

router.post("/create", bearerAuth, createLinkGroup);
router.put("/update", bearerAuth, updateLinkGroup);
router.delete("/delete/:id", bearerAuth, deleteLinkGroup);
router.get("/get/:id", bearerAuth, getLinkGroup);
router.get("/list", bearerAuth, getListLinkGroups);

export { router as linkGroupRouter };
