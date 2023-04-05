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
export async function deleteUser(req, res) {

	// Check request
	let token : string = req.body.jwt;
    let username : string = req.body.password;
	let password : string = req.body.password;
	if (token == undefined || password == undefined || username == undefined){
		return res.status(400).send();
    }
	console.log("Delete route");

	let id : Number;

	jwt.verify(token, JWT_SECRET_KEY , (err, decoded : {id : Number}) => {
		if (err){
			console.log(err)
		}if(decoded){
			id = decoded.id
		}
	});

    if (checkCredentials(id,username,password)){
        // Prepare and send request
        const requestPath = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
        const body = JSON.stringify({
            "id" : id 
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
                }
                if (response.statusCode != 204) {
                    console.log("Unexpected response!");
                    res.status(500).send('Error')
                } else {
                    console.log("Success:");
                    res.status(200).send('OK')
                }
            }
        );
        request.on("error", (error) => {
            console.error(error);
        });
        request.write(body);
        request.end();
    }else{
        console.log("Wrong credentials :\n");
        console.log(req.body);
        return res.status(400).send();
    }
}


//Check credentials provided
const checkCredentials = (id : Number,username : string,password: string) => {
    //Another authorisation 
    const path = `http://${AUTH_SERVICE_URI}:${AUTH_SERVICE_PORT}/user/`;
    const body = JSON.stringify({
        "username" : username,
        "password": password,
    });

    let ret : boolean; 
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
            if(response.statusCode == 200){
                response.on("data", (data) => {
                    ret =  JSON.parse(data).id === id ? true : false
                })
            }else{
                ret = false;
            }
        }
    )
    request.on("error", (error) => {
        console.error(error);
    });
    request.write(body);
    request.end();
    return ret;
}
