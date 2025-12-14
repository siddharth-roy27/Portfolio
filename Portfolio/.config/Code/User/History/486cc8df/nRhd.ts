// types/mammoth.d.ts
declare module "mammoth" {
  export interface ExtractOptions {
    includeEmbeddedStyleMap?: boolean;
  }

  export interface Message {
    type: string;
    message: string;
  }

  export interface ExtractResult {
    value: string;
    messages: Message[];
  }

  export function extractRaw(
    file: ArrayBuffer | Buffer | string,
    options?: ExtractOptions
  ): Promise<ExtractResult>;

  export function extractRaw(
    file: any,
    options?: ExtractOptions
  ): Promise<ExtractResult>;

  const mammoth: {
    extractRaw: typeof extractRaw;
  };

  export default mammoth;
}
