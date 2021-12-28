import {EmailVars} from './mail-interfaces';
import formData from 'form-data';
import got from 'got';

export const SendMail = async (
  subject: string,
  template: string,
  code: string,
  email: string,
): Promise<void> => {
  const form = new formData();
  form.append('from', `Verify Your Email <noreply@nubereats.com>`);
  form.append('to', `imran123irshad@gmail.com`);
  // form.append('text', content);
  form.append('subject', subject);
  form.append('template', template);
  // emailVars.forEach((eVar) => form.append(eVar.key, eVar.value))
  form.append('v:code', code);
  form.append('v:username', email);
  try {
    await got(
      `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(
            `api:${process.env.MAILGUN_API}`,
          ).toString('base64')}`,
        },
        body: form,
      },
    );
  } catch (error) {
    // console.log(error);
  }
};

export const sendVerificationEmail = async (
  email: string,
  code: string,
): Promise<void> => {
  return SendMail('Please Verify Your Email', 'verify-email', code, email);
};
