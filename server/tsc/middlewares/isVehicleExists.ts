import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
import db2 from "../config/db2";

const isVehicleExists = async (req: Request, res: Response, next: NextFunction) => {
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
};
export default isVehicleExists;
