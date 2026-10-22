/// <reference types="vite/client" />

declare module "*.md?raw" {
  const content: string;
  export default content;
}

/** Injected by vite.config.ts from the daily issue files. */
declare const __LP_ISSUES__: number;
declare const __LP_FIRST__: string;
declare const __LP_LAST__: string;
