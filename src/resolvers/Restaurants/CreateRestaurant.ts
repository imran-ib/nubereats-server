import {arg, extendType, nonNull} from 'nexus';

import {Context} from '../../context';
import {CreateRestaurantInput} from '../../InputTypes';

export const DefaultURL = `https://images.unsplash.com/photo-1498654896293-37aacf113fd9?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHJlc3RhdXJhbnR8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60`;

export const CreateRestaurant = extendType({
  type: 'Mutation',
  definition(t) {
    t.field('CreateRestaurant', {
      type: 'Restaurant',
      args: {
        data: nonNull(
          arg({
            type: CreateRestaurantInput,
          }),
        ),
      },
      //@ts-ignore
      async resolve(
        _,
        {data: {name, address, coverImage, Category}},
        ctx: Context,
      ) {
        try {
          if (!ctx.userId) {
            return;
          }

          const CategoryName = Category.trim().toLowerCase();
          //@ts-ignore
          const CategorySlug = CategoryName.replace(/ /g, '-');

          return ctx.prisma.restaurant.create({
            data: {
              address,
              name,
              coverImage: coverImage ? coverImage : DefaultURL,
              owner: {
                connect: {
                  id: parseInt(ctx.userId, 10),
                },
              },
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
            },
          });
        } catch (error) {
          return error;
        }
      },
    });
  },
});
