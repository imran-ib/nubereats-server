import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {CreateDishInput} from '../../InputTypes';

export const CreateDish = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateDish', {
      type: 'Dish',
      args: {
        data: nonNull(
          arg({
            type: CreateDishInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (
        _,
        {data: {RestaurantId, name, price, description, dishOptions}},
        ctx: Context,
      ) => {
        try {
          if (!ctx.userId) {
            return;
          }

          const Restaurant = await ctx.prisma.restaurant.findUnique({
            where: {id: RestaurantId},
            select: {id: true, userId: true},
          });

          if (!Restaurant) {
            return new Error(`Restaurant Not Found`);
          }

          if (parseInt(ctx.userId, 10) !== Restaurant.userId) {
            return new Error(`You are not allowed to do this operation `);
          }

          const Dish = await ctx.prisma.dish.create({
            data: {
              description,
              name,
              price,
              dishOptions: dishOptions || undefined,
              image: 'www.someUrl.com',
              Restaurant: {
                connect: {
                  id: RestaurantId,
                },
              },
            },
          });

          return Dish;
        } catch (error) {
          return;
        }
      },
    });
  },
});
