import { Request, Response, NextFunction, Router } from "express";
import db from "../config/db";
import AppError from "../utils/appError";

const router = Router();

router.get("/test", async (req, res, next) => {
	const [rows, fields] = await db.execute("SELECT * FROM vehicle_data");
	res.send(rows);
});
router.get("/error", async (req, res, next) => {
	try {
		throw new AppError();
	} catch (error) {
		next(error);
	}
});

export default router;
