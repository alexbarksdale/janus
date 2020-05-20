import { Resolver, Query } from 'type-graphql';

import { User } from '../entity/User.entity';

@Resolver()
export class AuthResolver {
    @Query(() => [User])
    users() {
        return User.find();
    }
}
