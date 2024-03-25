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
	created_at: Date;
	updated_at: Date;
}

export interface SigninInput {
	email: string;
	password: string;
}

export interface SiginOutput {
	access_token: string;
	user: User;
}
