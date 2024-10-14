import { ChangeEvent, Fragment, useCallback, useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { IrisDetector } from "./core/IrisDetector";
import { useOpenCv } from "./core/hooks/useOpenCv";
import { loadImageFile } from "./core/utils/loadImage";
import { DiabeteClassifier } from "./core/DiabeteClassifier";
import { useAsync } from "./core/hooks/useAsync";
import { IrideAgent } from "./core/IridologyAgent";
import { eye } from "@tensorflow/tfjs";

function App() {
  const [eyeDetector] = useState(new IrisDetector());
  const [diabeteClassifier] = useState(new DiabeteClassifier());
  const [irideAgent] = useState(new IrideAgent());

  const [image, setImage] = useState<HTMLImageElement | null>(null);

  const { loading: loadingDiabete } = useAsync(
    () => diabeteClassifier.load(),
    true
  );
  const { loading: loadingEyeDetector, load: loadEyeDetector } = useAsync(() =>
    eyeDetector.load()
  );
  const inferClasses = () => {
    if (!image) {
      return Promise.resolve(null);
    }
    return diabeteClassifier.infer(image);
  };
  const { loading: loadingInferencesClasses, load: infer } =
    useAsync(inferClasses);

  const { loading: LoadingOpencv } = useOpenCv();
  useEffect(() => {
    if (!LoadingOpencv) {
      return;
    }
    loadEyeDetector();
  }, [LoadingOpencv]);

  const onChangeHandler = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const img = await loadImageFile(e);
      const eye = await eyeDetector.infer(img);
      if (eye) {
        const classification = await diabeteClassifier.infer(eye);
        console.log(classification);
        const result = await irideAgent.infer(img);
        console.log(result);
      }

      setImage(() => {
        return img;
      });
    },
    [loadingEyeDetector]
  );
  return (
    <>
      <div className="card">
        <div>
          {loadingDiabete ? (
            <>Loading diabete classifier</>
          ) : (
            <>Diabete classifier ready</>
          )}
        </div>
        <div>
          {loadingEyeDetector ? (
            <>Loading eye detector</>
          ) : (
            <>Eye detector ready</>
          )}
        </div>
        <input type="file" onChange={onChangeHandler}></input>
        {image && <img src={image.src} />}
      </div>
    </>
  );
}

export default App;
