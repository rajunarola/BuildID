import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";
import SideNav from "./SideNav/SideNav";
import Login from './Login/Login';

const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const Projects = lazy(() => import("./Projects/Projects"));
const AddNewTickets = lazy(() => import("./Tickets/AddNewTickets"));
const EditTicketFinal = lazy(() => import("./Tickets/EditTicketFinal"));
const EditProfile = lazy(() => import("./EditProfile/EditProfile"));
const AddExperience = lazy(() => import("./Experience/AddExperience"));
const EditExperience = lazy(() => import("./Experience/EditExperience"));
const AddAddress = lazy(() => import("./Address/AddAddress"));
const ProjectDetails = lazy(() => import("./Projects/ProjectDetails"));
const AddManufacturer = lazy(() => import("./Projects/AddManufacturer"));
const AddCompany = lazy(() => import("./Projects/AddCompany"));

export const routesCode = [
    { path: "/(login)?", exact: true, component: Login },
    { path: "/dashboard", exact: true, component: Dashboard },
    { path: "/projects", exact: true, component: Projects },
    { path: "/edit-profile", exact: true, component: EditProfile },
    { path: "/add-ticket", exact: true, component: AddNewTickets },
    { path: "/add-experience", exact: true, component: AddExperience },
    { path: "/edit-experience/:userId/:experienceId", exact: true, component: EditExperience },
    { path: "/edit-ticket/:id", exact: true, component: EditTicketFinal },
    { path: "/add-address", exact: true, component: AddAddress },
    { path: "/project-details/:id", exact: true, component: ProjectDetails },
    { path: "/add-manufacturer", exact: true, component: AddManufacturer },
    { path: "/add-company", exact: true, component: AddCompany },
];

class Routes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="(login)?" exact component={Login} />
                <>
                    <SideNav />
                    <div>
                        <>
                            {routesCode.map((route, i) =>
                                <Route {...route} key={i} />
                            )}
                        </>
                    </div>
                </>
            </Switch>
        );
    }
}

export default Routes;
