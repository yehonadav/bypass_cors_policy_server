import React from 'react';
import './App.css';
import { Server } from 'cors-bypass'



function App() {
  try {
    const server = new Server();
    return <div>server is listening</div>
  } catch (e) {
    return <div>{`${e}`}</div>
  }

}

export default App;
