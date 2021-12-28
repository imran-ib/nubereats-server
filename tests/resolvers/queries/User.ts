import gql from 'graphql-tag';

// export const signUpMutation = /* GraphQL */ `
//   mutation signUp($user: UserCreateInput!) {
//     signUp(user: $user) {
//       token
//       user {
//         id
//         name
//         email
//         gender
//       }
//     }
//   }
// `;

export const CreateUserMutation = /* GraphQL */ `
  mutation CreateUserMutation($data: UserCreateInput!) {
    createUser(data: $data) {
      id
      name
      email
      role
    }
  }
`;

export const OneUserQuery = /* GraphQL */ `
  query OneUser($email: String!) {
    OneUser(email: $email) {
      id
      email
      name
    }
  }
`;

export const UserLoginMutation = /* GraphQL */ `
  mutation UserLogin($data: UserLoginInput!) {
    UserLogin(data: $data) {
      token
      user {
        email
      }
    }
  }
`;

export const UpdateUserProfile = /* GraphQL */ `
  mutation UpdateUserProfile($data: UpdateProfileInput!) {
    updateUserProfile(data: $data) {
      email
      id
      code
      isVerified
    }
  }
`;

export const VerifyEmail = /* GraphQl */ `
    mutation VerifyEmail($code: String!) {
      VerifyEmail(code: $code)
}

`;

// export const createDraftMutation = /* GraphQL */ `
//   mutation createDraft($title: String!, $content: String!) {
//     createDraft(title: $title, content: $content) {
//       id
//       title
//     }
//   }
// `;

// export const publishMutation = /* GraphQL */ `
//   mutation publish($id: Int!) {
//     publish(id: $id) {
//       id
//       title
//     }
//   }
// `;

// export const deletePostMutation = /* GraphQL */ `
//   mutation deletePost($id: Int!) {
//     deletePost(id: $id) {
//       id
//     }
//   }
// `;

// export const meQuery = /* GraphQL */ `
//   query me {
//     me {
//       id
//       email
//       name
//     }
//   }
// `;

// export const feedQuery = /* GraphQL */ `
//   query feed {
//     feed {
//       id
//       title
//     }
//   }
// `;

// export const filterPostsQuery = /* GraphQL */ `
//   query filterPosts($searchString: String!) {
//     filterPosts(searchString: $searchString) {
//       id
//       title
//     }
//   }
// `;

// export const postQuery = /* GraphQL */ `
//   query post($id: Int!) {
//     post(id: $id) {
//       id
//       title
//     }
//   }
// `;

// export const userUpdatedSubscription = gql`
//   subscription userUpdated($userId: String!) {
//     userUpdated(userId: $userId) {
//       id
//       email
//       name
//       gender
//     }
//   }
// `;

// export const userSignedInSubscription = gql`
//   subscription userSignedIn($userId: String!) {
//     userSignedIn(userId: $userId) {
//       id
//       email
//       name
//       gender
//       createdAt
//     }
//   }
// `;
