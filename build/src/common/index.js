"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getErrorMessage = exports.LifiError = void 0;
const LifiError = ({ message, code, }) => ({
    message,
    code,
});
exports.LifiError = LifiError;
const getErrorMessage = (err) => 'message' in err ? String(err.message) : 'Unknown error';
exports.getErrorMessage = getErrorMessage;
//# sourceMappingURL=index.js.map