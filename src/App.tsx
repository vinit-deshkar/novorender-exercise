import { useEffect, useRef, useState } from "react";
import { RenderStateChanges, View } from "@novorender/api";
import { SceneData } from "@novorender/data-js-api";
import { ViewBuilder } from "./utils/ViewBuilder";
import { SceneManager } from "./utils/SceneManager";
import {
  CameraControllerType,
  changeCameraController,
} from "./utils/cameraHelpers";
import { CameraStateRecorders } from "./components/CameraStateRecorders";
import { SearchBox } from "./components/SearchBox";

function App() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [sceneData, setSceneData] = useState<SceneData>(); // Store `sceneData` in state
  const [view, setView] = useState<View>(); // Store `view` in state

  console.log("Rendering App component");

  useEffect(() => {
    if (canvas.current && !view) {
      main(canvas.current);
    }
  }, []);

  // Create a simple sphere mesh object.
  const main = async (canvas: HTMLCanvasElement) => {
    try {
      console.log("Creating view ", view);

      // Create instance of ViewBuilder
      const viewBuilder = new ViewBuilder();
      const newView = await viewBuilder.createView(canvas);
      const sceneManager = new SceneManager(newView);
      const { sceneData } = await sceneManager.loadPublicScene();
      setSceneData(sceneData);
      changeCameraController(newView, CameraControllerType.FLIGHT);

      newView.modifyRenderState({
        grid: { enabled: true },
      } as RenderStateChanges);
      setView(newView);
      // Run the view
      await newView.run();

      // Dispose the view
      newView.dispose();
    } catch (error) {
      console.error("Error initializing view:", error);
    }
  };

  return (
    <>
      <canvas
        ref={canvas}
        style={{
          width: "100vw", // Full viewport width
          height: "100vh", // Full viewport height
          position: "absolute", // Position the canvas absolutely within the container
          top: 0, // Align to the top of the viewport
          left: 0, // Align to the left of the viewport
        }}
      ></canvas>
      <CameraStateRecorders
        recorderNames={["Camera 1", "Camera 2", "Camera 3"]}
        view={view}
      />
      {sceneData && view && <SearchBox sceneData={sceneData} view={view} />}
    </>
  );
}

export default App;
