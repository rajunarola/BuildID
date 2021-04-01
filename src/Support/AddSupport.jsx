import React, { Component } from 'react'
import { Input, Form, notification } from 'antd'
import { saveUserSupport } from '../Services/CommonAPI';
import Loader from '../Loader/Loader';
import { get } from 'lodash';

export default class AddSupport extends Component {
    formRef = React.createRef();

    state = {
        loading: false
    }
    componentDidMount() {
    }

    render() {
        const { TextArea } = Input;

        const addUserSupport = (values) => {
            var screenName = localStorage.getItem('SupportPage').replace("-"," ");
            screenName = screenName.replace("/","");
            this.setState({ loading: true }, () => {
                const data = {
                    Id: 0,
                    ScreenName: 'BIW-'+ screenName.replace(/\b(\w)/g, s => s.toUpperCase()),
                    Description: values.Description,
                    CreatedBy: parseInt(localStorage.getItem('userID')),
                    ModifiedBy: parseInt(localStorage.getItem('userID')),
                    RecordStatusId: 1
                }
                saveUserSupport(data).then(res => {
                    this.formRef.current.resetFields();
                    if (res.data.status === true) {
                        this.setState({ loading: false });
                        notification.success({
                            message: 'Success',
                            description: 'Your support has been successfully added!'
                        })
                    } else {
                        this.setState({ loading: false });
                        notification.error({
                            message: 'Error',
                            description: res.data.message
                        })
                    }
                    return this.props.history.push(localStorage.getItem('SupportPage'));
                }).catch(err => {
                    this.setState({ loading: false }, () => {
                        notification.error({
                            message: 'Error',
                            description: 'There was an error while adding a new Support!'
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
                                            <h4 className="k-card-title mb-0 text-uppercase">Support</h4>
                                            <div className="manufacture-content p-4">
                                                <p className="support_info">
                                                    Your feedback help us make BuildID a more useful tool for you<br /><br />
                                                    Let us know what happend and what we can do to reduce the problem.<br />
                                                </p>
                                                <Form onFinish={addUserSupport} ref={this.formRef}>
                                                    <Form.Item name="Description" rules={[{ required: true, message: 'Please enter something!' }]}>
                                                        <TextArea placeholder="Type here" rows={4}></TextArea>
                                                    </Form.Item>
                                                    <button type="submit" className="btn btn-blue w-100">Add Support</button>
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
