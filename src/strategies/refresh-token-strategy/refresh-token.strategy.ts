import { Request, Response, NextFunction } from 'express';

import jwt from 'jsonwebtoken';
import { User } from '~/entity/User';

const refreshToken = async (
	req: Request,
	res: Response,
	_next: NextFunction
) => {
	const refreshToken = req.body.refreshToken;

	if (refreshToken) {
		const id = +jwt.decode(refreshToken)!;
		const user = await User.findOne({
			id,
		});

		if (user) {
			const token = await jwt.sign(user, process.env.JWT_SECRET, {
				expiresIn: 600,
			});
			res.json({ jwt: token });
		} else {
			res.status(401);
		}
	} else {
		res.status(401);
	}
};

export default refreshToken;
