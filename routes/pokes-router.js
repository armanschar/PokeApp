import express from "express";
import {
  GetIndex,
  GetCreate,
  PostCreate,
  GetEdit,
  PostEdit,
  GetDelete,
  PostDelete
} from "../controllers/PokeController.js";

const router = express.Router();

router.get("/", GetIndex);
router.get("/create", GetCreate);
router.post("/create", PostCreate);
router.get("/edit/:pokesId", GetEdit);
router.post("/edit", PostEdit);
router.get("/delete/:pokesId", GetDelete);
router.post("/delete", PostDelete);

export default router;