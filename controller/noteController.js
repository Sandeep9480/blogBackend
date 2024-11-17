import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import Note from "../models/noteModel.js";
import { json } from "express";

export const register = async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      username,
    });

    await newUser.save();

    return res.json({ message: "User Created Successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred during registration" });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(404).json({ message: "Invalid Password" });
    }

    const token = crypto.randomBytes(32).toString("hex");
    await User.updateOne({ _id: user._id }, { token: token });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

export const getUserDetails = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    return res.json({ user });
  } catch (error) {}
};

export const createNote = async (req, res) => {
  const { token, title, body } = req.body;

  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const note = new Note({
      userId: user._id,
      title: title,
      body: body,
    });
    await note.save();
    return res.status(200).json({ message: "Note Created" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

export const updateNote = async (req, res) => {
  const { note_id, ...newNoteData } = req.body;
  try {
    const note = await Note.findOne({ _id: note_id });
    if (!note) {
      return res.status(404).json({ message: "Note Not Exits" });
    }
    Object.assign(note, newNoteData);
    await note.save();
    return res.status(200).json({ message: "Note Updated" });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

export const getAllNotes = async (req, res) => {
  try {
    const allNotes = await Note.find().populate("userId", "name username");
    return res.json({ allNotes });
  } catch (error) {
    return res.status(500).json({ message: "An error occurred during login" });
  }
};

export const deleteNote = async (req, res) => {
  const { token, note_id } = req.body;
  try {
    const user = await User.findOne({ token: token });
    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }
    const note = await Note.findOne({ _id: note_id });

    await Note.deleteOne({ _id: note._id });
    return res.status(200).json({ message: "Note Is Deleted" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
