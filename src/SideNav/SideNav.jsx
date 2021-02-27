import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Card, Accordion } from 'react-bootstrap';
class SideNav extends React.Component {

    state = {
        open: false
    }

    onLogout = () => { localStorage.clear() }

    render() {

        return (

            <>
                <aside className={this.state.open === true ? "sidebar bar-close sidebar_open" : "sidebar bar-close"} style={{ cursor: "pointer" }}>
                    <button className="sidebar_open_icon" onClick={() => this.setState({ open: !this.state.open })}>
                        <i className="fas fa-bars"></i>
                    </button>
                    <NavLink to="#" onClick={e => e.preventDefault()} className="logo">BUILD <b>ID</b></NavLink>
                    <div className="user-id">
                        <span> <img src={localStorage.getItem('userImage')} alt="" /></span>
                        <div onClick={() => this.props.history.push(`/edit-profile`)}>
                            <p>{localStorage.getItem('userName') !== null ? localStorage.getItem('userName') : <Link>Edit Profile</Link>}</p>
                        </div>
                    </div>
                    <ul className="main-nav">
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/dashboard" className="nav-link" >
                                <i><img src={require("../assets/images/icon_dashboard.png")} alt="Dashboard" /></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/projects" className="nav-link">
                                <i><img src={require("../assets/images/icon_projects.png")} alt="Projects" /></i>
                                <span>Projects</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/tickets" className="nav-link">
                                <i><img src={require("../assets/images/icon_link.png")} alt="Address" /></i>
                                <span>Tickets</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/montages" className="nav-link">
                                <i><img src={require("../assets/images/icon_timesheet.png")} alt="Timesheet" /></i>
                                <span>Montage</span>
                            </Link>
                        </li>

                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <div className="custom_nav">
                                        <i><img src={require("../assets/images/icon_timesheet.png")} alt="Timesheet" /></i>
                                        <span>Rewards</span>
                                    </div>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Link to="/store" className="nav-link" onClick={() => this.setState({ open: !this.state.open })}>
                                            <i><img src={require("../assets/images/icon_projects.png")} alt="Store" /></i>
                                            <span>Store</span>
                                        </Link>
                                        <Link to="/quiz" className="nav-link" onClick={() => this.setState({ open: !this.state.open })}>
                                            <i><img src={require("../assets/images/icon_comment.png")} alt="Comment" /></i>
                                            <span>Quiz</span>
                                        </Link>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                    </ul>
                    <ul className="lower-menu">
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="#" onClick={e => e.preventDefault()}>
                                <i className="fas fa-cog"></i>
                                <span>Setting</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/" onClick={() => this.onLogout()}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </aside>
            </>
        )
    }
}

export default withRouter(SideNav);