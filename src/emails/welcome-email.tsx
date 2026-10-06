import { EmailBrand } from '@/emails/components/email-brand';
import { emailTheme } from '@/emails/theme';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from 'react-email';

type WelcomeEmailProps = {
  name: string;
  url: string;
};

export const welcomeEmailSubject = 'Welcome to MovieShelf';

export function getWelcomeEmailText({ name, url }: WelcomeEmailProps) {
  return [
    `Hi ${name},`,
    '',
    'Your email is verified and your MovieShelf account is ready to go.',
    '',
    'Build your shelf, rate what you watch and develop your own movie taste over time.',
    '',
    'Open MovieShelf:',
    url,
    '',
    '© 2026 MovieShelf · Your movies. Your taste.',
  ].join('\n');
}

export function WelcomeEmail({ name, url }: WelcomeEmailProps) {
  const currentYear = new Date().getFullYear();

  return (
    <Html lang="en" dir="ltr">
      <Head />

      <Preview>
        Your MovieShelf account is ready. Start building your personal cinema
        archive.
      </Preview>

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
              Welcome to MovieShelf
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
              Your shelf is ready
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
              Your email is verified and your MovieShelf account is ready to go.
            </Text>

            <Text
              style={{
                margin: '10px 0 0',
                fontSize: '15px',
                lineHeight: '1.7',
                color: emailTheme.muted,
              }}
            >
              Build your shelf, rate what you watch and develop your own movie
              taste over time.
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
                Open MovieShelf
              </Button>
            </Section>

            <Text
              style={{
                margin: '24px 0 0',
                fontSize: '11px',
                lineHeight: '1.6',
                color: emailTheme.mutedStrong,
              }}
            >
              Your personal cinema archive starts here.
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
