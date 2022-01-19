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
            let options;
            let dishPrice = dish.price;
            //@ts-ignore
            let OrderOptions: [{}] = [];

            for (const itemOptions of item?.options!) {
              OrderOptions.push(itemOptions);

              options = await ctx.prisma.dish.findMany({
                select: {dishOptions: true},
                where: {
                  dishOptions: {
                    hasSome: itemOptions,
                  },
                },
              });
            }

            if (options.length) {
              const optionsArr: any[] = options.map((o) => o.dishOptions);
              const merged = [].concat.apply([], optionsArr);

              let UserOrderOptions = merged.map(
                //@ts-ignore
                (element, i) => (element = OrderOptions[i]),
              );

              UserOrderOptions = UserOrderOptions.filter(
                (e) => e !== undefined,
              );

              for (const iterator of UserOrderOptions) {
                //@ts-ignore
                dishPrice = dishPrice + iterator.extra;
              }
            }
            console.log(dishPrice);

            // const DishOptions = options.map(
            //   (o) => o?.dishOptions?.options?.option,
            // );

            // const merged = [].concat.apply([], DishOptions);

            // const UserItem = merged.filter(
            //   (i) => i.name === item?.options.option.name,
            // );

            // console.log(
            //   '🚀 ~ file: CreateOrderMutation.ts ~ line 61 ~ resolve: ~ UserItem',
            //   UserItem,
            // );

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
