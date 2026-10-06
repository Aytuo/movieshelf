import { emailTheme } from '@/emails/theme';
import { Section, Text } from 'react-email';

export function EmailBrand() {
  return (
    <Section
      style={{
        paddingBottom: '28px',
        textAlign: 'center',
      }}
    >
      <Text
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
          fontSize: '22px',
          lineHeight: '1',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          color: emailTheme.foreground,
        }}
      >
        Movie
        <span style={{ color: emailTheme.primary }}>Shelf</span>
      </Text>

      <Text
        style={{
          margin: '10px 0 0',
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif',
          fontSize: '10px',
          lineHeight: '1.4',
          fontWeight: 600,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: emailTheme.mutedStrong,
        }}
      >
        Personal Cinema Archive
      </Text>
    </Section>
  );
}
