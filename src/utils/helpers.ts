export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const generateToken = (): string => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getTokenExpiryDate = (hoursFromNow: number = 24): string => {
  const expiryDate = new Date();
  expiryDate.setHours(expiryDate.getHours() + hoursFromNow);
  return expiryDate.toISOString();
};

export const isTokenExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) < new Date();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const mockLogin = async (
  username: string,
  password: string,
): Promise<{ success: boolean; token?: string; message?: string }> => {
  await delay(1000);

  // Allow login with any credentials
  if (username && password) {
    return {
      success: true,
      token: generateToken(),
    };
  }

  if (validateEmail(username) && validatePassword(password)) {
    return {
      success: true,
      token: generateToken(),
    };
  }

  return {
    success: false,
    message: 'Invalid credentials',
  };
};
