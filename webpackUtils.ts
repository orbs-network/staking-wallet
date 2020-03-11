import * as path from 'path';
import * as fs from 'fs';

export function createEnvObjectForWebpack(env: object) {
  // create a nice object from the env variable
  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return envKeys;
}

export function overrideEnvFileValuesWithRuntimeEnv(enfFromFile: object, envFromRuntime: object) {
  const mergedEnvsObject = Object.keys(enfFromFile).reduce((mergedEnvObject, nextKey) => {
    // If the runtime provides an existing key, override it
    if (envFromRuntime[nextKey]) {
      mergedEnvObject[nextKey] = envFromRuntime[nextKey];
    } else {
      // Otherwise, take the value from the .env file
      mergedEnvObject[nextKey] = enfFromFile[nextKey];
    }

    return mergedEnvObject;
  }, {});

  return mergedEnvsObject;
}

export function getEnvFilePath(env: object) {
  // Get the root path (assuming your webpack config is in the root of your project!)
  const currentPath = path.join(__dirname);

  // Create the fallback path (the production .env)
  const basePath = currentPath + '/.env';

  // We're concatenating the environment name to our filename to specify the correct env file!
  const envPath = basePath + '.' + (env as any).NODE_ENV;

  // Check if the file exists, otherwise fall back to the production .env
  const finalPath = fs.existsSync(envPath) ? envPath : basePath;

  return finalPath;
}
