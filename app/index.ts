import express from "express";
import cors from "cors";
import Router from "express-promise-router";

//Local modules
import config from "./config/config";
import { connectMongo } from "./db/mongo-connection";
import {connectRedis} from "./db/redis-connect";
import { register as registerConsul } from "./consul/consul-connection";
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

//Account routes
import { level1KYCadd } from "./routes/level1KYC-add";
import { level1KYCget } from "./routes/level1KYC-get";
import { level2KYCadd } from "./routes/level2KYC-add";
import { level2KYCget } from "./routes/level2KYC-get";
import { accountView } from "./routes/account-abstract-view";
router.get("/kyclevel1", authenticateToken, level1KYCget);
router.post("/kyclevel1", authenticateToken, level1KYCadd);
router.get("/kyclevel2", authenticateToken, level2KYCget);
router.post("/kyclevel2", authenticateToken, level2KYCadd);
router.get("/account", authenticateToken, accountView);


// Fiat routes
import {paymentIntent} from "./routes/payment-intent"
router.post("/paymentIntent", authenticateToken,paymentIntent)



// Consul health checks route
router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

/* =================
   SERVER START
================== */
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
	registerConsul();
});
