import {Usere2e} from './resolvers/user.e2e';
import {mail} from './resolvers/queries/mail';
import {user} from './resolvers/user';

describe('main tests', () => {
  user();
  Usere2e();
  mail();
});
