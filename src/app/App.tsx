import React from 'react';
import logo from '../logo.svg';
import '../App.css';
import "./store/configure";
import HomeView from "./screens/Home"

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import { BoardRouter } from './screens/Board';
import Login from './screens/Login';
import { withModal } from './components/modal';
import BoardCreate from './screens/BoardCreate';
import { request } from './api';

class NavBoards extends React.Component {
  state = {
    status: 0,
    page: Array<any>()
  }
  componentDidMount() {
    request({
      method: "GET", endpoint: "/boards",
      expects: [200], format: 'page'
    }).then(
      ({ status, page }) => {
        this.setState({ status, page })
      },
      () => { })
  }
  render() {
    const { page } = this.state;
    return (
      <div className="p-3" style={{ borderBottom: "2px dashed white" }}>
        {page.map((e) =>
          <Link to={`/b/${e.Name}`}>
            <span>{e.Name} / </span>
          </Link>)}
      </div>
    )
  }
}

const About = () => {
  return (
    <div>
      <p>microchan!</p>
      <p>A very fast™ chan server written in Go</p>
      <p>This frontend is made with React.JS</p>
      <p>Find me on https://github.com/ollexjr/microchan</p>
      <p>And on https://github.com/ollexjr/microchan-web</p>

      <br/>
      <p>font-family: 'Press Start 2P' (google.fonts)</p>
    </div>
  )
}

const Nav = () => {
  return (
    <div className="">
      <nav className="navbar navbar-dark" style={{ borderBottom: "2px dashed white" }}>
        <Link to="/">/micro/chan <small>made in go!</small></Link>
        <Link to="/create">
          <button className="btn btn-dark">Create board</button>
        </Link>
      </nav>
      <NavBoards />
    </div>
  )
}

const AppRouter: React.FC = () => {
  return (
    <div className="d-flex flex-grow-1 flex-column container box" style={{ minHeight: '100%', width: '800px'  }}>
      <Router>
        <Nav />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/b/:boardID" component={BoardRouter} />
          <Route path="/" component={HomeView} />
        </Switch>
        <Route path="/create" component={
          withModal((props) => <BoardCreate {...props} />)} />
        <Route path="/about" component={
          withModal(() => <About />)} />
        <nav className="p-2 navbar" style={{ borderTop: "2px solid white" }}>
          <Link to="/about">
            About
          </Link>
          <small>{Date().toString()}</small>
          <span>React.js</span>
        </nav>
      </Router>
    </div>

  )
}

const App: React.FC = () => {
  return (
    <>
      <header className="App-header">
      </header>
      <AppRouter />
    </>
  );
}

export default App;
