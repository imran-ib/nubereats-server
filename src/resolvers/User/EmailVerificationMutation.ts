import {extendType, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';

export const EmailVerification = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('VerifyEmail', {
      type: 'Boolean',
      args: {
        code: nonNull(stringArg()),
      },
      //@ts-ignore
      resolve: async (_, {code}, ctx: Context) => {
        try {
          const CODE = await ctx.prisma.verifyEmail.findFirst({
            where: {code},
          });
          if (!CODE) {
            throw Error();
          }

          await ctx.prisma.user.update({
            where: {
              id: CODE.userId,
            },
            data: {
              isVerified: true,
            },
          });

          await ctx.prisma.verifyEmail.delete({
            where: {id: CODE.id},
          });

          return true;
        } catch (error) {
          return new Error(`Verification Code Not Found, ${error}`);
        }
      },
    });
  },
});
