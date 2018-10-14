import "bootstrap/dist/css/bootstrap.min.css";
import * as React from "react";
import "./App.css";

// import logo from "./logo.svg";

import "./StoryPanel";
import { StoryPanel } from "./StoryPanel";

class App extends React.Component {
  public render() {
    return <StoryPanel />;
  }
}

export default App;
