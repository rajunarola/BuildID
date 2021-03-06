import React, { Component } from 'react'
import { Form, Select, Spin, DatePicker, notification, Checkbox } from 'antd';
import { saveUserWorkHistory } from '../Services/Experience';
import debounce from 'lodash/debounce';
import moment from 'moment';
import Loader from '../Loader/Loader';
import Support from '../Support/Support';

export default class AddExperience extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.lastFetchId2 = 0;
    this.fetchSearchResult = debounce(this.fetchSearchResult, 800);
  }

  state = {
    data: [],
    fetching: false,
    data1: [],
    fetching1: false,
    data2: [],
    fetching2: false,
    CurrentCompany: false,
    IncludeInResume: false,
    loading: false
  };

  fetchSearchResult = (value, string) => {
    this.lastFetchId += 1;
    this.lastFetchId1 += 1;
    this.lastFetchId2 += 1;
    const fetchId = this.lastFetchId;
    const fetchId1 = this.lastFetchId1;
    const fetchId2 = this.lastFetchId2;
    if (string === 'trade') {
      this.setState({ data: [], fetching: true }, () => {
        fetch(process.env.REACT_APP_API_URL + `api/misc/GetTradesV1/${value}`).then(response => response.json()).then(body => {
          if (fetchId !== this.lastFetchId) {
            // for fetch callback order
            return;
          }
          const data = body.data.map(user => ({
            text: `${user.name}`,
            value: user.id,
          }));
          this.setState({ data, fetching: false });
        });
      });
    } else if (string === 'role') {
      this.setState({ data1: [], fetching1: true }, () => {
        fetch(process.env.REACT_APP_API_URL + `api/misc/GetRolesV1/${value}`).then(response => response.json()).then(body => {
          if (fetchId1 !== this.lastFetchId1) {
            // for fetch callback order
            return;
          }
          const data1 = body.data.map(user => ({
            text: `${user.name}`,
            value: user.id,
          }));
          this.setState({ data1, fetching1: false });
        });
      });
    } else if (string === 'company') {
      this.setState({ data2: [], fetching2: true }, () => {
        fetch(process.env.REACT_APP_API_URL + `api/companies/GetCompanies/${value}`).then(response => response.json()).then(body => {
          if (fetchId2 !== this.lastFetchId2) {
            // for fetch callback order
            return;
          }
          const data2 = body.data.map(user => ({
            text: `${user.name}`,
            value: user.id,
          }));
          this.setState({ data2, fetching2: false });
        });
      });
    }
  }

  getCheckBoxValue = (key, e) => {
    if (key === 'CurrentCompany') {
      this.setState({ CurrentCompany: e });
    } else if (key === 'IncludeInResume') {
      this.setState({ IncludeInResume: e });
    }
  }

  render() {

    const { fetching, data, fetching1, data1, fetching2, data2 } = this.state;

    const addExperienceTicket = values => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: 0,
          UserId: parseInt(localStorage.getItem('userID')),
          StartDate: moment(values.StartDate._d).format('YYYY-MM-DD'),
          EndDate: moment(values.EndDate._d).format('YYYY-MM-DD'),
          CompanyId: parseInt(values.companyName.value),
          TradeId: parseInt(values.tradeName.value),
          RoleId: parseInt(values.roleName.value),
          IncludeInResume: this.state.IncludeInResume,
          CurrentCompany: this.state.CurrentCompany,
          CreatedBy: parseInt(localStorage.getItem('userID')),
          ModifiedBy: parseInt(localStorage.getItem('userID')),
          DateCreated: moment(new Date()).format(),
          DateModified: moment(new Date()).format()
        }
        saveUserWorkHistory(data).then(res => {
          if (res.data.status === true) {
            this.setState({ loading: false }, () => {
              this.formRef.current.resetFields();
              notification.success({
                message: 'Success',
                description: 'Experience successfully added!'
              });
            })
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while adding new experience!'
            });
          });
        });
      });
    }

    return (

      <>
        {this.state.loading ? <Loader /> :
          <div className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Add Experience</h1>
                <Support dataParentToChild={this.props.location.pathname} history={this.props.history} />
              </div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header" id="ticketOne">
                    <h4>Add New Experience</h4>
                  </div>
                  <div className="container-fluid">
                    <div className="addticketform row">
                      <div className="col-md-12 p-0">
                        <Form className="card-body row" onFinish={addExperienceTicket} ref={this.formRef}>

                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label>Company</label>
                            <Form.Item className="m-0" name="companyName" rules={[{ required: true, message: 'Please select a company!' }]}>
                              <Select
                                showSearch
                                labelInValue
                                placeholder="Search Companies"
                                notFoundContent={fetching2 ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={(e) => this.fetchSearchResult(e, 'company')}
                                style={{ width: '100%' }}>
                                {data2.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label>Start Date</label>
                            <Form.Item className="m-0" name="StartDate" rules={[{ required: true, message: 'Please select a start date!' }]}>
                              <DatePicker className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label>End Date</label>
                            <Form.Item className="m-0" name="EndDate" rules={[{ required: true, message: 'Please select an end date!' }]}>
                              <DatePicker className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label>Trade</label>
                            <Form.Item className="m-0" name="tradeName" rules={[{ required: true, message: 'Please select a trade!' }]}>
                              <Select
                                showSearch
                                labelInValue
                                placeholder="Search Trades"
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={(e) => this.fetchSearchResult(e, 'trade')}
                                style={{ width: '100%' }}>
                                {data.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label>Role</label>
                            <Form.Item className="m-0" name="roleName" rules={[{ required: true, message: 'Please select a trade!' }]}>
                              <Select
                                showSearch
                                labelInValue
                                placeholder="Search Roles"
                                notFoundContent={fetching1 ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={(e) => this.fetchSearchResult(e, 'role')}
                                style={{ width: '100%' }}>
                                {data1.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-2 col-md-4 col-sm-6 d-flex align-items-center">
                            <Checkbox className="mt-sm-4" onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)} >I currently work here</Checkbox>
                          </div>
                          <div className="form-group col-lg-2 col-md-4 col-sm-6 d-flex align-items-center">
                            <Checkbox className="mt-sm-4" onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)}>Include In Resume</Checkbox>
                          </div>
                          <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                            <button type="submit" className="btn btn-blue btnManufacturer">Add Experience </button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        }
      </>
    )
  }
}
