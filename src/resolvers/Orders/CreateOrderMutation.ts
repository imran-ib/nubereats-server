import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {CreateOrderInput} from '../../InputTypes';

export const CreateOrderMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateOrder', {
      type: 'Order',
      args: {
        data: nonNull(
          arg({
            type: CreateOrderInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (_, {data: {restaurantId, items}}, ctx: Context) => {
        try {
          if (!ctx.userId) {
            return;
          }

          const restaurant = await ctx.prisma.restaurant.findUnique({
            where: {id: restaurantId},
          });

          if (!restaurant) {
            return Error(`Restaurant Not Found`);
          }

          for (const item of items) {
            const dish = await ctx.prisma.dish.findUnique({
              where: {id: item?.dishId},
            });
            if (!dish) {
              return new Error(`dish not found`);
            }

            for (const itemOptions of item?.options!) {
              const dishOptios = await ctx.prisma.dish.findMany({});
            }

            // await ctx.prisma.orderItem.create({
            //   data: {
            //     options: item?.options || [],
            //     dish: {
            //       connect: {
            //         id: dish.id,
            //       },
            //     },
            //   },
            // });
          }

          // const order = await ctx.prisma.order.create({
          //   data: {
          //     customer: {
          //       connect: {
          //         id: parseInt(ctx.userId, 10),
          //       },
          //     },
          //   },
          // });
        } catch (error) {
          return error;
        }
      },
    });
  },
});
