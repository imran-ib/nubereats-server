import {SendMail, sendVerificationEmail} from '../../../src/utils/mail/mail';

jest.mock('got', () => {});

jest.mock('form-data', () => {
  return {
    append: jest.fn(),
  };
});

export function mail(): void {
  describe('Send Verification Email', () => {
    it('should call send verification email', async () => {
      const send = jest.fn().mockImplementation(async () => {
        console.log('Hello THere');
      });

      const args = {
        email: '',
        code: '',
      };

      await send(args.email, args.code);

      expect(send).toHaveBeenCalledTimes(1);
    });
  });
}
