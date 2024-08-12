"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.http = void 0;
const http_axios_1 = require("./http.axios");
const http = () => ({
    get: http_axios_1.instance.get.bind(http_axios_1.instance),
    post: http_axios_1.instance.post.bind(http_axios_1.instance),
});
exports.http = http;
//# sourceMappingURL=http.js.map