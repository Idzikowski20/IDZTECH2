
import React from 'react';
import { useTheme } from '@/utils/themeContext';

export enum PasswordStrength {
  VeryWeak = "Bardzo słabe",
  Weak = "Słabe",
  Medium = "Średnie",
  Strong = "Silne",
  VeryStrong = "Bardzo silne"
}

export const passwordStrengthColorClass: Record<PasswordStrength, string> = {
  [PasswordStrength.VeryWeak]: 'bg-red-600',
  [PasswordStrength.Weak]: 'bg-orange-500',
  [PasswordStrength.Medium]: 'bg-yellow-500',
  [PasswordStrength.Strong]: 'bg-green-500',
  [PasswordStrength.VeryStrong]: 'bg-purple-500'
};

export const calculatePasswordStrength = (password: string): PasswordStrength => {
  if (!password) return PasswordStrength.VeryWeak;
  
  const length = password.length;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);
  
  const diversityScore = [hasLowercase, hasUppercase, hasNumbers, hasSpecialChars].filter(Boolean).length;
  
  if (length < 8) {
    return PasswordStrength.VeryWeak;
  } else if (length < 10 || diversityScore < 2) {
    return PasswordStrength.Weak;
  } else if (length < 12 || diversityScore < 3) {
    return PasswordStrength.Medium;
  } else if (length < 16 || diversityScore < 4) {
    return PasswordStrength.Strong;
  } else {
    return PasswordStrength.VeryStrong;
  }
};

export const getPasswordFeedback = (password: string): string[] => {
  const feedback = [];
  const length = password.length;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSpecialChars = /[^a-zA-Z0-9]/.test(password);
  
  if (length < 12) {
    feedback.push("Użyj co najmniej 12 znaków dla lepszego bezpieczeństwa");
  }
  
  if (!hasLowercase) {
    feedback.push("Dodaj małe litery");
  }
  
  if (!hasUppercase) {
    feedback.push("Dodaj wielkie litery");
  }
  
  if (!hasNumbers) {
    feedback.push("Dodaj cyfry");
  }
  
  if (!hasSpecialChars) {
    feedback.push("Dodaj znaki specjalne (np. !@#$%)");
  }
  
  if (/(.)\1{2,}/.test(password)) {
    feedback.push("Unikaj powtarzających się znaków");
  }
  
  if (/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    feedback.push("Unikaj sekwencji znaków (np. 'abc')");
  }
  
  if (/(?:123|234|345|456|567|678|789|890)/i.test(password)) {
    feedback.push("Unikaj sekwencji liczb (np. '123')");
  }
  
  return feedback;
};

interface PasswordStrengthIndicatorProps {
  password: string;
  showFeedback?: boolean;
}

export const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ 
  password, 
  showFeedback = true 
}) => {
  const { theme } = useTheme();
  const strength = calculatePasswordStrength(password);
  const feedback = showFeedback ? getPasswordFeedback(password) : [];
  
  // Score on scale of 1-5
  const getScore = (strength: PasswordStrength): number => {
    switch (strength) {
      case PasswordStrength.VeryWeak: return 1;
      case PasswordStrength.Weak: return 2;
      case PasswordStrength.Medium: return 3;
      case PasswordStrength.Strong: return 4;
      case PasswordStrength.VeryStrong: return 5;
      default: return 0;
    }
  };
  
  const score = getScore(strength);
  const barStyle = passwordStrengthColorClass[strength] || 'bg-red-600';

  return (
    <div className="mt-2 w-full space-y-1">
      {/* Strength label */}
      <div className="flex justify-between items-center">
        <p className={`text-xs ${theme === 'light' ? 'text-gray-600' : 'text-gray-300'}`}>
          Siła hasła: 
        </p>
        <p className={`text-xs font-medium ${
          strength === PasswordStrength.VeryWeak ? 'text-red-600' :
          strength === PasswordStrength.Weak ? 'text-orange-500' :
          strength === PasswordStrength.Medium ? 'text-yellow-500' :
          strength === PasswordStrength.Strong ? 'text-green-500' :
          'text-purple-500'
        }`}>
          {strength}
        </p>
      </div>
      
      {/* Strength bar */}
      <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div 
          className={`h-full ${barStyle} transition-all duration-300`} 
          style={{ width: `${(score / 5) * 100}%` }}
        ></div>
      </div>
      
      {/* Feedback suggestions */}
      {showFeedback && feedback.length > 0 && (
        <ul className="text-xs space-y-1 mt-2 pl-4">
          {feedback.map((item, index) => (
            <li 
              key={index} 
              className={`list-disc ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
