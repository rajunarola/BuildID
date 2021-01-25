import React, { Component } from 'react'
import debounce from 'lodash/debounce';
import { Select, Form, Spin, Input, Button } from 'antd';
import { getSearchProjectsBy } from '../Services/Project';
import GooglePlacesAutocomplete from "react-google-places-autocomplete";

export default class AddProject extends Component {

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
    contractor: ''
  }

  fetchBuildingType = (value, string) => {
    this.lastFetchId += 1;
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId;
    const fetchId1 = this.lastFetchId1;
    if (string === 'buildingType') {
      this.setState({ data: [], fetching: true }, () => {
        fetch(process.env.REACT_APP_API_URL + `api/projects/GetBuildingTypes/${value}`).then(response => response.json()).then(body => {
          console.log('body => ', body);
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
          console.log('body => ', body);
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
    console.log('hi', result);
  }

  render() {

    const { data, fetching, data1, fetching1 } = this.state;

    const fetchProjectBySearch = (value) => {
      console.log('hi');
      const data = {
        CityProv: "",
        ProjectName: value.projectName,
        BuildingTypeId: this.state.buildingTypeId,
        ContractorName: this.state.contractor
      }
      this.props.history.push(`/select-project`)
      // getSearchProjectsBy(data).then(Res => {
      //   console.log('Res => ', Res);

      // }).catch(Err => {
      //   console.log('Err => ', Err);

      // });
    }

    return (
      <>
        <main className="index-main">
          <section className="index-sec">
            <div className="edit-sec">
              <div className="editprofile">Add Project</div>
            </div>
            <div className="addticketform com-padding">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-border crd-wrp">
                    <div className="proj-timeline">
                      <h4 className="k-card-title">Search Projects</h4>
                      <div className="manufacture-form manufacture-content pt-3">
                        <Form onFinish={fetchProjectBySearch}>
                          <Form.Item name="projectName">
                            <Input placeholder="Enter Project Name" />
                          </Form.Item>
                          <div className="suggestion-input">
                            <GooglePlacesAutocomplete
                              selectProps={{
                                onChange: (result) => this.onLocationSelect(result),
                              }}
                              placeholder="Type in an address"
                            />
                          </div>
                          <Form.Item name="buildingType">
                            <Select
                              showSearch
                              labelInValue
                              placeholder="Search by building type"
                              notFoundContent={fetching ? <Spin size="small" /> : ""}
                              filterOption={false}
                              onSearch={(e) => this.fetchBuildingType(e, 'buildingType')}
                              onChange={(e) => this.handleChange(e, 'buildingType')}>
                              {data.map(d => (
                                <Select.Option key={d.value}>{d.text}</Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Form.Item name="projectSearch">
                            <Select
                              showSearch
                              labelInValue
                              placeholder="Search for a contractor"
                              notFoundContent={fetching1 ? <Spin size="small" /> : ""}
                              filterOption={false}
                              onSearch={(e) => this.fetchBuildingType(e, 'contractor')}
                              onChange={(e) => this.handleChange(e, 'contractor')}>
                              {data1.map(d => (
                                <Select.Option key={d.value}>{d.text}</Select.Option>
                              ))}
                            </Select>
                          </Form.Item>
                          <Button className="btn btn-blue" htmlType="submit">Search</Button>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    )
  }
}
