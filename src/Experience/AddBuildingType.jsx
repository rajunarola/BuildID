import React, { Component } from 'react'
import { saveGlobalBuildingType } from '../Services/Experience';
import { Form, Input, notification } from 'antd';
import queryString from 'query-string';

export default class AddBuildingType extends Component {

    formRef = React.createRef();

    render() {

        const onFinish = values => {
            const data = {
                Id: 0,
                Name: values.buildingName,
                RecordStatusId: 1,
                ModifiedBy: localStorage.getItem('userID'),
            }
            saveGlobalBuildingType(data).then(response => {
                if (response.data && response.data.message === "OK") {
                    this.formRef.current.resetFields();
                    notification.success({
                        message: 'Success',
                        description: 'New Building Type Data Added!'
                    });
                    const parsed = queryString.parse(this.props.location.search);
                    if (parsed.redirect) {
                        this.props.history.push(`${parsed.redirect}`)
                    }
                    return
                } else if (response.status === 201) {
                    notification.info({
                        message: 'Error',
                        description: 'A record with the same name already exists in database. The save will not be finalized!'
                    });
                    return
                }
            }).catch(error => {
                notification.error({
                    message: 'Error',
                    description: 'There was an error while adding new building type data!'
                });
            });
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
                                            <h4 className="k-card-title mb-0 text-uppercase"> Add Global Building Type</h4>
                                            <div className="manufacture-content p-4">
                                                <Form onFinish={onFinish} ref={this.formRef}>
                                                    <label>Building Type</label>
                                                    <Form.Item name="buildingName" rules={[{ required: true, message: 'Please input building type!' }]}>
                                                        <Input />
                                                    </Form.Item>
                                                    <button type="submit" className="btn btn-blue w-100">Add Building Type</button>
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