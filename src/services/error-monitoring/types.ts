export interface IErrorMessages {
  apiError: (url: string, message: string, retries: number) => void;
  stakingError: (step: string, message: string) => void;
}

export interface IErrorBoundaryProps {
  children: JSX.Element;
}
