export default function useUrlSearchParams() {
  const search = window.location.search;
  const sp = new URLSearchParams(search);
  const params: { [key: string]: string } = {};
  sp.forEach((value, key) => (params[key] = value));
  return params;
}
