import { useEffect } from "react";

export default function useMIDI(callback) {
  if (!("requestMIDIAccess" in navigator)) {
    throw "midi unsupported";
  }

  useEffect(() => {
    const inputs = [];
    let aborted = false;

    navigator.requestMIDIAccess().then((access) => {
      if (aborted) return;
      access.inputs.forEach((input) => {
        console.log("[MIDI] Subscribing to " + input.name);
        input.onmidimessage = (message) => {
          callback(input, message);
        };
        inputs.push(input);
      });
    });

    return () => {
      aborted = true;
      inputs.forEach((input) => {
        console.log("[MIDI] Unsubscribing from " + input.name);
        input.onmidimessage = false;
      });
    };
  }, []);
}

export function useMIDIEvent(callback) {
  useMIDI((input, message) => callback(input, midiToEvent(message)));
}

export const MIDI_UNKNOWN = -1;
export const MIDI_KEYDOWN = 144;
export const MIDI_KEYUP = 128;

export function midiToEvent(message) {
  if ([MIDI_KEYDOWN, MIDI_KEYUP].indexOf(message.data[0]) < 0) {
    console.log("Unknown MIDI message type", message.data[0], message);
    return {
      type: MIDI_UNKNOWN,
    };
  }
  return {
    type: message.data[0],
    key: midiToName(message.data[1]),
    strength: message.data[2],
  };
}

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

export function midiToName(midi) {
  const octave = Math.floor(midi / 12 - 1);
  const noteIndex = midi % 12;
  return notes[noteIndex] + octave;
}

export function nameToMidi(name) {
  const octave = +name[name.length - 1];
  const initialNote = (octave + 1) * 12;
  return initialNote + notes.indexOf(name.slice(0, -1));
}
