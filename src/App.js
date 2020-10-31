import Music from "./Music";

import { useMIDIEvent, MIDI_KEYDOWN, MIDI_KEYUP } from "./midi";
import { useReducer } from "react";

// TODO: support different amount of notes than 4
const notesToEasyScore = (notes) =>
  [notes[0] + "/q", ...notes.slice(1)].join(", ");

const ACTION_KEYDOWN = "ACTION_KEYDOWN";

/*
The events will be encoded as:
{
  type: ACTION_KEYDOWN,
  key: "C4"
}
*/

function reducer(state, action) {
  switch (action.type) {
    case ACTION_KEYDOWN:
      console.log("action dispatched:", action);

      const expectedNote = state.toPlay[state.position];
      console.log("expected note:", expectedNote);
      if (expectedNote !== action.key) {
        console.log("Wrong note!");
        return state;
      }

      if (state.position + 1 == state.toPlay.length) {
        // if this was the last note
        return {
          ...state,
          toPlay: ["C4", "C4", "C4", "B3"], // TODO: generate the notes randomly
          position: 0,
        };
      }

      // otherwise, advance the position
      return {
        ...state,
        position: state.position + 1,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, {
    toPlay: ["A4", "D4", "E4", "F4"],
    position: 0,
  });

  useMIDIEvent((input, event) => {
    if (event.type === MIDI_KEYDOWN) {
      dispatch({
        type: ACTION_KEYDOWN,
        key: event.key,
      });
    }
  });

  return (
    <div className="App">
      <Music
        notes={notesToEasyScore(state.toPlay)}
        highlightedNotes={[...Array(state.position).keys()]}
      />
      {JSON.stringify(state)}
    </div>
  );
}

export default App;
