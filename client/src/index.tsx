import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
    <div className="a">
      <p className="b">
        test
      </p>
    </div>
    <h1>header 1</h1>
    <h2>header 2</h2>
    <h3>header 3</h3>
    <h4>header 4</h4>
    <h5>header 5</h5>
    <h6>header 6</h6>
    <button className="button button-orange">test</button>
    <button className="button button-orange .button-large">btn large</button>
  </React.StrictMode>
);
