// Mock util module for Storybook
export function deprecate(fn, msg) {
  return fn;
}

export function inherits(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.prototype = Object.create(superCtor.prototype, {
    constructor: {
      value: ctor,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
}

export function isArray(ar) {
  return Array.isArray(ar);
}

export function isBoolean(arg) {
  return typeof arg === 'boolean';
}

export function isNull(arg) {
  return arg === null;
}

export function isNullOrUndefined(arg) {
  return arg == null;
}

export function isNumber(arg) {
  return typeof arg === 'number';
}

export function isString(arg) {
  return typeof arg === 'string';
}

export function isSymbol(arg) {
  return typeof arg === 'symbol';
}

export function isUndefined(arg) {
  return arg === void 0;
}

export function isRegExp(re) {
  return re instanceof RegExp;
}

export function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

export function isDate(d) {
  return d instanceof Date;
}

export function isError(e) {
  return e instanceof Error;
}

export function isFunction(arg) {
  return typeof arg === 'function';
}

export function isPrimitive(arg) {
  return arg === null ||
         typeof arg === 'boolean' ||
         typeof arg === 'number' ||
         typeof arg === 'string' ||
         typeof arg === 'symbol' ||
         typeof arg === 'undefined';
}

export function format(f, ...args) {
  let i = 1;
  const str = String(f).replace(/%[sdj%]/g, (x) => {
    if (x === '%%') return x;
    if (i >= args.length) return x;
    switch (x) {
      case '%s': return String(args[i++]);
      case '%d': return Number(args[i++]);
      case '%j':
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return '[Circular]';
        }
      default:
        return x;
    }
  });
  return str;
}

export default {
  deprecate,
  inherits,
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  format,
};