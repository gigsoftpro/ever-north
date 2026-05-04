export const getIn = (obj, path) =>
  path.split(".").reduce((a, k) => a?.[k], obj);
export const setIn = (obj, path, value) => {
  const keys = path.split(".");
  const copy = structuredClone(obj);
  let cur = copy;
  keys.slice(0, -1).forEach((k) => {
    cur = cur[k];
  });
  cur[keys[keys.length - 1]] = value;
  return copy;
};
