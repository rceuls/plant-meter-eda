/* eslint-disable no-console */
export const logDebug = ({ msg, data }: { msg: string; data?: unknown }) => {
  console.debug(msg, { payload: data });
};
export const logError = console.error;
