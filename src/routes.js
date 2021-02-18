import React, { lazy } from "react";
import { Route, Switch } from "react-router-dom";
import SideNav from "./SideNav/SideNav";
import Login from './Login/Login';
import Register from "./Register/Register";
import ForgotPassword from "./ForgotPassword/ForgotPassword";
import ConfirmCode from "./ForgotPassword/ConfirmCode";

const Dashboard = lazy(() => import("./Dashboard/Dashboard"));
const Projects = lazy(() => import("./Projects/Projects"));
const AddNewTickets = lazy(() => import("./Tickets/AddNewTickets"));
const EditTicketFinal = lazy(() => import("./Tickets/EditTicketFinal"));
const EditProfile = lazy(() => import("./EditProfile/EditProfile"));
const AddExperience = lazy(() => import("./Experience/AddExperience"));
const EditExperience = lazy(() => import("./Experience/EditExperience"));
const ProjectDetails = lazy(() => import("./Projects/ProjectDetails"));
const AddManufacturer = lazy(() => import("./Projects/AddManufacturer"));
const AddCompany = lazy(() => import("./Projects/AddCompany"));
const SearchProjects = lazy(() => import("./Projects/SearchProjects"));
const SelectProject = lazy(() => import("./Projects/SelectProject"));
const ViewSearchedProject = lazy(() => import("./Projects/ViewSearchedProject"));
const EditProject = lazy(() => import("./Projects/EditProject"));
const AddGlobalProject = lazy(() => import("./Projects/AddGlobalProject"));
const EditMontageById = lazy(() => import("./Montages/EditMontage"));
const AddNewMontage = lazy(() => import("./Montages/AddMontage"));
const PreviewOfMontage = lazy(() => import("./Montages/MontagePreview"));
const SaveTrade = lazy(() => import("./Experience/AddGlobalTrade"));
const SaveRole = lazy(() => import("./Experience/AddGlobalRole"));
const SaveBuildingType = lazy(() => import("./Experience/AddBuildingType"));
const Quiz = lazy(() => import("./Quiz/Quiz"));
const Montage = lazy(() => import("./Montages/SideNavMontage"));
const TicketPreview = lazy(() => import("./Tickets/TicketPreview"));

export const routesCode = [
    { path: "/dashboard", exact: true, component: Dashboard },
    { path: "/projects", exact: true, component: Projects },
    { path: "/tickets", exact: true, component: TicketPreview },
    { path: "/quiz", exact: true, component: Quiz },
    { path: "/montages", exact: true, component: Montage },
    { path: "/edit-profile", exact: true, component: EditProfile },
    { path: "/add-ticket", exact: true, component: AddNewTickets },
    { path: "/add-experience", exact: true, component: AddExperience },
    { path: "/edit-experience/:userId/:experienceId", exact: true, component: EditExperience },
    { path: "/edit-ticket/:id", exact: true, component: EditTicketFinal },
    { path: "/project-details/:id", exact: true, component: ProjectDetails },
    { path: "/add-manufacturer", exact: true, component: AddManufacturer },
    { path: "/add-company", exact: true, component: AddCompany },
    { path: "/search-project", exact: true, component: SearchProjects },
    { path: "/select-project", exact: true, component: SelectProject },
    { path: "/searched-project", exact: true, component: ViewSearchedProject },
    { path: "/edit-project/:id", exact: true, component: EditProject },
    { path: "/add-project", exact: true, component: AddGlobalProject },
    { path: "/edit-montage/:id", exact: true, component: EditMontageById },
    { path: "/add-montage", exact: true, component: AddNewMontage },
    { path: "/preview-montage/:id", exact: true, component: PreviewOfMontage },
    { path: "/add-trade", exact: true, component: SaveTrade },
    { path: "/add-role", exact: true, component: SaveRole },
    { path: "/add-building-type", exact: true, component: SaveBuildingType }
];

class Routes extends React.PureComponent {
    render() {
        return (
            <Switch>
                <Route path="(login)?" exact component={Login} />
                <Route path="/register" exact component={Register} />
                <Route path="/forgot-password" exact component={ForgotPassword} />
                <Route path="/confirm-code" exact component={ConfirmCode} />
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
