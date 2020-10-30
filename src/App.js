import Music from "./Music";

import { useMIDIEvent, MIDI_KEYDOWN, MIDI_KEYUP } from "./midi";
import { useState } from "react";

// TOOD: support different amount of notes than 4
const notesToEasyScore = (notes) =>
  [notes[0] + "/q", ...notes.slice(1)].join(", ");

function App() {
  const [pressedKeys, setPressedKeys] = useState([]);
  useMIDIEvent((input, event) => {
    switch (event.type) {
      case MIDI_KEYDOWN:
        setPressedKeys((prev) => {
          if (prev.indexOf(event.key) >= 0) return;

          return [...prev, event.key];
        });
        break;
      case MIDI_KEYUP:
        setPressedKeys((prev) => {
          const idx = prev.indexOf(event.key);
          if (idx < 0) return prev;

          return [...prev.slice(0, idx), ...prev.slice(idx + 1)];
        });
        break;
    }
  });

  const [notesToPlay, setNotesToPlay] = useState(["C4", "D4", "E4", "F5"]);

  return (
    <div className="App">
      <Music
        style={{
          margin: "0 auto",
        }}
        notes={notesToEasyScore(notesToPlay)}
        highlightedNotes={[1, 3]}
      />
      <div>{JSON.stringify(pressedKeys)}</div>
    </div>
  );
}

export default App;
