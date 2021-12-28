import {and, rule, shield} from 'graphql-shield';

import {Context} from '../context';

const rules = {
  isAuthenticatedUser: rule()((_, __, {userId}) => {
    return Boolean(userId);
  }),

  isOwner: rule()(async (_, __, {userId, prisma}) => {
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            role: 'OWNER',
          },
          {id: parseInt(userId, 10)},
        ],
      },
      select: {role: true},
    });

    const Owner = Boolean(user);
    if (Owner === false) {
      return new Error('Only Owners are Allowed to create/modify restaurants');
    }

    return Owner;
  }),
  isClient: rule()(async (_, __, {userId, prisma}) => {
    const user = await prisma.user.findFirst({
      where: {
        AND: [
          {
            role: 'CLIENT',
          },
          {id: parseInt(userId, 10)},
        ],
      },
      select: {role: true},
    });

    const Client = Boolean(user);
    if (Client === false) {
      return new Error('Only Clients are Allowed to create/modify orders');
    }

    return Client;
  }),
};

export const permissions = shield(
  {
    Query: {
      // me: rules.isAuthenticatedUser,
      // filterPosts: rules.isAuthenticatedUser,
      // post: rules.isAuthenticatedUser,
    },
    Mutation: {
      CreateRestaurant: and(rules.isAuthenticatedUser, rules.isOwner),
      EditRestaurant: and(rules.isAuthenticatedUser, rules.isOwner),
      DeleteRestaurant: and(rules.isAuthenticatedUser, rules.isOwner),
      CreateDish: and(rules.isAuthenticatedUser, rules.isOwner),
      DeleteDish: and(rules.isAuthenticatedUser, rules.isOwner),
      EditDish: and(rules.isAuthenticatedUser, rules.isOwner),
      CreateOrder: and(rules.isAuthenticatedUser, rules.isClient),

      // UpdatePhoto: and(rules.isAuthenticatedUser, rules.isPhotoOwner),
    },
  },
  {
    allowExternalErrors: process.env.NODE_ENV !== 'production',
  },
);
