export function validateName(name: string): string | undefined {
  if (!name) {
    return 'Name is required.';
  }

  if (name.length < 3) {
    return 'Name must be at least 3 characters long.';
  }
}

export function validateEmail(email: string): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return 'Email is required.';
  }

  if (!emailRegex.test(email)) {
    return 'Invalid email format.';
  }
}

export function validatePhone(phone: string): string | undefined {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  if (!phone) {
    return 'Phone number is required.';
  }
  if (!phoneRegex.test(phone)) {
    return 'Invalid phone number format.';
  }
}

export function validatePassword(password: string): string | undefined {
  if (!password) {
    return 'Password is required.';
  }

  if (password.length < 6) {
    return 'Password must be at least 6 characters long.';
  }

  if (!/[A-Z]/.test(password)) {
    return 'Password must contain at least one uppercase letter.';
  }

  if (!/[a-z]/.test(password)) {
    return 'Password must contain at least one lowercase letter.';
  }

  if (!/[0-9]/.test(password)) {
    return 'Password must contain at least one digit.';
  }
}

export function validatePasswordConfirm(password: string, confirmPassword: string): string {
  if (password !== confirmPassword) {
    return 'Passwords do not match.';
  }
  return '';
}
