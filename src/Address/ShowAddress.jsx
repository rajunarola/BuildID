import React, { Component } from 'react'
import { getAddress } from '../Services/AddressAPI'
import SideNav from '../SideNav/SideNav';
import { Form, Input, Button } from 'antd';

export default class ShowAddress extends Component {

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

    render() {

        const editAddress = () => {
            this.props.history.push('/edit-address')
        }
        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>User Address</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">

                            <Form className="card-body">
                                <div className="form-group">
                                    <label>Address Line 1</label>
                                    <Form.Item >
                                        <Input value={this.state.Address1} className="w-100 inputstyle" name="Address1" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Address Line 2</label>
                                    <Form.Item>
                                        <Input value={this.state.Address2} className="w-100 inputstyle" name="Address2" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <Form.Item>
                                        <Input value={this.state.City} className="w-100 inputstyle" name="City" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Province</label>
                                    <Form.Item>
                                        <Input value={this.state.Province} className="w-100 inputstyle" name="Province" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Country</label>
                                    <Form.Item>
                                        <Input value={this.state.Country} className="w-100 inputstyle" name="Country" />
                                    </Form.Item>
                                </div>
                                <div className="form-group">
                                    <label>Postal Code</label>
                                    <Form.Item>
                                        <Input value={this.state.postalCode} className="w-100 inputstyle" name="postalCode" />
                                    </Form.Item>
                                </div>
                                <Form.Item>
                                    <Button type="submit" className="btn btn-blue login-submit mt-5" onClick={editAddress}>Edit Address</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
