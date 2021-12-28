import {Context} from '../context';
import {objectType} from 'nexus';

export const Category = objectType({
  name: 'Category',
  definition(t) {
    t.id('id');
    t.string('name');
    t.string('slug');
    t.string('coverImage');
    t.list.field('Restaurant', {type: 'Restaurant'});

    t.field('RestaurantCount', {
      type: 'CountInput',
      resolve: async (parent, __, ctx: Context) => {
        const Restaurants = await ctx.prisma.restaurant.count({
          where: {
            categories: {
              //@ts-ignore
              id: parent.id,
            },
          },
        });
        const TotalPagesCount = Math.ceil(Restaurants / 25);

        return {
          TotalCount: Restaurants,
          pageCount: TotalPagesCount,
        };
      },
    });
    t.date('deletedAt');
  },
});
