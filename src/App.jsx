import './App.css';
import Container from "@mui/material/Container";
import { Outlet } from "react-router-dom";
import SiteHeader from "./components/site-header/SiteHeader";

function App() {
  return (
    <div className="App">
      <SiteHeader />
      <Container>
        <Outlet />
      </Container>
    </div>
  );
}

export default App;
