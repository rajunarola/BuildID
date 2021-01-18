import React, { Component } from 'react'
import moment from 'moment';
import { Form, Input, notification } from 'antd';
import { saveUserAddress } from '../Services/AddressAPI';
import Loader from '../Loader/Loader';
export default class AddAddress extends Component {

  formRef = React.createRef();

  state = {
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true })
    setTimeout(() => {
      this.setState({ loading: false })
    }, 1000);
  }

  render() {

    const addAddress = values => {
      const data = {
        UserId: parseInt(localStorage.getItem('userID')),
        Address1: values.Address1,
        Address2: values.Address2,
        Country: values.Country,
        Province: values.Province,
        City: values.City,
        PostalCode: values.postalCode,
        CreatedBy: parseInt(localStorage.getItem('userID')),
        ModifiedBy: parseInt(localStorage.getItem('userID')),
        DateCreated: moment(new Date()).format(),
        DateModified: moment(new Date()).format(),
      }
      saveUserAddress(data).then(res => {
        if (res.data.data === -1) {
          notification.info({
            message: 'Error',
            description: 'A company with same data address exist already!'
          });
        } else if (res.data.data !== -1) {
          this.formRef.current.resetFields();
          notification.success({
            message: 'Success',
            description: 'Company data has been added successfully!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while adding Company Data!'
        });
      });
    }

    return (

      <>
        {this.state.loading ? <Loader /> :
          <div className="index-main">
            <div className="edit-sec mt-80"><h2>Add Address</h2></div>
            <div className="addticketform ml-4">
              <div className="form-border p-4 w-30 mt-5 crd-wrap">
                <Form className="card-body" onFinish={addAddress} ref={this.formRef}>
                  <div className="form-group">
                    <label>Address Line 1</label>
                    <Form.Item name="Address1" rules={[{ required: true, message: "Please enter your Address Line 1!" }]} >
                      <Input className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="form-group">
                    <label>Address Line 2</label>
                    <Form.Item name="Address2" rules={[{ required: true, message: "Please enter your  Address Line 2!" }]}>
                      <Input className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="form-group">
                    <label>City</label>
                    <Form.Item name="City" rules={[{ required: true, message: "Please enter your City!" }]}>
                      <Input className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="form-group">
                    <label>Province</label>
                    <Form.Item name="Province" rules={[{ required: true, message: "Please enter your Province!" }]}>
                      <Input className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="form-group">
                    <label>Country</label>
                    <Form.Item name="Country" rules={[{ required: true, message: "Please enter your Country!" }]}>
                      <Input className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <Form.Item name="postalCode" rules={[{ required: true, message: "Please enter your Postal Code!" }]}>
                      <Input className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="mt-4">
                    <button type="submit" className="btn btn-blue btnManufacturer">Add Address</button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        }
      </>
    )
  }
}
