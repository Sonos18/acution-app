import { User } from '~/db/user-schema';

export interface CreateUserInput {
	firstName: string;
	lastName: string;
	email: string;
	password: string;
	phone: string;
	role: string;
}

export interface UpdateUserInput {
	userId: string;
	firstName?: string;
	lastName?: string;
	email?: string;
	password?: string;
	phone?: string;
}

export interface CreateUserOutput {
	first_name: string;
	last_name: string;
	email: string;
	phone: string;
	user_id: string;
	created_at: string;
	updated_at: string;
	avatar: string;
}

export interface SigninInput {
	email: string;
	password: string;
}

export interface SiginOutput {
	refreshToken: string;
	accessToken: string;
	user: User;
}
