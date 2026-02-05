import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Hr,
  Font,
} from '@react-email/components';
import * as React from 'react';

export default function EmailChangeEmail() {
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
          <Text style={text}>
            You've requested to change your email address for your Beep.Buzz account.
          </Text>
          <Text style={emailDetails}>
            <strong>New email address:</strong> {'{{.NewEmail}}'}
          </Text>
          <Text style={text}>
            Click the button below to confirm this change. After confirmation, you'll use your new email address to sign in.
          </Text>
          <Button style={button} href="{{.ConfirmationURL}}">
            Confirm email change
          </Button>
          <Text style={text}>
            If you didn't request this change, please contact support immediately to secure your account.
          </Text>
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

const text = {
  color: 'oklch(0 0 0)',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
  padding: '0 40px',
  letterSpacing: '-0.025px',
};

const emailDetails = {
  color: 'oklch(0 0 0)',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '24px 0',
  padding: '16px 40px',
  backgroundColor: 'oklch(0.9702 0 0)',
  borderRadius: '11.2px',
  letterSpacing: '-0.025px',
};

const button = {
  backgroundColor: 'oklch(0.5393 0.2713 286.7462)',
  borderRadius: '22.4px',
  color: 'oklch(1 0 0)',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 32px',
  margin: '32px 40px',
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
