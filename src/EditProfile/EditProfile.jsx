import React, { Component } from 'react'
import { editUserProfile, getUserDetails } from '../Services/CommonAPI'
import SideNav from '../SideNav/SideNav'
import { Form, Button, Input, Select, notification } from 'antd';
import moment from 'moment';

export default class EditProfile extends Component {

    state = {
        UserId: '',
        FirstName: '',
        LastName: '',
        Phones: '',
        DateCreated: '',
        RideShareInterested: false,
        finalPhone: ''
    }

    componentDidMount() {
        getUserDetails().then(res => {
            this.setState({
                UserId: res.data.data.userId,
                FirstName: res.data.data.firstName,
                LastName: res.data.data.lastName,
                Phones: res.data.data.phoneNo,
                DateCreated: res.data.data.DateCreated,
                RideShareInterested: res.data.data.rideShareInterested
            });
        }).catch(err => {
            console.log('err => ', err); notification.open({
                message: 'Error',
                description: 'There was an error while fetching user data!'
            });
        })
    }


    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    getCheckBoxValue = (e) => {
        this.setState({ RideShareInterested: e })
    }

    render() {

        const onChange = value => {
            var phoneAry = [];
            phoneAry.push({ "phoneType": value, "phoneNo": this.state.Phones })
            this.setState({ finalPhone: [...phoneAry] })
        }

        const updateUserProfile = () => {
            const formData = new FormData()
            formData.append('UserId', this.state.UserId)
            formData.append('FirstName', this.state.FirstName)
            formData.append('LastName', this.state.LastName)
            formData.append('Phones', JSON.stringify({ Phones: this.state.finalPhone }))
            formData.append('DateModified', moment(new Date()).format())
            formData.append('RideShareInterested', this.state.RideShareInterested)
            editUserProfile(formData).then(res => {
                if (res.data.status === true) {
                    notification.open({
                        message: 'Success',
                        description: 'User data successfully updated!'
                    });
                }
            }).catch(err => {
                notification.open({
                    message: 'Error',
                    description: 'There was an error while updating user data!'
                });
            })
        }

        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div class="com-padding">
                        <div class="row">
                            <div class="col-lg-4">
                                <Form onFinish={updateUserProfile}>
                                    <Form.Item label="First Name">
                                        <Input name="FirstName" value={this.state.FirstName} onChange={(e) => this.handleChange(e)} />
                                    </Form.Item>

                                    <Form.Item label="Last Name">
                                        <Input name="LastName" value={this.state.LastName} onChange={(e) => this.handleChange(e)} />
                                    </Form.Item>

                                    <Form.Item label="Phone Number">
                                        <Input name="Phones" value={this.state.Phones} onChange={(e) => this.handleChange(e)} />
                                    </Form.Item>

                                    <Select placeholder="Select a Phone Type" onChange={onChange}>
                                        <Select.Option value="Mobile">Mobile</Select.Option>
                                        <Select.Option value="Home">Home</Select.Option>
                                        <Select.Option value="Work">Work</Select.Option>
                                    </Select>

                                    <div className="form-check">
                                        <input className="form-check-input" type="checkbox" name="RideShareInterested" onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                                        <label className="form-check-label">Interested in ride share to site</label>
                                    </div>
                                    <Form.Item>
                                        <Button type="primary" htmlType="submit">Submit</Button>
                                    </Form.Item>
                                </Form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
