import {enumType, extendInputType, inputObjectType, objectType} from 'nexus';

export const UserCreateInput = inputObjectType({
  name: 'UserCreateInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('name');
    t.nonNull.string('password');
    t.nullable.field('ROLE', {type: 'ROLE'});
  },
});
export const UserLoginInput = inputObjectType({
  name: 'UserLoginInput',
  definition(t) {
    t.nonNull.string('email');
    t.nonNull.string('password');
  },
});
export const UpdateProfileInput = inputObjectType({
  name: 'UpdateProfileInput',
  definition(t) {
    t.nonNull.int('id');
    t.nullable.string('email');
    t.nullable.string('password');
  },
});

export const UserUniqueInput = inputObjectType({
  name: 'UserUniqueInput',
  definition(t) {
    t.int('id');
    t.string('email');
  },
});

export const CreateRestaurantInput = inputObjectType({
  name: 'CreateRestaurantInput',
  description: 'Create Restaurant Input',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('address');
    t.nullable.string('coverImage');
    t.nonNull.string('Category');
  },
});

export const EditRestaurantInput = inputObjectType({
  name: 'EditRestaurantInput',
  description: 'Edit Restaurant Input',
  definition(t) {
    t.nonNull.int('id');
    t.nullable.string('address');
    t.nullable.string('coverImage');
    t.nullable.string('Category');
  },
});

export const GetAllCategoryInput = inputObjectType({
  name: 'GetAllCategoryInput',
  description: 'Get CAtegories With Pagination',
  definition(t) {
    t.nonNull.string('slug');
    t.nonNull.int('page', {default: 1});
  },
});

export const SearchRestaurantInput = inputObjectType({
  name: 'SearchRestaurantInput',
  definition(t) {
    t.nonNull.string('term');
    t.nonNull.int('page', {default: 1});
  },
});

export const CreateDishInput = inputObjectType({
  name: 'CreateDishInput',
  definition(t) {
    t.nonNull.int('RestaurantId');
    t.nonNull.string('name');
    t.nonNull.int('price');
    t.nonNull.string('description');
    t.list.field('dishOptions', {type: 'JSONObject'});
    //   "dishOptions" : {
    //     "options": {
    //        "name": ["ChowMie New"],
    //        "SpiceLevel": ["Normal", "Hot" , "Kill me"],
    //         "choice":    ["Low" ,"Med" ,"Kill Me"],
    //         "size":      ["X" ,"M" ,"L","XL"],
    //         "extra":     [5 , 10 , 15 , 20],
    //         "remarks" :  ["Pleas Add extra Salt"]
    //         }}
    // },
  },
});
export const EditDishInput = inputObjectType({
  name: 'EditDishInput',
  definition(t) {
    t.nonNull.int('dishId');
    t.nullable.string('name');
    t.nullable.int('price');
    t.nullable.string('description');
    t.list.nullable.field('options', {type: 'JSONObject'});
  },
});

// export const OrderItemsInput = inputObjectType({
//   name: 'OrderItemsInput',
//   definition(t) {
//     t.nonNull.int('dishId');
//     t.nullable.field('options', {type: 'JSONObject'});
//   },
// });

export const CreateOrderInput = inputObjectType({
  name: 'CrateOrderInput',
  definition(t) {
    t.nonNull.int('restaurantId');

    t.nonNull.list.field('items', {
      type: 'OrderItemsInput',
    });
  },
});

// export const Media = interfaceType({
//   *     name: 'Media',
//   *     resolveType(source) {
//   *       return 'director' in source ? 'Movie' : 'Song'
//   *     },
//   *     definition(t) {
//   *       t.string('url')
//   *     },
//   *   })

export const SortOrder = enumType({
  name: 'SortOrder',
  members: ['asc', 'desc'],
});
