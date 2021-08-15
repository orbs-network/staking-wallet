export const apiError = (url: string, message: string, retries: number): string => {
  return `Invalid response for url '${url}',  error message is: ${message}, retry count: ${retries}`;
};

export const stepError = (step: string, message: string): string => {
  return `Error occured in ${step} step, error message is: ${message}`;
};

const errorMessages = {
  apiError,
  stepError,
};
export default errorMessages;
