import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { RootState } from '../../store';
import { loginSuccess } from '../../store/slices/authSlice';
import { useRegisterMutation } from '../../services/authApi';
import { useErrorHandler } from '../../hooks';
import { Layout } from '../../components/layout';
import { Button, Input, Card } from '../../components/ui';
import { ROUTES } from '../../utils/constants';
import { transformUserProfile } from '../../types';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone_No: z.string().min(10, 'Please enter a valid phone number'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const Signup: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { handleError } = useErrorHandler();

  const [register_user, { isLoading, error }] = useRegisterMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      address: '',
      phone_No: '',
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      const { confirmPassword, ...signupData } = data;
      const result = await register_user(signupData).unwrap();
      const transformedUser = transformUserProfile(result.user);
      dispatch(loginSuccess({ user: transformedUser, token: result.token }));
      toast.success(result.message || 'Account created successfully!');
      navigate(ROUTES.DASHBOARD);
    } catch (error: any) {
      handleError(error, 'Registration failed. Please try again.');
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Or{' '}
              <Link
                to={ROUTES.LOGIN}
                className="font-medium text-primary-600 hover:text-primary-500"
              >
                sign in to your existing account
              </Link>
            </p>
          </div>

          <Card>
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  {(error as any)?.data?.message || 'An error occurred during registration'}
                </div>
              )}

              <Input
                label="Full name"
                type="text"
                autoComplete="name"
                {...register('name')}
                error={errors.name?.message}
              />

              <Input
                label="Email address"
                type="email"
                autoComplete="email"
                {...register('email')}
                error={errors.email?.message}
              />

              <Input
                label="Address"
                type="text"
                autoComplete="address-line1"
                {...register('address')}
                error={errors.address?.message}
              />

              <Input
                label="Phone number"
                type="tel"
                autoComplete="tel"
                {...register('phone_No')}
                error={errors.phone_No?.message}
              />

              <Input
                label="Password"
                type="password"
                autoComplete="new-password"
                {...register('password')}
                error={errors.password?.message}
              />

              <Input
                label="Confirm password"
                type="password"
                autoComplete="new-password"
                {...register('confirmPassword')}
                error={errors.confirmPassword?.message}
              />



              <Button
                type="submit"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading}
              >
                Create account
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
