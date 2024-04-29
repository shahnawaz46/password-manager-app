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

export const singinSchema = Yup.object({
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
});

export const vaultSchema = Yup.object({
  name: Yup.string().required('Website/App Name is required'),
  userName: Yup.string().required('Email/UserName is required'),
  password: Yup.string().required('Password is Required'),
  category: Yup.string().required('Category is required'),
});
