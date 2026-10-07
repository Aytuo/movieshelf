import { EmailBrand } from '@/emails/components/email-brand';
import { emailTheme } from '@/emails/theme';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from 'react-email';

type PasswordResetEmailProps = {
  name: string;
  url: string;
};

export const passwordResetEmailSubject = 'Reset your MovieShelf password';

export function getPasswordResetEmailText({
  name,
  url,
}: PasswordResetEmailProps) {
  return [
    `Hi ${name},`,
    '',
    'We received a request to reset your MovieShelf password.',
    '',
    'Use the link below to create a new password:',
    '',
    url,
    '',
    'This password reset link expires in 1 hour.',
    '',
    "If you didn't request a password reset, you can safely ignore this email.",
    '',
    'Having trouble with the button? Copy and open this link:',
    '',
    url,
    '',
    'This is an automated account email. Please do not reply.',
    '',
    `© ${new Date().getFullYear()} MovieShelf · Your movies. Your taste.`,
  ].join('\n');
}

export function PasswordResetEmail({ name, url }: PasswordResetEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="en" dir="ltr">
      <Head />

      <Preview>Reset your MovieShelf password securely.</Preview>

      <Body
        style={{
          margin: 0,
          padding: '48px 20px',
          backgroundColor: emailTheme.background,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
          color: emailTheme.foreground,
        }}
      >
        <Container
          style={{
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <EmailBrand />

          <Section
            style={{
              border: `1px solid ${emailTheme.border}`,
              borderRadius: '20px',
              backgroundColor: emailTheme.surface,
              padding: '40px',
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: '11px',
                lineHeight: '1.4',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: emailTheme.primary,
              }}
            >
              Password reset
            </Text>

            <Heading
              as="h1"
              style={{
                margin: '18px 0 0',
                fontSize: '30px',
                lineHeight: '1.15',
                letterSpacing: '-0.03em',
                fontWeight: 700,
                color: emailTheme.foreground,
              }}
            >
              Create a new password
            </Heading>

            <Text
              style={{
                margin: '20px 0 0',
                fontSize: '15px',
                lineHeight: '1.7',
                color: emailTheme.muted,
              }}
            >
              Hi {name},
            </Text>

            <Text
              style={{
                margin: '10px 0 0',
                fontSize: '15px',
                lineHeight: '1.7',
                color: emailTheme.muted,
              }}
            >
              We received a request to reset your MovieShelf password.
            </Text>

            <Text
              style={{
                margin: '10px 0 0',
                fontSize: '15px',
                lineHeight: '1.7',
                color: emailTheme.muted,
              }}
            >
              Use the button below to create a new password for your account.
            </Text>

            <Section style={{ marginTop: '30px' }}>
              <Button
                href={url}
                style={{
                  display: 'inline-block',
                  borderRadius: '10px',
                  backgroundColor: emailTheme.primary,
                  padding: '14px 22px',
                  color: '#ffffff',
                  fontSize: '14px',
                  lineHeight: '1',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Reset my password
              </Button>
            </Section>

            <Text
              style={{
                margin: '28px 0 0',
                fontSize: '12px',
                lineHeight: '1.7',
                color: emailTheme.mutedStrong,
              }}
            >
              This password reset link expires in 1 hour.
            </Text>

            <Text
              style={{
                margin: '8px 0 0',
                fontSize: '12px',
                lineHeight: '1.7',
                color: emailTheme.mutedStrong,
              }}
            >
              If you didn&apos;t request a password reset, you can safely ignore
              this email.
            </Text>

            <Hr
              style={{
                margin: '30px 0',
                border: 0,
                borderTop: `1px solid ${emailTheme.border}`,
              }}
            />

            <Text
              style={{
                margin: 0,
                fontSize: '11px',
                lineHeight: '1.7',
                color: emailTheme.mutedStrong,
              }}
            >
              Having trouble with the button? Copy and open this link:
            </Text>

            <Link
              href={url}
              style={{
                display: 'block',
                marginTop: '7px',
                overflowWrap: 'anywhere',
                wordBreak: 'break-all',
                fontSize: '11px',
                lineHeight: '1.6',
                color: emailTheme.primary,
                textDecoration: 'none',
              }}
            >
              {url}
            </Link>

            <Hr
              style={{
                margin: '22px 0 0',
                border: 0,
                borderTop: `1px solid ${emailTheme.border}`,
              }}
            />

            <Text
              style={{
                margin: '16px 0 0',
                textAlign: 'center',
                fontSize: '10px',
                lineHeight: '1.6',
                color: emailTheme.mutedStrong,
              }}
            >
              This is an automated account email. Please do not reply.
            </Text>
          </Section>

          <Section
            style={{
              paddingTop: '20px',
              textAlign: 'center',
            }}
          >
            <Text
              style={{
                margin: 0,
                fontSize: '10px',
                lineHeight: '1.6',
                color: emailTheme.mutedStrong,
                whiteSpace: 'nowrap',
              }}
            >
              © {currentYear} MovieShelf
              <span style={{ padding: '0 7px', color: emailTheme.border }}>
                ·
              </span>
              Your movies. Your taste.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
