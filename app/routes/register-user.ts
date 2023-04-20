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
export async function registerUser(req : Request, res: Response) {
	// Check request
	let username = req.body.username;
	let email = req.body.email;
	let password = req.body.password;
	let confirmation = req.body.confirmation
	if (username == undefined || password == undefined || email == undefined) {
		return res.status(400).send();
	}if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(password)){
		return res.status(400).send();
	}if(password !== confirmation){
		return res.status(400).send();
	}

	console.log("Register route");
	// Prepare and send request
	const requestPath = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
	const body = JSON.stringify({
		"username" : username,
		"email" : email ,
		"password" : password
	});
	const request = http.request(
		requestPath,
		{
			method: "PUT",
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
				if (response.statusCode == 201) {
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

