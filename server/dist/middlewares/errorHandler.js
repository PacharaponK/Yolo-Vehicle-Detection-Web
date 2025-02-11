"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = __importDefault(require("../utils/appError"));
const errorHandler = (err, req, res, next) => {
    console.log(err);
    if (err instanceof appError_1.default) {
        res.status(err.status).json({ Error: { code: err.status, message: err.message } });
    }
    else {
        res.status(500).json({ Error: { code: 500, message: "Internal Server Error" } });
    }
};
exports.default = errorHandler;
