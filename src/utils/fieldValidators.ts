// Validate email address format using a regex
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate if the amount is a number
export const validateAmount = (amount: number | string): boolean => {
  return !isNaN(Number(amount)) && typeof Number(amount) === 'number';
};

// Check if all required fields are filled
interface UserDetails {
  email: string;
  password: string;
}

export const allFieldsFilled = (details: UserDetails): boolean => {
  // Ensure the email is valid and the password field is not empty
  return validateEmail(details.email) && details.password.trim() !== '';
};

// Handle blur event for email input field
export const handleEmailBlur = (email: string, setErrorMessage: (message: string) => void): void => {
  if (!validateEmail(email) && email.trim() !== '') {
    setErrorMessage('Invalid email address');
  } else {
    setErrorMessage('');
  }
};

// Handle blur event for amount input field
import currency from 'currency.js';

export const handleAmountBlur = (amount: string | number, setErrorMessage: (message: string) => void) => {
  const cleanAmount = typeof amount === 'string' ? amount.replace(/,/g, '') : amount;
  const numericAmount = Number(cleanAmount);

  if (isNaN(numericAmount)) {
    setErrorMessage('Invalid amount. Please enter a valid number.');
  } else if (numericAmount <= 0) {
    setErrorMessage('Amount must be greater than zero.');
  } else {
    setErrorMessage('');
  }

  return numericAmount;
};

export function isAtLeast18YearsOld(dateString: string): boolean {
  const birthDate = new Date(dateString);
  const today = new Date();

  // Calculate the difference in years
  let age = today.getFullYear() - birthDate.getFullYear();

  // Check if birthday hasn't occurred this year
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age >= 18;
}
