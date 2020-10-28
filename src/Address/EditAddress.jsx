import React, { Component } from 'react'
import { getAddress, saveUserAddress } from '../Services/AddressAPI'
import SideNav from '../SideNav/SideNav'
import { Form, Input, Button, notification } from 'antd';
import moment from 'moment';

export default class EditAddress extends Component {

    state = {
        Address1: '',
        Address2: '',
        City: '',
        Province: '',
        Country: '',
        postalCode: ''
    }

    componentDidMount() {
        getAddress().then(res => {
            console.log('res => ', res);
            this.setState({
                Address1: res.data.data.address1,
                Address2: res.data.data.address2,
                City: res.data.data.city,
                Province: res.data.data.province,
                Country: res.data.data.country,
                postalCode: res.data.data.postalCode,
            })
            console.log('this.state => ', this.state);

        }).catch(err => {
            console.log('err => ', err);

        })
    }

    changeHandler = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    render() {

        const updateAddress = () => {
            const data = {
                UserId: localStorage.getItem('userID'),
                Address1: this.state.Address1 ? this.state.Address1 : '',
                Address2: this.state.Address2 ? this.state.Address2 : '',
                Country: this.state.Country ? this.state.Country : '',
                Province: this.state.Province ? this.state.Province : '',
                City: this.state.City ? this.state.City : '',
                PostalCode: this.state.postalCode ? this.state.postalCode : '',
                CreatedBy: localStorage.getItem('userID'),
                ModifiedBy: localStorage.getItem('userID'),
                DateCreated: moment(new Date()).format(),
                DateModified: moment(new Date()).format()
            }
            saveUserAddress(data).then(res => {
                if (res.data.status === true) {
                    notification.open({
                        message: 'Success',
                        description: 'Ticket successfully updated!'
                    });
                }

            }).catch(err => {
                notification.open({
                    message: 'Error',
                    description: 'There was an error while updating ticket!'
                });

            })


        }

        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>Edit Address</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">
                            <Form className="card-body">
                                <div className="form-group">
                                    <label>Address Line 1</label>
                                    <Form.Item >
                                        <Input value={this.state.Address1} className="w-100 inputstyle" name="Address1" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Address Line 2</label>
                                    <Form.Item>
                                        <Input value={this.state.Address2} className="w-100 inputstyle" name="Address2" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <Form.Item>
                                        <Input value={this.state.City} className="w-100 inputstyle" name="City" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Province</label>
                                    <Form.Item>
                                        <Input value={this.state.Province} className="w-100 inputstyle" name="Province" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <Form.Item>
                                        <Input value={this.state.Country} className="w-100 inputstyle" name="Country" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <Form.Item>
                                        <Input value={this.state.postalCode} className="w-100 inputstyle" name="postalCode" onChange={(e) => this.changeHandler(e)} />
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <Button type="submit" className="btn btn-blue login-submit mt-5" onClick={updateAddress}>Update Address</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
