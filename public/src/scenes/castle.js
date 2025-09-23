import { setBackgroundColor } from "../utils/utils.js";

export default function castle(k) {
  setBackgroundColor("#000000");

  k.add([
    k.text("Castle home", { size: 32, font: "gameboy" }),
    k.area(),
    k.anchor("center"),
    k.pos(k.center().x, k.center().y - 100),
  ]);
}
