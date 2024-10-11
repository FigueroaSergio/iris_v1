import { GraphModel, loadGraphModel, Rank, Tensor } from "@tensorflow/tfjs";
import { IrisModel, ModelLoadError } from "./model/IrisModel";
import { rescaleCanvasImage } from "./utils/imageTensor";
import { image2Canvas } from "./utils/Canvas";

export class DiabeteClassfier implements IrisModel {
  model: GraphModel | null = null;
  async load(): Promise<void> {
    this.model = await loadGraphModel("./../../public/result/model.json");
  }
  onReady(cb: () => void): void {
    cb();
  }
  async infer(img: HTMLImageElement): Promise<unknown> {
    if (!this.model) {
      throw new ModelLoadError();
    }
    const cv = await image2Canvas(img);
    const tensorImg = await rescaleCanvasImage(cv, [300, 300]);
    const tensor = this.model.predict(tensorImg) as Tensor<Rank>;
    const value = tensor.dataSync();
    console.log(value);

    return value;
  }
}