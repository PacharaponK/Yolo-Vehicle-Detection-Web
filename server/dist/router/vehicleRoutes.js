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
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const appError_1 = __importDefault(require("../utils/appError"));
const isVehicleExists_1 = __importDefault(require("../middlewares/isVehicleExists"));
const router = (0, express_1.Router)();
router.post("/vehicle", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { class: vehicleClass, date, time } = req.body;
        const values = [vehicleClass, date, time];
        if (!vehicleClass && !date && !time) {
            throw new appError_1.default("Request payload is required.", 400);
        }
        const sql = `INSERT INTO vehicle_data (class,date,time) VALUES (?, ?, ?)`;
        const [rows] = yield db_1.default.query(sql, values);
        res.status(201).json({ id: rows.insertId, class: vehicleClass, date: date, time: time });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/vehicle/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = "SELECT * FROM vehicle_data";
        const [rows, fields] = yield db_1.default.query(sql);
        res.send(rows);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/vehicle/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const sql = `SELECT * FROM vehicle_data WHERE id=?`;
        const values = [id];
        const [rows, fields] = yield db_1.default.query(sql, values);
        if (rows.length) {
            res.send(rows);
            return;
        }
        throw new appError_1.default("Not Found", 404);
    }
    catch (error) {
        next(error);
    }
}));
router.put("/vehicle/:id", [
    isVehicleExists_1.default,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const fileds = [];
            const values = [];
            Object.entries(req.body).forEach(([key, value]) => {
                fileds.push(`${key} = ?`);
                values.push(value);
            });
            values.push(id);
            const sql = `UPDAte vehicle_data SET ${fileds.join(",")} WHERE id = ?`;
            yield db_1.default.query(sql, values);
            res.send({ status: "200", message: "Resource updated successfully.", id: id });
        }
        catch (error) {
            next(error);
        }
    }),
]);
router.delete("/vehicle/:id", [
    isVehicleExists_1.default,
    (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            const sql = `DELETE FROM vehicle_data WHERE id = ?`;
            const values = [id];
            yield db_1.default.query(sql, values);
            res.send({ status: "200", message: "Resource deleted successfully.", id: id });
        }
        catch (error) {
            next(error);
        }
    }),
]);
exports.default = router;
