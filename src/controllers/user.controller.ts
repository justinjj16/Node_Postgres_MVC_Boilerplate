import { Request, Response, NextFunction } from 'express';
import { CreateUserDto } from '~/dtos/users.dto';
import { User } from '~/interfaces/user.interface';
import UserService from '~/services/user.service';

class UserController {
	public userService = new UserService();

	public getUsers = async (
		_req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const users = await this.userService.findAllUser();

			res.status(200).json({ data: users, message: 'findAllUsers' });
		} catch (error) {
			next(error);
		}
	};

	public getUserById = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const userId = +req.params.id;

		try {
			const user = await this.userService.findUserById(userId);

			res.status(200).json({ data: user, message: 'findOneUser' });
		} catch (error) {
			next(error);
		}
	};

	public createUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const userData: CreateUserDto = req.body;

		try {
			const user = await this.userService.createUser(userData);

			res.status(201).json({ data: user, message: 'userCreated' });
		} catch (error) {
			next(error);
		}
	};

	public updateUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const userId = +req.params.id;
		const userData: User = req.body;

		try {
			const user = await this.userService.updateUser(userId, userData);

			res.status(200).json({ data: user, message: 'userUpdated' });
		} catch (error) {
			next(error);
		}
	};

	public deleteUser = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		const userId = +req.params.id;

		try {
			const user = await this.userService.deleteUserData(userId);

			res.status(200).json({ data: user, message: 'userDeleted' });
		} catch (error) {
			next(error);
		}
	};
}

export default UserController;
