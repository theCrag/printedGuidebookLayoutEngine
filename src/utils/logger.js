import logdown from 'logdown';

window.localStorage.debug = 'app:*';

export const createLogger = (scope) => logdown(`app:${scope}`);
