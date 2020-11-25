import React from 'react';
import './App.css';
import '../src/assets/css/all.min.css';
import '../src/assets/css/bootstrap.min.css';
import '../src/assets/css/bootstrap.min.css.map';
import '../src/assets/css/jquery.fancybox.min.css';
import '../src/assets/css/owl.carousel.min.css';
import '../src/assets/css/styles.css';
import '../src/assets/css/responsive.css';
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Login from './Login/Login';
import Dashboard from './Dashboard/Dashboard';
import Projects from './Projects/Projects';
import AddNewTickets from './Tickets/AddNewTickets';
import EditTicketFinal from './Tickets/EditTicketFinal';
import EditProfile from './EditProfile/EditProfile';
import ShowAddress from './Address/ShowAddress';
import EditAddress from './Address/EditAddress';
import AddExperience from './Experience/AddExperience';
import EditExperience from './Experience/EditExperience';

export default class App extends React.Component {

    render() {
        return (
            <BrowserRouter>
                <div className="">
                    <Switch>
                        <Route path="/(login)?" exact component={Login} />
                        <Route path="/dashboard" exact component={Dashboard} />
                        <Route path="/projects" exact component={Projects} />
                        <Route path="/edit-profile" exact component={EditProfile} />
                        <Route path="/add-ticket" exact component={AddNewTickets} />
                        <Route path="/address" exact component={ShowAddress} />
                        <Route path="/edit-address" exact component={EditAddress} />
                        <Route path="/add-experience" exact component={AddExperience} />
                        <Route path="/edit-experience/:userId/:experienceId" exact component={EditExperience} />
                        <Route path="/edit-ticket/:id" exact component={EditTicketFinal} />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }

}