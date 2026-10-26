import { env } from "./src/config/env.js";
import { connectDB } from "./src/config/database.js";
import app from "./src/app.js";

const startServer = async () => {
  try {
    await connectDB();

    app.listen(env.PORT, () => {
      console.log(`NexTalk API running on port ${env.PORT}`);
    });
  } catch (error) {
    console.error("Failed to start NexTalk:", error.message);
    process.exit(1);
  }
};

startServer();
