import React, { Component } from 'react';
import { userProjects } from '../Services/CommonAPI';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import moment from 'moment';
import {
  getProjectManufacturers,
  getProjectCompany,
  saveNewCompanyInProject,
  saveNewManufacturerInProject,
  saveProjectPicture
} from '../Services/Project';
import debounce from 'lodash/debounce';
import { Select, Form, Spin, notification, Button } from 'antd';
import Loader from '../Loader/Loader';

export default class ProjectDetails extends Component {

  formRef = React.createRef();
  formRef1 = React.createRef();

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.fetchManufacturers = debounce(this.fetchManufacturers, 800);
    this.fetchCompany = debounce(this.fetchCompany, 800);
  }

  state = {
    projectName: '',
    projectDetails: [],
    pictureList: [],
    manufacturersData: [],
    companyData: [],
    data: [],
    fetching: false,
    data1: [],
    fetching1: false,
    saveNewImages: [],
    loading: false,
    addManufacturerData: [],
    addCompanyData: [],
    imageLength: 0
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([
        userProjects(this.props.match.params.id),
        getProjectManufacturers(this.props.match.params.id),
        getProjectCompany(this.props.match.params.id)
      ]).then((values) => {
        this.setState({
          projectDetails: values[0].data.data.project,
          pictureList: values[0].data.data.pictureList,
          projectName: values[0].data.data.project.name,
          manufacturersData: values[1].data.data,
          companyData: values[2].data.data,
          loading: false
        }, () => {
          console.log('this.state.manufacturersData => ', this.state.manufacturersData);
        });
      });
    })
  }

  fetchManufacturers = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
    fetch(process.env.REACT_APP_API_URL + `api/misc/Getmanufacturersv1/${value}`).then(response => response.json()).then(body => {
      if (fetchId !== this.lastFetchId) {
        // for fetch callback order
        return;
      }
      const data = body.data.map(user => ({
        text: `${user.name}`,
        value: user.id,
      }));
      this.state.addManufacturerData.map(id => {
        console.log('id => ', id, data.value);
        console.log('data => ', data, data.value !== id.manufacturerId);
        if (data.value !== id.manufacturerId) {
          this.setState({ data: data, fetching: false });

        } else {
          console.log('in else');
        }
      })
    });
  };

  handleChange = value => {
    this.setState({ addManufacturerData: value })
  };

  addfinal = () => {
    for (let index = 0; index < this.state.addManufacturerData.length; index++) {
      const element = this.state.addManufacturerData[index];
      const data = {
        Id: 0,
        ProjectId: parseInt(this.props.match.params.id),
        ManufacturerId: parseInt(element.value),
        ModifiedBy: parseInt(localStorage.getItem('userID'))
      }
      saveNewManufacturerInProject(data).then(res => {
        if (res.data && res.data.status === true) {
          this.formRef.current.resetFields();
          notification.success({
            message: 'Success',
            description: 'A new manufacturer has been added to the current project!'
          });
          getProjectManufacturers(this.props.match.params.id).then(res => {
            this.setState({ manufacturersData: res.data.data })
          }).catch(err => { });
        } else if (res.response.status === 400) {
          this.formRef.current.resetFields();
          notification.info({
            message: 'Error',
            description: 'This data already exists in database!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while adding a manufacturer to the current project!'
        });
      });
    }
  }

  fetchCompany = value => {
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId1;
    this.setState({ data1: [], fetching1: true });
    fetch(process.env.REACT_APP_API_URL + `api/companies/GetCompanies/${value}`).then(response => response.json()).then(body => {
      if (fetchId !== this.lastFetchId1) {
        // for fetch callback order
        return;
      }
      const data = body.data.map(user => ({
        text: `${user.name}`,
        value: user.id,
      }));
    });
  };

  handleCompanyChange = value => {
    this.setState({ addCompanyData: value })
  };

  addfinalCompany() {
    for (let index = 0; index < this.state.addCompanyData.length; index++) {
      const element = this.state.addCompanyData[index];
      const data = {
        Id: 0,
        ProjectId: parseInt(this.props.match.params.id),
        CompanyId: parseInt(element.value),
        ModifiedBy: parseInt(localStorage.getItem('userID'))
      }
      saveNewCompanyInProject(data).then(res => {
        if (res.data && res.data.status === true) {
          this.formRef1.current.resetFields();
          notification.success({
            message: 'Success',
            description: 'A new company has been added to the current project!'
          });
          getProjectCompany(this.props.match.params.id).then(res => {
            this.setState({ companyData: res.data.data })
          }).catch(err => { });
        } else if (res.response.status === 400) {
          this.formRef1.current.resetFields();
          notification.info({
            message: 'Error',
            description: 'This data already exists in database!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while adding a company to the current project!'
        });
      })
    }
  }

  addManufacuterer() {
    this.props.history.push(`/add-manufacturer?redirect=project-details/${this.props.match.params.id}`)
  }

  addCompany() {
    this.props.history.push(`/add-company?redirect=project-details/${this.props.match.params.id}`)
  }

  saveImage = (e) => {
    this.setState({ imageLength: e.target.files.length }, () => {
      console.log('this.state => ', this.state.imageLength);

      for (let index = 0; index < e.target.files.length; index++) {
        const element = e.target.files[index];
        console.log('element,index => ', e.target.files.length, index + 1);
        this.setState({ loading: true }, () => {
          const formData = new FormData();
          formData.append('Id', parseInt(this.props.match.params.id))
          formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')))
          formData.append('Photo', element)
          saveProjectPicture(formData).then(res => {
            if (res.data.status === true) {
              userProjects(this.props.match.params.id).then(Res => {
                if (Res.data.status === true) {
                  this.setState({ pictureList: Res.data.data.pictureList, loading: false }, () => {
                    notification.success({
                      message: 'Success',
                      description: 'An Image has been successfully added to the current project!'
                    });
                  })
                }
              })
            }
          }).catch(err => {
            notification.error({
              message: 'Error',
              description: 'There was an error while uploading an image to the current project!'
            });
          });
        });
      }
    })
  }

  render() {

    const { fetching, data, fetching1, data1 } = this.state;

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div class="edit-sec">
                <div class="editprofile"> Project Details</div>
              </div>
              <div className="addticketform com-padding">
                <div className="row">
                  {/*  Project Info  */}
                  <div className="col-lg-4 col-md-6 col-12">
                    <button type="button" className="add-btn btn-blue mb-4">
                      <label htmlFor="file" className="mb-0"><i className="fas fa-plus-circle"></i> Add Picture</label>
                    </button>
                    <input type="file" id="file" style={{ 'display': 'none' }} onChange={(e) => this.saveImage(e)} multiple />
                    <div className="form-border crd-wrp">
                      <div className="pro-img slider-main mb-2 embed-responsive">
                        <Carousel autoPlay>
                          {this.state.pictureList.map((data, index) => (
                            <img key="image" src={data.imageUrl} alt="" />
                          ))}
                        </Carousel>
                      </div>
                      <div className="pro-details">
                        <div className="wrap">
                          <h4>{this.state.projectName}</h4>
                        </div>
                      </div>
                      <div className="proj-timeline project-address-location">
                        <p className="stage-detail"><span className="stage-label">Address:</span> <span>{this.state.projectDetails && this.state.projectDetails.address}</span></p>
                        <p className="stage-detail"><span className="stage-label">City:</span> <span>{this.state.projectDetails && this.state.projectDetails.city}</span></p>
                        <p className="stage-detail"><span className="stage-label">Province:</span> <span>{this.state.projectDetails && this.state.projectDetails.province}</span></p>
                        <p className="stage-detail"><span className="stage-label">Country:</span> <span>{this.state.projectDetails && this.state.projectDetails.country}</span></p>
                        <p className="stage-detail"><span className="stage-label">Postal: </span> <span>{this.state.projectDetails && this.state.projectDetails.postalCode}</span></p>
                        <p className="stage-detail"><span className="stage-label">Start Date:</span> <span>{moment(this.state.projectDetails.startDate).format('DD-MM-YYYY')}</span></p>
                        <p className="stage-detail"><span className="stage-label">End Date:</span> <span>{moment(this.state.projectDetails.endDate).format('DD-MM-YYYY')}</span></p>
                        <p className="stage-detail"><span className="stage-label">Building Type: </span> <span>{this.state.projectDetails && this.state.projectDetails.buildingTypeName}</span></p>
                      </div>
                    </div>
                  </div>
                  { /* Manufacturer */}
                  <div className="col-lg-4 col-md-6 col-12">
                    <button className="add-btn btn-blue" onClick={() => this.addManufacuterer()}><i className="fas fa-plus-circle"></i> Add Manufacturer</button>
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <h4 className="k-card-title">MANUFACTURERS</h4>
                        <div className="manufacture-content">
                          {this.state.manufacturersData.map(data => (
                            <div className="k-custom-tag">{data.manufacturerName}</div>
                          ))}
                        </div>
                        <div className="manufacture-form manufacture-content pt-3">
                          <Form ref={this.formRef}>
                            <Form.Item name="manufacturerName">
                              <Select
                                key="manufacturer"
                                mode="multiple"
                                showSearch
                                labelInValue
                                placeholder="Search for a manufacturer"
                                notFoundContent={fetching ? <Spin size="small" /> : ""}
                                filterOption={false}
                                onSearch={(e) => this.fetchManufacturers(e)}
                                onChange={(e) => this.handleChange(e)}
                                style={{ width: '100%' }}>
                                {data.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Form>
                          <Button htmlType="button" onClick={() => this.addfinal()}>Add Manufacturer</Button>
                        </div>
                      </div>
                    </div>
                  </div>
                  { /* Company */}
                  <div className="col-lg-4 col-md-6 col-12">
                    <button className="add-btn btn-blue" onClick={() => this.addCompany()}><i className="fas fa-plus-circle"></i> Add Company</button>
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <h4 className="k-card-title">COMPANY</h4>
                        <div className="manufacture-content">
                          {this.state.companyData.map(data => (
                            <div className="k-custom-tag">{data.companyName}</div>
                          ))}
                        </div>
                        <div className="manufacture-form manufacture-content pt-3">
                          <Form ref={this.formRef1}>
                            <Form.Item name="companyName">
                              <Select
                                key="company"
                                mode="multiple"
                                showSearch
                                labelInValue
                                placeholder="Search for a comany"
                                notFoundContent={fetching1 ? <Spin size="small" /> : ""}
                                filterOption={false}
                                onSearch={(e) => this.fetchCompany(e)}
                                onChange={(e) => this.handleCompanyChange(e)}
                                style={{ width: '100%' }}>
                                {data1.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                            <Button htmlType="button" onClick={() => this.addfinalCompany()}>Add Company</Button>
                          </Form>
                        </div>
                      </div>
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
