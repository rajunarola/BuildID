import React, { Component } from 'react';
import SideNav from '../SideNav/SideNav';
import { Form, Select, Spin, DatePicker, Button, notification } from 'antd';
import { saveUserWorkHistory, editAnExperience, getUserExperienceHistory } from '../Services/Experience';
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

    formRef = React.createRef()

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
        editAnExperience(localStorage.getItem('userID'), this.props.match.params.experienceId).then(res => {
            if (res.data.data === null) {
                notification.open({
                    message: 'Error',
                    description: 'No Data for this experience'
                });
            }
            if (res.status === 200) {
                this.setState({
                    CurrentCompany: res.data.data.currentCompany,
                    IncludeInResume: res.data.data.includeInResume,
                    companyId: res.data.data.companyId,
                    tradeId: res.data.data.tradeId,
                    roleId: res.data.data.roleId,

                });
                if (this.formRef) {
                    this.formRef.current.setFieldsValue({
                        companyName: { value: res.data.data.companyId, label: res.data.data.companyName, key: res.data.data.companyId },
                        roleName: { value: res.data.data.roleId, label: res.data.data.roleName, key: res.data.data.roleId },
                        tradeName: { value: res.data.data.tradeId, label: res.data.data.tradeName, key: res.data.data.tradeId }
                    });
                }
            }
        }).catch(err => {
            notification.open({
                message: 'Error',
                description: 'There was an error while fetching Experience Details!'
            });
        });
    }

    fetchTrade = value => {
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
        this.setState({ companyId: parseInt(value.value) }, () => {
            this.formRef.current.setFieldsValue({
                companyName: { value: value.value, label: value.label, key: value.key },
            });
        })
    };

    handleChangeRole = value1 => {
        this.setState({ roleId: parseInt(value1.value) }, () => {
            this.formRef.current.setFieldsValue({
                roleName: { value: value1.value, label: value1.label, key: value1.key },
            });
        });
    };

    handleChangeTrade = value2 => {
        this.setState({ tradeId: parseInt(value2.value) }, () => {
            this.formRef.current.setFieldsValue({
                tradeName: { value: value2.value, label: value2.label, key: value2.key },
            });
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
        getUserExperienceHistory().then(res => {
            res.data.data.map(id => {
                if (id.id === parseInt(this.props.match.params.experienceId)) {
                    this.setState({
                        CurrentCompany: id.currentCompany,
                        IncludeInResume: id.includeInResume,
                        companyId: id.companyId,
                        tradeId: id.tradeId,
                        roleId: id.roleId,
                    }, () => {
                        this.formRef.current.setFieldsValue({
                            companyName: { value: id.companyId, label: id.companyName, key: id.companyId },
                            roleName: { value: id.roleId, label: id.roleName, key: id.roleId },
                            tradeName: { value: id.tradeId, label: id.tradeName, key: id.tradeId }
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
                        description: 'Experience updated successfully!'
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
                                            onChange={(e) => this.handleChange(e)}
                                            style={{ width: '100%' }}>
                                            {data.map(d => (
                                                <Select.Option key={d.value}>{d.text}</Select.Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
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
                                        <input className="form-check-input" type="checkbox" name="CurrentCompany" checked={this.state.CurrentCompany}
                                            onChange={(e) => this.getCheckBoxValue('CurrentCompany', e.target.checked)} />
                                            Current Company
                                    </label>
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
                                            onChange={(e) => this.handleChangeTrade(e)}
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
                                            onChange={(e) => this.handleChangeRole(e)}
                                            style={{ width: '100%' }}>
                                            {data1.map(d => (
                                                <Option key={d.value}>{d.text}</Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
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
