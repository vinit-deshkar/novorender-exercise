import { View } from "@novorender/api";

export enum CameraControllerType {
  FLIGHT = "flight",
}

export const changeCameraController = (
  view: View,
  cameraControllerType: CameraControllerType
) => {
  view.switchCameraController(cameraControllerType);
};
