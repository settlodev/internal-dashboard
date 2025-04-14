import * as React from 'react';
import { Html, Button, Head, Preview, Body, Container, Section, Heading, Text } from "@react-email/components";

export default function SubscriptionRenewalEmailTemplate({ emailPayload }: any) {
  // Destructure properties from emailPayload
  const { 
    user, 
    location_name, 
    quantity,  // This represents the subscription period in months
    packageName,
    payment_type,
    email,
    phone 
  } = emailPayload;

 
  const userName = user?.email?.split('@')[0] || 'Valued Customer';
  
  return (
    <Html>
      <Head />
      <Preview>Subscription Renewal Confirmation for {location_name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={upperSection}>
            <Heading style={h1}>✅ Subscription Renewal Confirmation</Heading>
            
            <Text style={mainText}>
              Hello 
              <br /><br />
              I need to renew subscription for business location with details below;
            </Text>

            <Section style={detailsContainer}>
              <Text style={detailHeading}>Renewal Details:</Text>
              <Text style={detailItem}><strong>Business Location:</strong> {location_name}</Text>
              <Text style={detailItem}><strong>Subscription Period:</strong> {quantity} month(s)</Text>
              <Text style={detailItem}><strong>Package Name:</strong> {packageName}</Text>
              <Text style={detailItem}><strong>Paid :</strong> {payment_type}</Text>
              <Text style={detailItem}><strong>Contact Email:</strong> {email}</Text>
              <Text style={detailItem}><strong>Contact Phone:</strong> {phone}</Text>
            </Section>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/requests`}
              >
                View Subscription Details
              </Button>
            </Section>

            <Text style={mainText}>
              Thank you for your continued trust in our services. If you have any questions or need assistance, please don't hesitate to contact our support team.
            </Text>

            <Text style={footerText}>
              Best regards,<br/>
              Requested by {userName}
              <br />
              The Settlo Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const buttonContainer = {
  padding: "27px 0 27px",
};

const button = {
  backgroundColor: "#00DBA2",
  borderRadius: "3px",
  fontWeight: "600",
  color: "#fff",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 23px",
};

const main = {
  backgroundColor: "#fff",
  color: "#333",
  borderRadius: "3px",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#f9f9f9",
  borderRadius: "3px",
};

const h1 = {
  color: "#00DBA2",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "20px",
  textAlign: "center" as const,
};

const detailsContainer = {
  backgroundColor: "#fff",
  borderRadius: "5px",
  padding: "15px",
  marginBottom: "20px",
  border: "1px solid #eee",
};

const detailHeading = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#333",
  marginBottom: "10px",
};

const detailItem = {
  color: "#444",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "8px 0",
};

const text = {
  color: "#444",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "14px",
  margin: "8px 0",
};

const mainText = {
  ...text,
  marginBottom: "14px",
  lineHeight: "1.5",
};

const footerText = {
  ...text,
  marginTop: "25px",
  paddingTop: "15px",
  borderTop: "1px solid #eee",
};

const upperSection = { 
  padding: "25px 35px" 
};