// Validation helper functions for enhanced user experience

export const formatPrice = (value: string): string => {
  // Remove non-numeric characters except decimal point
  const cleaned = value.replace(/[^\d.]/g, '');
  // Ensure only one decimal point
  const parts = cleaned.split('.');
  if (parts.length > 2) {
    return parts[0] + '.' + parts.slice(1).join('');
  }
  // Limit to 2 decimal places
  if (parts[1] && parts[1].length > 2) {
    return parts[0] + '.' + parts[1].substring(0, 2);
  }
  return cleaned;
};

export const formatSKU = (value: string): string => {
  // Remove all non-digit characters
  const digitsOnly = value.replace(/\D/g, '');
  
  // Limit to 8 digits max
  const limitedDigits = digitsOnly.slice(0, 8);
  
  // Format as XXX-XXX-XX
  if (limitedDigits.length >= 6) {
    const part1 = limitedDigits.slice(0, 3);
    const part2 = limitedDigits.slice(3, 6);
    const part3 = limitedDigits.slice(6, 8);
    
    if (part3) {
      return `${part1}-${part2}-${part3}`;
    } else {
      return `${part1}-${part2}`;
    }
  } else if (limitedDigits.length >= 3) {
    const part1 = limitedDigits.slice(0, 3);
    const part2 = limitedDigits.slice(3);
    return `${part1}-${part2}`;
  }
  
  return limitedDigits;
};

export const validateSKU = (sku: string): boolean => {
  return /^\d{3}-\d{3}-\d{2}$/.test(sku);
};

export const formatStock = (value: string): string => {
  // Remove non-numeric characters
  return value.replace(/\D/g, '');
};

export const validatePasswordStrength = (password: string): {
  isValid: boolean;
  score: number;
  feedback: string[];
} => {
  const feedback: string[] = [];
  let score = 0;

  if (password.length >= 8) score += 1;
  else feedback.push('At least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Include lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Include uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Include numbers');

  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
  else feedback.push('Include special characters');

  return {
    isValid: score >= 4,
    score,
    feedback,
  };
};

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};