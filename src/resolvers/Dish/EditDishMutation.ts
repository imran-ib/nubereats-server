import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {EditDishInput} from '../../InputTypes';

export const EditDishMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('EditDish', {
      type: 'Dish',
      args: {
        data: nonNull(
          arg({
            type: EditDishInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (_, args, ctx: Context) => {
        try {
          const {dishId, name, price, description, options} = args.data;

          if (!ctx.userId) {
            return;
          }

          const dish = await ctx.prisma.dish.findUnique({
            where: {id: dishId},
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

          return ctx.prisma.dish.update({
            where: {id: dishId},
            data: {
              name: name || undefined,
              price: price || undefined,
              description: description || undefined,
              dishOptions: options || undefined,
            },
          });
        } catch (error) {
          return error;
        }
      },
    });
  },
});
