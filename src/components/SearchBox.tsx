import { FunctionComponent, useEffect, useState } from "react";
import { SceneData } from "@novorender/data-js-api";
import {
  createNeutralHighlight,
  RenderStateHighlightGroups,
  View,
} from "@novorender/api";
import { TextField } from "@mui/material";

interface SearchBoxProps {
  sceneData: SceneData;
  view: View;
}

export const SearchBox: FunctionComponent<SearchBoxProps> = ({
  sceneData,
  view,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Debounced search handler logic
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      objectSearchHandler();
    }, 500); // 500ms debounce time

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const objectSearchHandler = async () => {
    if (searchTerm === "") {
      return;
    }

    try {
      const { db } = sceneData;
      if (db && view) {
        const controller = new AbortController();
        const signal = controller.signal;

        // Run the searches
        const iterator = db.search({ searchPattern: searchTerm }, signal);

        // In this example we just want to isolate the objects so all we need is the object ID
        const result: number[] = [];
        for await (const object of iterator) {
          result.push(object.id);
        }

        if (result.length > 0) {
          // Then we isolate the objects found
          const renderStateHighlightGroups: RenderStateHighlightGroups = {
            defaultAction: "hide",
            groups: [{ action: createNeutralHighlight(), objectIds: result }],
            defaultPointVisualization: undefined,
          };

          // Finally, modify the renderState
          view.modifyRenderState({ highlights: renderStateHighlightGroups });
        }
      }
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <TextField
      label="Search"
      id="fullWidth"
      onChange={(event) => setSearchTerm(event.target.value)}
    />
  );
};
