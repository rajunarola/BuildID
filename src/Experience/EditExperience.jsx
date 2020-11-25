import React, { Component } from 'react';
import SideNav from '../SideNav/SideNav';
import { Form, Select, Spin, DatePicker, Button, notification } from 'antd';
import { saveUserWorkHistory, editAnExperience } from '../Services/Experience';
import debounce from 'lodash/debounce';
import moment from 'moment';
export default class EditExperience extends Component {

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
        StartDate: moment(new Date()),
        EndDate: moment(new Date()),
        CurrentCompany: false,
        IncludeInResume: false,
        companyName: [],
        companyId: '',
        roleName: [],
        roleId: '',
        tradeName: [],
        tradeId: '',
        editData: [],
    };

    componentDidMount() {
        editAnExperience(parseInt(this.props.match.params.experienceId)).then(res => {
            if (res.status === 200) {
                this.setState({
                    value: res.data.data.companyName,
                    companyName: res.data.data.companyName,
                    companyId: res.data.data.companyId,
                    tradeName: res.data.data.tradeName,
                    roleName: res.data.data.roleName,
                    roleId: res.data.data.roleId,
                    tradeId: res.data.data.tradeId
                });
            }
        }).catch(err => {
            notification.open({
                message: 'Error',
                description: 'There was an error while fetching Experience Details!'
            });
        });
    }

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
            this.setState({ data2: data2, fetching: false });
        });
    }


    fetchRole = value => {
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
            this.setState({ data1: data1, fetching: false });
            // console.log('this.state => ', this.state);
        });
    }

    fetchCompany = value => {
        this.lastFetchId += 1;
        const fetchId = this.lastFetchId;
        this.setState({ data: [], fetching: true });
        fetch(`https://bimiscwebapi-test.azurewebsites.net/api/companies/GetCompanies/${value}`).then(response => response.json()).then(body => {
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

    handleChange = value => {
        this.state.data.map(data => {
            if (data.value === parseInt(value)) {
                this.setState({
                    companyName: data.text,
                    companyId: parseInt(data.value),
                    value,
                    data: [],
                    fetching: false,
                });
                setTimeout(() => {
                    // console.log('this.state.companyId => ', this.state.companyId);
                }, 1000);
            }
        });
    };

    handleChangeRole = value1 => {
        this.state.data1.map(data => {
            if (data.value === value1) {
                this.setState({
                    roleName: data.text,
                    roleId: parseInt(data.value),
                    value1,
                    data1: [],
                    fetching1: false,
                });
                setTimeout(() => {
                    // console.log('this.state.roleId => ', this.state.roleId);
                }, 1000);
            }
        });
    };

    handleChangeTrade = value2 => {
        this.state.data2.map(data => {
            if (data.value === value2) {
                this.setState({
                    tradeName: data.text,
                    tradeId: parseInt(data.value),
                    value2,
                    data2: [],
                    fetching2: false,
                });
                setTimeout(() => {
                    // console.log('this.state.tradeId => ', this.state.tradeId);
                }, 1000);
            }
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

    cancelChanges = () => {
        getUserWorkHistory().then(res => {
            res.data.data.map(id => {
                if (id.id === parseInt(this.props.match.params.id)) {
                    this.setState({ value: id.companyName })
                    this.setState({
                        companyName: id.companyName,
                        companyId: id.companyId,
                        tradeName: id.tradeName,
                        roleName: id.roleName,
                        roleId: id.roleId,
                        tradeId: id.tradeId
                    });
                }
            });
        });
    }

    render() {

        const { fetching, data, fetching1, data1, fetching2, data2 } = this.state;

        const { Option } = Select;

        const updateExperience = values => {
            const data = {
                Id: this.props.match.params.id,
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
            console.log('date => ', data);
            saveUserWorkHistory(data).then(res => {
                if (res.data.status === true) {
                    notification.open({
                        message: 'Success',
                        description: 'Experience updated successfully!'
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
                notification.open({
                    message: 'Error',
                    description: 'There was an error while updating the experience!'
                });
            });
        }

        return (
            <div>
                <SideNav />
                <div className="index-main">
                    <div className="edit-sec mt-80"><h2>Edit Experience</h2></div>
                    <div className="addticketform ml-4">
                        <div className="form-border p-4 w-30 mt-5 crd-wrap">
                            <Form className="card-body" onFinish={updateExperience}>
                                <div className="form-group">
                                    <label>Company</label>
                                    <Select
                                        showSearch
                                        value={this.state.companyName}
                                        placeholder="Search Companies"
                                        notFoundContent={fetching ? <Spin size="small" /> : null}
                                        filterOption={false}
                                        onSearch={(e) => this.fetchCompany(e)}
                                        onChange={(e) => this.handleChange(e)}
                                        style={{ width: '100%' }}>
                                        {data.map(d => (
                                            <Select.Option key={d.value}>{d.text}</Select.Option>
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
                                <div className="form-group">
                                    <label className="ml-4 mt-1">
                                        <input className="form-check-input" type="checkbox" name="CurrentCompany" checked={this.state.CurrentCompany} onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)} />
                                    Current Company
                                    </label>
                                </div>
                                <div className="form-group">
                                    <label>Trade</label>
                                    <Select
                                        showSearch
                                        value={this.state.tradeName}
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
                                        value={this.state.roleName}
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
                                <div className="form-group">
                                    <label className="ml-4 mt-1">
                                        <input className="form-check-input" type="checkbox" name="IncludeInResume" checked={this.state.IncludeInResume} onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)} />
                                    Include In Resume
                                    </label>
                                </div>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="mr-2">Update Experience </Button>
                                    <Button type="primary" htmlType="reset" onClick={() => this.cancelChanges()} danger>Cancel</Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
