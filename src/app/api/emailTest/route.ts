import { EmailTemplate } from '../../../components/EmailTemplate';
import { resend } from '@/lib/resend';

export async function POST() {
  try {

    const emailBody = {
        from: 'ShahCodes <verify@shahcodes.in>',
        to: ['shahbazathwal2107@gmail.com'],
        subject: 'Verification Code for Feedback',
        react: EmailTemplate({ firstName: 'Shahbaz' }),
      }

    const { data, error } = await resend.emails.send(emailBody );

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
