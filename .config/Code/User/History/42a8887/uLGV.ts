// types/formidable.d.ts
declare module "formidable" {
  import type { IncomingMessage } from "http";

  export interface Fields {
    [key: string]: string | string[];
  }

  export interface Files {
    [key: string]: File | File[];
  }

  export interface File {
    filepath: string;
    originalFilename?: string;
    mimetype?: string;
    size?: number;
  }

  export interface Options {
    multiples?: boolean;
    keepExtensions?: boolean;
    maxFileSize?: number;
  }

  export class IncomingForm {
    constructor(options?: Options);
    parse(
      req: IncomingMessage,
      callback: (err: any, fields: Fields, files: Files) => void
    ): void;
  }

  export default IncomingForm;
}
