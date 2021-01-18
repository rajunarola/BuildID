import React, { Component } from 'react';
import { Form, Select, Spin, DatePicker, notification, Checkbox } from 'antd';
import { saveUserWorkHistory, editAnExperience, getUserExperienceHistory } from '../Services/Experience';
import debounce from 'lodash/debounce';
import moment from 'moment';
export default class EditExperience extends Component {

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
    value: [],
    fetching: false,
    data1: [],
    value1: [],
    fetching1: false,
    data2: [],
    value2: [],
    fetching2: false,
    CurrentCompany: false,
    IncludeInResume: false
  };

  componentDidMount() {
    editAnExperience(localStorage.getItem('userID'), this.props.match.params.experienceId).then(res => {
      if (res.status === 200) {
        this.setState({
          CurrentCompany: res.data.data.currentCompany,
          IncludeInResume: res.data.data.includeInResume,
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
    }).catch(err => {
      notification.error({
        message: 'Error',
        description: 'There was an error while fetching experience details!'
      });
    });
  }

  fetchCompany = value => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true });
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
  };

  fetchRole = value => {
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId1;
    this.setState({ data1: [], fetching1: true });
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
  }

  fetchTrade = value => {
    this.lastFetchId2 += 1;
    const fetchId = this.lastFetchId2;
    this.setState({ data2: [], fetching2: true });
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
  }

  getCheckBoxValue = (key, e) => {
    if (key === 'CurrentCompany') {
      this.setState({ CurrentCompany: e });
    } else if (key === 'IncludeInResume') {
      this.setState({ IncludeInResume: e });
    }
  }

  cancelChanges = () => {
    getUserExperienceHistory().then(res => {
      res.data.data.map(id => {
        if (id.id === parseInt(this.props.match.params.experienceId)) {
          this.setState({
            CurrentCompany: id.currentCompany,
            IncludeInResume: id.includeInResume,
          }, () => {
            this.formRef.current.setFieldsValue({
              companyName: { value: id.companyId, label: id.companyName, key: id.companyId },
              roleName: { value: id.roleId, label: id.roleName, key: id.roleId },
              tradeName: { value: id.tradeId, label: id.tradeName, key: id.tradeId },
              StartDate: moment(moment(id.startDate).format('YYYY-MM-DD'), ('YYYY-MM-DD')),
              EndDate: moment(moment(id.endDate).format('YYYY-MM-DD'), ('YYYY-MM-DD')),
            });
          })
        }
      });
    });
  }

  render() {

    const { fetching, data, fetching1, data1, fetching2, data2 } = this.state;
    const { Option } = Select;

    const updateExperience = values => {
      const data = {
        Id: parseInt(this.props.match.params.experienceId),
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
          notification.success({
            message: 'Success',
            description: 'Experience updated successfully!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while updating the experience!'
        });
      });
    }

    return (

      <>
        <div className="index-main">
          <div className="edit-sec mt-80"><h2>Edit Experience</h2></div>
          <div className="addticketform ml-4">
            <div className="form-border p-4 w-30 mt-5 crd-wrap">
              <Form className="card-body" onFinish={updateExperience} ref={this.formRef}>
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
                  <Checkbox checked={this.state.CurrentCompany ? true === true : false}
                    onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)}>I currently work here </Checkbox>
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
                </div>
                <div className="form-group">
                  <Checkbox checked={this.state.IncludeInResume === true ? true : false}
                    onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)}>Include In Resume </Checkbox>
                </div>
                <button type="submit" className="btn btn-blue btnManufacturer mr-2">Update Experience </button>
                <button type="reset" onClick={() => this.cancelChanges()} className="btn btn-danger btnManufacturer">Cancel</button>
              </Form>
            </div>
          </div>
        </div>
      </>
    )
  }
}
