const REGEX = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

export default (phone: string) => {
  const result: { processedPhone: string; code: number } = {
    processedPhone: phone,
    code: 0,
  };

  result.processedPhone = phone.trim();
  
  if (!REGEX.test(phone)) {
    result.code = 1;
  }

  return result;
};