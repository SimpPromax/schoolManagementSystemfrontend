import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';

const Register = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <RegisterForm />
    </div>
  );
};

export default Register;