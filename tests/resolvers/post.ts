// import {
//   createDraftMutation,
//   deletePostMutation,
//   feedQuery,
//   filterPostsQuery,
//   postQuery,
//   publishMutation,
// } from './queries';

// import {getTestUtils} from '../testUtils';

// export function post(): void {
//   describe('Post', () => {
//     it.skip('should create auth user`s draft', async () => {
//       const {graphqlClient} = getTestUtils();

//       const variables = {
//         title: 'title',
//         content: 'content',
//       };

//       const response = await graphqlClient.request(
//         createDraftMutation,
//         variables,
//       );

//       expect(response).toHaveProperty('createDraft');
//       expect(response.createDraft).toHaveProperty('id');
//       expect(response.createDraft.title).toEqual('title');
//     });

//     it.skip('should publish user`s draft', async () => {
//       const {graphqlClient} = getTestUtils();
//       const variables = {id: 1};

//       const response = await graphqlClient.request(publishMutation, variables);

//       expect(response).toHaveProperty('publish');
//       expect(response.publish).toHaveProperty('id');
//       expect(response.publish.title).toEqual('title');
//     });

//     it.skip('should query feed', async () => {
//       const {graphqlClient} = getTestUtils();
//       const response = await graphqlClient.request(feedQuery);

//       expect(response).toHaveProperty('feed');
//       expect(response.feed).toHaveLength(1);
//     });

//     it.skip('should query post', async () => {
//       const {graphqlClient} = getTestUtils();

//       const response = await graphqlClient.request(postQuery, {
//         id: 1,
//       });

//       expect(response).toHaveProperty('post');
//     });

//     it.skip('should filter posts', async () => {
//       const {graphqlClient} = getTestUtils();

//       const response = await graphqlClient.request(filterPostsQuery, {
//         searchString: 'title',
//       });

//       expect(response).toHaveProperty('filterPosts');
//     });

//     it.skip('should delete user`s draft', async () => {
//       const {graphqlClient} = getTestUtils();

//       const variables = {
//         id: 1,
//       };

//       const response = await graphqlClient.request(
//         deletePostMutation,
//         variables,
//       );

//       expect(response).toHaveProperty('deletePost');
//       expect(response.deletePost).toHaveProperty('id');
//       expect(response.deletePost.id).toEqual(1);
//     });

//     it.skip('should query feed after deletion', async () => {
//       const {graphqlClient} = getTestUtils();

//       const response = await graphqlClient.request(feedQuery);

//       expect(response).toHaveProperty('feed');
//       expect(response.feed).toHaveLength(0);
//     });
//   });
// }
