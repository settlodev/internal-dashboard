import * as React from 'react';
import { Html, Button, Head, Preview, Body, Container, Section, Heading,Text } from "@react-email/components";
import { requestPasswordReset } from '@/lib/actions/auth/signIn';

interface EmailTemplateProps {
  email: string;
}
const handleRequestPasswordReset = async (email: string) => async () => {
    await requestPasswordReset(email)
}

export default function InvitationEmailTemplate({email}:EmailTemplateProps){
  return (
    <Html>
    <Head/>
    <Preview>Invitation To Internal Settlo Dashboard</Preview>
    <Body style={main}>
    <Container style={container}>
    <Section style={coverSection}>
        <Section style={upperSection}>
            <Heading style={h1}>🌟 You &apos;re Invited to Join the Internal Dashboard! 🌟</Heading>
            <Text style={mainText}>Hello</Text>
            <Text style={mainText}>
                You have been invited to join a team on Settlo.
            </Text>
            <Text style={mainText}>
            To get started, please click the button below to accept the invitation and reset your password;
            </Text>
            <Section style={buttonContainer}>
                <Button
                onClick={async () => {
                    await handleRequestPasswordReset(email);
                }}
                    // href={`${process.env.NEXT_PUBLIC_APP_URL}/reset-password?email=${email}`}
                    style={button}
                >
                     Reset Password
                </Button>
            </Section>
            <Text style={validityText}>
            ⏳ For security purposes, this link will expire in 24 hours. Please act quickly!
            </Text>
        </Section>
    </Section>
    </Container>
    </Body>
   </Html>
  )
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
    margin: "24px 0",
};

const coverSection = { backgroundColor: "#FFFFFF" };

const upperSection = { padding: "25px 35px" };


const validityText = {
    ...text,
    margin: "0px",
    textAlign: "center" as const,
    fontSize: "12px",
    fontWeight: "bold",
};



const mainText = { ...text, marginBottom: "14px" };

