import { Router } from 'express';

import Route from '~/interfaces/routes.interface';

class IndexRoute implements Route {
	public path = '/';
	public router = Router();

	constructor() {
		this.initializeRoutes();
	}

	private initializeRoutes() {
		this.router.get(`${this.path}`, async (_req, res) => {

			res.status(200).json({ message:'You have reached' });
		});
	}
}

export default IndexRoute;
