const REGEX =
  /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

export default (email: string) => {
  const result: { processedEmail: string; code: number } = {
    processedEmail: email,
    code: 0,
  };

  result.processedEmail = email.trim();
  
  if (!REGEX.test(email)) {
    result.code = 1;
  }

  return result;
};
