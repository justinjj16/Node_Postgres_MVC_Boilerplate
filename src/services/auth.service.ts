import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import _ from 'lodash';
import { CreateUserDto } from '~/dtos/users.dto';
import { User } from '~/entity/User';
import HttpException from '~/exceptions/HttpException';
import { DataStoredInToken, TokenData } from '~/interfaces/auth.interface';

class AuthService {
	public async signUp(userData: CreateUserDto): Promise<User> {
		if (_.isEmpty(userData)) {
			throw new HttpException(400, 'Nothing found on user data');
		}

		const user = await User.findOne({
			where: {
				email: userData.email,
			},
		});
		if (user) {
			throw new HttpException(409, 'Email already exists');
		}

		const hashedPass = await bcrypt.hash(userData.password, 10);

		return User.create({...userData,
			password: hashedPass,
		}).save();
	}

	public async logout(userData: User): Promise<User> {
		if (_.isEmpty(userData)) {
			throw new HttpException(400, 'There is no user data');
		}

		const user = await User.findOne({
			where: {
				email: userData.email,
			},
		});
		if (!user) {
			throw new HttpException(409, 'You are not a valid user');
		}

		return user;
	}

	public createToken(user: User): TokenData {
		const dataStoredInToken: DataStoredInToken = {
			id: user.id,
			firstName:user.firstName,
			lastName:user.lastName,
			email:user.email,
			role:user.role
		};
		const secret: string = process.env.JWT_SECRET as string;
		const expiresIn: number = 60 * 60;

		return {
			expiresIn,
			token: jwt.sign(dataStoredInToken, secret, {
				expiresIn,
			}),
		};
	}

	public createCookie(tokenData: TokenData): string {
		return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn};`;
	}
}

export default AuthService;
