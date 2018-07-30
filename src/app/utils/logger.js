import logdown from 'logdown';

/**
 * Defines the global log level. For instance if it is set to
 * `app:*`, that means all logger with a scope that starts with
 * `app:` are allowed to print to the console.
 */
window.localStorage.debug = 'app:*';

/**
 * Creates a new logdown instance and defines a prefixed scoped.
 *
 * @param {string} scope
 * @returns {Object} Logdown instance
 */
export const createLogger = (scope) => logdown(`app:${scope}`);
