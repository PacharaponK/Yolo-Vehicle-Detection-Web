import { Request, Response, NextFunction, Router } from "express";
import AppError from "../utils/appError";
import * as argon2 from "argon2";
import Service from "../service/BaseService";

const router = Router();

router.get("/test", async (req, res, next) => {
	const password = "mudd1312312dd";
	const hashpassword = await Service.hash(password);
	res.send(hashpassword);
});
router.get("/error", async (req, res, next) => {
	try {
		throw new AppError();
	} catch (error) {
		next(error);
	}
});

export default router;
