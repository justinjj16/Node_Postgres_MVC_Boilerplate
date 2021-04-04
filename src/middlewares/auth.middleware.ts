import { Request, NextFunction, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import HttpException from '../exceptions/HttpException';
import { DataStoredInToken } from '~/interfaces/auth.interface';
import { User } from '~/entity/User';

async function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction
) {
	const bearerToken:string|undefined = req.headers.authorization;
	const token:string|undefined = bearerToken && bearerToken.split(" ")[1];
	if (token) {
		const secret = process.env.JWT_SECRET;

		try {
			const verificationResponse = jwt.verify(
				token,
				secret as jwt.Secret
			) as DataStoredInToken;
			const userId = verificationResponse.id;

			const findUser = await User.findOne({ id: userId });
			if (findUser) {
				req.user = findUser;
				next();
			} else {
				next(new HttpException(401, 'Wrong authentication token'));
			}
		} catch (error) {
			next(new HttpException(401, 'Wrong authentication token'));
		}
	} else {
		next(new HttpException(404, 'Authentication token missing'));
	}
}

export default authMiddleware;
