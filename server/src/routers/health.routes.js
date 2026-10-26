import { Router } from "express";
import { success } from "zod";

const router = Router();

router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "NexTalk API is running",
  });
});

export default router;
