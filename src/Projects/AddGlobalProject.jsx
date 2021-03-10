import React, { Component } from 'react';
import Loader from '../Loader/Loader';
import { Form, Input, notification, Spin, Select } from 'antd';
import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import { addGlobalProject, getGoogleAPIKey, saveProjectPicture } from '../Services/Project';
import debounce from 'lodash/debounce';
export default class AddGlobalProject extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.fetchSearchedData = debounce(this.fetchSearchedData, 800);
    this.files = [];
  }

  state = {
    loading: false,
    googleAPIKey: '',
    data: [],
    fetching: false,
    data1: [],
    fetching1: false,
    projectId: '',
    gallery: [],
    newValue: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getGoogleAPIKey().then(res => {
        if (res.status === 200) {
          this.setState({ googleAPIKey: res.data.data, loading: false })
        }
      }).catch(res => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'Something went wrong! Please try again'
          });
        });
      });
    });
  }

  fetchSearchedData = (value, string) => {
    this.lastFetchId += 1;
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId;
    const fetchId1 = this.lastFetchId1;
    if (string === 'buildingType') {
      this.setState({ data: [], fetching: true }, () => {
        fetch(process.env.REACT_APP_API_URL + `api/projects/GetBuildingTypes/${value}`).then(response => response.json()).then(body => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = body.data.map(user => ({
            text: `${user.name}`,
            value: user.id,
          }));
          this.setState({ data: data, fetching: false });
        });
      });
    } else if (string === 'contractor') {
      this.setState({ data1: [], fetching1: true }, () => {
        fetch(process.env.REACT_APP_API_URL + `api/companies/GetCompanies//${value}`).then(response => response.json()).then(body => {
          if (fetchId1 !== this.lastFetchId1) {
            // for fetch callback order
            return;
          }
          const data = body.data.map(user => ({
            text: `${user.name}`,
            value: user.id,
          }));
          this.setState({ data1: data, fetching1: false });
        });
      });
    }
  };

  handleChange = (value, string) => {
    if (string === 'buildingType') {
      this.setState({ buildingTypeId: parseInt(value.value) })
    } else if (string === 'contractor') {
      this.setState({ contractor: value.label });
    }
  };

  onLocationSelect(result) {
    this.setState({ newValue: result }, () => {
      this.formRef.current.setFieldsValue({
        address: result.value.description,
        city: result.value.terms && result.value.terms[0] && result.value.terms[0].value,
        country: result.value.terms && result.value.terms[2] && result.value.terms[2].value,
        province: result.value.terms && result.value.terms[0] && result.value.terms[0].value
      });
    });
  }

  handleFile = ({ target }) => {
    if (!target.files) return;
    Array.prototype.forEach.call(target.files, (file) => {
      const { gallery } = this.state;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target: { result } }) => {
        gallery.push(result);
        this.setState({ gallery }, () => {
          this.files.push(file)
        })
      }
    })
  };

  removeImage = (i) => {
    const { gallery } = this.state;
    gallery.splice(i, 1);
    this.setState({ gallery });
  };

  removeAddress() {
    this.setState({ newValue: '' }, () => {
      this.formRef.current.setFieldsValue({
        address: "",
        city: "",
        country: "",
        postalCode: "",
        province: ""
      });
    });
  }

  render() {

    const { data, fetching, data1, fetching1, newValue } = this.state;

    const SaveImageAPI = () => {
      for (let index = 0; index < this.files.length; index++) {
        const element = this.files[index];
        const formData = new FormData();
        formData.append('Id', this.state.projectId);
        formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')));
        formData.append('Photo', element);
        saveProjectPicture(formData).then(res => {
          if (res.data.status === true) {
            if (index + 1 === this.files.length) {
              this.setState({ loading: false }, () => {
                notification.success({
                  message: 'Success',
                  description: 'A new project has been successfully added to the list of global projects!'
                });
              });
            }
          } else {
            this.setState({ loading: false }, () => {
              notification.error({
                message: 'Error',
                description: 'There was an error while uploading an image to the current project!'
              });
            });
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while uploading an image to the current project!'
            });
          });
        });
      }
    }

    const addProject = (values) => {
      this.setState({ loading: true }, () => {
        const formData = new FormData();
        formData.append('Id', 0);
        formData.append('Name', values.projectName);
        formData.append('Address', values.address);
        formData.append('City', values.city);
        formData.append('Province', values.province);
        formData.append('PostalCode', values.postalCode);
        formData.append('Country', values.country);
        formData.append('BuildingTypeId', parseInt(values.buildingType.value));
        formData.append('ContractorId', parseInt(values.contractor.value));
        formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')));
        addGlobalProject(formData).then(res => {
          if (res.data && res.data.status === true) {
            this.setState({ projectId: res.data.data }, () => {
              if (this.files && this.files.length > 0) {
                SaveImageAPI();
              } else {
                this.setState({ loading: false }, () => {
                  notification.success({
                    message: 'Success',
                    description: 'A new project has been successfully added to the list of global projects!'
                  });
                });
              }
            });
          } else {
            this.setState({ loading: false }, () => {
              notification.error({
                message: 'Error',
                description: 'There was an error while adding a new project to the list of global projects!'
              });
            });
          }
        }).catch(Err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while adding a new project to the list of global projects!'
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
              <div className="edit-sec"> <h1> Add Global Project </h1></div>
              <div className="newpage_section com-padding">
                <div className="crd-wrap">
                  <div className="crd-header">
                    <h4>Add Global Project </h4>
                  </div>
                  <div className="container-fluid">
                    <div className="addticketform row">
                      <div className="col-md-12 p-0">
                        <Form className="card-body row" ref={this.formRef} onFinish={addProject}>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel">Project Name</label>
                            <Form.Item name="projectName" rules={[{ required: true, message: 'Please enter Project Name!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel"> Search Project Address</label>
                            <div className="project_address_l">
                              <div className="w-100">
                                <GooglePlacesAutocomplete className="select-bx w-100" apiKey={this.state.googleAPIKey}
                                  selectProps={{
                                    placeholder: 'Enter City, State, Country',
                                    onChange: (value) => this.onLocationSelect(value),
                                    value: newValue
                                  }} />
                              </div>
                              <span className="delete-icon">
                                <i className="fa fa-close" onClick={() => this.removeAddress()} style={{ cursor: "pointer" }}></i>
                              </span>
                            </div>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel"> Address</label>
                            <Form.Item name="address" rules={[{ required: true, message: 'Please enter your address!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel"> City</label>
                            <Form.Item name="city" rules={[{ required: true, message: 'Please enter your city!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel"> Province</label>
                            <Form.Item name="province" rules={[{ required: true, message: 'Please enter your Province!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel"> Postal Code</label>
                            <Form.Item name="postalCode" rules={[{ required: true, message: 'Please enter your Postal Code!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel"> Country</label>
                            <Form.Item name="country" rules={[{ required: true, message: 'Please enter your Country!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel">Building Type</label>
                            <Form.Item name="buildingType" rules={[{ required: true, message: 'Please select Building Type!' }]}>
                              <Select
                                className="select-bx"
                                showSearch
                                labelInValue
                                placeholder="Search by building type"
                                notFoundContent={fetching ? <Spin size="small" /> : ""}
                                filterOption={false}
                                onSearch={(e) => this.fetchSearchedData(e, 'buildingType')}
                                onChange={(e) => this.handleChange(e, 'buildingType')}>
                                {data.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel">Contractor Name</label>
                            <Form.Item name="contractor" rules={[{ required: true, message: 'Please select Contractor Name!' }]}>
                              <Select
                                className="select-bx"
                                showSearch
                                labelInValue
                                placeholder="Search for a contractor"
                                notFoundContent={fetching1 ? <Spin size="small" /> : ""}
                                filterOption={false}
                                onSearch={(e) => this.fetchSearchedData(e, 'contractor')}
                                onChange={(e) => this.handleChange(e, 'contractor')}>
                                {data1.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>

                          <input type="file" id="file" style={{ 'display': 'none' }} onChange={this.handleFile} multiple />
                          <div className="gallery-content">
                            {this.state.gallery.map((res, e) => (
                              <div className="preview" key={res}>
                                <div className="gallary_bg_hn" htmlFor="gallery" style={{ backgroundImage: `url(${res})`, pointerEvents: 'none' }}>
                                  <div className="removeImage" onClick={() => this.removeImage(e)}>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white" xmlns="http://www.w3.org/2000/svg" >
                                      <path d="M1 9L5 5M9 1L5 5M5 5L1 1L9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                            <button type="button" className="add-btn btn-blue mr-3">
                              <label htmlFor="file" className="mb-0"><i className="fas fa-plus-circle"></i> Add Picture</label>
                            </button>
                            <button className="btn btn-blue mr-3" type="submit">Add Project</button>
                            <button className="btn btn-danger" onClick={() => this.props.history.push(`/search-project`)}>Cancel</button>
                          </div>
                        </Form>
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
