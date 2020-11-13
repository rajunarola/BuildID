import React from 'react'
import { Link, withRouter } from 'react-router-dom'

class SideNav extends React.Component {


    onLogout = () => {
        localStorage.clear();
    }

    render() {

        let userName = localStorage.getItem('userName')
        let userImage = localStorage.getItem('userImage')


        return (
            <div>
                <aside className="sidebar bar-close" style={{ cursor: "pointer" }}>
                    <a href="#!" className="logo">BUILD <b>ID</b></a>
                    <div className="user-id" onClick={() => this.props.history.push('/projects')}>
                        <span>
                            <img src={userImage} alt="" /></span>
                        <div>
                            <p>{userName}</p>
                        </div>
                    </div>
                    <ul className="main-nav">
                        <li>
                            <Link to="/dashboard">
                                <i><img src={require("../assets/images/icon_dashboard.png")} alt="Icon" /></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/projects">
                                <i><img src={require("../assets/images/icon_projects.png")} alt="Icon" /></i>
                                <span>Projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/address">
                                <i><img src={require("../assets/images/icon_link.png")} alt="Icon" /></i>
                                <span>Address</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"javascript:void(0);"}>
                                <i><img src={require("../assets/images/icon_comment.png")} alt="Icon" /></i>
                                <span>Comment</span>
                            </Link>
                        </li>
                        <li>
                            <Link to={"javascript:void(0);"}>
                                <i><img src={require("../assets/images/icon_timesheet.png")} alt="Icon" /></i>
                                <span>Timesheet</span>
                            </Link>
                        </li>
                    </ul>
                    <ul className="lower-menu">
                        <li>
                            <Link to={"javascript:void(0);"}>
                                <i className="fas fa-cog"></i>
                                <span>Setting</span>
                            </Link>
                        </li>
                        <li>
                            <Link to="/" onClick={() => this.onLogout()}>
                                <i className="fas fa-sign-out-alt"></i>
                                <span>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </aside>
            </div>
        )
    }
}


export default withRouter(SideNav);