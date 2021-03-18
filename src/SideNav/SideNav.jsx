import React from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { Card, Accordion } from 'react-bootstrap';
class SideNav extends React.Component {

    state = {
        open: false
    }

    onLogout = () => { localStorage.clear() }

    render() {
        const { REACT_APP_API_VERSION_NO } = process.env;
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
                                <i className="fas fa-th-large"></i>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/projects" className="nav-link">
                                <i className="fas fa-project-diagram"></i>
                                <span>Projects</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/tickets" className="nav-link">
                                <i className="fas fa-link"></i>
                                <span>Tickets</span>
                            </Link>
                        </li>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/montages" className="nav-link">
                                <i className="fas fa-file-alt"></i>
                                <span>Montage</span>
                            </Link>
                        </li>

                        <Accordion>
                            <Card>
                                <Accordion.Toggle as={Card.Header} eventKey="0">
                                    <div className="custom_nav">
                                        <div className="d-flex">
                                            <i className="fas fa-dollar-sign"></i>
                                            <span>Rewards</span>
                                        </div>
                                        <i className="fas fa-chevron-down"></i>
                                    </div>
                                </Accordion.Toggle>
                                <Accordion.Collapse eventKey="0">
                                    <Card.Body>
                                        <Link to="/store" className="nav-link" onClick={() => this.setState({ open: !this.state.open })}>
                                            <i className="fas fa-store"></i>
                                            <span>Store</span>
                                        </Link>
                                        <Link to="/quiz" className="nav-link" onClick={() => this.setState({ open: !this.state.open })}>
                                            <i className="fas fa-question"></i>
                                            <span>Quiz</span>
                                        </Link>
                                    </Card.Body>
                                </Accordion.Collapse>
                            </Card>
                        </Accordion>
                        <li onClick={() => this.setState({ open: !this.state.open })}>
                            <Link to="/buy-sell" className="nav-link">
                                <i className="fas fa-exchange-alt"></i>
                                <span>Buy Sell</span>
                            </Link>
                        </li>
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
                        <li className="text-center">
                            <label className="mt-3">{REACT_APP_API_VERSION_NO}</label>
                        </li>
                    </ul>
                </aside>
            </>
        )
    }
}

export default withRouter(SideNav);