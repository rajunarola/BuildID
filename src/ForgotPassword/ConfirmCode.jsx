import React, { Component } from 'react'
import Loader from '../Loader/Loader'
import { Form, Input, notification } from 'antd';
import { Link } from 'react-router-dom';
import { checkIfValidCode } from '../Services/CommonAPI';

export default class ConfirmCode extends Component {

    state = {
        loading: false
    }

    render() {

        const confirmCode = (value) => {
            this.setState({ loading: true }, () => {
                checkIfValidCode(this.props.match.params.email, value.code).then(res => {
                    if (res.data === 'OK') {
                        this.setState({ loading: false }, () => {
                            notification.success({
                                message: 'Success',
                                description: 'Code successfully matched! You can now change your password!!'
                            });
                            this.props.history.push(`/change-password`);
                        })
                    } else {
                        this.setState({ loading: false }, () => {
                            notification.error({
                                message: 'Error',
                                description: `${res.data}`
                            });
                        });
                    }
                }).catch(Err => {
                    this.setState({ loading: false }, () => {
                        notification.error({
                            message: 'Error',
                            description: 'There was an error while resetting your password'
                        })
                    });
                });
            });
        }

        return (
            <>
                {this.state.loading ? <Loader /> :
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
                                    <h3>Confirm Code</h3>
                                    <Form onFinish={confirmCode} className="login-form">
                                        <div className="form-group">
                                            <label>Code</label>
                                            <Form.Item name="code" rules={[{ required: true, message: 'Please enter your code!' }]}>
                                                <Input className="form-control" />
                                            </Form.Item>
                                        </div>
                                        <button type="submit" className="btn-blue btn-login">Verify Code</button>

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
