declare namespace NodeJS {
	export interface ProcessEnv {
		DOMAIN: string;
		PORT: string;
		NODE_ENV: string;
		DB_TYPE: string;
		DB_HOST: string;
		DB_PORT: string;
		DB_USERNAME: string;
		DB_PASSWORD: string;
		DB_NAME: string;
		JWT_SECRET: string;
	}
}
