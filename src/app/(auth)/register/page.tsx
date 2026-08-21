import AuthVisual from '@/components/auth/auth-visual';
import RegisterForm from '@/components/auth/register-form';

const RegisterPage = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </div>

      <AuthVisual />
    </div>
  );
};

export default RegisterPage;
