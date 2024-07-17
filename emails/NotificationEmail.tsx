import {
    Html,
    Head,
    Font,
    Heading,
    Row,
    Section,
    Text,
    Button,
  } from '@react-email/components';
  
  export default function NotificationEmail(username: string) {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <title>New Message!!</title>
          <Font
            fontFamily="Roboto"
            fallbackFontFamily="Verdana"
            webFont={{
              url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
              format: 'woff2',
            }}
            fontWeight={400}
            fontStyle="normal"
          />
        </Head>
        <Section>
          <Row>
            <Heading as="h2">Hello {username},</Heading>
          </Row>
          <Row>
            <Text>
              You have received a new message. Open your dashboard to see the message.
            </Text>
          </Row>
          <Row>
            <Button
              href="https://whisperella.shahcodes.in/dashboard"
              style={{
                backgroundColor: '#007bff',
                color: '#ffffff',
                padding: '10px 20px',
                borderRadius: '5px',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: 'bold',
              }}
            >
              Go to Dashboard
            </Button>
          </Row>
          <Row>
            <Text
              style={{
                marginTop: '20px',
                fontSize: '12px',
                color: '#888888',
              }}
            >
              This email is auto-generated. Please do not reply.
            </Text>
          </Row>
        </Section>
      </Html>
    );
  }
  