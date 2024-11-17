import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./router/noteRouter.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// If you have routes for posts and users, make sure to uncomment these lines:
// app.use(postRoutes);
app.use(userRoutes);

// Serve static files (uploads folder) for file access
app.use(express.static("uploads"));

const PORT = process.env.PORT || 4000;

// Establish MongoDB connection
main()
  .then(() => {
    console.log("Database is connected");
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });

async function main() {
  await mongoose.connect(process.env.MONGO_URL);
}

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
