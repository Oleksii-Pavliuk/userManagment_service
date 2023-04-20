import http from "http";
import { Request, Response } from "express";
// Local modules
import config from "../config/config";
import {generateAccessToken} from "../middleware/gen-token"
// Convict vars
const AUTH_SERVICE_URI = config.get("authhost");
const AUTH_SERVICE_PORT = config.get("authport");
const AUTH_SERVICE_API_KEY = config.get("authapikey");

/* =================
   ROUTE HANDLER
================== */
export async function editUser(req : Request, res : Response) {
	// Check request
	let token: string = req.headers.authorization.split(' ')[1];
	let password: string = req.body.password;
	let newPassword: string = req.body.new;
	let confirmation: string = req.body.confirmation;
	if (
		password == undefined ||
		newPassword == undefined ||
		confirmation == undefined
	) {
		console.log(1);
		return res.status(400).send();
	} else if (newPassword !== confirmation) {
		console.log(2);
		return res.status(400).send();
	} else if (newPassword == password) {
		console.log(3);
		return res.status(400).send();
	} else if (
		!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(
			password
		)
	) {
		console.log(4);
		return res.status(400).send();
	} else if (token == undefined) {
		console.log()
		return res.status(401).send();
	}
	console.log("Edit route");

	let id = req.body.tokenUser;

	// Prepare and send request
	const requestPath = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
	const body = JSON.stringify({
		id: id,
		password: password,
	});

	const request = http.request(
		requestPath,
		{
			method: "PATCH",
			headers: {
				"Content-type": "application/json",
				"Content-length": body.length,
				Authorization: `Api-Key ${AUTH_SERVICE_API_KEY}`,
			},
		},
		// Get responce
		(response) => {
			console.log(`statusCode: ${response.statusCode}`);
			if (response.statusCode == 400) {
				console.log("Wrong credentials :\n");
				console.log(req.body);
				return res.status(400).send();
			}
			if (response.statusCode == 500) {
				console.log("Auth service error :\n");
				console.log(req.body);
				return res.status(400).send();
			}
			if (response.statusCode != 201) {
				console.log("Unexpected response!");
			}

			response.on("data", (data) => {
				if (response.statusCode == 200) {
					console.log("Success:");
					console.log(JSON.parse(data));
					// Create and send token
					let token = generateAccessToken(JSON.parse(data).id)
					return res.status(200).send({ jwt: token });
				} else {
					console.log("Unexpected response with data!");
				}
			});
		}
	);
	request.on("error", (error) => {
		console.error(error);
		return res.sendStatus(500);
	});
	request.write(body);
	request.end();
	console.log();
}
