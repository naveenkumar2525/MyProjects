const getAppUrl = () => window.location.href.split("/").slice(0, 4).join("/");

export const getMobGraphUrl = (workflow: string) => {
  return `?route=canvas&workflowId=${workflow}`;
};

export const getNewCanvasUrl = (workflow: string) => {
  return `${getAppUrl()}/ushur-ui?route=canvas&workflowId=${workflow}`;
};
