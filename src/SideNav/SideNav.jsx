import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
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
                    <div className="user-id" onClick={() => this.props.history.push('/projects')}>
                        <span> <img src={localStorage.getItem('userImage')} alt="" /></span>
                        <div> <p>{localStorage.getItem('userName')}</p> </div>
                    </div>
                    <ul className="main-nav">
                        <li>
                            <Link to="/dashboard" className="nav-link" >
                                <i><img src={require("../assets/images/icon_dashboard.png")} alt="Dashboard" /></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects" className="nav-link">
                                <i><img src={require("../assets/images/icon_projects.png")} alt="Projects" /></i>
                                <span>Projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="#" onClick={e => e.preventDefault()} className="nav-link">
                                <i><img src={require("../assets/images/icon_link.png")} alt="Address" /></i>
                                <span>Address</span>
                            </Link>
                        </li>
                        <li>
                            <NavLink to="#" onClick={e => e.preventDefault()}>
                                <i><img src={require("../assets/images/icon_comment.png")} alt="Comment" /></i>
                                <span>Comment</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="#" onClick={e => e.preventDefault()}>
                                <i><img src={require("../assets/images/icon_timesheet.png")} alt="Timesheet" /></i>
                                <span>Timesheet</span>
                            </NavLink>
                        </li>
                    </ul>
                    <ul className="lower-menu">
                        <li>
                            <NavLink to="#" onClick={e => e.preventDefault()}>
                                <i className="fas fa-cog"></i>
                                <span>Setting</span>
                            </NavLink>
                        </li>
                        <li>
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