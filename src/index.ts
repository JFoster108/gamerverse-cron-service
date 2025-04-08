import dotenv from "dotenv";
import mongoose from "mongoose";
import cron from "node-cron";
import { sendDailyModerationSummary } from "./utils/moderationUtils";

dotenv.config();

console.log("Gamerverse Cron Service is running...");

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI as string)
  .then(() => {
    console.log("Connected to MongoDB");

    // Schedule daily moderation summary
    cron.schedule("0 0 * * *", async () => {
      console.log("Running daily moderation summary email...");
      await sendDailyModerationSummary();
    });
  })
  .catch((err) => console.error("MongoDB connection error:", err));

// Graceful shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM received, shutting down...");
  await mongoose.connection.close();
  console.log("MongoDB connection closed. Exiting process...");
  process.exit(0);
});
