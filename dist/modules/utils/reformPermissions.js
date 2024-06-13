"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const resources_1 = __importDefault(require("../../config/resources"));
const convertRequiredRights = (specificRights) => {
    const defaultRights = {};
    for (const resource of Object.values(resources_1.default)) {
        defaultRights[resource] = [];
    }
    for (const resource in specificRights) {
        if (Object.prototype.hasOwnProperty.call(specificRights, resource)) {
            defaultRights[resource] = specificRights[resource] || [];
        }
    }
    return defaultRights;
};
exports.default = convertRequiredRights;
//# sourceMappingURL=reformPermissions.js.map