import {inputObjectType, objectType} from 'nexus';

import {Prisma} from '@prisma/client';

export const OrderItemsInput = inputObjectType({
  name: 'OrderItemsInput',
  definition(t) {
    t.nonNull.int('dishId');
    t.nullable.list.field('options', {type: 'JSONObject'});
  },
});

export const OrderItem = objectType({
  name: 'OrderItem',
  definition(t) {
    t.id('id');
    t.list.field('dishes', {type: 'Dish'});

    t.field('options', {
      type: 'JSONObject',
      resolve(parent, _args, _ctx) {
        if (parent && typeof parent === 'object' && Array.isArray(parent)) {
          const Obj = parent as Prisma.JsonArray;

          return Obj[0];
        }

        return;
      },
    });
  },
});
