import { ChangeEvent, useCallback, useEffect, useState } from "react";

import "./App.css";
import { IrisDetector } from "./core/IrisDetector";
import { useOpenCv } from "./core/hooks/useOpenCv";
import { loadImageFile } from "./core/utils/loadImage";
import { DiabeteClassifier } from "./core/DiabeteClassifier";
import { useAsync } from "./core/hooks/useAsync";
import { IrideAgent } from "./core/IridologyAgent";
import { toast, Toaster } from "sonner";
import { ChartPercent } from "./components/ChartPercent";
import { CardText } from "./components/CardText";
import { CardImage } from "./components/CardImage";

function App() {
  const [eyeDetector] = useState(new IrisDetector());
  const [diabeteClassifier] = useState(new DiabeteClassifier());
  const [irideAgent] = useState(new IrideAgent());
  const [diabete, setDiabete] = useState({
    value: 0,
    label: "Diabete",
    fill: "hsl(var(--chart-2))",
  });
  const [text, setText] = useState("");
  const [image, setImage] = useState<null | string>(null);

  const { loading: loadingDiabete } = useAsync(
    () => diabeteClassifier.load(),
    true
  );
  const { loading: loadingEyeDetector, load: loadEyeDetector } = useAsync(() =>
    eyeDetector.load()
  );
  const map_value = (x: number) => {
    return 50 * (x + 1);
  };

  const inferClasses = async (image: HTMLImageElement) => {
    if (!image) {
      return Promise.resolve(null);
    }
    const r = await diabeteClassifier.infer(image);
    console.log(r);

    if (r?.diabete) {
      setDiabete((prev) => ({ ...prev, value: map_value(r.diabete) }));
    }
    return;
  };
  const inferText = async (image: HTMLImageElement) => {
    if (!image) {
      return Promise.resolve(null);
    }
    const r = await irideAgent.infer(image);
    console.log(r);

    if (r.text) {
      setText(r.text);
    }
    return;
  };

  const { loading: LoadingOpencv } = useOpenCv();
  useEffect(() => {
    if (!LoadingOpencv) {
      return;
    }
    loadEyeDetector();
  }, [LoadingOpencv]);

  useEffect(() => {
    if (!loadingEyeDetector && eyeDetector.model) {
      toast("Eye detector ready");
    }
  }, [loadingEyeDetector]);

  useEffect(() => {
    if (!loadingDiabete && diabeteClassifier.model) {
      toast("Diabete classifier ready");
    }
  }, [loadingDiabete]);

  const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const img = await loadImageFile(e);
    setImage(img.src);
    inferClasses(img);
    inferText(img);
  };

  return (
    <div className="w-screen justify-center  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-4 p-4">
      <div className="col-span-1">
        <CardImage
          src={image}
          onChange={onChangeHandler}
          onDelete={() => {
            setImage(null);
          }}
        ></CardImage>
      </div>
      <div className="col-span-1">
        <ChartPercent data={diabete}></ChartPercent>
      </div>
      <div className="col-span-1">
        <CardText text={text} title="Diagnosi"></CardText>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
