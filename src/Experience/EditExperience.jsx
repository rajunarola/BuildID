import React, { Component } from 'react';
import SideNav from '../SideNav/SideNav';
import { Form, Select, Spin, DatePicker, Button, notification } from 'antd';
import { getUserWorkHistory, saveUserWorkHistory } from '../Services/Experience';
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
        fetching2: '',
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
        getUserWorkHistory().then(res => {
            console.log('res => ', res, this.props.match.params.id);
            res.data.data.map(id => {
                console.log('id => ', id.id);
                if (id.id === parseInt(this.props.match.params.id)) {
                    // console.log('true => ',);
                    this.setState({ value: id.companyName })
                    this.setState({ companyName: id.companyName, companyId: id.companyId, tradeName: id.tradeName, roleName: id.roleName })
                    console.log('this.state.editData => ', this.state.companyName);

                }
            })
        })
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
            this.setState({ data1: data1, fetching: false });
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
            this.setState({ data: data, fetching: false });
        });
    };

    handleChange = value => {
        this.state.data.map(data => {
            if (data.value === parseInt(value)) {
                this.setState({
                    companyName: data.text,
                    companyId: data.value,
                    value,
                    data: [],
                    fetching: false,
                });
                setTimeout(() => {
                    console.log('this.state.companyId => ', this.state.companyId);
                }, 1000);
            }
        });
    };

    handleChangeRole = value1 => {
        this.state.data1.map(data => {
            if (data.value === value1) {
                this.setState({
                    roleName: data.text,
                    roleId: data.value,
                    value1,
                    data1: [],
                    fetching1: false,
                });
                setTimeout(() => {
                    console.log('this.state.roleId => ', this.state.roleId);
                }, 1000);
            }
        });
    };

    handleChangeTrade = value2 => {
        this.state.data2.map(data => {
            if (data.value === value2) {
                this.setState({
                    tradeName: data.text,
                    tradeId: data.value,
                    value2,
                    data2: [],
                    fetching2: false,
                });
                setTimeout(() => {
                    console.log('this.state.tradeId => ', this.state.tradeId);
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

    render() {

        const { fetching, data, value, fetching1, data1, value1, fetching2, data2, value2 } = this.state;

        const { Option } = Select;

        const updateExperience = values => {
            const data = {
                Id: this.props.match.params.id,
                UserId: localStorage.getItem('userID'),
                StartDate: moment(values.StartDate).format('YYYY-MM-DD'),
                EndDate: moment(values.EndDate).format('YYYY-MM-DD'),
                CompanyId: this.state.companyId,
                TradeId: this.state.tradeId,
                RoleId: this.state.roleId,
                IncludeInResume: this.state.IncludeInResume,
                CurrentCompany: this.state.CurrentCompany,
                CreatedBy: localStorage.getItem('userID'),
                ModifiedBy: localStorage.getItem('userID'),
                DateCreated: moment(new Date()).format(),
                DateModified: moment(new Date()).format()
            }
            saveUserWorkHistory(data).then(res => {
                if (res.data.status === true) {
                    notification.open({
                        message: 'Success',
                        description: 'Experience updated added!'
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
                    description: 'There was an error while updating new experience!'
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
                                    <label>Current Company</label>
                                    <input className="form-check-input" type="checkbox" name="CurrentCompany" checked={this.state.CurrentCompany} onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)} />
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
                                    <label>Include In Resume</label>
                                    <input className="form-check-input" type="checkbox" name="IncludeInResume" checked={this.state.IncludeInResume} onChange={(e) => this.getCheckBoxValue('IncludeInResume', e.target.checked)} />
                                </div>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">Update Experience </Button>
                                </Form.Item>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
