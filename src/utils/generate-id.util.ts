export const generateId = /* @__PURE__ */ (): string => {
  if (typeof globalThis !== 'undefined' && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  
  return `pk-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
};