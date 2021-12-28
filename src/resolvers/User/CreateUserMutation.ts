import {randomUUID} from 'crypto';
import {arg, nonNull, extendType} from 'nexus';
import {Context} from '../../context';
import {UserCreateInput} from '../../InputTypes';
import {encryptCredential, validateEmail} from '../../utils/auth';
import {sendVerificationEmail} from '../../utils/mail/mail';

export const createUser = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('createUser', {
      type: 'User',
      args: {
        data: nonNull(
          arg({
            type: UserCreateInput,
          }),
        ),
      },
      //@ts-ignore
      async resolve(_, {data: {name, email, password, ROLE}}, ctx: Context) {
        try {
          //Validate Email
          const ValidEmail = validateEmail(email);

          if (!ValidEmail) {
            throw new Error(`Please Provide Valid Email Address`);
          }

          const UserExists = await ctx.prisma.user.findFirst({
            where: {email},
          });

          if (UserExists) {
            return new Error(`User Already Exists`);
          }

          const HashedPassword = await encryptCredential(password);

          const USER = await ctx.prisma.user.create({
            data: {
              email,
              name,
              password: HashedPassword,
              role: ROLE ? ROLE : undefined,
            },
          });

          const code = await ctx.prisma.verifyEmail.create({
            data: {
              code: randomUUID(),
              user: {
                connect: {
                  email,
                },
              },
            },
          });
          await sendVerificationEmail(email, code.code);

          return USER;
        } catch (error) {
          return error;
        }
      },
    });
  },
});
