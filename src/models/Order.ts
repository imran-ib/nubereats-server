import {Context} from '../context';
import {Prisma} from '@prisma/client';
import {objectType} from 'nexus';

export const Order = objectType({
  name: 'Order',
  definition(t) {
    t.id('id');
    t.int('total');
    t.field('status', {type: 'ORDER_STATUS'});
    t.field('customer', {type: 'User'});
    t.field('restaurant', {type: 'Restaurant'});
    t.field('driver', {type: 'User'});
    t.list.field('dishes', {type: 'Dish'});
  },
});
