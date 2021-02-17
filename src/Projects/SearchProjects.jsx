import React, { Component } from 'react';
import debounce from 'lodash/debounce';
import { Select, Form, Spin, Input, notification } from 'antd';
import { getGoogleAPIKey, searchProjectsBy } from '../Services/Project';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
export default class SearchProjects extends Component {

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.fetchBuildingType = debounce(this.fetchBuildingType, 800);
  }

  state = {
    data: [],
    fetching: false,
    data1: [],
    fetching1: false,
    buildingTypeId: '',
    contractor: '',
    cityName: '',
    projectName: '',
    resultofSearchedProject: [],
    emptySearchResult: '',
    loading: false,
    googleAPIKey: ''
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

  fetchBuildingType = (value, string) => {
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
    this.setState({ cityName: result.value.structured_formatting.main_text })
  }

  fetchProjectId = (data) => {
    localStorage.setItem('projectId', data.id)
    localStorage.setItem('projectName', data.name)
    this.props.history.push('/searched-project')
  }

  render() {

    const { data, fetching, data1, fetching1 } = this.state;

    const fetchProjectBySearch = (value) => {
      this.setState({ projectName: value.projectName === undefined ? "" : value.projectName }, () => {
        searchProjectsBy(this.state.cityName, this.state.projectName, this.state.buildingTypeId, this.state.contractor).then(Res => {
          if (Res.status === 200 && Res.data.data.length > 0) {
            this.setState({ resultofSearchedProject: Res.data.data, emptySearchResult: '' });
          } else if (Res.status === 200 && Res.data.data.length === 0) {
            this.setState({ emptySearchResult: 'Search Result is Empty', resultofSearchedProject: [] });
          }
        }).catch(Err => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching searched project!'
          });
        });
      });
    }

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec">
                {/* <div className="editprofile">Search Project</div> */}
              </div>
              <div className="addticketform com-padding">
                <div className="row">
                  <div className="col-12">
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <h4 className="k-card-title">Search Projects</h4>
                        <div className="manufacture-form manufacture-content seaerchForms pt-3">
                          <div className="header-title-btn">
                            <p className="note_infor">Can't find your project ?
                              <Link to="/add-project" className="color-danger ml-1">
                                Click here to add new project
                              </Link> or come back later as hundreds of projects are getting added everyday.
                            </p>
                          </div>
                          <div className="add-btn-list my-4 text-right">
                            <button type="button" className="btn btn-blue"
                              onClick={() => this.props.history.push(`/add-building-type?redirect=search-project`)}>
                              Add Building Type
                              </button>
                            <button type="button" className="btn btn-blue ml-3"
                              onClick={() => this.props.history.push(`/add-company?redirect=search-project`)}>
                              Add Company
                              </button>
                          </div>
                          <Form onFinish={fetchProjectBySearch}>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-12 col-lg-6">
                                    <Form.Item name="projectName">
                                      <Input placeholder="Enter Project Name" />
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-lg-6">
                                    <div className="suggestion-input">
                                      <GooglePlacesAutocomplete
                                        className="select-bx"
                                        apiKey={this.state.googleAPIKey}
                                        selectProps={{
                                          placeholder: 'Enter City, State, Country',
                                          onChange: (result) => this.onLocationSelect(result)
                                        }} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="row">
                                  <div className="col-12 col-lg-6">
                                    <Form.Item name="buildingType">
                                      <Select
                                        className="select-bx"
                                        showSearch
                                        labelInValue
                                        placeholder="Search by Building Type"
                                        notFoundContent={fetching ? <Spin size="small" /> : ""}
                                        filterOption={false}
                                        onSearch={(e) => this.fetchBuildingType(e, 'buildingType')}
                                        onChange={(e) => this.handleChange(e, 'buildingType')}>
                                        {data.map(d => (
                                          <Select.Option key={d.value}>{d.text}</Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                  <div className="col-12 col-lg-6">
                                    <Form.Item name="projectSearch">
                                      <Select
                                        className="select-bx"
                                        showSearch
                                        labelInValue
                                        placeholder="Search for a Contractor"
                                        notFoundContent={fetching1 ? <Spin size="small" /> : ""}
                                        filterOption={false}
                                        onSearch={(e) => this.fetchBuildingType(e, 'contractor')}
                                        onChange={(e) => this.handleChange(e, 'contractor')}>
                                        {data1.map(d => (
                                          <Select.Option key={d.value}>{d.text}</Select.Option>
                                        ))}
                                      </Select>
                                    </Form.Item>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 text-center">
                              <button className="add-btn btn-Search" type="submit">Search</button>
                            </div>
                          </Form>
                          {this.state.resultofSearchedProject && this.state.resultofSearchedProject.length > 0 &&
                            <>
                              <div className="search-list-sec">
                                <h4 className="mb-4">Search Result</h4>
                                <div className="row">
                                  {this.state.resultofSearchedProject.map(res => (
                                    <div className="col-12 col-md-6 col-lg-3">
                                      <p className="sls-list" onClick={() => this.fetchProjectId(res)}>{res.name}</p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </>
                          }
                          {this.state.emptySearchResult}
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
