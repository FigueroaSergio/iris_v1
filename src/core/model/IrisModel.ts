export interface IrisModel {
  load(): Promise<void>;
  onReady(cb: () => void): void;
  infer(img: HTMLImageElement): Promise<unknown>;
}
export interface IrisExtractor extends IrisModel {
  load(): Promise<void>;
  onReady(cb: () => void): void;
  infer(img: HTMLImageElement): Promise<HTMLImageElement | null>;
}
export class ModelLoadError extends Error {
  constructor() {
    super("Error loading model");
  }
}

export class ModelInference extends Error {
  constructor() {
    super("Error inference model");
  }
}
