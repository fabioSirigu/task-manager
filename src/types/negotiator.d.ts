declare module 'negotiator' {
  import type { IncomingMessage } from 'http';

  interface NegotiatorOptions {
    headers: Record<string, string>;
  }

  export default class Negotiator {
    constructor(request: IncomingMessage | NegotiatorOptions);
    languages(available?: string[]): string[];
    language(available?: string[]): string | null;
    mediaTypes(available?: string[]): string[];
    mediaType(available?: string[]): string | null;
    charsets(available?: string[]): string[];
    charset(available?: string[]): string | null;
    encodings(available?: string[]): string[];
    encoding(available?: string[]): string | null;
  }
}
