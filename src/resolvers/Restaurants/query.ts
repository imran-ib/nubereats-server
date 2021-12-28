import {arg, extendType, intArg, nonNull, stringArg} from 'nexus';

import {Context} from '../../context';
import {GetAllCategoryInput} from '../../InputTypes';

export const GetAllCategories = extendType({
  type: 'Query',
  definition(t) {
    t.list.field('GetAllCategories', {
      type: 'Category',

      //@ts-ignore
      resolve: async (_, __, ctx: Context) => {
        try {
          return ctx.prisma.category.findMany();
        } catch (error) {
          return error;
        }
      },
    });
  },
});

export const GetCategory = extendType({
  type: 'Query',
  definition(t) {
    t.nullable.field('GetCategory', {
      type: 'Category',
      args: {
        data: nonNull(
          arg({
            type: GetAllCategoryInput,
          }),
        ),
      },

      //@ts-ignore
      resolve: async (_, {data: {slug, page}}, ctx: Context) => {
        try {
          return ctx.prisma.category.findFirst({
            where: {
              slug,
            },
            include: {
              Restaurant: {
                where: {
                  categories: {
                    slug,
                  },
                },
                take: 25,
                skip: (page - 1) * 25,
              },
            },
          });
        } catch (error) {
          return error;
        }
      },
    });
  },
});

export const GetRestaurant = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.field('GetRestaurant', {
      type: 'Restaurant',
      args: {
        id: nonNull(intArg()),
      },
      //@ts-ignore
      resolve: async (_, {id}, ctx: Context) => {
        try {
          //TODO see if restaurant needs category
          const res = await ctx.prisma.restaurant.findFirst({
            where: {id},
            include: {categories: true, menu: true},
          });

          return res;
        } catch (error) {
          return error;
        }
      },
    });
  },
});
