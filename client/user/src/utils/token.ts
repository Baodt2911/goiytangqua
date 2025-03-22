export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const tokenExp = payload.exp * 1000;
    return Date.now() >= tokenExp;
  } catch (error) {
    console.error(error);
    return true;
  }
};
