import React, { Component } from 'react'
import { saveNewPassword, userLogin } from '../Services/CommonAPI';
import { notification, Form, Input } from 'antd';
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';

export default class ChangePassword extends Component {

  state = {
    loading: false
  }

  render() {

    const changePassword = (value) => {
      this.setState({ loading: true }, () => {
        saveNewPassword({ email: value.email, password: value.password }).then(res => {
          if (res.data.message === 'OK') {
            userLogin({ user: value.email, password: value.password }).then(response => {
              if (response.data && response.data.status === true) {
                this.setState({ loading: false }, () => {
                  localStorage.setItem('userID', response.data.data.userId);
                  localStorage.setItem('userImage', response.data.data.pictureUrl)
                  localStorage.setItem('userName', response.data.data.firstName + " " + response.data.data.lastName);
                  this.props.history.push("/dashboard");
                  notification.success({
                    message: 'Success',
                    description: 'You have successfully logged in!'
                  });
                });
                return
              } else if (response.response.status === 400) {
                this.setState({ loading: false }, () => {
                  notification.error({
                    message: 'Error',
                    description: `${response.response.data.message}`
                  });
                  return
                });
              }
            }).catch(err => {
              this.setState({ loading: false }, () => {
                notification.error({
                  message: 'Error',
                  description: `Something went wrong! Please try again later!`
                });
              });
            });
          } else {
            this.setState({ loading: false }, () => {
              notification.error({
                message: 'Error',
                description: 'There was an error while changing your password'
              });
            });
          }
        }).catch(Err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while resetting your password'
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
                  <h3>Change Password</h3>
                  <Form onFinish={changePassword} className="login-form">
                    <div className="form-group">
                      <label>Email</label>
                      <Form.Item name="email" rules={[{ required: true, message: 'Please enter your email!' }]}>
                        <Input className="form-control" placeholder="Enter your email" />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label>New Password</label>
                      <Form.Item name="password" rules={[{ required: true, message: 'Please enter a new password!' }]}>
                        <Input.Password className="form-control" placeholder="Enter your password" />
                      </Form.Item>
                    </div>
                    <button type="submit" className="btn-blue btn-login">Change Password</button>
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
