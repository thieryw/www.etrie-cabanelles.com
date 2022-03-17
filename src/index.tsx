import React from 'react';
import ReactDOM from 'react-dom';
import { App } from "./App"
import { ThemeProvider } from "./theme";
import { RouteProvider } from "./router";

ReactDOM.render(
  <React.StrictMode>
    <RouteProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </RouteProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

