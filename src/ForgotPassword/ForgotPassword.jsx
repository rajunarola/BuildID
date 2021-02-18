import React, { Component } from 'react'
import { Form, Input, notification } from 'antd';
import { getResetCode } from '../Services/CommonAPI';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';

export default class ForgotPassword extends Component {

  state = {
    loading: false
  }

  render() {

    const forgotPassword = (value) => {
      this.setState({ loading: true }, () => {
        getResetCode(value.email).then(response => {
          if (response.data && response.data === "OK") {
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Success',
                description: `An email has been successfully sent to ${value.email}!`
              });
              this.props.history.push(`/confirm-code/${value.email}`);
            });
          } else {
            this.setState({ loading: false }, () => {
              notification.error({
                message: 'Error',
                description: `The email id ${value.email} is not registered with Build ID!`
              });
            });
          }
          return
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: `Something went wrong! Please try again later!`
            });
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
                  <h3>Forgot Password</h3>
                  <Form onFinish={forgotPassword} className="login-form">
                    <div className="form-group">
                      <label>Email</label>
                      <Form.Item name="email" rules={[{ required: true, message: 'Please enter email!' }]}>
                        <Input className="form-control" placeholder="Enter your email" />
                      </Form.Item>
                    </div>
                    <button type="submit" className="btn-blue btn-login">Verify Email</button>
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
