import { Player } from "@remotion/player";
import { createRoot } from "react-dom/client";
import { MyComposition } from "./MyComposition";
import "./style.css";

const root = createRoot(document.getElementById("app")!);

root.render(
  <Player
    component={MyComposition}
    durationInFrames={90}
    fps={30}
    compositionWidth={960}
    compositionHeight={540}
    style={{ width: "100%", maxWidth: 960 }}
    autoPlay
    loop
  />,
);
