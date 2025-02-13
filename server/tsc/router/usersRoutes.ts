import { Request, Response, NextFunction, Router } from "express";
import AppError from "../utils/appError";
import db2 from "../config/db2";
import isRecordExists from "../middlewares/isRecordExists";
import Service from "../service/BaseService";
const router = Router();
router.post("/user", async (req, res, next) => {
	try {
		const { name, email, password } = req.body.data;
		if (!name || !email || !password) {
			throw new AppError("Request payload is required.", 400);
		}
		const alreadyExists = await db2.user.findUnique({ where: { email: email } });
		if (alreadyExists) {
			throw new AppError("Email already in use", 400);
		}
		const user = await db2.user.create({
			data: {
				name: name,
				email: email,
				password: await Service.hash(password),
			},
			select: {
				id: true,
				name: true,
				email: true,
				createdAt: true,
				updatedAt: true,
			},
		});
		res.status(201).json({ data: user });
	} catch (error) {
		next(error);
	}
});
router.get("/user/all", async (req, res, next) => {
	try {
		const user = await db2.user.findMany();
		res.send(user);
	} catch (error) {
		next(error);
	}
});
router.get("/user/:id", async (req, res, next) => {
	try {
		const { id } = req.params;
		const user = await db2.user.findUnique({ where: { id: Number(id) } });
		if (user) {
			res.send(user);
			return;
		}
		throw new AppError("Not Found", 404);
	} catch (error) {
		next(error);
	}
});
router.put("/user/:id", [
	isRecordExists(db2.user),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const { name, email, password } = req.body.data;
			if (!name && !email && !password) {
				throw new AppError("Request payload is required.", 400);
			}
			const alreadyExists = await db2.user.findUnique({ where: { email: email } });
			if (alreadyExists) {
				throw new AppError("Email already in use", 400);
			}
			const user = await db2.user.update({
				where: {
					id: Number(id),
				},
				data: {
					name: name ?? undefined,
					email: email ?? undefined,
					password: (await Service.hash(password)) ?? undefined,
				},
				select: {
					id: true,
					name: true,
					email: true,
					updatedAt: true,
				},
			});
			res.send({ status: "200", message: "Resource updated successfully.", data: user });
		} catch (error) {
			next(error);
		}
	},
]);
router.delete("/user/:id", [
	isRecordExists(db2.user),
	async (req: Request, res: Response, next: NextFunction) => {
		try {
			const { id } = req.params;
			const user = await db2.user.delete({ where: { id: Number(id) } });
			res.send({ status: "200", message: "Resource deleted successfully.", data: user });
		} catch (error) {
			next(error);
		}
	},
]);

export default router;
