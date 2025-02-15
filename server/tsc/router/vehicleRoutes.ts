import { Request, Response, NextFunction, Router } from "express";
import AppError from "../utils/appError";
import db2 from "../config/db2";
import isRecordExists from "../middlewares/isRecordExists";
import { io } from "../index";

const router = Router();
router.post("/vehicle", async (req, res, next) => {
	try {
		const { class: vehicleClass, date, entry_time, exit_time, lane_type, lane_id } = req.body.data;
		if (!vehicleClass && !date && !entry_time && !exit_time && !lane_type && !lane_id) {
			throw new AppError("Request payload is required.", 400);
		}
		const vehicle = await db2.vehicle_data.create({
			data: {
				class: vehicleClass,
				date: date ? new Date(date) : undefined,
				entry_time: entry_time ? new Date(entry_time) : undefined,
				exit_time: exit_time ? new Date(exit_time) : undefined,
				lane_type: lane_type ? lane_type : undefined,
				lane_id: lane_id ? Number(lane_id) : undefined,
			},
		});
		// io.emit()
		res.status(201).json({ data: vehicle });
	} catch (error) {
		next(error);
	}
});
router.get("/vehicle/all", async (req, res, next) => {
	try {
		const vehicle = await db2.vehicle_data.findMany();
		res.send(vehicle);
	} catch (error) {
		next(error);
	}
});
router.get("/vehicle/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const vehicle = await db2.vehicle_data.findUnique({ where: { id: Number(id) } });
		if (vehicle) {
			res.send(vehicle);
			return;
		}
		throw new AppError("Not Found", 404);
	} catch (error) {
		next(error);
	}
});
router.put("/vehicle/:id", [
	isRecordExists(db2.vehicle_data),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const {
				class: vehicleClass,
				date,
				entry_time,
				exit_time,
				lane_type,
				lane_id,
			} = req.body.data;
			if (!vehicleClass && !date && !entry_time && !exit_time && !lane_type && !lane_id) {
				throw new AppError("Request payload is required.", 400);
			}
			const vehicle = await db2.vehicle_data.update({
				where: {
					id: Number(id),
				},
				data: {
					class: vehicleClass ? vehicleClass : undefined,
					date: date ? new Date(date) : undefined,
					entry_time: entry_time ? new Date(entry_time) : undefined,
					exit_time: exit_time ? new Date(exit_time) : undefined,
					lane_type: lane_type ? lane_type : undefined,
					lane_id: lane_id ? Number(lane_id) : undefined,
				},
			});
			res.send({ status: "200", message: "Resource updated successfully.", data: vehicle });
		} catch (error) {
			next(error);
		}
	},
]);
router.delete("/vehicle/:id", [
	isRecordExists(db2.vehicle_data),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const vehicle = await db2.vehicle_data.delete({ where: { id: Number(id) } });
			res.send({ status: "200", message: "Resource deleted successfully.", data: vehicle });
		} catch (error) {
			next(error);
		}
	},
]);

export default router;
