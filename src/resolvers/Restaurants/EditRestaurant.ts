import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {DefaultURL} from '.';
import {EditRestaurantInput} from '../../InputTypes';

export const EditRestaurant = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('EditRestaurant', {
      type: 'Restaurant',
      args: {
        data: nonNull(
          arg({
            type: EditRestaurantInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (
        _,
        {data: {id, address, Category, coverImage}},
        ctx: Context,
      ) => {
        try {
          if (!ctx.userId) {
            return;
          }

          const restaurant = await ctx.prisma.restaurant.findUnique({
            where: {
              id,
            },
            select: {id: true, userId: true},
          });
          if (!restaurant) {
            return new Error(`Restaurant No Found`);
          }

          if (restaurant.userId !== parseInt(ctx?.userId, 10)) {
            return new Error(`You are not authorized for this operation`);
          }

          const CategoryName = Category?.trim().toLowerCase();
          //@ts-ignore
          const CategorySlug = CategoryName?.replace(/ /g, '-');

          const UpdatedRestaurant = await ctx.prisma.restaurant.update({
            where: {id},
            //@ts-ignore
            data: {
              address: address ? address : undefined,
              coverImage: coverImage ? coverImage : undefined,
              ...(Category && {
                categories: {
                  connectOrCreate: {
                    create: {
                      coverImage: coverImage ? coverImage : DefaultURL,
                      slug: CategorySlug,
                      name: CategoryName,
                    },
                    where: {
                      slug: CategorySlug,
                    },
                  },
                },
              }),
            },
            select: {id: true},
          });

          return UpdatedRestaurant;
        } catch (error) {
          return error;
        }
      },
    });
  },
});
