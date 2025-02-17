import { Request, Response, NextFunction, Router } from "express";
import AppError from "../utils/appError";
import db2 from "../config/db2";
import { io } from "../index";
import { VehiclesSocket } from "../sockets/VehiclesSocket";
const router = Router();

router.post("/api/video", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { title } = req.body.data;
		if (!title) {
			throw new AppError("Request payload is required.", 400);
		}
		const vehicle = await db2.video.create({
			data: {
				title: title,
			},
			include: { vehicle_data: true },
		});
		res.status(201).json({ data: vehicle });
	} catch (error) {
		next(error);
	}
});
export default router;
