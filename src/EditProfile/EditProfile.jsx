import React, { Component } from 'react'
import { editUserProfile, getUserDetails } from '../Services/CommonAPI'
import SideNav from '../SideNav/SideNav'
import { Form, Select, Button, notification, Input, Space } from 'antd';
import moment from 'moment';
import { getAddress, saveUserAddress } from '../Services/AddressAPI';
import { deleteAnExperience, getUserExperienceHistory } from '../Services/Experience';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
export default class EditProfile extends Component {

  formRef = React.createRef();

  state = {
    experienceArray: [],
    UserId: '',
    FirstName: '',
    LastName: '',
    Phones: '',
    DateCreated: '',
    RideShareInterested: false,
    finalPhone: '',
    data: [],
    value: [],
    fetching: false,
    data1: [],
    value1: [],
    fetching1: false,
    data2: [],
    value2: [],
    fetching2: '',
    StartDate: moment(new Date()),
    EndDate: moment(new Date()),
    CurrentCompany: false,
    IncludeInResume: false,
    Address1: '',
    Address2: '',
    City: '',
    Province: '',
    Country: '',
    postalCode: ''
  }

  componentDidMount() {
    getUserDetails().then(res => {
      if (res.status === 200) {
        this.setState({
          UserId: res.data.data.userId,
          FirstName: res.data.data.firstName,
          LastName: res.data.data.lastName,
          Phones: res.data.data.phones,
          DateCreated: res.data.data.DateCreated,
          RideShareInterested: res.data.data.rideShareInterested
        }, () => {
          console.log('this.state.FirstName => ', this.state.FirstName);
          if (this.formRef) {
            this.formRef.current.setFieldsValue({
              FirstName: res.data.data.firstName,
              LastName: res.data.data.lastName,
            });
          }
        });
      }
    }).catch(err => {
      notification.open({
        message: 'Error',
        description: 'There was an error while fetching user data!'
      });
    });

    getAddress().then(res => {
      if (res.status === 200) {
        this.setState({
          Address1: res.data.data.address1,
          Address2: res.data.data.address2,
          City: res.data.data.city,
          Province: res.data.data.province,
          Country: res.data.data.country,
          postalCode: res.data.data.postalCode,
        });
      }
    }).catch(err => {
      notification.open({
        message: 'Error',
        description: 'There was an error while fetching user data!'
      });
    });

    getUserExperienceHistory().then(response => {
      if (response.status === 200) {
        const datenewd = response.data.data.sort((a, b) => new Date(moment(b.endDate).format('YYYY')) - new Date(moment(a.endDate).format('YYYY')))
        this.setState({ experienceArray: response.data.data });
        const firstData = this.state.experienceArray[0].projectId;
        const projectName = this.state.experienceArray[0].projectName;
        const companyName = this.state.experienceArray[0].companyName;
        this.setState({ projectName: projectName, projectID: firstData, companyName: companyName });
      }
    }).catch(Err => {
      notification.open({
        message: 'Error',
        description: 'There was an error while fetching user work history!'
      })
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  handleMobileNumbers = (e, i) => {
    let numbers = [...this.state.Phones];
    numbers[i].phoneNo = e
    this.setState({
      Phones: numbers
    })
  }

  handleMobileType = (e, i) => {
    let numbers = [...this.state.Phones];
    numbers[i].phoneType = e
    this.setState({
      Phones: numbers
    })
  }

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  getCheckBoxValue = (e) => {
    this.setState({ RideShareInterested: e })
  }

  editExperience = (userid, id) => {
    this.props.history.push(`/edit-experience/${userid}/${id}`)
  }

  deleteExperience = (id) => {
    swal({
      title: "Are you sure you want to delete the selected experience?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        deleteAnExperience({ Id: id }).then(res => {
          if (res.data.status === true) {
            getUserExperienceHistory().then(response => {
              if (response.status === 200) {
                const datenewd = response.data.data.sort((a, b) => new Date(moment(b.endDate).format('YYYY')) - new Date(moment(a.endDate).format('YYYY')))
                this.setState({ experienceArray: response.data.data });
                const firstData = this.state.experienceArray[0].projectId;
                const projectName = this.state.experienceArray[0].projectName;
                const companyName = this.state.experienceArray[0].companyName;
                this.setState({ projectName: projectName, projectID: firstData, companyName: companyName });
              }
            }).catch(Err => {
            });
            notification.open({
              message: 'Success',
              description: 'Experience data deleted successfully!'
            });
          } else {
            notification.open({
              message: 'Error',
              description: 'There was an error while deleting an experience'
            });
          }
        }).catch(err => {
          notification.open({
            message: 'Error',
            description: 'There was an error while deleting an experience'
          });
        })
      } else {
        swal("Your experience data is safe!");
      }
    })
  }

  cancelAddress = () => {
    getAddress().then(res => {
      this.setState({
        Address1: res.data.data.address1,
        Address2: res.data.data.address2,
        City: res.data.data.city,
        Province: res.data.data.province,
        Country: res.data.data.country,
        postalCode: res.data.data.postalCode,
      });
    }).catch(err => {
      console.log('err => ', err);
    });
  }

  cancelUserDetails = () => {
    getUserDetails().then(res => {
      this.setState({
        UserId: res.data.data.userId,
        FirstName: res.data.data.firstName,
        LastName: res.data.data.lastName,
        Phones: res.data.data.phones,
        DateCreated: res.data.data.DateCreated,
        RideShareInterested: res.data.data.rideShareInterested
      });
    }).catch(err => {
      console.log('err => ', err);
    });
  }

  spliceItems = (i) => {
    this.state.Phones.splice(i, 1);
    this.setState({ Phones: this.state.Phones })
  }

  render() {

    const updateUserProfile = (values) => {
      console.log('values => ', values);
      if (values.sights) {
        var numbers = [...this.state.Phones, ...values.sights];
      }
      const formData = new FormData()
      formData.append('UserId', this.state.UserId);
      formData.append('FirstName', values.FirstName ? values.FirstName : this.state.FirstName);
      formData.append('LastName', values.LastName ? values.LastName : this.state.LastName);
      formData.append('Phones', JSON.stringify({ Phones: this.state.Phones ? this.state.Phones : numbers }));
      formData.append('DateCreated', moment(new Date()).format());
      formData.append('DateModified', moment(new Date()).format());
      formData.append('CreatedBy', this.state.UserId);
      formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')));
      formData.append('RideShareInterested', this.state.RideShareInterested ? this.state.RideShareInterested : false);
      editUserProfile(formData).then(res => {
        console.log('calld');
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
      });
    }

    return (
      <div>
        <SideNav />
        <main className="index-main">
          <section className="index-sec">
            <div className="edit-sec flex-end">
              <h1>Edit Profile</h1>
            </div>
            <div className="com-padding">
              <div className="row">
                <div className="col-lg-4">
                  <div className="crd-wrap">
                    <div className="inner-wrap-card">
                      <Form onFinish={updateUserProfile} ref={this.formRef}>
                        <Form.Item label="First Name" name="FirstName">
                          <Input onChange={(e) => this.handleChange(e)} />
                        </Form.Item>
                        <Form.Item label="Last Name" name="LastName">
                          <Input onChange={(e) => this.handleChange(e)} />
                        </Form.Item>
                        <label>Phone Number</label>
                        {this.state.Phones && this.state.Phones.map((phoneNumber, i) => (
                          <>
                            <div className="d-flex mb-2">
                              <Select defaultValue={phoneNumber.phoneType} onChange={(e) => this.handleMobileType(e, i)} >
                                <Select.Option value="Mobile">Mobile</Select.Option>
                                <Select.Option value="Home">Home</Select.Option>
                                <Select.Option value="Work">Work</Select.Option>
                              </Select>
                              <Input name="phoneNo" value={phoneNumber.phoneNo} onChange={(e) => this.handleMobileNumbers(e.target.value, i)} />
                              <span className="delete-icon">
                                <i className="fa fa-close" onClick={() => this.spliceItems(i)}></i>
                              </span>
                            </div>
                          </>
                        ))}
                        <Form.List name="sights">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, i) => (
                                <Space key={field.key} align="baseline">
                                  <Form.Item noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                      prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                    }>
                                    {() => (
                                      <>
                                        <label>Phone Type</label>
                                        <Form.Item
                                          name={[field.name, 'phoneType']}
                                          fieldKey={[field.fieldKey, 'phoneType']}
                                          rules={[{ required: true, message: 'Missing phone type' }]}>
                                          <Select placeholder="Select a Phone Type" >
                                            <Select.Option value="Mobile">Mobile</Select.Option>
                                            <Select.Option value="Home">Home</Select.Option>
                                            <Select.Option value="Work">Work</Select.Option>
                                          </Select>
                                        </Form.Item>
                                      </>
                                    )}
                                  </Form.Item>
                                  <Form.Item label="Phone Number" name={[field.name, 'phoneNo']}
                                    fieldKey={[field.fieldKey, 'phoneNo']}>
                                    {/* <label>Phone Number</label> */}
                                    <Input placeholder="Enter your Phone Number" />
                                  </Form.Item>
                                  <div className="formfieldremove">
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                  </div>
                                </Space>
                              ))}
                              <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>Add Phone Number</Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" checked={this.state.RideShareInterested === true ? true : false} name="RideShareInterested" onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                          <label className="form-check-label">Interested in ride share to site</label>
                        </div>
                        <Form.Item>
                          <Button type="primary" htmlType="submit" className="btn btn-blue mt-2 mr-2">Update User Data</Button>
                          <Button className="btn btn-danger mt-2" onClick={() => this.cancelUserDetails()}>Cancel Changes</Button>
                        </Form.Item>
                      </Form>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <Link to="/add-address" className="add-btn btn-blue" ><i className="fas fa-plus-circle"></i> Add Address</Link>
                  <div className="crd-wrap">
                    <div className="inner-wrap-card">
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
                          <Button type="submit" className="btn btn-blue login-submit mt-2 mr-2" onClick={updateAddress}>Update Address</Button>
                          <Button type="reset" className="btn btn-danger mt-2" onClick={() => this.cancelAddress()}>Cancel Changes</Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <Link to="/add-experience" className="add-btn btn-blue" ><i className="fas fa-plus-circle"></i> Add Experience</Link>
                  <div className="crd-wrap">
                    <div className="inner-wrap-card">
                      <div className="proj-timeline">
                        <h4>My Experiences</h4>
                        <ul className="timeline-sec">
                          {this.state.experienceArray.map((data, index) => (
                            <li>
                              <h4 className="year">{moment(data.endDate).format('YYYY')}</h4>
                              <div className="timeline-block">
                                <h4>{data.projectName}</h4>
                                <span>{moment(data.startDate).format('MMM YYYY')} - {moment(data.endDate).format('MMM YYYY')}</span>
                                <span>{data.tradeName}</span>
                                <span>{data.roleName}</span>
                                <h5>{data.companyName}</h5>
                                <button onClick={() => this.editExperience(localStorage.getItem('userID'), data.id)} className="btn btn-blue">Edit</button>
                                <button onClick={() => this.deleteExperience(data.id)} className="btn btn-danger">Delete</button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    )
  }
}
