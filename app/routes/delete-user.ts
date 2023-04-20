import { Request, Response } from "express";
import http from "http";
import jwt from "jsonwebtoken";

// Local modules
import config from "../config/config";
import {generateAccessToken} from "../middleware/gen-token"
// Convict vars
const AUTH_SERVICE_URI = config.get("authhost");
const AUTH_SERVICE_PORT = config.get("authport");
const AUTH_SERVICE_API_KEY = config.get("authapikey");
const JWT_SECRET_KEY = config.get("jwtsecretkey");

/* =================
   ROUTE HANDLER
================== */
export async function deleteUser(req : Request, res : Response) {
	// Check request
	let token: string = req.headers.authorization.split(' ')[1];
	let username: string = req.body.username;
	let password: string = req.body.password;
	if (password == undefined || username == undefined) {
		return res.status(400).send();
	} else if (token == undefined) {
		return res.status(401).send();
	}
	console.log("Delete route");

	let id = req.body.tokenUser

	jwt.verify(token, JWT_SECRET_KEY, (err, decoded: { id: Number }) => {
		if (err) {
			if (err.name === 'TokenExpiredError') {
                // Token is expired
                return res.status(403).send();
              } else {
                // Token is invalid
                return res.status(401).send();
              }
		}
		if (decoded) {
			id = decoded.id;
		}
	});


	//Another authorisation
	const path = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
	const body = JSON.stringify({
		username: username,
		password: password,
	});
	console.log(body)
	const request = http.request(
		path,
		{
			method: "POST",
			headers: {
				"Content-type": "application/json",
				"Content-length": body.length,
				Authorization: `Api-Key ${AUTH_SERVICE_API_KEY}`,
			},
		},
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
				JSON.parse(data).id === id ? sendRequest() : res.status(400).send();
			});
		}
	);
	request.on("error", (error) => {
		console.error(error);
		return res.sendStatus(500);
	});
	request.write(body);
	request.end()

	// Prepare and send request
	const sendRequest = () => {
		const requestPath = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
		const body = JSON.stringify({
			id: id,
		});
		const request = http.request(
			requestPath,
			{
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					"Content-length": body.length,
					Authorization: `Api-Key ${AUTH_SERVICE_API_KEY}`,
				},
			},
			// Get responce
			(response) => {
				console.log(`statusCode: ${response.statusCode}`);
				if (response.statusCode == 500) {
					console.log("Auth service error :\n");
					console.log(req.body);
					return res.status(400).send();
				} else if (response.statusCode != 204) {
					console.log("Unexpected response!");
					res.status(500).send("Error");
				} else {
					console.log("Success:");
					res.status(200).send("OK");
				}
			}
		);
		request.on("error", (error) => {
			console.error(error);
			return res.sendStatus(500);
		});
		request.write(body);
		request.end();
	}
}