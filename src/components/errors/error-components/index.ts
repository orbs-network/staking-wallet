import BaseError from './base-error';
import CrashError from './crash-error';

const errorComponents = {
  Base: BaseError,
  Crash: CrashError,
};

export default errorComponents;
