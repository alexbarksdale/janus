import { Resolver, Query, Mutation, Arg } from 'type-graphql';

import { hash } from 'bcrypt';
import { UserEntity } from '../entity/User.entity';

@Resolver()
export class AuthResolver {
    @Query(() => [UserEntity])
    users() {
        return UserEntity.find();
    }

    @Mutation(() => UserEntity)
    async register(
        @Arg('email') email: string,
        @Arg('password') password: string
    ): Promise<UserEntity> {
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
            throw new Error(`Failed to register: ${err}`);
        }
        return user;
    }
}
