import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpDto } from 'src/modules/auth/dto/signup.dto';
import { UpdateUserDto } from 'src/modules/auth/dto/update-user.dto';
import { User } from '../schema/user.schema';
import { ErrorCode } from '../../../shared/enums/error-codes.enum';
import AppError from '../../../shared/helpers/app-error';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User.name) private model: Model<User>) { }

    async createUser(dto: SignUpDto): Promise<User> {
        return (await (new this.model(dto).save())).toJSON()
    }

    async updateUser(userId: string, updateUserDto: UpdateUserDto, throwError: boolean = false): Promise<User> {
        const user = await this.model.findByIdAndUpdate(userId, updateUserDto, {
            new: true,
        })

        if (!user && throwError) throw new AppError(ErrorCode['0003']);

        return user.toJSON()
    }

    async getUser(userId: string, throwError: boolean = false): Promise<User> {
        const user = await this.model.findById(userId)

        if (!user && throwError) throw new AppError(ErrorCode['0003']);

        return user.toJSON()
    }

    async getUserByUsername(username: string, throwError: boolean = false): Promise<User | null> {
        const user = await this.model.findOne({ username }).exec()


        if (!user && throwError) throw new AppError(ErrorCode['0003']);

        return user.toJSON()
    }
}
