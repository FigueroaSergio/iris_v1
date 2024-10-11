import { ChangeEvent, Fragment, useEffect, useState } from "react";

import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { IrisDetector } from "./core/IrisDetector";
import { useOpenCv } from "./core/hooks/useOpenCv";
import { loadImageFile } from "./core/utils/loadImage";
import { DiabeteClassfier } from "./core/DiabeteClassifier";

function App() {
  const [eyeDetector] = useState(new IrisDetector());
  const [diabeteClassfier] = useState(new DiabeteClassfier());
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const { loading } = useOpenCv();
  useEffect(() => {
    if (!loading) {
      return;
    }
    eyeDetector.load();
    diabeteClassfier.load();
  }, [loading]);
  const onChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    const img = await loadImageFile(e);
    const eye = await eyeDetector.infer(img);
    if (eye) {
      await diabeteClassfier.infer(eye);
    }

    setImages(() => {
      const i = [img];
      if (eye) i.push(eye);
      return i;
    });
  };
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
