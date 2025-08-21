export interface IUser {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
}

export enum UserRole {
    LandLord = 1,
    Renter = 2
}