"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const mongoose = require("mongoose");
exports.UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    tasks: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Task',
        }]
});
//# sourceMappingURL=user.schema.js.map