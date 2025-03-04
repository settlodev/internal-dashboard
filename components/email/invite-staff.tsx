import * as React from 'react';
import { Html, Button, Head, Preview, Body, Container, Section, Heading, Text } from "@react-email/components";

interface EmailTemplateProps {
  email: string;
  first_name: string;
  last_name: string;
  code: string;
  password: string;
}

export default function InvitationEmailTemplate({ email, first_name, last_name, code, password }: EmailTemplateProps) {
  return (
    <Html>
      <Head />
      <Preview>You're invited to the Settlo Internal Dashboard - Use your referral code to earn commissions!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={upperSection}>
            <Heading style={h1}>🌟 {first_name} {last_name}, You're Invited to Join the Internal Dashboard! 🌟</Heading>
            <Text style={mainText}>
              Hello {first_name},
              <br />
              You have been invited to join a team on Settlo. Below are your credentials to access the dashboard:
            </Text>

            <Text style={text}><strong>Email:</strong> {email}</Text>
            <Text style={text}><strong>Password:</strong> {password}</Text>
            <Text style={text}><strong>Referral Code:</strong> {code}</Text>

            <Section style={buttonContainer}>
              <Button
                style={button}
                href={`${process.env.NEXT_PUBLIC_APP_URL}/sign-in`}
              >
                Login to Dashboard
              </Button>
            </Section>

            <Heading as="h3" style={h1}>💰 Earn More with Your Referral Code! 💰</Heading>
            <Text style={mainText}>
              You can use your referral code <strong>{code}</strong> to register multiple businesses. For every successful registration using your referral, you will earn commissions!
            </Text>

            <Text style={validityText}>
              ⏳ For security purposes, this link will expire in 24 hours. Please act quickly!
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
  color: "#00DBA2",
  borderRadius: "3px",
};

const container = {
  padding: "20px",
  margin: "0 auto",
  backgroundColor: "#eee",
  borderRadius: "3px",
};

const h1 = {
  color: "#00DBA2",
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontSize: "20px",
  fontWeight: "bold",
  marginBottom: "15px",
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
};

const validityText = {
  ...text,
  margin: "0px",
  textAlign: "center" as const,
  fontSize: "12px",
  fontWeight: "bold",
};

const upperSection = { padding: "25px 35px" };
