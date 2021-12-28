import {
  CreateUserMutation,
  OneUserQuery,
  UpdateUserProfile,
  UserLoginMutation,
  VerifyEmail,
} from './queries';

import {GraphQLClient} from 'graphql-request';
import {PrismaClient} from '.prisma/client';
import {getTestUtils} from '../testUtils';

const userVariables = {
  data: {
    email: 'test@jest-e2e.com',
    password: 'password',
    name: 'Imran',
  },
};

export function Usere2e(): void {
  describe('Test Create User E2E', () => {
    let graphqlClient: GraphQLClient;
    let prisma: PrismaClient;
    let setAuthToken: (token: string) => void;

    beforeEach(async () => {
      prisma = getTestUtils().prisma;
      graphqlClient = getTestUtils().graphqlClient;
      setAuthToken = getTestUtils().setAuthToken;
    });

    it('Should Create User Successfully ', async () => {
      const response = await graphqlClient.request(
        CreateUserMutation,
        userVariables,
      );
      expect(response.createUser).toBeDefined();

      expect(response.createUser).toMatchObject({
        email: 'test@jest-e2e.com',
        id: expect.any(String),
        name: 'Imran',
        role: 'CLIENT',
      });
    });

    it('should throw an error if user Already Exists', () => {
      expect(async () => {
        await graphqlClient.request(CreateUserMutation, userVariables);
      }).rejects.toThrow();

      // //with prisma
      // expect(async () => {
      //   await prisma.user.create({
      //     data: {...userVariables.data},
      //   });
      // }).rejects.toThrow();
    });

    it('Log User in', async () => {
      const userLoginVars = {
        data: {
          email: 'test@jest.com',
          password: 'password',
        },
      };

      const response = await graphqlClient.request(
        UserLoginMutation,
        userLoginVars,
      );

      expect(response).toHaveProperty('UserLogin');
      expect(response.UserLogin).toHaveProperty('token');
      expect(response.UserLogin).toHaveProperty('user');
      expect(response.UserLogin.user.email).toEqual(userLoginVars.data.email);

      //! GQL client is replaced with authenticated one.
      setAuthToken(response.UserLogin.token);
    });
  });
}
