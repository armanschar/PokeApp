import express from "express";
import {
  GetIndex,
  GetCreate,
  PostCreate,
  GetEdit,
  PostEdit,
  GetDelete,
  PostDelete
} from "../controllers/TypeController.js";

const router = express.Router();

router.get("/", GetIndex);
router.get("/create", GetCreate);
router.post("/create", PostCreate);
router.get("/edit/:typesId", GetEdit);
router.post("/edit", PostEdit);
router.get("/delete/:typesId", GetDelete);
router.post("/delete", PostDelete);

export default router;