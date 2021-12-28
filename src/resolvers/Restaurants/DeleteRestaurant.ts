import {extendType, intArg, nonNull} from 'nexus';

import {Context} from '../../context';

export const DeleteRestaurant = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('DeleteRestaurant', {
      type: 'String',
      args: {
        id: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_, {id}, ctx: Context) => {
        try {
          if (!ctx.userId) {
            return;
          }

          const restaurant = await ctx.prisma.restaurant.findUnique({
            where: {id},
            select: {id: true, userId: true},
          });
          if (!restaurant) {
            return `Restaurant Not Found`;
          }

          if (restaurant.userId !== parseInt(ctx.userId, 10)) {
            return new Error(`You are not allowed to do this operation`);
          }

          await ctx.prisma.restaurant.delete({
            where: {id},
          });

          return `Success!`;
        } catch (error) {
          return error;
        }
      },
    });
  },
});
