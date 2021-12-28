import {objectType} from 'nexus';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.id('id');
    t.string('email');
    t.string('name');
    t.string('code');
    t.boolean('isVerified');
    t.date('createdAt');
    t.date('updatedAt');
    // t.date('deletedAt');
    t.field('role', {type: 'ROLE'});
  },
});
