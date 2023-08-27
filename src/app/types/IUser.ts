

export type IUser = {
    id: string;
    login: string;
    role?: string;
    address?: string;
    phone?: string;
    firstname?: string;
    lastname?: string;
    password?: string;
}

export type INewUser = Omit<IUser, "id">;

export const unAuthorized = "__unauthorized__";