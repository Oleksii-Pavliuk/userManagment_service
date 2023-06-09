import mongoose from "mongoose";

import config from "../config/config";

const CONNECTION_STRING = config.get("mongostring");

export const connectMongo = () => mongoose
	.connect(CONNECTION_STRING)
	.then(() => {
		console.log("Connected to the mongo");
	})
	.catch((err) => {
		console.error("Error mongo: ", err);
	});
