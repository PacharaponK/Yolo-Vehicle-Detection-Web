import { Request, Response, NextFunction, Router } from "express";
import AppError from "../utils/appError";
import db2 from "../config/db2";
import isRecordExists from "../middlewares/isRecordExists";
import { io } from "../index";
import { VehiclesSocket } from "../sockets/VehiclesSocket";

const router = Router();
router.post("/api/vehicle", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const {
			class: vehicleClass,
			entry_time,
			exit_time,
			lane_type,
			lane_id,
			yolo_id,
			video_id,
		} = req.body.data;
		if (
			!yolo_id ||
			!video_id ||
			(!vehicleClass && !entry_time && !exit_time && !lane_type && !lane_id)
		) {
			throw new AppError("Request payload is required.", 400);
		}
		if (
			await db2.vehicle_data.findUnique({
				where: {
					yolo_id_video_id: {
						yolo_id: Number(yolo_id),
						video_id: video_id,
					},
				},
			})
		) {
			throw new AppError("not unique yolo_id&video_id Request", 400);
		}
		const vehicle = await db2.vehicle_data.create({
			data: {
				yolo_id: Number(yolo_id),
				video: { connect: { id: video_id } },
				class: vehicleClass,
				entry_time: entry_time ? new Date(entry_time) : undefined,
				exit_time: exit_time ? new Date(exit_time) : undefined,
				lane_type: lane_type ? lane_type : undefined,
				lane_id: lane_id ? Number(lane_id) : undefined,
			},
			include: { video: true },
		});
		VehiclesSocket(io);
		res.status(201).json({ data: vehicle });
	} catch (error) {
		next(error);
	}
});
router.get("/api/vehicle", async (req, res, next) => {
	try {
		const { yolo_id, video_id } = req.query;
		if (!yolo_id || !video_id) {
			throw new AppError("query required.", 400);
		}
		const vehicle = await db2.vehicle_data.findUnique({
			where: {
				yolo_id_video_id: {
					yolo_id: Number(yolo_id),
					video_id: Number(video_id),
				},
			},
			include: { video: true },
		});
		if (!vehicle) {
			throw new AppError("Not Found", 404);
		}
		res.send({ data: vehicle });
	} catch (error) {
		next(error);
	}
});
router.put("/api/vehicle", [
	// isRecordExists(db2.vehicle_data),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { yolo_id: yolo_id_query, video_id: video_id_query } = req.query;
			if (!yolo_id_query || !video_id_query) {
				throw new AppError("query required.", 400);
			}
			if (
				!(await db2.vehicle_data.findUnique({
					where: {
						yolo_id_video_id: {
							yolo_id: Number(yolo_id_query),
							video_id: Number(video_id_query),
						},
					},
				}))
			) {
				throw new AppError("Not Found", 404);
			}
			const {
				class: vehicleClass,
				entry_time,
				exit_time,
				lane_type,
				lane_id,
				yolo_id,
				video_id,
			} = req.body.data;
			if (
				!vehicleClass &&
				!entry_time &&
				!exit_time &&
				!lane_type &&
				!lane_id &&
				!yolo_id &&
				!video_id
			) {
				throw new AppError("Request payload is required.", 400);
			}
			const vehicle = await db2.vehicle_data.update({
				where: {
					yolo_id_video_id: {
						yolo_id: Number(yolo_id_query),
						video_id: Number(video_id_query),
					},
				},
				data: {
					yolo_id: yolo_id ? Number(yolo_id) : undefined,
					video: video_id ? { connect: { id: video_id } } : undefined,
					class: vehicleClass ? vehicleClass : undefined,
					entry_time: entry_time ? new Date(entry_time) : undefined,
					exit_time: exit_time ? new Date(exit_time) : undefined,
					lane_type: lane_type ? lane_type : undefined,
					lane_id: lane_id ? Number(lane_id) : undefined,
				},
				include: { video: true },
			});
			VehiclesSocket(io);
			res.send({ status: "200", message: "Resource updated successfully.", data: vehicle });
		} catch (error) {
			next(error);
		}
	},
]);
router.delete("/api/vehicle", [
	// isRecordExists(db2.vehicle_data),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { yolo_id, video_id } = req.query;
			if (!yolo_id || !video_id) {
				throw new AppError();
			}
			const vehicle = await db2.vehicle_data.delete({
				where: {
					yolo_id_video_id: {
						yolo_id: Number(yolo_id),
						video_id: Number(video_id),
					},
				},
			});
			VehiclesSocket(io);

			res.send({ status: "200", message: "Resource deleted successfully.", data: vehicle });
		} catch (error) {
			next(error);
		}
	},
]);
router.get("/api/vehicle/all", async (req, res, next) => {
	try {
		const vehicle = await db2.vehicle_data.findMany({ include: { video: true } });
		res.send({ data: vehicle });
	} catch (error) {
		next(error);
	}
});
router.get("/api/vehicle/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const vehicle = await db2.vehicle_data.findUnique({
			where: { id: id },
			include: { video: true },
		});

		if (vehicle) {
			res.send({ data: vehicle });
			return;
		}
		throw new AppError("Not Found", 404);
	} catch (error) {
		next(error);
	}
});
router.put("/api/vehicle/:id", [
	isRecordExists(db2.vehicle_data),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const {
				class: vehicleClass,
				entry_time,
				exit_time,
				lane_type,
				lane_id,
				yolo_id,
				video_id,
			} = req.body.data;
			if (
				!vehicleClass &&
				!entry_time &&
				!exit_time &&
				!lane_type &&
				!lane_id &&
				!yolo_id &&
				!video_id
			) {
				throw new AppError("Request payload is required.", 400);
			}
			const vehicle = await db2.vehicle_data.update({
				where: {
					id: id,
				},
				data: {
					yolo_id: Number(yolo_id),
					video: video_id ? { connect: { id: video_id } } : undefined,
					class: vehicleClass ? vehicleClass : undefined,
					entry_time: entry_time ? new Date(entry_time) : undefined,
					exit_time: exit_time ? new Date(exit_time) : undefined,
					lane_type: lane_type ? lane_type : undefined,
					lane_id: lane_id ? Number(lane_id) : undefined,
				},
				include: { video: true },
			});
			VehiclesSocket(io);
			res.send({ status: "200", message: "Resource updated successfully.", data: vehicle });
		} catch (error) {
			next(error);
		}
	},
]);
router.delete("/api/vehicle/:id", [
	isRecordExists(db2.vehicle_data),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const vehicle = await db2.vehicle_data.delete({ where: { id: id } });
			VehiclesSocket(io);

			res.send({ status: "200", message: "Resource deleted successfully.", data: vehicle });
		} catch (error) {
			next(error);
		}
	},
]);

export default router;
