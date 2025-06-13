import EmailConfirmationClient from '../../components/EmailConfirmationClient';

interface EmailConfirmationPageProps {
  params: Promise<{
    token: string;
  }>;
}

const EmailConfirmationPage = async ({ params }: EmailConfirmationPageProps) => { 
  const { token } = await params;

  return <EmailConfirmationClient token={token} />;
};

export default EmailConfirmationPage;