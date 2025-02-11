"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = __importDefault(require("../config/db"));
const appError_1 = __importDefault(require("../utils/appError"));
const isVehicleExists = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // console.log(req.params.id);
        const [rows, fields] = yield db_1.default.query(`SELECT * FROM vehicle_data WHERE id=?`, [
            id,
        ]);
        console.log(rows.length);
        if (rows.length) {
            next();
            return;
        }
        // res.status(404).send({ status: "404", message: "Not Found", id: id });
        throw new appError_1.default("Not Found", 404);
    }
    catch (error) {
        next(error);
    }
});
exports.default = isVehicleExists;
