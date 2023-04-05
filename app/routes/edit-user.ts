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
export async function editUser(req, res) {
	// Check request
	let token : string = req.body.jwt;
	let password : string = req.body.password;
	let newPassword : string = req.body.new;
	let confirmation : string= req.body.confirmation;
	if (token == undefined || password == undefined || newPassword == undefined || confirmation == undefined) {
		console.log(1)
		return res.status(400).send();
	}if(newPassword !== confirmation){
		console.log(2)
		return res.status(400).send();
	}if(newPassword == password){
		console.log(3)
		return res.status(400).send();
	}if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{10,}$/.test(password)){
		console.log(4)
		return res.status(400).send();
	}
	console.log("Edit route");

	let id : Number;

	jwt.verify(token, JWT_SECRET_KEY , (err, decoded : {id : Number}) => {
		if (err){
			console.log(err)
		}if(decoded){
			id = decoded.id
		}
	});

	// Prepare and send request
	const requestPath = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
	const body = JSON.stringify({
		"id" : id ,
		"password" : password
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
								return res.status(500).send();
							}
						}
					);
				} else {
					console.log("Unexpected response with data!");
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
