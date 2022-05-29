import useUsers from "./hooks/useUsers";

function App() {
  const useData = useUsers();

  return (
    <div className="App">
      <header className="App-header">memes</header>
    </div>
  );
}

export default App;
