// React Fast Refresh polyfill - loaded before everything else
(function() {
  'use strict';
  
  function createRefreshSig() {
    return function(type) {
      return type;
    };
  }
  
  function createRefreshReg() {
    return function() {};
  }
  
  // Set on all possible global objects
  if (typeof globalThis !== 'undefined') {
    globalThis.$RefreshSig$ = createRefreshSig;
    globalThis.$RefreshReg$ = createRefreshReg;
  }
  
  if (typeof window !== 'undefined') {
    window.$RefreshSig$ = createRefreshSig;
    window.$RefreshReg$ = createRefreshReg;
  }
  
  if (typeof self !== 'undefined') {
    self.$RefreshSig$ = createRefreshSig;
    self.$RefreshReg$ = createRefreshReg;
  }
  
  if (typeof global !== 'undefined') {
    global.$RefreshSig$ = createRefreshSig;
    global.$RefreshReg$ = createRefreshReg;
  }
})();