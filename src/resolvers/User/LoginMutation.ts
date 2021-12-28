import {GenerateToken, validateCredential} from '../../utils/auth';
import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {USER_SIGNED_IN} from '.';
import {UserLoginInput} from '../../InputTypes';

export const UserLogin = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('UserLogin', {
      type: 'AuthPayload',
      args: {
        data: nonNull(
          arg({
            type: UserLoginInput,
          }),
        ),
      },
      //@ts-ignore
      async resolve(_, {data: {email, password}}, ctx: Context) {
        try {
          const user = await ctx.prisma.user.findFirst({
            where: {email},
            select: {email: true, id: true, password: true},
          });

          if (!user) {
            return new Error(`User not Found!`);
          }

          const IsCorrect = await validateCredential(password, user.password);

          if (!IsCorrect) {
            return new Error(`Wrong Email/Password`);
          }

          const token = GenerateToken(user.id);
          ctx.pubsub.publish(USER_SIGNED_IN, user);

          return {
            token,
            user,
          };
        } catch (error) {
          return error;
        }
      },
    });
  },
});
