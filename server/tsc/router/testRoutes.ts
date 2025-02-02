import { Request, Response, NextFunction, Router } from "express";
import db from "../config/db";

const router = Router();

router.get("/test", async (req, res, next) => {
	const [rows, fields] = await db.execute("SELECT * FROM users");
	res.send(rows);
});

export default router;
