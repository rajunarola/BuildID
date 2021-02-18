import React, { Component } from 'react';
import { Form, notification, Input } from 'antd';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { signUp } from '../Services/CommonAPI'

export default class Register extends Component {

    state = {
        loading: false
    }

    render() {

        const onFinish = (value) => {
            this.setState({ loading: true }, () => {
                const data = {
                    user: value.email,
                    password: value.password
                }
                signUp(data).then(response => {
                    if (response.data && response.data.message === "OK") {
                        this.setState({ loading: false }, () => {
                            localStorage.setItem('userID', response.data.data);
                            this.props.history.push("/edit-profile");
                            notification.success({
                                message: 'Success',
                                description: 'You have been successfully registered!'
                            });
                        });
                        return
                    }
                }).catch(err => {
                    if (err && err.response && err.response.status === 400) {
                        this.setState({ loading: false }, () => {
                            notification.error({
                                message: 'Error',
                                description: `${err.response.data.message}`
                            });
                        });
                    } else {
                        this.setState({ loading: false }, () => {
                            notification.error({
                                message: 'Error',
                                description: `Something went wrong! Please try again later!`
                            });
                        });
                    }
                });
            });
        }

        return (
            <>
                {
                    this.state.loading ? <Loader /> :
                        <div className="login-sec login-block">
                            <div className="container">
                                <div className="row align-items-center justify-content-between alternate">
                                    <div className="col-lg-5 col-md-6">
                                        <h1><small>Welcome to</small>BUILD <b>ID</b></h1>
                                        <p>Help us help you showcase the projects that you have been a part of that make you be proud of working in construction. </p>
                                        <p>Oh and get builders bucks that you can exchange for chances to win prizes tools and other cool things</p>
                                    </div>
                                    <div className="col-lg-5 col-md-6">
                                        <h2>BUILD <b>ID</b></h2>
                                        <h3>Create A New Account</h3>
                                        {/* <h4>Login with your social media account</h4>
                                    <ul className="login-social">
                                        <li><Link style={{ 'backgroundColor': '#4268b3' }}><i className="fab fa-facebook-f"></i></Link></li>
                                        <li><Link style={{ 'backgroundColor': '#1ca1ee' }}><i className="fab fa-twitter"></i></Link></li>
                                        <li><Link style={{ 'backgroundColor': '#d44439' }}><i className="fab fa-google-plus-g"></i></Link></li>
                                    </ul> */}
                                        <Form onFinish={onFinish} className="login-form">
                                            <div className="form-group">
                                                <label>Email</label>
                                                <Form.Item name="email" rules={[{ required: true, message: 'Please enter email!' }]}>
                                                    <Input className="form-control" />
                                                </Form.Item>
                                            </div>
                                            <div className="form-group">
                                                <label>Password</label>
                                                <Form.Item name="password" rules={[{ required: true, message: 'Please enter password!' }]}>
                                                    <Input.Password className="form-control" />
                                                </Form.Item>
                                            </div>
                                            <button type="submit" className="btn-blue btn-login">Register</button>
                                            <div className="or_section">
                                                <span>or</span>
                                            </div>

                                            <span className="create_link"> <Link to="/">Take me back to login</Link> </span>
                                        </Form>
                                    </div>
                                </div>
                            </div>
                        </div>
                }
            </>
        )
    }
}
