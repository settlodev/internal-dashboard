import InvitationEmailTemplate from '@/components/email/invite-staff';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function inviteStaff(email:string) {
    console.log("The email passed is ",email)
  try {
    const { data, error } = await resend.emails.send({
        from:"Settlo Technologies <no-reply@settlo.co.tz>",
        to: email,
        subject: "Settlo Technologies Internal Dashboard Invitation",
      react: InvitationEmailTemplate({ email }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}
