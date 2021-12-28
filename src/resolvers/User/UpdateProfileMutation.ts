import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {UpdateProfileInput} from '../../InputTypes';
import {encryptCredential} from '../../utils/auth';
import {randomUUID} from 'crypto';
import {sendVerificationEmail} from '../../utils/mail/mail';

export const UpdateUsersProfile = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateUserProfile', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: UpdateProfileInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (_, {data: {id, email, password}}, ctx: Context) => {
        try {
          const USER = await ctx.prisma.user.findFirst({
            where: {id},
            select: {code: true},
          });
          if (password === undefined && email) {
            const UpdatedUser = await ctx.prisma.user.update({
              where: {id},
              data: {
                email,
                isVerified: false,
                ...(USER?.code && {
                  code: {
                    delete: true,
                  },
                }),
              },
              select: {id: true},
            });
            // Verify Email

            const user = await ctx.prisma.verifyEmail.create({
              data: {
                code: randomUUID(),
                user: {
                  connect: {
                    id: UpdatedUser.id,
                  },
                },
              },
              select: {code: true},
            });

            await sendVerificationEmail(email, user.code);
          } else if (email && password) {
            const Hashed = await encryptCredential(password);

            const UpdatedUser = await ctx.prisma.user.update({
              where: {id},
              data: {
                email: email,
                password: Hashed,
                isVerified: false,
                ...(USER?.code && {
                  code: {
                    delete: true,
                  },
                }),
              },
            });

            // Verify Email
            const user = await ctx.prisma.verifyEmail.create({
              data: {
                code: randomUUID(),
                user: {
                  connect: {
                    id: UpdatedUser.id,
                  },
                },
              },
            });

            sendVerificationEmail(email, user.code);
          } else if (email === undefined && password) {
            const Hashed = await encryptCredential(password);

            await ctx.prisma.user.update({
              where: {id},
              data: {
                password: Hashed,
              },
            });
          }

          return ctx.prisma.user.findUnique({where: {id}});
        } catch (error) {
          return error;
        }
      },
    });
  },
});
