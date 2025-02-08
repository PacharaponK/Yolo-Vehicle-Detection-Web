import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError";
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	if (err instanceof AppError) {
		res.status(err.status).json({ Error: { code: err.status, message: err.message } });
	} else {
		res.status(500).json({ Error: { code: 500, message: "Internal Server Error" } });
	}
};

export default errorHandler;
