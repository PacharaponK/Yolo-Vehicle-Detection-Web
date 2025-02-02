import express from "express";
import userRoutes from "./router/testRoutes";
import errorHandler from "./middlewares/errorHandler";
import dotenv from "dotenv";
import db from "./config/db";

dotenv.config();
const PORT = process.env.PORT || 3001;
const URL = (process.env.URL as string) || "localhost";

const app = express();

app.use(express.json());

app.use(userRoutes);
app.use(errorHandler);

try {
	db.getConnection();
	console.log("[server] Connected to MySQL");
} catch (err) {
	console.log("[server] MySQL connection error\n", err);
}
app.listen(PORT, () => {
	console.log(`[server] Server is running on http://${URL}:${PORT}`);
});
