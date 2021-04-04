import * as bcrypt from 'bcrypt';
import { isEmpty } from 'lodash';
import { CreateUserDto } from '~/dtos/users.dto';
import { User as UserInterface } from '~/interfaces/user.interface';
import { User } from '~/entity/User';
import HttpException from '~/exceptions/HttpException';

class UserService {
	public async findAllUser(): Promise<User[]> {
		return await User.find();
	}

	public async findUserById(userId: number): Promise<User> {
		const user = await User.findOne({ id: userId });
		if (!user) throw new HttpException(409, 'User could not be found');

		return user;
	}

	public async createUser(userData: CreateUserDto): Promise<User> {
		if (isEmpty(userData)) {
			throw new HttpException(400, 'No valid user data found');
		}

		const user = await User.findOne({ email: userData.email });
		if (user) {
			throw new HttpException(409, 'Email already present');
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10);

		return User.create({
			email: userData.email,
			password: hashedPassword,
		}).save();
	}

	public async updateUser(
		userId: number,
		userData: UserInterface
	): Promise<User> {
		if (isEmpty(userData)) {
			throw new HttpException(400, 'This is not a valid user data');
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10);
		const user = await User.findOne({
			id: userId,
		});
		if (!user) {
			throw new HttpException(409, 'User not found');
		}

		user.password = hashedPassword;
		await user.save();

		return user;
	}

	public async deleteUserData(userId: number): Promise<null> {
		const user = await User.findOne({
			id: userId,
		});
		if (!user) {
			throw new HttpException(409, 'User not found');
		}

		await User.delete({
			id: userId,
		});

		return null;
	}
}

export default UserService;
