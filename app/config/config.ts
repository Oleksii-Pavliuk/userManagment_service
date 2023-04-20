import convict, { Schema } from "convict";

interface IConfigSchema {
	env: string;
	port: number;
	origin: string;
	pguser: string;
	pghost: string;
	pgport: number;
	pgdatabase: string;
	pgpassword: string;
	mongostring: string;
	redisstring: string;
	consulServiceName: string;
	consulHost: string;
	consulPort: number;
	authhost: string;
	authport: number;
	authapikey: string;
	jwtsecretkey: string;
}

const config: convict.Config<IConfigSchema> = convict({
	env: {
		doc: "Environoment for application",
		format: ["development", "production"],
		default: "development",
		env: "NODE_ENV",
	},
	port: {
		doc: "The port to bind.",
		format: "port",
		default: null,
		env: "PORT",
		arg: "port",
	},
	origin: {
		doc: "Allowed CORS servers",
		format: String,
		default: "*",
		env: "ORIGIN",
		arg: "origin",
	},
	pguser: {
		doc: "The postgres user that the application will use",
		format: "*",
		default: null,
		env: "PGUSER",
		arg: "pguser",
	},
	pghost: {
		doc: "The host of the postgres server",
		format: "*",
		default: null,
		env: "PGHOST",
		arg: "pghost",
	},
	pgport: {
		doc: "The port on which the postgres database will be listening",
		format: "port",
		default: null,
		env: "PGPORT",
		arg: "pgport",
	},
	pgdatabase: {
		doc: "The name of the postgres databse",
		format: String,
		default: null,
		env: "PGDATABASE",
		arg: "pgdatabase",
	},
	pgpassword: {
		doc: "The password for the postgres database",
		format: String,
		default: null,
		env: "PGPASSWORD",
		arg: "pgpassword",
		sensitive: true,
	},
	mongostring: {
		doc: "Connection string for mongoDB",
		format: String,
		default: null,
		env: "MONGOSTRING",
		arg: "mongostring",
		sensitive: true,
	},	
	redisstring: {
		doc: "Connection string for redis DB",
		format: String,
		default: null,
		env: "REDIS_STRING",
		arg: "redisstring",
		sensitive: true,
	},
	consulServiceName: {
		doc: "The name by which the service is registered in Consul. If not specified, the service is not registered",
		format: "*",
		default: "userManager",
		env: "CONSUL_SERVICE_NAME",
	},
	consulHost: {
		doc: "The host where the Consul client runs",
		format: String,
		default: "consul-client",
		env: "CONSUL_HOST",
	},
	consulPort: {
		doc: "The port for the Consul client",
		format: "port",
		default: 8500,
		env: "CONSUL_PORT",
	},
	authhost: {
		doc: "Server of auhtentication service",
		format: String,
		default: null,
		env: "AUTH_HOST",
		arg: "authhost"
	},	
	authport: {
		doc: "Port of auhtentication service server",
		format: "port",
		default: 8000,
		env: "AUTH_PORT",
		arg: "authport"
	},
	authapikey: {
		doc: "API key to make requests to auhtentication service",
		format: String,
		default: null,
		env: "AUTH_API_KEY",
		arg: "authapikey"
	},
	jwtsecretkey: {
		doc: "JWT secretKey to encrypt jwt",
		format: String,
		default: 'my-secret-key',
		env: 'JWT_KEY',
		arg: 'jwtsecretkey'
	}
} as unknown as Schema<IConfigSchema>);

const env = config.get("env");
config.loadFile(`./config/${env}.json`);

config.validate({ allowed: "strict" });

export default config;
