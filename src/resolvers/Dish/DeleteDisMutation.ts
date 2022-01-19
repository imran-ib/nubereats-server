import {extendType, intArg, nonNull} from 'nexus';

import {Context} from '../../context';

export const DeleteDishMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('DeleteDish', {
      type: 'Dish',
      args: {
        dishId: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_, args, ctx: Context) => {
        try {
          if (!ctx.userId) {
            return;
          }

          const dish = await ctx.prisma.dish.findUnique({
            where: {id: args.dishId},
            include: {
              Restaurant: true,
            },
          });

          if (!dish) {
            return Error(`Dish Not Found!`);
          }

          if (parseInt(ctx.userId, 10) !== dish.Restaurant.userId) {
            return new Error(`You are not allowed to do this operation `);
          }

          return ctx.prisma.dish.delete({where: {id: args.dishId}});
        } catch (error) {
          return error;
        }
      },
    });
  },
});
