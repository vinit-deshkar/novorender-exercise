import { FunctionComponent } from "react";
import { View } from "@novorender/api";
import { CameraStateRecorder } from "./CameraStateRecorder";

interface CameraStateRecordersProps {
  recorderNames: string[];
  view: View | undefined;
}

export const CameraStateRecorders: FunctionComponent<
  CameraStateRecordersProps
> = ({ recorderNames, view }) => {
  if (!view) {
    return;
  }

  return (
    <>
      {recorderNames.map((recorderName) => (
        <CameraStateRecorder
          name={recorderName}
          key={recorderName}
          activeController={view.activeController}
        />
      ))}
    </>
  );
};
