import { Request, Response, NextFunction } from 'express';
import HttpException from '~/exceptions/HttpException';

function errorMiddleware(
	error: HttpException,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	const status: number = error.status || 500;
	const message: string =
		error.message || 'Internal server error, please try again later.';

	console.log('[ERROR] ', status, '-', message);
	res.status(status).json({ message });
}

export default errorMiddleware;
