export interface IrisModel<T> {
  load(): Promise<void>;
  onReady(cb: () => void): void;
  infer(img: HTMLImageElement): Promise<T>;
}
export type IrisExtractorInference = HTMLImageElement | null;
export type IrisExtractor = IrisModel<IrisExtractorInference>;

export type IrisClassifierInference = { [class_name: string]: number } | null;
export type IrisClassifier = IrisModel<IrisClassifierInference>;

export type IrisAgentInference = { text: string } | null;
export type IrisAgent = IrisModel<IrisAgentInference>;
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
