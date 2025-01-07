import "./App.css";
import { RepoProvider } from "./data/repo/Context";
import AppRouter from "./router";

function App() {
  return (
    <RepoProvider>
      <AppRouter />
    </RepoProvider>
  );
}

export default App;
