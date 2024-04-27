import * as Yup from 'yup';

export const singupSchema = Yup.object({
  fullName: Yup.string().required('Full Name is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Please enter a valid email address'),
  password: Yup.string()
    .required('Password is required')
    .min(6, 'Password must be at least 6 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9]+$/,
      'Password must contain at least one lowercase letter, one uppercase letter, and one number',
    ),
  confirmPassword: Yup.string()
    .required('Confirm Password is required')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
});
