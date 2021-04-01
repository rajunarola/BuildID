import React, { Component } from 'react'
import { Input, Form, notification, Select, Checkbox, Button } from 'antd'
import { saveUserTradeCertification, getUserTradeCertification } from '../Services/TradeCertifications';
import Loader from '../Loader/Loader';
import { get } from 'lodash';
import Support from '../Support/Support';

export default class AddEditTradeCertification extends Component {
    formRef = React.createRef();

    state = {
        loading: false
    }
    componentDidMount() {
        this.setState({ loading: true }, () => {
            this.props.match.params.id && getUserTradeCertification(this.props.match.params.id).then(res => {
                this.setState({ loading: false }, () => {
                    if (res.data.status === true) {
                        this.formRef.current.setFieldsValue({
                            School: res.data.data.school,
                            Years: res.data.data.years,
                            TradeReceived: res.data.data.tradeReceived
                        });
                    }
                });
            }).catch(Err => {
                this.setState({ loading: false }, () => {
                    notification.error({
                        message: 'Error',
                        description: 'There was an error while fetching data!'
                    });
                });
            });
            this.setState({ loading: false });
        });
    }

    validate = (evt) => {
        var theEvent = evt || window.event;
        // Handle paste
        if (theEvent.type === 'paste') {
            var key = evt.clipboardData.getData('text/plain');
        } else {
            // Handle key press
            var key = theEvent.keyCode || theEvent.which;
            key = String.fromCharCode(key);
        }
        var regex = /[0-9]/;
        if (!regex.test(key)) {
            theEvent.returnValue = false;
            if (theEvent.preventDefault) theEvent.preventDefault();
        }
    }

    render() {
        const addTradeCertifications = (values) => {
            this.setState({ loading: true }, () => {
                const data = {
                    Id: this.props.match.params.id ? parseInt(this.props.match.params.id) : 0,
                    UserId: parseInt(localStorage.getItem('userID')),
                    School: values.School,
                    Years: values.Years,
                    TradeReceived: values.TradeReceived,
                    ModifiedBy: parseInt(localStorage.getItem('userID'))
                }
                saveUserTradeCertification(data).then(res => {
                    this.formRef.current.resetFields();
                    if (res.data.status === true) {
                        this.setState({ loading: false });
                        notification.success({
                            message: 'Success',
                            description: this.props.match.params.id > 0 ? 'Trade Certifications Updated successfully!' : 'Trade Certifications has been successfully added!'
                        })
                    } else {
                        this.setState({ loading: false });
                        notification.error({
                            message: 'Error',
                            description: res.data.message
                        })
                    }
                    return this.props.match.params.id && this.props.history.push(`/edit-profile`);
                }).catch(err => {
                    this.setState({ loading: false }, () => {
                        notification.error({
                            message: 'Error',
                            description: `There was an error while ${this.props.match.params.id ? 'updating a' : 'adding a new'} trade certifications!`
                        });
                    });
                });
            })
        }

        return (

            <>
                <main className="index-main">
                    <section className="index-sec">
                        <div className="addticketform com-padding mt-4">
                            <div className="row">
                                <div className="col-12 col-md-6 offset-md-3">
                                    <div className="form-border crd-wrp">
                                        <div className="proj-timeline">
                                            <h4 className="k-card-title mb-0 text-uppercase mon_p"> {this.props.match.params.id ? 'Edit' : 'Add'} Trade Certifications
                                            <Support dataParentToChild={this.props.location.pathname} history={this.props.history} />
                                            </h4>
                                            <div className="manufacture-content p-4">
                                                <Form onFinish={addTradeCertifications} ref={this.formRef}>
                                                    <Form.Item label="School" name="School" rules={[{ required: true, message: 'Please enter a School!' }]}>
                                                        <Input />
                                                    </Form.Item>
                                                    <Form.Item label="Years" name="Years" rules={[{ required: true, message: 'Please enter a Years!' }]}>
                                                        <Input maxLength={4} onKeyPress={() => this.validate()} />
                                                    </Form.Item>
                                                    <Form.Item label="Trade Received" name="TradeReceived" rules={[{ required: true, message: 'Please enter a Trade Received!' }]}>
                                                        <Input />
                                                    </Form.Item>
                                                    <button type="submit" className="btn btn-blue w-50">{this.props.match.params.id ? 'Edit' : 'Add'} Trade Certifications</button>
                                                    <button className="btn btn-danger w-50 btnManufacturer" onClick={() => this.props.history.push(`/edit-profile`)}>Cancel</button>
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
