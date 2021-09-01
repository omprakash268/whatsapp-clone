import React from 'react';
import './App.css';
import Login from './components/Login/Login';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import  WhatsApp  from './Whatsapp';
import  Error   from './components/Error/Error';
function App() {

  return (
    <div className="app">
      <div className="app_body">
      <Router>
      <Switch>
      <Route exact path="/">
        <Login />
      </Route>
      <Route  path="/whatsapp">
        <WhatsApp />
      </Route>
      <Route >
        <Error />
      </Route>
      </Switch>
        </Router>
    </div> 
    </div>
  );
}

export default App;
