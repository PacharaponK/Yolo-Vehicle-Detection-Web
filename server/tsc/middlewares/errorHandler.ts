import { NextFunction, Request, Response } from "express";
const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
	console.log(err);
	res.status(err.status || 500).json({
		Error: {
			code: err.status || 500,
			message: err.status ? err.message : "Internal Server Error",
		},
	});
};

export default errorHandler;
