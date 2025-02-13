// import { sign, decode, verify } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
// import dotenv from "dotenv";

// dotenv.config();
// const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
// 	const token = req.headers.authorization?.split(" ")[1];
// 	if (!token) {
// 		const err: any = new Error("Unauthorized");
// 		err.status = 401;
// 		next(err);
// 		return;
// 	}
// 	// console.log("+++token++++");
// 	// console.log(token);
// 	verify(token, process.env.SECRET_KEY as string, (error: any, user: any) => {
// 		// console.log("++++ERROR++++");
// 		// console.log(error.message);
// 		if (error) {
// 			const err: any = new Error(error.message);
// 			err.status = 401;
// 			next(err);
// 			return;
// 		}
// 		// console.log("++++USER++++");
// 		// console.log(user);
// 	});
// 	next();
// };

// export default authenticateJWT;
