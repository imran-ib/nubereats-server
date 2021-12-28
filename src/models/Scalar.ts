import {asNexusMethod, enumType, scalarType} from 'nexus';

import {GraphQLDateTime} from 'graphql-iso-date';
import {GraphQLUpload} from 'graphql-upload';
import {JSONObjectResolver} from 'graphql-scalars';

export const AuthType = enumType({
  name: 'AuthType',
  members: ['Email', 'Facebook', 'Google', 'Apple'],
});

export const ROLE = enumType({
  name: 'ROLE',
  members: ['CLIENT', 'OWNER', 'DELIVERY_PERSON'],
  description: 'Role for user',
});

export const ORDER_STATUS = enumType({
  name: 'ORDER_STATUS',
  members: ['PENDING', 'COOKING', 'PICKED_UP', 'DELIVERED'],
});

enum GenderType {
  male = 'male',
  female = 'female',
}

export const Gender = scalarType({
  name: 'Gender',
  asNexusMethod: 'gender',
  parseValue(value: GenderType): GenderType | undefined {
    if (GenderType[value]) {
      return value;
    }
  },
  serialize(value) {
    return value;
  },
});

export const Upload = GraphQLUpload;
export const DateTime = asNexusMethod(GraphQLDateTime, 'date');
export const jsonScalar = asNexusMethod(JSONObjectResolver, 'json');
