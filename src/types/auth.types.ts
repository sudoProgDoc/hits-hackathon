export interface IAuthForm {
	password: string
	username: string
}

export interface IUser {
	id: string
	firstName: string
	lastName: string
	email: string
	password: string
	role: string
	createAt: string
	updateAt: string
}

export type IAdmin = { user: IUser }
export interface IManager extends IUser {
	id: string
	phone: string
	birthdate: string
}

export interface IAuthResponse {
	accessToken: string
	user: IUser
	role: string
}

export type TypeUserForm = Omit<IUser, 'id'> & { password?: string }
