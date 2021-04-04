import { Request } from 'express';
import { User } from './user.interface';

export interface DataStoredInToken {
	id: number;
	firstName:string;
	lastName:string;
	email:string;
	role:string;
}

export interface TokenData {
	token: string;
	expiresIn: number;
}

export interface RequestWithUser extends Request {
	user: User;
}
