import { Router } from "express";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getUserDetails,
  login,
  register,
  updateNote,
} from "../controller/noteController.js";

const router = new Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getUserDetails").get(getUserDetails);
router.route("/create_note").post(createNote);
router.route("/update_note").post(updateNote);
router.route("/delete_note").delete(deleteNote);
router.route("/get_all_note").get(getAllNotes);

export default router;
