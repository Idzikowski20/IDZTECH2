
import React from 'react';
import { calculatePasswordStrength, PasswordStrength, passwordStrengthColorClass, getPasswordFeedback } from '@/utils/passwordValidation';
import { useTheme } from '@/utils/themeContext';

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
