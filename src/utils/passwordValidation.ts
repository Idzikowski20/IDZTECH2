
import { z } from 'zod';

// List of commonly used compromised passwords
const commonCompromisedPasswords = [
  'password', 'qwerty', '123456', '123456789', 'qwerty123',
  'password123', '12345678', '111111', '1234567890', '1234567',
  '12345', '1234', 'abc123', 'admin', 'welcome', 'welcome123',
  'admin123', 'login', 'master', 'letmein', 'monkey', 'monkey123',
  'qazwsx', 'zaq12wsx', 'dragon', 'sunshine', 'asdfgh', 'asdfghjkl',
  'football', 'baseball', 'soccer', 'princess', 'iloveyou'
];

// Custom password strength levels
export enum PasswordStrength {
  VeryWeak = 'Very Weak',
  Weak = 'Weak',
  Medium = 'Medium',
  Strong = 'Strong',
  VeryStrong = 'Very Strong'
}

// Color classes for password strength indicator
export const passwordStrengthColorClass = {
  [PasswordStrength.VeryWeak]: 'bg-red-600',
  [PasswordStrength.Weak]: 'bg-orange-500',
  [PasswordStrength.Medium]: 'bg-yellow-500',
  [PasswordStrength.Strong]: 'bg-green-500',
  [PasswordStrength.VeryStrong]: 'bg-premium-gradient'
};

/**
 * Check if a password has been compromised
 * @param password Password to check
 * @returns Boolean indicating if password is compromised
 */
export const isPasswordCompromised = async (password: string): Promise<boolean> => {
  // First check local list
  if (commonCompromisedPasswords.includes(password.toLowerCase())) {
    return true;
  }

  try {
    // Optional: Create a SHA-1 hash of the password and check only the first 5 chars
    // against the HaveIBeenPwned API (k-anonymity method)
    // Note: This would require a backend proxy to avoid CORS issues in production
    
    // If implementing with an API, we could use code like:
    // const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`);
    // const data = await response.text();
    // Check if hash suffix exists in response...
    
    // For now, we just use our local check
    return false;
  } catch (error) {
    console.error("Error checking password against compromise database:", error);
    return false;
  }
};

/**
 * Calculate password strength
 * @param password Password to evaluate
 * @returns PasswordStrength enum value
 */
export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.VeryWeak;
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  
  // Character variety checks
  if (/[A-Z]/.test(password)) score += 1;  // Has uppercase
  if (/[a-z]/.test(password)) score += 1;  // Has lowercase
  if (/[0-9]/.test(password)) score += 1;  // Has numbers
  if (/[^A-Za-z0-9]/.test(password)) score += 2;  // Has special chars
  
  // Mix of character types
  const charTypes = [/[A-Z]/, /[a-z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(regex => 
    regex.test(password)
  ).length;
  if (charTypes >= 3) score += 1;
  if (charTypes === 4) score += 1;
  
  // Map score to strength
  if (score <= 2) return PasswordStrength.VeryWeak;
  if (score <= 4) return PasswordStrength.Weak;
  if (score <= 6) return PasswordStrength.Medium;
  if (score <= 8) return PasswordStrength.Strong;
  return PasswordStrength.VeryStrong;
};

/**
 * Zod schema for password validation
 * Can be used in any form validation
 */
export const passwordSchema = z.string()
  .min(8, "Hasło musi mieć co najmniej 8 znaków")
  .refine(
    (password) => /[A-Z]/.test(password),
    "Hasło musi zawierać co najmniej jedną wielką literę"
  )
  .refine(
    (password) => /[a-z]/.test(password),
    "Hasło musi zawierać co najmniej jedną małą literę"
  )
  .refine(
    (password) => /[0-9]/.test(password),
    "Hasło musi zawierać co najmniej jedną cyfrę"
  )
  .refine(
    (password) => /[^A-Za-z0-9]/.test(password),
    "Hasło musi zawierać co najmniej jeden znak specjalny"
  )
  .refine(
    async (password) => !(await isPasswordCompromised(password)),
    "To hasło jest zbyt popularne i znane. Wybierz bezpieczniejsze hasło."
  );

/**
 * Get helpful password feedback
 * @param password Password to analyze
 * @returns Array of feedback messages
 */
export const getPasswordFeedback = (password: string): string[] => {
  const feedback: string[] = [];
  
  if (!password || password.length < 8) {
    feedback.push("Hasło powinno mieć co najmniej 8 znaków");
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push("Dodaj wielką literę");
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push("Dodaj małą literę");
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push("Dodaj cyfrę");
  }
  
  if (!/[^A-Za-z0-9]/.test(password)) {
    feedback.push("Dodaj znak specjalny (!@#$%^&*)");
  }
  
  return feedback;
};
