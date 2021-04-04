import 'reflect-metadata';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';
import swaggerUI, { SwaggerOptions } from 'swagger-ui-express';
import passport from 'passport';
import { ConnectionOptions, createConnection } from 'typeorm';
import { __PROD__ } from '~/constants';
import { User } from '~/entity/User';
import Routes from '~/interfaces/routes.interface';
import errorMiddleware from '~/middlewares/error.middleware';
import * as strategies from '~/strategies/auth-strategy';

class App {
	public app: express.Application;
	public port: string | number;
	public env: boolean;

	constructor(routes: Routes[]) {
		this.app = express();
		this.port = process.env.PORT || 3000;
		this.env = __PROD__;

		this.connectToDatabase();
		this.initializeMiddlewares();
		this.initializeSwagger();
		this.initializeRoutes(routes);
		this.initializeErrorHandling();
	}

	public listen() {
		this.app.listen(this.port, () => {
			console.log(`Server running on PORT: ${this.port}`);
		});
	}

	public getServer() {
		return this.app;
	}

	private connectToDatabase() {
		let config = {
			type: process.env.DB_TYPE,
			host: process.env.DB_HOST,
			port: process.env.DB_PORT,
			database: process.env.DB_NAME,
			username: process.env.DB_USERNAME,
			password: process.env.DB_PASSWORD,
			synchronize: !__PROD__,
			logging: !__PROD__,
			migrationsRun: false,
			entities: [User],
			migrations: ['src/migration/**/*.js'],
			subscribers: ['src/subscriber/**/*.js'],
			cli: {
				entitiesDir: 'src/entity',
				migrationsDir: 'src/migration',
				subscribersDir: 'src/subscriber',
			},
		} as ConnectionOptions;

		createConnection(config).catch((error) => console.error(error));
	}

	private initializeMiddlewares() {
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		// TODO strategy
		this.app.use(express.json());
		this.app.use(
			express.urlencoded({
				extended: true,
			})
		);
		this.app.use(cookieParser());
		Object.values(strategies.default.local).forEach((strategy: any) => {
			strategy(passport);
		});
		if (this.env) {
			this.app.use(hpp());
			this.app.use(helmet());
			this.app.use(morgan('combined'));
			this.app.use(
				cors({
					origin: process.env.DOMAIN,
					credentials: true,
				})
			);
		} else {
			this.app.use(morgan('dev'));
			this.app.use(
				cors({
					origin: true,
					credentials: true,
				})
			);
		}
	}

	private initializeRoutes(routes: Routes[]) {
		routes.forEach((route) => this.app.use('/', route.router));
	}

	private initializeErrorHandling() {
		this.app.use(errorMiddleware);
	}

	private initializeSwagger() {
		const swaggerDefinition: SwaggerDefinition = {
			basePath: '/',
			host: 'http://localhost:4001',
			info: {
				title: 'REST API VIBEONIX',
				version: '1.0.0',
				description: 'API docs for vibeonix',
			},
		};
		const options: SwaggerOptions = { swaggerDefinition, apis: ['**/*.ts'] };

		const specs = swaggerJSDoc(options);
		this.app.get('/swagger.json', function (_req, res) {
			res.setHeader('Content-Type', 'application/json');
			res.send(specs);
		});
		this.app.use('/swagger', swaggerUI.serve, swaggerUI.setup(specs));
	}
}

export default App;
