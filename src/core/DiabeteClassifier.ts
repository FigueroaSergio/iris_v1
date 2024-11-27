import { GraphModel, loadGraphModel, Rank, Tensor } from "@tensorflow/tfjs";
import {
  IrisClassifier,
  IrisClassifierInference,
  ModelLoadError,
} from "./model/IrisModel";
import { rescaleCanvasImage } from "./utils/imageTensor";
import { image2Canvas } from "./utils/canvas";

export class DiabeteClassifier implements IrisClassifier {
  model: GraphModel | null = null;
  async load(): Promise<void> {
    const url = `${import.meta.env.BASE_URL}${
      import.meta.env.DEV ? "/public" : ""
    }/result/model.json`;
    this.model = await loadGraphModel(url);
  }
  onReady(cb: () => void): void {
    cb();
  }
  async infer(img: HTMLImageElement): Promise<IrisClassifierInference> {
    if (!this.model) {
      throw new ModelLoadError();
    }
    const cv = await image2Canvas(img);
    const tensorImg = await rescaleCanvasImage(cv, [300, 300]);
    const tensor = this.model.predict(tensorImg) as Tensor<Rank>;
    const value = tensor.dataSync();

    return { diabete: value[0] };
  }
}
