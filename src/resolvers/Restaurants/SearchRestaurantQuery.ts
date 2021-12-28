import {arg, extendType, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {SearchRestaurantInput} from '../../InputTypes';

export const SearchRestaurant = extendType({
  type: 'Query',
  definition(t) {
    t.field('SearchRestaurant', {
      type: 'RestaurantSearchOutput',
      args: {
        data: nonNull(
          arg({
            type: SearchRestaurantInput,
          }),
        ),
      },
      //@ts-ignore
      resolve: async (_, {data: {term, page}}, ctx: Context) => {
        try {
          const results = await ctx.prisma.restaurant.findMany({
            where: {
              OR: [
                {
                  name: {
                    contains: term,
                    mode: 'insensitive',
                  },
                },
                {
                  categories: {
                    name: {
                      contains: term,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            },
          });

          const count = await ctx.prisma.restaurant.count({
            where: {
              OR: [
                {
                  name: {
                    contains: term,
                    mode: 'insensitive',
                  },
                },
                {
                  categories: {
                    name: {
                      contains: term,
                      mode: 'insensitive',
                    },
                  },
                },
              ],
            },
          });

          return {
            Restaurant: results,
            count,
            page,
          };
        } catch (error) {
          return error;
        }
      },
    });
  },
});
