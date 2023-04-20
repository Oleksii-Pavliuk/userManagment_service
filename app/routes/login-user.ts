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
export async function loginUser(req : Request, res : Response) {
	// Check request
	let username = req.body.username;
	let password = req.body.password;
	if (username == undefined || password == undefined) {
		return res.status(400).send();
	}

	console.log("Login route");
	// Prepare and send request
	const requestPath = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
	const body = JSON.stringify(req.body);
	const request = http.request(
		requestPath,
		{
			method: "POST",
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
					console.log("Unexpected response with data");
					return res.status(500).send();
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


