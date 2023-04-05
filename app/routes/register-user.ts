import http from "http";
import jwt from "jsonwebtoken";
// Local modules
import config from "../config/config";
// Convict vars
const AUTH_SERVICE_URI = config.get("authhost");
const AUTH_SERVICE_PORT = config.get("authport");
const AUTH_SERVICE_API_KEY = config.get("authapikey");
const JWT_SECRET_KEY = config.get("jwtsecretkey");

/* =================
   ROUTE HANDLER
================== */
export async function registerUser(req, res) {
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
					jwt.sign( 
						{ "id": JSON.parse(data).id },
						JWT_SECRET_KEY,
						{ expiresIn: "2h" },
						(err, token) => {
							if (token) {
								console.log("token: " + token);
								return res.status(200).send({ jwt: token });
							}
							if (err) {
								console.error(err);
								res.status(500).send();
							}
						}
					);
				} else {
					console.log("Unexpected response with data");
				}
			});
		}
	);
	request.on("error", (error) => {
		console.error(error);
	});
	request.write(body);
	request.end();
	console.log();
}
