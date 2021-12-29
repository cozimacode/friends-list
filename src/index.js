import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "normalize.css";
import "./index.css";

function test() {
  console.log("test");
}

test();

ReactDOM.render(<App />, document.getElementById("root"));
