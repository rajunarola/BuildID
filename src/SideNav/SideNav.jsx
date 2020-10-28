import React from 'react'
import { Link } from 'react-router-dom'

export default function SideNav() {

    const userName = localStorage.getItem('userName')
    const userImage = localStorage.getItem('userImage')

    const onLogout = () => {
        localStorage.clear();
    }

    return (
        <div>
            <aside class="sidebar bar-close">
                <a href="#!" class="logo">BUILD <b>ID</b></a>
                <div class="user-id">
                    <span>
                        <img src={userImage} alt="" /></span>
                    <div>
                        <p>{userName}</p>
                    </div>
                </div>
                <ul class="main-nav">
                    <li>
                        <Link href="/dashboard" >
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
                <ul class="lower-menu">
                    <li>
                        <Link to={"javascript:void(0);"}>
                            <i class="fas fa-cog"></i>
                            <span>Setting</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/" onClick={() => onLogout()}>
                            <i class="fas fa-sign-out-alt"></i>
                            <span>Logout</span>
                        </Link>
                    </li>
                </ul>
            </aside>
        </div >
    )
}
