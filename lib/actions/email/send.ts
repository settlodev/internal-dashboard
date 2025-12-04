import InvitationEmailTemplate from '@/components/email/invite-staff';
import SubscriptionRenewalEmailTemplate from '@/components/email/request-subscription';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function inviteStaff(email:string,firstName:string,lastName:string,code:string,password:string) {
    console.log("The email passed is ",email)
  try {
    const { data, error } = await resend.emails.send({
        from:"Settlo Technologies <no-reply@settlo.co.tz>",
        to: email,
        subject: "Settlo Technologies Internal Dashboard Invitation",
      react: InvitationEmailTemplate({ email,firstName,lastName,code,password }),
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}

export async function RequestSubscriptionEmail(emailPayload: any) {
  try {
    // Specific Settlo email addresses
    const settloRecipients = [
      // 'tech@settlo.co.tz',
      // 'accounts@settlo.co.tz',
      'elizabeth.kadomole@settlo.co.tz',
      'pbijampola@settlo.co.tz',
      'patrickbijampola@gmail.com'
    ];
    
    // Store all email sending promises
    const emailPromises = settloRecipients.map(recipientEmail => {

      // Create a customized payload if needed
      const customizedPayload = {
        ...emailPayload,
        
      };
      
      return resend.emails.send({
        from: "Settlo Technologies <no-reply@settlo.co.tz>",
        to: recipientEmail,
        subject: `Subscription Renewal for ${emailPayload.location_name}`,
        react: SubscriptionRenewalEmailTemplate({ emailPayload: customizedPayload }),
      });
    });
    
    // Wait for all emails to be sent
    const results = await Promise.all(emailPromises);
    
    // Check for any errors
    const errors = results.filter(result => result.error).map(result => result.error);
    if (errors.length > 0) {
      console.error("Some emails failed to send:", errors);
      return Response.json({ 
        success: results.filter(result => !result.error).length,
        failed: errors.length,
        errors 
      });
    }
    
    return Response.json({ 
      success: true, 
      count: settloRecipients.length,
      message: `Successfully sent subscription renewal emails to all Settlo team members`
    });
  } catch (error) {
    console.error("Error sending emails:", error);
    return Response.json({ error }, { status: 500 });
  }
}
