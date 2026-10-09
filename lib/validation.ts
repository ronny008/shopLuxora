// Reusable validation utilities for client-side forms and server-side API routes

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const NAME_REGEX = /^[a-zA-Z\s'-]+$/;

export function validateEmail(email: string): string | null {
  const trimmed = email ? email.trim() : '';
  if (!trimmed) {
    return 'Email address is required.';
  }
  if (trimmed.length > 100) {
    return 'Email address cannot exceed 100 characters.';
  }
  if (!EMAIL_REGEX.test(trimmed)) {
    return 'Please enter a valid email address (e.g. user@example.com).';
  }
  return null;
}

export function validatePassword(password: string, isRegistration = false): string | null {
  if (!password) {
    return 'Password is required.';
  }
  if (isRegistration) {
    if (password.length < 6) {
      return 'Password must be at least 6 characters long.';
    }
    if (password.length > 128) {
      return 'Password cannot exceed 128 characters.';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return 'Password must contain at least one letter and one number.';
    }
  }
  return null;
}

export function validateName(name: string): string | null {
  const trimmed = name ? name.trim() : '';
  if (!trimmed) {
    return 'Full name is required.';
  }
  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters long.';
  }
  if (trimmed.length > 50) {
    return 'Full name cannot exceed 50 characters.';
  }
  if (!NAME_REGEX.test(trimmed)) {
    return 'Full name can only contain letters, spaces, hyphens, and apostrophes.';
  }
  return null;
}

export function validateConfirmPassword(password: string, confirmPassword: string): string | null {
  if (!confirmPassword) {
    return 'Please confirm your password.';
  }
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return null;
}

export function validateRole(role: string): string | null {
  if (!role || !['Customer', 'Admin'].includes(role)) {
    return 'Role must be either Customer or Admin.';
  }
  return null;
}

export interface PasswordStrength {
  score: 0 | 1 | 2 | 3 | 4;
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong';
  color: string;
}

export function getPasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return { score: 0, label: 'Very Weak', color: 'bg-slate-200 text-slate-400' };
  }

  let score = 0;
  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) score += 1;

  switch (score) {
    case 1:
      return { score: 1, label: 'Weak', color: 'bg-red-500 text-red-600' };
    case 2:
      return { score: 2, label: 'Fair', color: 'bg-amber-500 text-amber-600' };
    case 3:
      return { score: 3, label: 'Good', color: 'bg-blue-500 text-blue-600' };
    case 4:
      return { score: 4, label: 'Strong', color: 'bg-emerald-500 text-emerald-600' };
    default:
      return { score: 0, label: 'Very Weak', color: 'bg-red-400 text-red-500' };
  }
}
