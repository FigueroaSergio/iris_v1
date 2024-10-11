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

function App() {
  const [eyeDetector] = useState(new IrisDetector());
  const [diabeteClassifier] = useState(new DiabeteClassifier());
  const [irideAgent] = useState(new IrideAgent());

  const [images, setImages] = useState<HTMLImageElement[]>([]);

  const { loading: loadingDiabete } = useAsync(
    () => diabeteClassifier.load(),
    true
  );
  const { loading: loadingEyeDetector, load: loadEyeDetector } = useAsync(() =>
    eyeDetector.load()
  );

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

      setImages(() => {
        const i = [img];
        if (eye) i.push(eye);
        return i;
      });
    },
    [loadingEyeDetector]
  );
  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
        {images.map((image, index) => (
          <Fragment key={index}>
            <img src={image.src} />
          </Fragment>
        ))}
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
