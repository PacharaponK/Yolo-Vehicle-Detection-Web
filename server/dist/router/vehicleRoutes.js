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
const appError_1 = __importDefault(require("../utils/appError"));
const isVehicleExists_1 = __importDefault(require("../middlewares/isVehicleExists"));
const db2_1 = __importDefault(require("../config/db2"));
const router = (0, express_1.Router)();
router.post("/vehicle", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { class: vehicleClass, date, time } = req.body.data;
        if (!vehicleClass && !date && !time) {
            throw new appError_1.default("Request payload is required.", 400);
        }
        const vehicle = yield db2_1.default.vehicle_data.create({
            data: {
                class: vehicleClass,
                date: date ? new Date(date) : null,
                time: time ? new Date(`1970-01-01T${time}.000Z`) : null,
            },
        });
        res.status(201).json({ data: vehicle });
    }
    catch (error) {
        next(error);
    }
}));
router.get("/vehicle/all", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const vehicle = yield db2_1.default.vehicle_data.findMany();
        res.send(vehicle);
    }
    catch (error) {
        next(error);
    }
}));
router.get("/vehicle/:id", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const vehicle = yield db2_1.default.vehicle_data.findUnique({ where: { id: Number(id) } });
        if (vehicle) {
            res.send(vehicle);
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
            const { class: vehicleClass, date, time } = req.body.data;
            if (!vehicleClass && !date && !time) {
                throw new appError_1.default("Request payload is required.", 400);
            }
            const vehicle = yield db2_1.default.vehicle_data.update({
                where: {
                    id: Number(id),
                },
                data: {
                    class: vehicleClass !== null && vehicleClass !== void 0 ? vehicleClass : undefined,
                    date: date ? new Date(date) : undefined,
                    time: time ? new Date(`1970-01-01T${time}.000Z`) : undefined,
                },
            });
            res.send({ status: "200", message: "Resource updated successfully.", data: vehicle });
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
            const vehicle = yield db2_1.default.vehicle_data.delete({ where: { id: Number(id) } });
            res.send({ status: "200", message: "Resource deleted successfully.", data: vehicle });
        }
        catch (error) {
            next(error);
        }
    }),
]);
exports.default = router;
