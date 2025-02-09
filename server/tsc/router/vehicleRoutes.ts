import { Request, Response, NextFunction, Router } from "express";
import db from "../config/db";
import AppError from "../utils/appError";
import Ivehicle from "../models/vehicle_data";
import isVehicleExists from "../middlewares/isVehicleExists";
import { ResultSetHeader } from "mysql2";
const router = Router();
router.post("/vehicle", async (req, res, next) => {
	try {
		const { class: vehicleClass, date, time } = req.body;
		const values: Ivehicle[] = [vehicleClass, date, time];
		if (!vehicleClass && !date && !time) {
			throw new AppError("Request payload is required.", 400);
		}
		const sql = `INSERT INTO vehicle_data (class,date,time) VALUES (?, ?, ?)`;
		const [rows] = await db.query<ResultSetHeader>(sql, values);
		res.status(201).json({ id: rows.insertId, class: vehicleClass, date: date, time: time });
	} catch (error) {
		next(error);
	}
});
router.get("/vehicle/all", async (req, res, next) => {
	try {
		const sql = "SELECT * FROM vehicle_data";
		const [rows, fields] = await db.query<Ivehicle[]>(sql);
		res.send(rows);
	} catch (error) {
		next(error);
	}
});
router.get("/vehicle/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const sql = `SELECT * FROM vehicle_data WHERE id=?`;
		const values = [id];
		const [rows, fields] = await db.query<Ivehicle[]>(sql, values);
		if (rows.length) {
			res.send(rows);
			return;
		}
		throw new AppError("Not Found", 404);
	} catch (error) {
		next(error);
	}
});
router.put("/vehicle/:id", [
	isVehicleExists,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const fileds: string[] = [];
			const values: unknown[] = [];
			Object.entries(req.body).forEach(([key, value]) => {
				fileds.push(`${key} = ?`);
				values.push(value);
			});
			values.push(id);
			const sql = `UPDAte vehicle_data SET ${fileds.join(",")} WHERE id = ?`;
			await db.query(sql, values);
			res.send({ status: "200", message: "Resource updated successfully.", id: id });
		} catch (error) {
			next(error);
		}
	},
]);
router.delete("/vehicle/:id", [
	isVehicleExists,
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const sql = `DELETE FROM vehicle_data WHERE id = ?`;
			const values = [id];
			await db.query(sql, values);
			res.send({ status: "200", message: "Resource deleted successfully.", id: id });
		} catch (error) {
			next(error);
		}
	},
]);

export default router;
