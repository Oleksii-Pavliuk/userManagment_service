import express, { response } from "express";
import bodyParser from "body-parser";
import cors from "cors";
import Router from "express-promise-router";
import http from "http";
import jwt from "jsonwebtoken";

import config from "./config/config";
import { connect } from "./db/mongo-connection";
import { postgreQuery, postgreTransaction } from "./db/postgres-connection";
import { register as registerConsul } from "./consul/consul";

/* =================
   SERVER SETUP
================== */
const app = express();
const router = Router();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Getting convict vars
const PORT = config.get("port");
const CORS_ORIGIN = config.get("origin");
const AUTH_SERVICE_URL = config.get("authhost");
const AUTH_SERVICE_PORT = config.get("authport");
const AUTH_SERVICE_API_KEY = config.get("authapikey");
const JWT_SECRET_KEY = config.get("jwtsecretkey")

const corsOptions: cors.CorsOptions = {
	origin: CORS_ORIGIN as unknown as string,
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(router);
const mongoUsers = connect;

/* ======
   ROUTES
========*/

router.get("/", hello);
router.post("register", registerUser);

/* =================
   ROUTE HANDLERS
================== */

async function hello(req, res) {
	res.status(200).send("Hello World!");
}

/* =================
   Request:
   {
	"username": string
	"password": string
   }
================== */
async function registerUser(req, res) {
	let username = req.body.username;
	let password = req.body.password;

	//request options
	const options = {
		hostname: AUTH_SERVICE_URL,
		port: AUTH_SERVICE_PORT,
		path: "/use",
		method: "POST",
		headers: {
			"Content-type": "application/json",
			Authentication: `Api-Key ${AUTH_SERVICE_API_KEY}`,
		},
	};
	//requset body
	const body = {
		username: username,
		password: password,
	};

	const request = http.request(options, (response) => {
		response.on("data", (chunk : {id : Number}) => {
			// Verify response data
			if (chunk) {
				console.log("Verified: " + body);

				//Create JWT and send it
				const token = jwt.sign(body, chunk.id.toString(), { expiresIn: "2h",algorithm: "RS256"}, (err) => {
					if(err){
						console.error(err);
						res.send(500)
					}
				  });
				res.status(200).send({jwt});
			} else {
				console.log("Failed verification: " + body);
				return res.status(400);
			}
		});
		request.on("error", (error) => {
			console.error(error);
		});
	});
}

/* =================
   SERVER START
================== */
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
	registerConsul()
});
