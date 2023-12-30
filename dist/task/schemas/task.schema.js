"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskSchema = void 0;
const mongoose = require("mongoose");
exports.TaskSchema = new mongoose.Schema({
    name: { type: String, unique: true, required: true },
    description: { type: String, required: true },
    creationDate: { type: Date, required: true, default: Date.now() },
    endingDate: { type: Date, required: true },
    state: { type: String, enum: ['creado', 'en progreso', 'terminado', 'no completado'], default: 'creado', required: true }
});
//# sourceMappingURL=task.schema.js.map