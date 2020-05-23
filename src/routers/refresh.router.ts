import express, { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';

import { UserEntity } from '../entity/User.entity';
import { genAccessToken, sendRefreshToken } from '../utils/jwt.utils';

export const router = express.Router();

router.post('/auth/refresh', async (req: Request, res: Response) => {
    const token = req.cookies.trident;
    if (!token) res.send({ ok: false, accessToken: '' });

    let payload: any;
    try {
        payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (err) {
        return res.status(401).send({ ok: false, accessToken: '' });
    }

    // Token is valid
    const user = await UserEntity.findOne({ id: payload.userId });
    if (!user) return res.status(404).send({ ok: false, accessToken: '' });

    // User exists, sending tokens
    sendRefreshToken(res, genAccessToken(user));
    return res.send({ ok: true, accessToken: genAccessToken(user) });
});

