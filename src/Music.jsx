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
    // const renderer = new VF.Renderer(target.current, VF.Renderer.Backends.SVG);
    // renderer.resize(500, 500); // TODO: set this in a more responsive way
    // const context = renderer.getContext();
    // context.clear();
    // const stave = new VF.Stave(10, 40, 400);
    // stave.addClef("treble").addTimeSignature("4/4");

    // if (notes != null && notes.length > 0) {
    //   console.log(notes, 3);
    //   var voice = new VF.Voice({ num_beats: 4, beat_value: 4 });
    //   voice.addTickables(notes);
    //   var formatter = new VF.Formatter()
    //     .joinVoices([voice])
    //     .format([voice], 400);
    // }

    // stave.setContext(context).draw();
    // voice.draw(context, stave);
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
