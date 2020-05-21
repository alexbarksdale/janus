import { sign } from 'jsonwebtoken';

import { UserEntity } from '../entity/User.entity';

export const genAccessToken = (user: UserEntity) => {
    return sign(
        { userId: user.id, userEmail: user.email },
        process.env.ACCESS_TOKEN_SECRET!,
        {
            expiresIn: '13m',
        }
    );
};

export const genRefreshToken = (user: UserEntity) => {
    return sign(
        { userId: user.id, userEmail: user.email },
        process.env.REFRESH_TOKEN_SECRET!,
        {
            expiresIn: '5d',
        }
    );
};
