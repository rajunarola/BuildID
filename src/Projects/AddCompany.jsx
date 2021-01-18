import React, { Component } from 'react';
import { Form, Input, notification } from 'antd';
import { saveCompany } from '../Services/Project';
import queryString from 'query-string';

export default class AddCompany extends Component {

  formRef = React.createRef();

  render() {

    const onFinish = values => {
      const data = {
        Id: 0,
        Name: values.companyName,
        ModifiedBy: localStorage.getItem('userID')
      }
      saveCompany(data).then(response => {
        if (response.data && response.data.message === "OK") {
          this.formRef.current.resetFields();
          notification.success({
            message: 'Success',
            description: 'New Company Data Added!'
          });
          const parsed = queryString.parse(this.props.location.search);
          if (parsed.redirect) {
            this.props.history.push(`${parsed.redirect}`)
          }
          return
        } else if (response.response.status === 400) {
          notification.info({
            message: 'Error',
            description: 'A record with the same name already exists in database. The save will not be finalized!'
          });
          return
        }
      }).catch(error => {
        notification.error({
          message: 'Error',
          description: 'There was an error while adding new company data!'
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
                    <div class="proj-timeline">
                      <h4 class="k-card-title mb-0 text-uppercase"> Add New Company</h4>
                      <div class="manufacture-content p-4">
                        <Form onFinish={onFinish} ref={this.formRef}>
                          <label>Company Name</label>
                          <Form.Item name="companyName" rules={[{ required: true, message: 'Please input company name!' }]}>
                            <Input />
                          </Form.Item>
                          <button type="submit" className="btn btn-blue w-100">Add Company</button>
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
