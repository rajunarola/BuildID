import React, { useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
// import * as $ from 'jquery';
// import { NavLink } from 'react-router-dom'
export default function SideNav() {

    useEffect(() => {
        // $("#main-nav ul li a").on('click', function (e) {
        //     $("#main-nav .active").removeClass('active');
        //     $(this).parent().addClass('active');
        //     e.preventDefault();
        // });
        // (function () {
        //     var current = window.location.pathname.split('/')[1];
        //     console.log('current => ', current);

        //     if (current === "") return;
        //     var menuItems = document.querySelectorAll('.main-nav a');

        //     for (var i = 0, len = menuItems.length; i < len; i++) {
        //         if (menuItems[i].getAttribute("href").indexOf(current) !== -1) {
        //             console.log('enuItems[i].getAttribute("href").indexOf(current) !== -1 => ', menuItems[i].getAttribute("href").indexOf(current) !== -1);

        //             console.log('menuItems => ', menuItems[i]);
        //             menuItems[i].className = "active";
        //         }
        //     }
        // })();
    }, [])

    const onLogout = () => {
        localStorage.clear();
    }

    return (
        <div>
            <aside class="sidebar bar-close">
                <a href="#!" class="logo">BUILD <b>ID</b></a>
                <div class="user-id">
                    <span>
                        <img src={require("../assets/images/user-img.jpg")} alt="User" /></span>
                    <div>
                        <p><a href="/projects">Grant Morgan <small>Carpenter</small></a></p>
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
                        <Link to={"javascript:void(0);"}>
                            <i><img src={require("../assets/images/icon_link.png")} alt="Icon" /></i>
                            <span>Link</span>
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
        </div>
    )
}
