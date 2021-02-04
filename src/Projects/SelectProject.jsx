import React, { Component } from 'react'
import { DatePicker, Form, Select, Checkbox, Spin, notification } from 'antd'
import debounce from 'lodash/debounce';
import moment from 'moment';
import { postSaveUserWorkHistory } from '../Services/Project';
import { withRouter } from 'react-router-dom';
class SelectProject extends Component {

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.lastFetchId2 = 0;
    this.fetchSelectData = debounce(this.fetchSelectData, 800);
  }

  state = {
    data: [],
    fetching: false,
    data1: [],
    fetching1: false,
    data2: [],
    fetching2: false,
    Present: false,
    IncludeInResume: false
  };

  fetchSelectData = (value, string) => {
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

  componentWillUnmount() {
    localStorage.removeItem('projectId')
  }

  render() {

    const { fetching, data, fetching1, data1, fetching2, data2 } = this.state;

    const saveWorkHistory = values => {
      const data = {
        Id: 0,
        UserId: parseInt(localStorage.getItem('userID')),
        ProjectId: parseInt(localStorage.getItem('projectId')),
        StartDate: moment(values.StartDate._d).format('YYYY-MM-DD'),
        EndDate: moment(values.EndDate._d).format('YYYY-MM-DD'),
        TradeId: parseInt(values.tradeName.value),
        CompanyId: parseInt(values.companyName.value),
        RoleId: parseInt(values.roleName.value),
        ModifiedBy: parseInt(localStorage.getItem('userID')),
        IncludeInResume: this.state.IncludeInResume,
        Present: this.state.CurrentCompany,
      }
      postSaveUserWorkHistory(data).then(res => {
        if (res.data.status === true) {
          notification.success({
            message: 'Success',
            description: 'Project has been successfully added!'
          });
          this.props.history.push(`/projects`);
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while adding new project!'
        });
      });
    }

    return (
      <>
        <main className="index-main">
          <section className="index-sec">
            <div className="edit-sec">
              <div className="editprofile">Add Project Details</div>
            </div>
            <div className="addticketform com-padding">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  <div className="form-border crd-wrp">
                    <div className="proj-timeline">
                      {/* <h4 className="k-card-title">View Projects</h4> */}
                      <div className="manufacture-form manufacture-content pt-3">
                        <Form onFinish={saveWorkHistory}>
                          <div className="form-group">
                            <label>Start Date</label>
                            <Form.Item name="StartDate" rules={[{ required: true, message: 'Please select a start date!' }]}>
                              <DatePicker className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>End Date</label>
                            <Form.Item name="EndDate" rules={[{ required: true, message: 'Please select an end date!' }]}>
                              <DatePicker className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <Checkbox onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)} >Present</Checkbox>
                          </div>
                          <div className="form-group">
                            <label>Trade</label>
                            <Form.Item name="tradeName" rules={[{ required: true, message: 'Please select a trade!' }]}>
                              <Select
                                showSearch
                                labelInValue
                                placeholder="Search Trades"
                                notFoundContent={fetching ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={(e) => this.fetchSelectData(e, 'trade')}
                                style={{ width: '100%' }}>
                                {data.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>Role</label>
                            <Form.Item name="roleName" rules={[{ required: true, message: 'Please select a trade!' }]}>
                              <Select
                                showSearch
                                labelInValue
                                placeholder="Search Roles"
                                notFoundContent={fetching1 ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={(e) => this.fetchSelectData(e, 'role')}
                                style={{ width: '100%' }}>
                                {data1.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <label>Company</label>
                            <Form.Item name="companyName" rules={[{ required: true, message: 'Please select a company!' }]}>
                              <Select
                                showSearch
                                labelInValue
                                placeholder="Search Companies"
                                notFoundContent={fetching2 ? <Spin size="small" /> : null}
                                filterOption={false}
                                onSearch={(e) => this.fetchSelectData(e, 'company')}
                                style={{ width: '100%' }}>
                                {data2.map(d => (
                                  <Select.Option key={d.value}>{d.text}</Select.Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </div>
                          <div className="form-group">
                            <Form.Item name="IncludeInResume">
                              <Checkbox onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)}>Include In Resume</Checkbox>
                            </Form.Item>
                          </div>

                          <button className="btn btn-blue mr-3 mb-3" type="submit">Add Project To Timeline</button>
                          <button className="btn btn-danger" onClick={() => this.props.history.push(`/search-project`)}>Cancel</button>
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

export default withRouter(SelectProject);