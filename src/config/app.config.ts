export const appConfig = {
  env: process.env.VUE_APP_ENV_NAME as string,
  apiPath: process.env.VUE_APP_API_PATH as string,
  isLogEnabled: process.env.VUE_APP_LOG_ENABLED as string,
};
