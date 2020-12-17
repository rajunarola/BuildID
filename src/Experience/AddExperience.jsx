import React, { Component } from 'react'
import SideNav from '../SideNav/SideNav'
import { Form, Select, Spin, DatePicker, Button, notification } from 'antd';
import { saveUserWorkHistory } from '../Services/Experience';
import debounce from 'lodash/debounce';
import moment from 'moment';
export default class AddExperience extends Component {

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
        fetching2: '',
        StartDate: moment(new Date()),
        EndDate: moment(new Date()),
        CurrentCompany: false,
        IncludeInResume: false,
        companyId: '',
        roleId: '',
        tradeId: ''
    };

    fetchTrade = value => {
        console.log('fetching user', value);
        this.lastFetchId2 += 1;
        const fetchId = this.lastFetchId2;
        this.setState({ data2: [], fetching2: true });
        fetch(`https://bimiscwebapi-test.azurewebsites.net/api/misc/GetTradesV1/${value}`).then(response => response.json()).then(body => {
            if (fetchId !== this.lastFetchId2) {
                // for fetch callback order
                return;
            }
            const data2 = body.data.map(user => ({
                text: `${user.name}`,
                value: user.id,
            }));
            this.setState({ data2, fetching: false });
        });
    }


    fetchRole = value => {
        console.log('fetching user', value);
        this.lastFetchId1 += 1;
        const fetchId = this.lastFetchId1;
        this.setState({ data1: [], fetching1: true });
        fetch(`https://bimiscwebapi-test.azurewebsites.net/api/misc/GetRolesV1/${value}`).then(response => response.json()).then(body => {
            if (fetchId !== this.lastFetchId1) {
                // for fetch callback order
                return;
            }
            const data1 = body.data.map(user => ({
                text: `${user.name}`,
                value: user.id,
            }));
            this.setState({ data1, fetching: false });
            console.log('this.state => ', this.state);

        });
    }

    fetchCompany = value => {
        console.log('fetching user', value);
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        fetch(`https://bimiscwebapi-test.azurewebsites.net/api/companies/GetCompanies/${value}`).then(response => response.json()).then(body => {
            console.log('body => ', body);
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
    };

    handleChange = value => {
        this.setState({
            companyId: parseInt(value.value),
            value,
            data: [],
            fetching: false,
        });
    };

    handleChangeRole = value1 => {
        this.setState({
            roleId: parseInt(value1.value),
            value1,
            data1: [],
            fetching1: false,
        });
    };

    handleChangeTrade = value2 => {
        this.setState({
            tradeId: parseInt(value2.value),
            value2,
            data2: [],
            fetching2: false,
        });
    };

    getCheckBoxValue = (key, e) => {
        if (key === 'CurrentCompany') {
            this.setState({ CurrentCompany: e });
        } else if (key === 'IncludeInResume') {
            this.setState({ IncludeInResume: e });
        }
    }

    datePickerStartDate = (date) => {
        this.setState({ StartDate: date });
    }

    datePickerEndDate = (date) => {
        this.setState({ EndDate: date });
    }

    render() {

        const { fetching, data, value, fetching1, data1, value1, fetching2, data2, value2 } = this.state;

        const { Option } = Select;

        const addExperienceTicket = values => {
            const data = {
                Id: 0,
                UserId: parseInt(localStorage.getItem('userID')),
                StartDate: moment(values.StartDate).format('YYYY-MM-DD'),
                EndDate: moment(values.EndDate).format('YYYY-MM-DD'),
                CompanyId: this.state.companyId,
                TradeId: this.state.tradeId,
                RoleId: this.state.roleId,
                IncludeInResume: this.state.IncludeInResume,
                CurrentCompany: this.state.CurrentCompany,
                CreatedBy: parseInt(localStorage.getItem('userID')),
                ModifiedBy: parseInt(localStorage.getItem('userID')),
                DateCreated: moment(new Date()).format(),
                DateModified: moment(new Date()).format()
            }
            saveUserWorkHistory(data).then(res => {
                if (res.data.status === true) {
                    notification.open({
                        message: 'Success',
                        description: 'Experience successfully added!'
                    });
                    this.setState({
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
                        tradeId: ''
                    });
                }
            }).catch(err => {
                console.log('err => ', err);
                notification.open({
                    message: 'Error',
                    description: 'There was an error while adding new experience!'
                });
            });
        }

        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>Add Experience</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">
                            <Form className="card-body" onFinish={addExperienceTicket} >
                                <div className="form-group">
                                    <label>Company</label>
                                    <Select
                                        showSearch
                                        labelInValue
                                        value={value}
                                        placeholder="Search Companies"
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onSearch={(e) => this.fetchCompany(e)}
                                        onChange={(e) => this.handleChange(e)}
                                        style={{ width: '100%' }}>
                                        {data.map(d => (
                                            <Option key={d.value}>{d.text}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="form-group">
                                    <label>Start Date</label>
                                    <DatePicker value={moment(this.state.StartDate)} className="w-100 inputstyle" onChange={this.datePickerStartDate} name="StartDate" />
                                </div>
                                <div className="form-group">
                                    <label>End Date</label>
                                    <DatePicker value={moment(this.state.EndDate)} className="w-100 inputstyle" onChange={this.datePickerEndDate} name="EndDate" />
                                </div>
                                <div className="form-group check-wrap">
                                    <input className="form-check-input" type="checkbox" name="CurrentCompany" checked={this.state.CurrentCompany} onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)} />
                                    <label>I currently work here</label>
                                </div>
                                <div className="form-group">
                                    <label>Trade</label>
                                    <Select
                                        showSearch
                                        labelInValue
                                        value={value2}
                                        placeholder="Search Trades"
                                        notFoundContent={fetching2 ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onSearch={(e) => this.fetchTrade(e)}
                                        onChange={(e) => this.handleChangeTrade(e)}
                                        style={{ width: '100%' }}>
                                        {data2.map(d => (
                                            <Option key={d.value}>{d.text}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="form-group">
                                    <label>Role</label>
                                    <Select
                                        showSearch
                                        labelInValue
                                        value={value1}
                                        placeholder="Search Roles"
                                        notFoundContent={fetching1 ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onSearch={(e) => this.fetchRole(e)}
                                        onChange={(e) => this.handleChangeRole(e)}
                                        style={{ width: '100%' }}>
                                        {data1.map(d => (
                                            <Option key={d.value}>{d.text}</Option>
                                        ))}
                                    </Select>
                                </div>
                                <div className="form-group check-wrap">
                                    <input className="form-check-input" type="checkbox" name="IncludeInResume" checked={this.state.IncludeInResume} onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)} />
                                    <label>Include In Resume</label>
                                </div>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Add Experience </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
