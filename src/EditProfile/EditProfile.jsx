import React, { Component } from 'react';
import { editUserProfile, getUserDetails } from '../Services/CommonAPI';
import { Form, Select, Button, notification, Input, Space } from 'antd';
import moment from 'moment';
import { getAddress, saveUserAddress } from '../Services/AddressAPI';
import { deleteAnExperience, getUserExperienceHistory } from '../Services/Experience';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import swal from 'sweetalert';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
export default class EditProfile extends Component {

  formRef = React.createRef();
  formRef1 = React.createRef();

  state = {
    experienceArray: [],
    Phones: [],
    RideShareInterested: false,
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([getUserDetails(), getAddress(), getUserExperienceHistory()]).then((values) => {
        if (values[0] && values[1] && values[2] && values[0].status === 200 && values[1].status === 200 && values[2].status === 200) {
          this.setState({
            loading: false,
            RideShareInterested: values[0].data.data !== null ? values[0].data.data.rideShareInterested : false,
            Phones: values[0].data.data !== null ? values[0].data.data.phones : [],
            experienceArray: values[2].data.data
          }, () => {
            if (values[0].data.data !== null) {
              this.formRef.current.setFieldsValue({
                FirstName: values[0].data.data.firstName,
                LastName: values[0].data.data.lastName,
              });
            }
            if (values[1].data.data !== null) {
              this.formRef1.current.setFieldsValue({
                Address1: values[1].data.data.address1,
                Address2: values[1].data.data.address2,
                City: values[1].data.data.city,
                Province: values[1].data.data.province,
                Country: values[1].data.data.country,
                postalCode: values[1].data.data.postalCode,
              });
            }
          });
        } else {
          this.setState({ loading: false })
        }
      }).catch(err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching data!'
          });
        });
      });
    })
  }

  handleMobileNumbers = (e, i) => {
    let numbers = [...this.state.Phones];
    numbers[i].phoneNo = e
    this.setState({ Phones: numbers })
  }

  handleMobileType = (e, i) => {
    let numbers = [...this.state.Phones];
    numbers[i].phoneType = e
    this.setState({ Phones: numbers })
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
        // this.setState({ loading: true }, () => {
        deleteAnExperience({ Id: id }).then(res => {
          if (res.data.status === true) {
            getUserExperienceHistory().then(response => {
              if (response.status === 200) {
                this.setState({ experienceArray: response.data.data }, () => {
                  const firstData = this.state.experienceArray[0].projectId;
                  const projectName = this.state.experienceArray[0].projectName;
                  const companyName = this.state.experienceArray[0].companyName;
                  this.setState({ projectName: projectName, projectID: firstData, companyName: companyName });
                });
              }
            }).catch(Err => { });
            notification.success({
              message: 'Success',
              description: 'Experience data deleted successfully!'
            });
          } else {
            // this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while deleting an experience'
            });
            // });
          }
        }).catch(err => {
          // this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while deleting an experience'
          });
          // });
        });
        // });
      } else {
        swal("Your experience data is safe!");
      }
    })
  }

  cancelAddress = () => {
    getAddress().then(res => {
      this.formRef1.current.setFieldsValue({
        Address1: res.data.data.address1,
        Address2: res.data.data.address2,
        City: res.data.data.city,
        Province: res.data.data.province,
        Country: res.data.data.country,
        postalCode: res.data.data.postalCode,
      });
    }).catch(err => {
      // console.log('err => ', err);
    });
  }

  cancelUserDetails = () => {
    getUserDetails().then(res => {
      this.setState({
        Phones: res.data.data.phones,
        RideShareInterested: res.data.data.rideShareInterested
      }, () => {
        this.formRef.current.setFieldsValue({
          FirstName: res.data.data.firstName,
          LastName: res.data.data.lastName
        });
      });
    }).catch(err => {
      // console.log('err => ', err);
    });
  }

  deletePhoneNumber = (i) => {
    this.state.Phones.splice(i, 1);
    this.setState({ Phones: this.state.Phones })
  }

  render() {

    const updateUserProfile = (values) => {
      this.setState({ loading: true }, () => {
        if (values.sights) {
          var numbers = [...this.state.Phones, ...values.sights];
        }
        const formData = new FormData()
        formData.append('UserId', parseInt(localStorage.getItem('userID')));
        formData.append('FirstName', values.FirstName);
        formData.append('LastName', values.LastName);
        formData.append('Phones', JSON.stringify({ Phones: numbers ? numbers : this.state.Phones }));
        formData.append('DateCreated', moment(new Date()).format());
        formData.append('DateModified', moment(new Date()).format());
        formData.append('CreatedBy', parseInt(localStorage.getItem('userID')));
        formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')));
        formData.append('RideShareInterested', this.state.RideShareInterested);
        editUserProfile(formData).then(res => {
          this.setState({ loading: false }, () => {
            if (res.data.status === true) {
              Promise.all([getUserDetails(), getAddress()]).then(values => {
                if (values[0] && values[1] && values[0].status === 200 && values[1].status === 200) {
                  localStorage.setItem('userID', values[0].data.data.userId);
                  localStorage.setItem('userImage', values[0].data.data.pictureUrl)
                  localStorage.setItem('userName', values[0].data.data.firstName + " " + values[0].data.data.lastName);
                  if (values[0].data.data !== null) {
                    this.formRef.current.setFieldsValue({
                      FirstName: values[0].data.data.firstName,
                      LastName: values[0].data.data.lastName,
                    });
                  }
                  if (values[1].data.data !== null) {
                    this.formRef1.current.setFieldsValue({
                      Address1: values[1].data.data.address1,
                      Address2: values[1].data.data.address2,
                      City: values[1].data.data.city,
                      Province: values[1].data.data.province,
                      Country: values[1].data.data.country,
                      postalCode: values[1].data.data.postalCode,
                    });
                  }
                }
              });
              notification.success({
                message: 'Success',
                description: 'User data successfully updated!'
              });
            }
          });
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while updating user data!'
            });
          })
        });
      });
    }

    const updateAddress = (values) => {
      this.setState({ loading: true }, () => {
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
          DateModified: moment(new Date()).format()
        }
        saveUserAddress(data).then(res => {
          if (res.data.status === true) {
            this.setState({ loading: false }, () => {
              Promise.all([getUserDetails(), getAddress()]).then(values => {
                if (values[0] && values[1] && values[0].status === 200 && values[1].status === 200) {
                  if (this.formRef) {
                    this.formRef.current.setFieldsValue({
                      FirstName: values[0].data.data.firstName,
                      LastName: values[0].data.data.lastName,
                    });
                  }
                  if (this.formRef1) {
                    this.formRef1.current.setFieldsValue({
                      Address1: values[1].data.data.address1,
                      Address2: values[1].data.data.address2,
                      City: values[1].data.data.city,
                      Province: values[1].data.data.province,
                      Country: values[1].data.data.country,
                      postalCode: values[1].data.data.postalCode,
                    });
                  }
                }
              });
              notification.success({
                message: 'Success',
                description: 'User address successfully updated!'
              });
            });
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while updating address!'
            });
          });
        });
      });
    }

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"> <h1> Edit Profile </h1></div>
              <div className="com-padding">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <div className="crd-wrap mb-4">
                      <div className="inner-wrap-card">
                        <Form onFinish={updateUserProfile} ref={this.formRef}>
                          <Form.Item label="First Name" name="FirstName">
                            <Input />
                          </Form.Item>
                          <Form.Item label="Last Name" name="LastName">
                            <Input />
                          </Form.Item>
                          <label>Phone Number</label>
                          {this.state.Phones && this.state.Phones.map((phoneNumber, i) => (
                            <>
                              <div className="d-flex mb-2 align-items-center">
                                <Select defaultValue={phoneNumber.phoneType} onChange={(e) => this.handleMobileType(e, i)} >
                                  <Select.Option value="Mobile">Mobile</Select.Option>
                                  <Select.Option value="Home">Home</Select.Option>
                                  <Select.Option value="Work">Work</Select.Option>
                                </Select>
                                <Input name="phoneNo" value={phoneNumber.phoneNo} onChange={(e) => this.handleMobileNumbers(e.target.value, i)} />
                                <span className="delete-icon">
                                  <i className="fa fa-close" onClick={() => this.deletePhoneNumber(i)} style={{ cursor: "pointer" }}></i>
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
                            <input className="form-check-input" type="checkbox" checked={this.state.RideShareInterested} name="RideShareInterested" onChange={(e) => this.getCheckBoxValue(e.target.checked)} />
                            <label className="form-check-label">Interested in ride share to site</label>
                          </div>
                          <Form.Item>
                            <Button type="primary" htmlType="submit" className="btn btn-blue mt-2 mr-2 btnManufacturer">Update User Data</Button>
                            <Button className="btn btn-danger mt-2 btnManufacturer" onClick={() => this.cancelUserDetails()}>Cancel Changes</Button>
                          </Form.Item>
                        </Form>
                        <div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="crd-wrap">
                      <div className="inner-wrap-card">
                        <Form className="card-body" ref={this.formRef1} onFinish={updateAddress}>
                          <div className="form-group">
                            <label>Address Line 1</label>
                            <Form.Item name="Address1" rules={[{ required: true, message: 'Please input your Address Line 1!' }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>Address Line 2</label>
                            <Form.Item name="Address2" rules={[{ required: true, message: 'Please input your Address Line 2!' }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>City</label>
                            <Form.Item name="City" rules={[{ required: true, message: 'Please input your City!' }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>Province</label>
                            <Form.Item name="Province" rules={[{ required: true, message: 'Please input your Province!' }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>Country</label>
                            <Form.Item name="Country" rules={[{ required: true, message: 'Please input your Country!' }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>Postal Code</label>
                            <Form.Item name="postalCode" rules={[{ required: true, message: 'Please input your Postal Code!' }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <Form.Item>
                            <button type="submit" className="btn btn-blue login-submit mt-2 mr-2" >Update Address</button>
                            <Button type="reset" className="btn btn-danger mt-2" onClick={() => this.cancelAddress()}>Cancel Changes</Button>
                          </Form.Item>
                        </Form>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <Link to="/add-experience" className="add-btn btn-blue" ><i className="fas fa-plus-circle"></i> Add Experience</Link>
                    <div className="crd-wrap">
                      {this.state.experienceArray.length > 0 &&
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
                      }
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        }
      </>
    )
  }
}
