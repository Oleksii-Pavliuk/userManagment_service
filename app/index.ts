import express from "express";
import cors from "cors";
import Router from "express-promise-router";
//Local modules
import config from "./config/config";
import { connect } from "./db/mongo-connection";
import { postgreQuery, postgreTransaction } from "./db/postgres-connection";
import { register as registerConsul } from "./consul/consul-connection";

//Routes
import { registerUser } from "./routes/register-user";
import { loginUser } from "./routes/login-user";
import { editUser } from "./routes/edit-user";
import { deleteUser } from "./routes/delete-user"

/* =================
   SERVER SETUP
================== */
const app = express();
const router = Router();

//Getting convict vars
const PORT = config.get("port");
const CORS_ORIGIN = config.get("origin");
const corsOptions: cors.CorsOptions = {
	origin: CORS_ORIGIN as unknown as string,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};
const mongoUsers = connect;

app.use(express.json());
app.use(cors(corsOptions));
app.use(router);

/* ======
   ROUTES
========*/

// Auth service routes
router.put("/register", registerUser);
router.post("/login", loginUser);
router.patch("/edit", editUser);
router.post("/delete", deleteUser)


// Consul health checks
router.get("/health", (_req, res) => {
	res.sendStatus(200);
});

/* =================
   SERVER START
================== */
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
