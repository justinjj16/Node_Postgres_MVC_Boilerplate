import { Router } from 'express';
import UserController from '~/controllers/user.controller';
import { CreateUserDto } from '~/dtos/users.dto';
import Route from '~/interfaces/routes.interface';
import validationMiddleware from '~/middlewares/validation.middleware';

class UserRoute implements Route {
	public path = '/users';
	public router = Router();
	public userController = new UserController();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		/**
		 * @swagger
		 * /users:
		 *   produces:
		 *   - application/json
		 */

		/**
		 * @swagger
		 * /users:
		 *  get:
		 *   tags:
		 *    - User
		 *   description: get all users
		 *   responses:
		 *    200:
		 *      description: fetch all the users
		 */

		/**
		 * @swagger
		 * /users/{id}:
		 *  get:
		 *    tags:
		 *     - User
		 *    description: fetch a single user by id
		 *    parameters:
		 *    - name: id
		 *      in: path
		 *      type: string
		 *      required: true
		 *      description: id of the user
		 *    responses:
		 *     200:
		 *       description: fetch all the users
		 */

		/**
		 * @swagger
		 * /users:
		 *  post:
		 *    tags:
		 *     - User
		 *    description: create a new user
		 *    parameters:
		 *    - name: email
		 *      in: body
		 *      type: string
		 *      required: true
		 *      description: email of the user
		 *    - name: password
		 *      in: body
		 *      type: string
		 *      required: true
		 *      description: password for the user
		 *    responses:
		 *     201:
		 *       description: user created
		 *     400:
		 *       description: not all data is given
		 */

		/**
		 * @swagger
		 * /users/{id}:
		 *  put:
		 *    tags:
		 *     - User
		 *    description: update an existing user
		 *    parameters:
		 *    - name: id
		 *      in: path
		 *      type: string
		 *      required: true
		 *      description: id of the user
		 *    - name: password
		 *      in: body
		 *      type: string
		 *      required: true
		 *      description: password for the user
		 *    responses:
		 *     201:
		 *       description: user created
		 *     400:
		 *       description: not all data is given
		 */

		/**
		 * @swagger
		 * /users/{id}:
		 *  delete:
		 *    tags:
		 *     - User
		 *    description: delete an existing user
		 *    parameters:
		 *    - name: id
		 *      in: path
		 *      type: string
		 *      required: true
		 *      description: id of the user
		 *    responses:
		 *     201:
		 *       description: user created
		 *     409:
		 *       description: user not found
		 */

		this.router.get(`${this.path}`, this.userController.getUsers);
		this.router.get(`${this.path}/:id`, this.userController.getUserById);
		this.router.post(
			`${this.path}`,
			validationMiddleware(CreateUserDto),
			this.userController.createUser
		);
		this.router.put(
			`${this.path}/:id`,
			validationMiddleware(CreateUserDto, true),
			this.userController.updateUser
		);
		this.router.delete(`${this.path}/:id`, this.userController.deleteUser);
	}
}

export default UserRoute;
