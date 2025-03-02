import { createUserSchema, queryVehicleSchema } from "./../utils/validatorSchema";
import dotenv from "dotenv";
import { Request, Response, NextFunction, Router } from "express";
import AppError from "../utils/appError";
import * as argon2 from "argon2";
import Service from "../service/BaseService";
import db2 from "../config/db2";
import authenticateJWT from "../middlewares/authenticateJWT";
import reqValidator from "../middlewares/reqValidator";
import queryValidator from "../middlewares/queryValidator";
dotenv.config();

const router = Router();
router.get("/api/test", [
	// queryValidator(queryVehicleSchema),
	// authenticateJWT,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const today = new Date();
			today.setHours(0, 0, 0, 0);

			const tomorrow = new Date(today);
			tomorrow.setDate(tomorrow.getDate() + 1);
			const vehicleData = await db2.vehicle_data.findMany({
				where: {
					entry_time: {
						gte: today,
						lt: tomorrow,
					},
				},
			});

			res.json(vehicleData);
		} catch (error) {
			next(error);
		}
		// try {
		// 	// console.log("query\n", req.query);
		// 	// console.log("Body\n", req.body.data);
		// 	console.log("success");
		// 	res.send("success");
		// } catch (error) {
		// 	next(error);
		// }
	},
]);
router.get("/api/error", async (req, res, next) => {
	try {
		throw new AppError();
	} catch (error) {
		next(error);
	}
});

export default router;
