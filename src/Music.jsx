import Vex from "vexflow";

import { useRef, useEffect } from "react";

export default function Music({
  notes = [],
  highlightedNotes = [],
  width = 520,
  height = 150,
  style = {},
  ...props
}) {
  const target = useRef();

  useEffect(() => {
    if (target.current == null) return;

    target.current.innerHTML = "";
    const vf = new Vex.Flow.Factory({
      renderer: { elementId: target.current, width: width, height: height },
    });

    const score = vf.EasyScore();
    const system = vf.System();

    const vexNotes = score.notes(notes, { stem: "up" });
    highlightedNotes.forEach((index) => {
      if (vexNotes[index] != null) {
        vexNotes[index].setStyle({ strokeStyle: "red", fillStyle: "red" });
      }
    });

    system
      .addStave({
        voices: [score.voice(vexNotes)],
      })
      .addClef("treble");

    vf.draw();
  }, [target, notes, width, height, highlightedNotes]);

  return <div ref={target} {...props} style={{ width, height, ...style }} />;
}
