"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksProviders = void 0;
const task_schema_1 = require("./schemas/task.schema");
exports.tasksProviders = [
    {
        provide: 'TASK_MODEL',
        useFactory: (connection) => connection.model('Task', task_schema_1.TaskSchema),
        inject: ['DATABASE_CONNECTION'],
    },
];
//# sourceMappingURL=task.providers.js.map