import React, { Component } from 'react'
import SideNav from '../SideNav/SideNav'
import moment from 'moment';
import { Form, Input, Button, notification } from 'antd';
import { saveUserAddress } from '../Services/AddressAPI';

export default class AddAddress extends Component {

  state = {
    newAddress: []
  }

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {

    const addAddress = () => {
      const data = {
        UserId: parseInt(localStorage.getItem('userID')),
        Address1: this.state.Address1,
        Address2: this.state.Address2,
        Country: this.state.Country,
        Province: this.state.Province,
        City: this.state.City,
        PostalCode: this.state.postalCode,
        CreatedBy: parseInt(localStorage.getItem('userID')),
        ModifiedBy: parseInt(localStorage.getItem('userID')),
        DateCreated: moment(new Date()).format(),
        DateModified: moment(new Date()).format(),
      }
      saveUserAddress(data).then(res => {
        if (res.data.data === -1) {
          notification.open({
            message: 'Error',
            description: 'A company with same data address exist already!'
          });
        } else if (res.data.data !== -1) {
          notification.open({
            message: 'Success',
            description: 'Company data has been added successfully!'
          });
        }
      }).catch(err => {
        notification.open({
          message: 'Error',
          description: 'There was an error while adding Company Data!'
        });
      });
    }

    return (
      <div>
        <div>
          <SideNav />
          <div className="index-main">
            <div className="edit-sec mt-80"><h2>Add Address</h2></div>
            <div className="addticketform ml-4">
              <div className="form-border p-4 w-30 mt-5 crd-wrap">
                <Form className="card-body" onFinish={addAddress}>
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
                  <div className="mt-4">
                    <Form.Item>
                      <Button type="primary" htmlType="submit" className="btn btn-orange-search">Add Address</Button>
                    </Form.Item>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
