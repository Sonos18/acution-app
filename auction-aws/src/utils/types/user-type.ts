export interface CreateUserInput { 
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
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
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
}