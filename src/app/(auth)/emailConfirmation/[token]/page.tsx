import EmailConfirmationClient from '../../components/EmailConfirmationClient';

interface EmailConfirmationPageProps {
  params: {
    token: string;
  };
}

const EmailConfirmationPage = ({ params }: EmailConfirmationPageProps) => {
  const { token } = params;
  return <EmailConfirmationClient token={token} />;
};

export default EmailConfirmationPage;