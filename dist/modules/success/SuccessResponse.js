"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createSuccessResponse = (data, message) => {
    const responseData = {
        success: true,
    };
    if (message) {
        responseData.message = message;
    }
    if (data) {
        responseData.data = Object.assign({}, data);
    }
    return responseData;
};
exports.default = createSuccessResponse;
//# sourceMappingURL=SuccessResponse.js.map