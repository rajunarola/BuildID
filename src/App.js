import React from 'react';
import './App.css';
import { Switch, Route, BrowserRouter, HashRouter } from "react-router-dom";
import '../src/assets/css/all.min.css';
import '../src/assets/css/bootstrap.min.css';
import '../src/assets/css/bootstrap.min.css.map';
import '../src/assets/css/jquery.fancybox.min.css';
import '../src/assets/css/owl.carousel.min.css';
import '../src/assets/css/styles.css';
import '../src/assets/css/responsive.css';
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Projects from './Projects/Projects';

export default class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div className="">
                    <Switch>
                        <Route path="/(login)?" exact component={Login} />
                        <Route path="/dashboard" exact component={Dashboard} />
                        <Route path="/projects" exact component={Projects} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }

}