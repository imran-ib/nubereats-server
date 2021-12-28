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

    t.field('options', {
      type: 'JSONObject',
      resolve(parent, _args, _ctx) {
        console.log('🚀 ~ file: Dish.ts ~ line 18 ~ resolve ~ parent', parent);
        if (parent && typeof parent === 'object' && Array.isArray(parent)) {
          const Obj = parent as Prisma.JsonArray;

          return Obj[0];
        }

        return;
      },
    });
  },
});
