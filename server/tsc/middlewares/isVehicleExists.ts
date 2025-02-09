import { NextFunction, Request, Response } from "express";
import db from "../config/db";
import AppError from "../utils/appError";
import Ivehicle from "../models/vehicle_data";

const isVehicleExists = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { id } = req.params;
		// console.log(req.params.id);
		const [rows, fields] = await db.query<Ivehicle[]>(`SELECT * FROM vehicle_data WHERE id=?`, [
			id,
		]);
		console.log(rows.length);
		if (rows.length) {
			next();
			return;
		}
		// res.status(404).send({ status: "404", message: "Not Found", id: id });
		throw new AppError("Not Found", 404);
	} catch (error) {
		next(error);
	}
};
export default isVehicleExists;
