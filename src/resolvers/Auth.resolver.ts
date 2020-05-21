import { Resolver, Query, Mutation, Arg, Ctx } from 'type-graphql';

import { hash, compare } from 'bcrypt';
import { UserEntity } from '../entity/User.entity';
import { genAccessToken, genRefreshToken } from '../utils/jwt.utils';
import { RegisterResponse, LoginResponse } from './types/auth.types';
import { ReqRes } from '../context/reqres.context';

@Resolver()
export class AuthResolver {
    @Query(() => [UserEntity])
    users() {
        return UserEntity.find();
    }

    @Mutation(() => RegisterResponse)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<RegisterResponse> {
        if (!email || !password) throw new Error('Email or password is missing!');

        const doesUserExist = await UserEntity.findOne({ where: { email } });
        if (doesUserExist) throw new Error('Email is already registered.');

        // Create a new user
        const user = UserEntity.create();
        user.email = email;
        user.password = await hash(password, 12);

        try {
            await UserEntity.save(user);
        } catch (err) {
            throw new Error('Failed to register');
        }

        return {
            registerMsg: 'Please check your email to confirm your registration.',
            registerSuccess: true,
        };
    }

    @Mutation(() => LoginResponse)
    async login(
        @Arg('email') email: string,
        @Arg('password') password: string,
        @Ctx() { res }: ReqRes
    ): Promise<LoginResponse> {
        if (!email || !password) throw new Error('Email or password is missing!');

        const user = await UserEntity.findOne({ where: { email } });
        if (!user) throw new Error('Email or password is incorrect!');

        const validPassword = await compare(password, user.password);
        if (!validPassword) throw new Error('Email or password is incorrect!');

        // User is authenticated
        res.cookie('trident', genRefreshToken(user), {
            httpOnly: true,
        });

        return {
            user,
            accessToken: genAccessToken(user),
        };
    }
}
