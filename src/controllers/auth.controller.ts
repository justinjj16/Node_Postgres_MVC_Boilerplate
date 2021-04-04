import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { CreateUserDto } from '~/dtos/users.dto';
import AuthService from '~/services/auth.service';
import { User } from '~/entity/User';
import HttpException from '~/exceptions/HttpException';

// import { RequestWithUser } from '~/interfaces/auth.interface';

class AuthController {
	public authService = new AuthService();

	public signUp = async (req: Request, res: Response, next: NextFunction) => {
		const userData: CreateUserDto = req.body;

		try {
			const user = await this.authService.signUp(userData);
			const tokenData = this.authService.createToken(user);
			res.status(201).json({ data: {...user, accessToken:tokenData}, message: 'Sucessfully Signup' });
		} catch (error) {
			next(error);
		}
	};

	public login = async (req: Request, res: Response, next: NextFunction) => {
		if (req.body.email === '' || req.body.password === '') {
			next(new HttpException(400, 'No valid data is passed'));
		}

		passport.authenticate(
			'login-strategy',
			{ session: false },
			(err: HttpException, user: User) => {
				if (err) {
					next(err);
				} else {
					const tokenData = this.authService.createToken(user);
					const cookie = this.authService.createCookie(tokenData);

					res.setHeader('Set-Cookie', [cookie]);
					res.status(200).json({ data: {...user, accessToken:tokenData}, message: 'login' });
				}
			}
		)(req, res, next);
	};

	public logout = async (req: Request, res: Response, next: NextFunction) => {
		const userData = req.user as User;

		try {
			const user = await this.authService.logout(userData);

			res.setHeader('Set-Cookie', ['Authorization=;Max-age=0']);
			res.status(200).json({ data: user, message: 'logout' });
		} catch (error) {
			next(error);
		}
	};
}

export default AuthController;
