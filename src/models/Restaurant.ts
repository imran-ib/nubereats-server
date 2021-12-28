import {Context} from '../context';
import {objectType} from 'nexus';

export const Restaurant = objectType({
  name: 'Restaurant',
  description: 'Restaurants',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('coverImage');
    t.string('address');
    t.field('categories', {type: 'Category'});
    t.list.field('menu', {type: 'Dish'});

    // t.field('RestaurantCount', {
    //   type: 'CountInput',

    //   resolve: async (parent, args, ctx: Context, info) => {
    //     const {term} = info.variableValues.data;

    //     const Restaurants = await ctx.prisma.restaurant.count({
    //       where: {
    //         OR: [
    //           {
    //             name: {
    //               contains: term,
    //               mode: 'insensitive',
    //             },
    //           },
    //           {
    //             categories: {
    //               name: {
    //                 contains: term,
    //                 mode: 'insensitive',
    //               },
    //             },
    //           },
    //         ],
    //       },
    //     });

    //     const TotalPagesCount = Math.ceil(Restaurants / 5);

    //     return {
    //       TotalCount: Restaurants,
    //       pageCount: TotalPagesCount,
    //     };
    //   },
    // });
    t.date('deletedAt');
  },
});

export const RestaurantSearchOutput = objectType({
  name: 'RestaurantSearchOutput',
  definition(t) {
    t.list.field('Restaurant', {type: 'Restaurant'});
    t.int('count');
    t.int('page');
  },
});
