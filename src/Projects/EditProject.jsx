import React, { Component } from 'react';
import { getUserWorkExperience } from '../Services/CommonAPI';
import { Form, Select, DatePicker, Checkbox, Spin, notification } from 'antd';
import moment from 'moment';
import debounce from 'lodash/debounce';
import Loader from '../Loader/Loader';
import { postSaveUserWorkHistory } from '../Services/Project';
export default class EditProject extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.lastFetchId2 = 0;
    this.fetchCompany = debounce(this.fetchCompany, 800);
    this.fetchRole = debounce(this.fetchRole, 800);
    this.fetchTrade = debounce(this.fetchTrade, 800);
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
    loading: false,
    projectName: '',
    projectId: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getUserWorkExperience(parseInt(this.props.match.params.id)).then(res => {
        if (res.status === 200) {
          this.setState({
            CurrentCompany: res.data.data.currentCompany,
            IncludeInResume: res.data.data.includeInResume,
            loading: false,
            projectName: res.data.data.projectName,
            projectId: res.data.data.projectId
          }, () => {
            this.formRef.current.setFieldsValue({
              companyName: { value: res.data.data.companyId, label: res.data.data.companyName, key: res.data.data.companyId },
              roleName: { value: res.data.data.roleId, label: res.data.data.roleName, key: res.data.data.roleId },
              tradeName: { value: res.data.data.tradeId, label: res.data.data.tradeName, key: res.data.data.tradeId },
              StartDate: moment(moment(res.data.data.startDate).format('YYYY-MM-DD'), ('YYYY-MM-DD')),
              EndDate: moment(moment(res.data.data.endDate).format('YYYY-MM-DD'), ('YYYY-MM-DD')),
            });
          });
        }
      }).catch(Err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching project details!'
          });
        });
      });
    });
  }

  fetchCompany = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true }, () => {
      fetch(process.env.REACT_APP_API_URL + `api/companies/GetCompanies/${value}`).then(response => response.json()).then(body => {
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
  };

  fetchRole = value => {
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId1;
    this.setState({ data1: [], fetching1: true }, () => {
      fetch(process.env.REACT_APP_API_URL + `api/misc/GetRolesV1/${value}`).then(response => response.json()).then(body => {
        if (fetchId !== this.lastFetchId1) {
          // for fetch callback order
          return;
        }
        const data1 = body.data.map(user => ({
          text: `${user.name}`,
          value: user.id,
        }));
        this.setState({ data1: data1, fetching1: false });
      });
    });
  }

  fetchTrade = value => {
    this.lastFetchId2 += 1;
    const fetchId = this.lastFetchId2;
    this.setState({ data2: [], fetching2: true }, () => {
      fetch(process.env.REACT_APP_API_URL + `api/misc/GetTradesV1/${value}`).then(response => response.json()).then(body => {
        if (fetchId !== this.lastFetchId2) {
          // for fetch callback order
          return;
        }
        const data2 = body.data.map(user => ({
          text: `${user.name}`,
          value: user.id,
        }));
        this.setState({ data2: data2, fetching2: false });
      });
    });
  }

  getCheckBoxValue = (key, e) => {
    if (key === 'CurrentCompany') {
      this.setState({ CurrentCompany: e });
    } else if (key === 'IncludeInResume') {
      this.setState({ IncludeInResume: e });
    }
  }

  cancelChanges = () => {
    this.props.history.push("/projects");
  }

  render() {

    const { fetching, data, fetching1, data1, fetching2, data2, projectName } = this.state;
    const { Option } = Select;

    const updateProjectDetails = values => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: parseInt(this.props.match.params.id),
          UserId: parseInt(localStorage.getItem('userID')),
          ProjectId: this.state.projectId,
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
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Success',
                description: 'Project Updated Successfully!'
              });
              this.props.history.push(`/projects`);
            });
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while updating the project details!'
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
              <div className="edit-sec">
                <div className="editprofile">Edit Project Details</div>
              </div>
              <div className="addticketform com-padding">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <h4 className="k-card-title">{projectName}</h4>
                        <div className="manufacture-form manufacture-content pt-3">
                          <Form ref={this.formRef} onFinish={updateProjectDetails}>
                            <div className="form-group">
                              <label>Company</label>
                              <Form.Item name="companyName">
                                <Select
                                  showSearch
                                  labelInValue
                                  placeholder="Search Companies"
                                  notFoundContent={fetching ? <Spin size="small" /> : null}
                                  filterOption={false}
                                  onSearch={(e) => this.fetchCompany(e)}
                                  style={{ width: '100%' }}>
                                  {data.map(d => (
                                    <Select.Option key={d.value}>{d.text}</Select.Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <button type="button" className="btn btn-blue"
                                onClick={() =>
                                  this.props.history.push(`/add-company?redirect=edit-project/${this.props.match.params.id}`
                                  )}>
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                            <div className="form-group">
                              <label>Role</label>
                              <Form.Item name="roleName">
                                <Select
                                  showSearch
                                  labelInValue
                                  placeholder="Search Roles"
                                  notFoundContent={fetching1 ? <Spin size="small" /> : null}
                                  filterOption={false}
                                  onSearch={(e) => this.fetchRole(e)}
                                  style={{ width: '100%' }}>
                                  {data1.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <button type="button" className="btn btn-blue"
                                onClick={() =>
                                  this.props.history.push(`/add-role?redirect=edit-project/${this.props.match.params.id}`
                                  )}>
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                            <div className="form-group">
                              <label>Trade</label>
                              <Form.Item name="tradeName">
                                <Select
                                  showSearch
                                  labelInValue
                                  placeholder="Search Trades"
                                  notFoundContent={fetching2 ? <Spin size="small" /> : null}
                                  filterOption={false}
                                  onSearch={(e) => this.fetchTrade(e)}
                                  style={{ width: '100%' }}>
                                  {data2.map(d => (
                                    <Option key={d.value}>{d.text}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                              <button type="button" className="btn btn-blue"
                                onClick={() =>
                                  this.props.history.push(`/add-trade?redirect=edit-project/${this.props.match.params.id}`
                                  )}>
                                <i className="fa fa-plus"></i>
                              </button>
                            </div>
                            <div className="form-group">
                              <Checkbox checked={this.state.CurrentCompany}
                                onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)}>Present
                              </Checkbox>
                            </div>
                            <div className="form-group">
                              <label>Start Date</label>
                              <Form.Item name="StartDate">
                                <DatePicker className="w-100 inputstyle" />
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <label>End Date</label>
                              <Form.Item name="EndDate">
                                <DatePicker className="w-100 inputstyle" />
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <Checkbox checked={this.state.IncludeInResume}
                                onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)}>Include In Resume
                              </Checkbox>
                            </div>
                            <div className="d-flex mt-3 mb-4">
                              <button type="submit" className="btn btn-blue btnManufacturer mr-2">Update Project Details </button>
                              <button type="reset" onClick={() => this.cancelChanges()} className="btn btn-danger btnManufacturer">Cancel</button>
                            </div>
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
