import Music from "./Music";

function App() {
  return (
    <div className="App">
      <Music
        style={{
          margin: "0 auto",
        }}
        notes="C4/q, D4, E4, F4"
        highlightedNotes={[1, 3]}
      />
    </div>
  );
}

export default App;
