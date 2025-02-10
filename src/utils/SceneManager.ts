import { SceneConfig, View } from "@novorender/api";
import { createAPI, SceneData } from "@novorender/data-js-api";

export class SceneManager {
  private view: View;

  constructor(view: View) {
    this.view = view;
  }

  async loadPublicScene(): Promise<{
    sceneData: SceneData;
    sceneConfig: SceneConfig;
  }> {
    const serviceUrl = "https://data.novorender.com/api";

    // Initialize the data API with the Novorender data server service
    const dataApi = createAPI({
      serviceUrl,
    });

    // Condos scene ID, but can be changed to any public scene ID
    const sceneData = await dataApi.loadScene(
      "95a89d20dd084d9486e383e131242c4c"
    );

    if ("error" in sceneData) {
      throw sceneData;
    }

    // Destructure relevant properties into variables
    const { url: _url } = sceneData as SceneData;
    const url = new URL(_url);
    const parentSceneId = url.pathname.replaceAll("/", "");
    url.pathname = "";

    // Load the scene using URL gotten from `sceneData`
    const sceneConfig = await this.view.loadScene(
      url,
      parentSceneId,
      "index.json"
    );

    const { center, radius } = sceneConfig.boundingSphere;
    this.view.activeController.autoFit(center, radius);

    return { sceneData, sceneConfig };
  }
}
