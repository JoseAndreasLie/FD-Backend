import { Request } from 'express';
import { ApiServiceResponse } from '../../@types/apiServiceResponse';
import { IUser } from '../../models/interfaces/IUser';

export default interface IUserService {
    isEmailExists: (email: string) => Promise<ApiServiceResponse>;
}
