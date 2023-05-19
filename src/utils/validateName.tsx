const MIN_NAME_LENGTH = 2;

export default (name: string) => {
  const result: { processedName: string; code: number } = {
    processedName: name,
    code: 0,
  };

  result.processedName = name.trim();

  if (result.processedName.length < MIN_NAME_LENGTH) {
    result.code = 1;
  }

  return result;
};
