import React, { Component } from 'react'
import { editUserProfile, getUserDetails } from '../Services/CommonAPI'
import SideNav from '../SideNav/SideNav'
import { Form, Select, Button, notification, Input, Space } from 'antd';
import moment from 'moment';
import { getAddress, saveUserAddress } from '../Services/AddressAPI';
import { deleteAnExperience, getUserWorkHistory } from '../Services/Experience';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';

export default class EditProfile extends Component {

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
    companyId: '',
    roleId: '',
    tradeId: '',
    editData: [],
    companyName: [],
    companyId: '',
    Address1: '',
    Address2: '',
    City: '',
    Province: '',
    Country: '',
    postalCode: '',
    users: [{ phoneType: "", phoneNo: "" }]
  }

  componentDidMount() {
    getUserDetails().then(res => {
      if (res.status === 200) {
        this.setState({
          UserId: res.data.data.userId,
          FirstName: res.data.data.firstName,
          LastName: res.data.data.lastName,
          Phones: res.data.data.phoneNo,
          DateCreated: res.data.data.DateCreated,
          RideShareInterested: res.data.data.rideShareInterested
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

    getUserWorkHistory().then(response => {
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

  changeHandler = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  getCheckBoxValue = (e) => {
    this.setState({ RideShareInterested: e })
  }

  editExperience = (id) => {
    this.props.history.push(`/edit-experience/${localStorage.getItem('userID')}/${id}`)
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
            getUserWorkHistory().then(response => {
              if (response.status === 200) {
                // console.log('response => ', response);
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

  onChange = value => {
    var phoneAry = [...this.state.finalPhone];
    phoneAry.push({ "phoneType": value, "phoneNo": this.state.Phones });
    this.setState({ finalPhone: phoneAry });
  }

  render() {

    const updateUserProfile = () => {
      const formData = new FormData()
      formData.append('UserId', this.state.UserId);
      formData.append('FirstName', this.state.FirstName);
      formData.append('LastName', this.state.LastName);
      formData.append('Phones', JSON.stringify({ Phones: this.state.finalPhone }));
      formData.append('DateModified', moment(new Date()).format());
      formData.append('RideShareInterested', this.state.RideShareInterested);
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
                      <Form onFinish={updateUserProfile}>
                        <Form.Item label="First Name">
                          <Input name="FirstName" value={this.state.FirstName} onChange={(e) => this.handleChange(e)} />
                        </Form.Item>

                        <Form.Item label="Last Name">
                          <Input name="LastName" value={this.state.LastName} onChange={(e) => this.handleChange(e)} />
                        </Form.Item>
                        <Form.List name="sights">
                          {(fields, { add, remove }) => (
                            <>
                              {fields.map((field, i) => (
                                <Space key={field.key} align="baseline">
                                  <Form.Item
                                    noStyle
                                    shouldUpdate={(prevValues, curValues) =>
                                      prevValues.area !== curValues.area || prevValues.sights !== curValues.sights
                                    }>
                                    {() => (
                                      <>
                                        <label>Phone Type</label>
                                        <Form.Item
                                          rules={[{ required: true, message: 'Missing phone type' }]}>
                                          <Select name="phoneType" placeholder="Select a Phone Type" onChange={(e) => this.onChange(e)}>
                                            <Select.Option value="Mobile">Mobile</Select.Option>
                                            <Select.Option value="Home">Home</Select.Option>
                                            <Select.Option value="Work">Work</Select.Option>
                                          </Select>
                                        </Form.Item>
                                      </>
                                    )}
                                  </Form.Item>
                                  <Form.Item>
                                    <label>Phone Number</label>
                                    <Input name='Phones' onChange={(e) => this.onChange(e)} />
                                  </Form.Item>
                                  <div className="formfieldremove">
                                    <MinusCircleOutlined onClick={() => remove(field.name)} />
                                  </div>
                                </Space>
                              ))}
                              <Form.Item>
                                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                                  Add Phone Number
                                  </Button>
                              </Form.Item>
                            </>
                          )}
                        </Form.List>
                        <div className="form-check">
                          <input className="form-check-input" type="checkbox" name="RideShareInterested" onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                          <label className="form-check-label">Interested in ride share to site</label>
                        </div>
                        <Form.Item>
                          <Button type="primary" htmlType="submit" className="btn btn-blue">Update User Data</Button>
                        </Form.Item>
                      </Form>
                      <div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4">
                  <Link to="/add-experience" className="add-btn btn-blue" ><i className="fas fa-plus-circle"></i> Add Address</Link>
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
                          <Button type="submit" className="btn btn-blue login-submit mt-5" onClick={updateAddress}>Update Address</Button>
                        </Form.Item>
                      </Form>
                    </div>
                  </div>
                </div>

                <div className="col-lg-4">
                  <Link to="/add-experience" className="add-btn btn-blue" ><i className="fas fa-plus-circle"></i> Add Experience</Link>
                  <div className="crd-wrap">
                    <div className="inner-wrap-card">
                      {/* <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                        <Carousel autoPlay>
                          {this.state.pictureList.map((data, index) => (
                            <img src={data.imageUrl} alt="" />
                          ))}
                        </Carousel>
                      </div>
                      <div className="pro-details">
                        <a className="close-proj"><i className="fas fa-times-circle"></i></a>
                        <div className="wrap">
                          <h4>{this.state.projectName}</h4>
                          <span>{this.state.companyName}</span>
                        </div>
                        <a className="approve-proj"><i className="fas fa-check-circle"></i></a>
                      </div> */}
                      <div className="proj-timeline">
                        <h4>My Projects</h4>
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
                                <button onClick={() => this.editExperience(data.id)} className="btn btn-blue">Edit</button>
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
