import express from "express";
import cors from "cors";
import Router from "express-promise-router";

//Local modules
import config from "./config/config";
import { connectMongo } from "./db/mongo-connection";
import { connectRedis } from "./db/redis-connect";
import { register as registerConsul } from "./observability/consul-connection";
import { register as registerOpenTelemetry } from "./observability/opentelemetry-connection";
import { handleOptions } from "./middleware/options";
import { authenticateToken } from "./middleware/auth-token";
import { corsOptions } from "./middleware/cors";

/* =================
   SERVER SETUP
================== */

const PORT = config.get("port");
const app = express();
const router = Router();
app.use(express.json());
app.use(cors(corsOptions));
app.use(router);
router.use(handleOptions);
connectMongo();
connectRedis();

/* ======
   ROUTES
========*/

// Auth service routes
import { registerUser } from "./routes/register-user";
import { loginUser } from "./routes/login-user";
import { editUser } from "./routes/edit-user";
import { deleteUser } from "./routes/delete-user";
router.put("/register", registerUser);
router.post("/login", loginUser);
router.patch("/edit", authenticateToken, editUser);
router.post("/delete", authenticateToken, deleteUser);

//KYC routes
import { level1KYCadd } from "./routes/level1KYC-add";
import { level1KYCget } from "./routes/level1KYC-get";
import { level2KYCadd } from "./routes/level2KYC-add";
import { level2KYCget } from "./routes/level2KYC-get";
router.get("/level1", authenticateToken, level1KYCget);
router.post("/level1", authenticateToken, level1KYCadd);
router.get("/level2", authenticateToken, level2KYCget);
router.post("/level2", authenticateToken, level2KYCadd);

//Account view route
import { accountView } from "./routes/account-view";
router.get("/account", authenticateToken, accountView);

// Consul health checks route
router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

/* =================
   SERVER START
================== */
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
	// registerOpenTelemetry();
	registerConsul();
});
