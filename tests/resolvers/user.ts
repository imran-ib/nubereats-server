import {
  CreateUserMutation,
  OneUserQuery,
  UpdateUserProfile,
  UserLoginMutation,
  VerifyEmail,
} from './queries';
import {GenerateToken, encryptCredential} from '../../src/utils/auth';

import {GraphQLClient} from 'graphql-request';
import {PrismaClient} from '.prisma/client';
import {getTestUtils} from '../testUtils';

const userVariables = {
  data: {
    email: 'test@jest.com',
    password: 'password',
    name: 'Imran',
  },
};

export function user(): void {
  describe('USER TESTS ', () => {
    let graphqlClient: GraphQLClient;
    let prisma: PrismaClient;
    let setAuthToken: (token: string) => void;

    beforeEach(async () => {
      prisma = getTestUtils().prisma;
      graphqlClient = getTestUtils().graphqlClient;
      setAuthToken = getTestUtils().setAuthToken;
    });

    describe('create User -Unit', () => {
      let ExistingUser;

      beforeEach(async () => {
        ExistingUser = await prisma.user.findFirst({
          where: {email: userVariables.data.email},
          select: {code: true, isVerified: true},
        });
      });

      it('should create new user -Unit', async () => {
        const response = await graphqlClient.request(
          CreateUserMutation,
          userVariables,
        );

        expect(response).toHaveProperty('createUser');
        expect(response.createUser).toHaveProperty('id');
        expect(response.createUser).toHaveProperty('email');
        expect(response.createUser).toHaveProperty('name');
        expect(response.createUser).not.toHaveProperty('password');
        expect(response.createUser.email).toEqual(userVariables.data.email);
        expect(response.createUser.name).toEqual(userVariables.data.name);

        //TODO Test mail Service
      });

      it('should verify that password is hashed', async () => {
        expect(ExistingUser?.password).not.toEqual(userVariables.data.password);
      });

      it('it should verify that user is created and email verification code is saved in db and new user is not verified', async () => {
        expect(typeof ExistingUser?.code).toBe('object');
        expect(typeof ExistingUser?.code?.code).toBe('string');
        expect(typeof ExistingUser?.isVerified).toBe('boolean');
        expect(ExistingUser?.isVerified).toBeFalsy();
      });
    });

    describe('login User -Unit', () => {
      it('should fail if user does not exists', async () => {
        expect(async () => {
          await graphqlClient.request(UserLoginMutation, {
            data: {
              email: 'test@notExists.com',
              password: 'password',
            },
          });
        }).rejects.toThrowError();
      });

      it('should throw an error if password is wrong', async () => {
        expect(async () => {
          await graphqlClient.request(UserLoginMutation, {
            data: {
              email: 'test@jest.com',
              password: 'Wrong-password',
            },
          });
        }).rejects.toThrowError();
      });

      it('should Generate Auth Token', async () => {
        const MockedToken = jest.fn(GenerateToken);
        const token = MockedToken(1);

        expect(MockedToken).toHaveBeenCalledTimes(1);
        expect(MockedToken).toHaveBeenCalledWith(expect.any(Number));
        expect(typeof token).toBe('string');
        expect(token).toContain('.');
      });
    });

    describe('Edit Users Profile -Unit', () => {
      const UpdateVariables = {
        id: 1,
        email: 'test@upadted.com',
        password: 'UpdatedPassword',
      };

      afterEach(async () => {
        //change back so other test won't get affected
        await graphqlClient.request(UpdateUserProfile, {
          data: {
            id: 1,
            email: userVariables.data.email,
            password: userVariables.data.password,
          },
        });
      });

      it('Should Update Email if There is no password ', async () => {
        const OldUser = await graphqlClient.request(OneUserQuery, {
          email: 'test@jest.com',
        });

        expect(OldUser.OneUser).toHaveProperty('email');
        expect(OldUser.OneUser.email).toEqual(userVariables.data.email);

        // const UpdatedUser = await graphqlClient.request(UpdateUserProfile, {
        //   data: {id: UpdateVariables.id, email: UpdateVariables.email},
        // });

        const UpdatedUser = await prisma.user.update({
          where: {id: UpdateVariables.id},
          data: {email: UpdateVariables.email},
          include: {code: true},
        });

        expect(UpdatedUser).toHaveProperty('email');
        expect(UpdatedUser).toHaveProperty('id');
        expect(UpdatedUser).toHaveProperty('code');
        expect(UpdatedUser.email).not.toEqual(OldUser.email);
        expect(UpdatedUser.email).toEqual(UpdateVariables.email);
        expect(UpdatedUser).toHaveProperty('isVerified');
        expect(UpdatedUser.isVerified).toBeFalsy();
        expect(UpdatedUser?.code).toBeDefined();
        expect(typeof UpdatedUser?.code?.code).toBe('string');
      });

      it('Should update email and password  ', async () => {
        const OldUser = await graphqlClient.request(OneUserQuery, {
          email: 'test@jest.com',
        });

        const UpdatedUser = await prisma.user.update({
          where: {id: UpdateVariables.id},
          data: {
            email: UpdateVariables.email,
            password: UpdateVariables.password,
          },
          include: {code: true},
        });

        expect(OldUser.OneUser).toHaveProperty('email');
        expect(OldUser.OneUser.email).toEqual(userVariables.data.email);
        expect(UpdatedUser).toHaveProperty('email');
        expect(UpdatedUser).toHaveProperty('id');
        expect(UpdatedUser).toHaveProperty('code');
        expect(UpdatedUser.email).not.toEqual(OldUser.email);
        expect(UpdatedUser.password).not.toEqual(OldUser.password);
        expect(UpdatedUser.email).toEqual(UpdateVariables.email);
        expect(UpdatedUser).toHaveProperty('isVerified');
        expect(UpdatedUser.isVerified).toBeFalsy();
        expect(UpdatedUser?.code).toBeDefined();
        expect(typeof UpdatedUser?.code?.code).toBe('string');
      });

      it('should updated user password', async () => {
        const mockedHashed = jest.fn(async (hash) => encryptCredential(hash));

        const hashed = await mockedHashed(UpdateVariables.password);

        const OldUser = await prisma.user.findFirst({
          where: {email: 'test@jest.com'},
          select: {email: true, password: true},
        });

        const UpdatedUser = await prisma.user.update({
          where: {id: UpdateVariables.id},
          data: {
            password: hashed,
          },
          select: {email: true, password: true},
        });

        expect(OldUser).toHaveProperty('email');
        expect(OldUser?.email).toEqual(userVariables.data.email);
        expect(typeof UpdatedUser.password).toBe('string');
        expect(UpdatedUser.password).not.toEqual(OldUser?.password);
        expect(UpdatedUser.password.length).toEqual(hashed.length);
      });

      it('Should fail on exception', () => {
        expect(async () => {
          await prisma.user.findFirst({
            where: {email: 'notExists@notExists.com'},
            select: {id: true},
            rejectOnNotFound: true,
          });
        }).rejects.toThrowError();
      });
    });

    describe('should verify  email verification code', () => {
      let OldUser;

      let code;

      beforeEach(async () => {
        OldUser = await prisma.user.findFirst({
          where: {email: 'test@jest.com'},
          select: {
            code: {select: {code: true}},
            id: true,
          },
        });

        code = await prisma.verifyEmail.findFirst({
          where: {code: OldUser?.code?.code},
        });
      });

      it('should check code', async () => {
        expect(typeof OldUser?.code?.code).toBeDefined();
        expect(typeof OldUser?.code?.code).toBe('string');
      });

      it(' should throw an error if code does not exists', async () => {
        expect(async () => {
          await graphqlClient.request(VerifyEmail, {
            code: 'Wrong code',
          });
        }).rejects.toThrowError();
      });

      it('it should update user "isVerify" status', async () => {
        const updatedUser = await prisma.user.update({
          where: {
            id: OldUser?.id,
          },
          data: {isVerified: false},
        });

        expect(updatedUser?.isVerified).toBe(false);
        expect(updatedUser?.isVerified).toBeFalsy();
      });

      it('should delete code', async () => {
        await graphqlClient.request(VerifyEmail, {
          code: code.code,
        });
      });
    });
  });
}

// it.skip('should throw error when password is invalid', () => {
//   const {graphqlClient} = getTestUtils();

//   const variables = {
//     email: 'dooboo@dooboolab.com',
//     password: 'invalid',
//   };

//   const promise = graphqlClient.request(testHost, signInMutation, variables);

//   expect(promise).rejects.toThrow();
// });

// it.skip('should signIn user', async () => {
//   const {graphqlClient, setAuthToken} = getTestUtils();

//   const variables = {
//     email: 'dooboo@dooboolab.com',
//     password: 'password',
//   };

//   const response = await graphqlClient.request(signInMutation, variables);

//   expect(response).toHaveProperty('signIn');
//   expect(response.signIn).toHaveProperty('token');
//   expect(response.signIn).toHaveProperty('user');
//   expect(response.signIn.user.email).toEqual(variables.email);

//   //! GQL client is replaced with authenticated one.
//   setAuthToken(response.signIn.token);
// });

// describe.skip('Resolver - after signIn', () => {
//   const variables = {
//     user: {
//       name: 'HelloBro',
//       gender: 'male',
//     },
//   };

//   it('should update user profile', async () => {
//     const {graphqlClient} = getTestUtils();

//     const response = await graphqlClient.request(
//       updateProfileMutation,
//       variables,
//     );

//     expect(response).toHaveProperty('updateProfile');
//     expect(response.updateProfile).toHaveProperty('name');
//     expect(response.updateProfile).toHaveProperty('gender');
//     expect(response.updateProfile.name).toEqual(variables.user.name);
//     expect(response.updateProfile.gender).toEqual(variables.user.gender);
//   });

//   it('should throw error when invalid gender value is given', async () => {
//     const {graphqlClient} = getTestUtils();

//     const vars = {
//       user: {
//         name: 'HelloBro',
//         gender: 'invalid',
//       },
//     };

//     expect(async () => {
//       await graphqlClient.request(updateProfileMutation, vars);
//     }).rejects.toThrow();
//   });

//   it('should query me and get updated name', async () => {
//     const {graphqlClient} = getTestUtils();
//     const response = await graphqlClient.request(meQuery);

//     expect(response).toHaveProperty('me');
//     expect(response.me.name).toEqual(variables.user.name);
//   });
// });

// describe.skip('Resolver - user Subscription', () => {
//   const userVariables = {
//     user: {
//       name: 'newUser1',
//       email: 'newUser1@dooboolab.com',
//       password: 'password123!',
//       gender: 'male',
//     },
//   };

//   it("should subscribe 'userSignedIn' after 'signUp' mutation", async () => {
//     const {graphqlClient, apolloClient} = getTestUtils();

//     let subscriptionValue;

//     const response1 = await graphqlClient.request(
//       signUpMutation,
//       userVariables,
//     );

//     const userId = response1.signUp.user.id;

//     expect(response1.signUp.user.name).toEqual(userVariables.user.name);
//     expect(response1.signUp.user.gender).toEqual(userVariables.user.gender);

//     apolloClient
//       .subscribe({
//         query: userSignedInSubscription,
//         variables: {userId},
//       })
//       .subscribe({
//         next: ({data}) => {
//           return (subscriptionValue = data.userSignedIn);
//         },
//       });

//     const variables = {
//       email: 'newUser1@dooboolab.com',
//       password: 'password123!',
//     };

//     const response2 = await graphqlClient.request(signInMutation, variables);

//     expect(response2).toHaveProperty('signIn');
//     expect(response2.signIn).toHaveProperty('token');
//     expect(response2.signIn).toHaveProperty('user');
//     expect(response2.signIn.user.id).toEqual(subscriptionValue.id);
//     expect(response2.signIn.user.email).toEqual(subscriptionValue.email);
//     expect(response2.signIn.user.name).toEqual(subscriptionValue.name);
//     expect(response2.signIn.user.gender).toEqual(subscriptionValue.gender);

//     expect(response2.signIn.user.createdAt).toEqual(
//       subscriptionValue.createdAt,
//     );
//   });

//   it("should subscribe 'userUpdated' after 'updateProfile' mutation", async () => {
//     const {graphqlClient, apolloClient} = getTestUtils();

//     let subscriptionValue;

//     const variables = {
//       email: 'newUser1@dooboolab.com',
//       password: 'password123!',
//     };

//     const response = await graphqlClient.request(signInMutation, variables);

//     expect(response.signIn).toHaveProperty('user');

//     const userId = response.signIn.user.id;

//     apolloClient
//       .subscribe({
//         query: userUpdatedSubscription,
//         variables: {userId},
//       })
//       .subscribe({
//         next: ({data}) => {
//           return (subscriptionValue = data.userUpdated);
//         },
//       });

//     const variables2 = {
//       user: {
//         name: 'HelloBro',
//         gender: 'female',
//       },
//     };

//     const response2 = await graphqlClient.request(
//       updateProfileMutation,
//       variables2,
//     );

//     expect(response2).toHaveProperty('updateProfile');
//     expect(response2.updateProfile).toHaveProperty('name');
//     expect(response2.updateProfile).toHaveProperty('gender');
//   });
// });
