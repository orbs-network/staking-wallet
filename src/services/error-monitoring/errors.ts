const apiError = (url: string, message: string, retries: number): string => {
  return `Invalid response for url '${url}',  error message is: ${message}, retry count: ${retries}`;
};

const errorMessages = {
  apiError,
};
export default errorMessages;
