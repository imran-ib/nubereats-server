import {Context} from '../context';
import {Prisma} from '@prisma/client';
import {objectType} from 'nexus';

export const Dish = objectType({
  name: 'Dish',
  definition(t) {
    t.id('id');
    t.string('name');
    t.int('price');
    t.string('image');
    t.string('description');
    t.field('Restaurant', {type: 'Restaurant'});

    t.list.field('dishOptions', {
      type: 'JSONObject',
      resolve(parent, _args, _ctx) {
        if (
          parent?.dishOptions &&
          typeof parent?.dishOptions === 'object' &&
          Array.isArray(parent?.dishOptions)
        ) {
          const Obj = parent?.dishOptions as Prisma.JsonArray;

          return Obj;
        }

        return;
      },
    });
  },
});
