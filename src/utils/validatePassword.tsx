const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 64;

export default (password: string) => {
  if (password.length < MIN_PASSWORD_LENGTH || password.length > MAX_PASSWORD_LENGTH) {
    return 1;
  }
  return 0;
};
