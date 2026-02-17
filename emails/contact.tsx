import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Font,
} from '@react-email/components';
import * as React from 'react';

interface ContactEmailProps {
  senderEmail: string;
  subject: string;
  message: string;
}

export default function ContactEmail({ senderEmail, subject, message }: ContactEmailProps) {
  return (
    <Html>
      <Head>
        <Font
          fontFamily="Plus Jakarta Sans"
          fallbackFontFamily="Arial"
          webFont={{
            url: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Beep.Buzz</Heading>
          <Text style={label}>New contact form submission</Text>
          <Text style={text}>
            <strong>From:</strong> {senderEmail}
          </Text>
          <Text style={text}>
            <strong>Subject:</strong> {subject}
          </Text>
          <Hr style={hr} />
          <Text style={text}>{message}</Text>
          <Hr style={hr} />
          <Text style={footer}>
            Beep.Buzz - Interactive Morse code learning platform
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: 'oklch(0.994 0 0)',
  fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
  letterSpacing: '-0.025px',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
  backgroundColor: 'oklch(0.994 0 0)',
  boxShadow: '0px 2px 3px 0px rgba(0, 0, 0, 0.16)',
  borderRadius: '22.4px',
};

const h1 = {
  color: 'oklch(0 0 0)',
  fontSize: '32px',
  fontWeight: '700',
  margin: '40px 0',
  padding: '0 40px',
  letterSpacing: '-0.025px',
};

const label = {
  color: 'oklch(0.4386 0 0)',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '0 0 16px',
  padding: '0 40px',
  letterSpacing: '-0.025px',
};

const text = {
  color: 'oklch(0 0 0)',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
  letterSpacing: '-0.025px',
};

const hr = {
  borderColor: 'oklch(0.93 0.0094 286.2156)',
  margin: '32px 0',
};

const footer = {
  color: 'oklch(0.4386 0 0)',
  fontSize: '14px',
  lineHeight: '24px',
  padding: '0 40px',
  letterSpacing: '-0.025px',
};
