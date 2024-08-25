"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
// Initializing Express
const app = (0, express_1.default)();
// Cors
app.use((0, cors_1.default)());
// For getting JSON response
app.use(express_1.default.json());
// Landing Route
app.get("/", (req, res) => {
    return res.send("Tasks API Assignment for GoKapture");
});
// Routes
app.use("/api", routes_1.default);
/* Starting Server */
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
