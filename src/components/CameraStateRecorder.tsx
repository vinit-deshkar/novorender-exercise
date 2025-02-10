import { FunctionComponent, useState } from "react";
import { Button } from "@mui/material";
import { BaseController, FlightController } from "@novorender/api";

interface CameraStateRecorderProps {
  name: string;
  activeController: BaseController | undefined;
}

export const CameraStateRecorder: FunctionComponent<
  CameraStateRecorderProps
> = ({ name, activeController }) => {
  if (!activeController) {
    return;
  }
  // Check if current controller is Flight controller
  FlightController.assert(activeController);
  const [cameraPosition, setCameraPosition] = useState(
    activeController.position
  );

  const [cameraRotation, setCameraRotation] = useState(
    activeController.rotation
  );

  const buttonClickHandler = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (e.shiftKey) {
      setCameraPosition(activeController.position);
      setCameraRotation(activeController.rotation);
    } else {
      activeController.moveTo(cameraPosition, undefined, cameraRotation);
    }
  };

  return (
    <>
      <Button variant="contained" onClick={(e) => buttonClickHandler(e)}>
        {name}
      </Button>
    </>
  );
};
