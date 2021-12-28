import {assert} from '../../utils/assert';
import {nonNull, queryField, stringArg} from 'nexus';
import {Context} from '../../context';

export const me = queryField('me', {
  type: 'User',

  resolve: async (_, __, {prisma, userId}) => {
    assert(userId, 'Not authorized');

    return prisma.user.findUnique({
      where: {
        id: parseInt(userId, 10),
      },
    });
  },
});

export const OneUser = queryField('OneUser', {
  type: 'User',
  args: {
    email: nonNull(stringArg()),
  },
  resolve: async (_, {email}, ctx: Context) => {
    const user = await ctx.prisma.user.findFirst({
      where: {email},
      select: {email: true, id: true, name: true},
    });
    if (!user) {
      throw Error(`User not Found`);
    }

    return user;
  },
});
