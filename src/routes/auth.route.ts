import { Router } from 'express';
import AuthController from '~/controllers/auth.controller';
import { CreateUserDto, LoginDto } from '~/dtos/users.dto';
import Route from '~/interfaces/routes.interface';
import authMiddleware from '~/middlewares/auth.middleware';
import validationMiddleware from '~/middlewares/validation.middleware';

class AuthRoute implements Route {
	public path = '/auth';
	public router = Router();
	public authController = new AuthController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		/**
		 * @swagger
		 * /auth:
		 *   produces:
		 *   - application/json
		 */

		/**
		 * @swagger
		 * /auth/signup:
		 *  post:
		 *   tags:
		 *    - Authentication
		 *   description: Signup a user using email and password
		 *   produces:
		 *    - application/json
		 *   parameters:
		 *    - name: email
		 *      description: email
		 *      in: body
		 *      required: true
		 *    - name: password
		 *      description: password
		 *      in: body
		 *      required: true
		 *   responses:
		 *    200:
		 *      description: Successfully created
		 *    409:
		 *      description: already exist
		 *    400:
		 *      description: Invalid request
		 */

		/**
		 * @swagger
		 * /auth/login:
		 *  post:
		 *   tags:
		 *    - Authentication
		 *   description: Sign in with email and password
		 *   produces:
		 *    - application/json
		 *   parameters:
		 *    - name: email
		 *      description: email
		 *      in: body
		 *      required: true
		 *    - name: password
		 *      description: password
		 *      in: body
		 *      required: true
		 *   responses:
		 *    200:
		 *      description: Successful
		 *    409:
		 *      description: already exist
		 *    400:
		 *      description: Invalid request
		 */

		/**
		 * @swagger
		 * /auth/logout:
		 *  post:
		 *   tags:
		 *    - Authentication
		 *   description: Logout a user
		 *   security:
		 *    - bearerAuth: []
		 *    - in: header
		 *   produces:
		 *    - application/json
		 *   responses:
		 *    200:
		 *      description: Successful
		 *    401:
		 *      description: Wrong authentication token
		 *    404:
		 *      description: Authentication token missing
		 */

		this.router.post(
			`${this.path}/signup`,
			validationMiddleware(CreateUserDto),
			this.authController.signUp
		);
		this.router.post(
			`${this.path}/login`,
			validationMiddleware(LoginDto),
			this.authController.login
		);
		this.router.post(
			`${this.path}/logout`,
			authMiddleware,
			this.authController.logout
		);
	}
}

export default AuthRoute;
