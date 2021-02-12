import React from 'react';
import { addNewTicket } from '../Services/TicketAPI';
import { Form, Input, Select, DatePicker, notification, Spin, Checkbox } from 'antd';
import debounce from 'lodash/debounce';
import * as moment from "moment";
import Loader from '../Loader/Loader';
export default class AddNewTickets extends React.Component {

  formRef = React.createRef()

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.fetchCompany = debounce(this.fetchCompany, 800);
    this.fetchTicketType = debounce(this.fetchTicketType, 800);
  }

  state = {
    FrontPictureUrl: '',
    BackPictureUrl: '',
    data: [],
    value: [],
    fetching: false,
    data1: [],
    value1: [],
    fetching1: false,
    PublicTicket: false,
    loading: false,
    file: '',
    file2: ''
  }

  fileChangedHandler = (event, value) => {
    if (value === 'front_picture') {
      this.setState({ FrontPictureUrl: event.target.files, file: URL.createObjectURL(event.target.files[0]) })
    } else if (value === 'back_picture') {
      this.setState({ BackPictureUrl: event.target.files, file2: URL.createObjectURL(event.target.files[0]) });
    }
  }

  onChange(e) {
    this.setState({ PublicTicket: e.target.checked });
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
        this.setState({ data, fetching: false });
      });
    });
  };

  fetchTicketType = () => {
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId1;
    this.setState({ data1: [], fetching1: true }, () => {
      fetch(process.env.REACT_APP_API_URL + `api/tickets/GetTicketTypes`).then(response => response.json()).then(body => {
        if (fetchId !== this.lastFetchId1) {
          // for fetch callback order
          return;
        }
        const data = body.data.map(user => ({
          text: `${user.name}`,
          value: user.id,
        }));
        this.setState({ data1: data, fetching1: false });
      });
    });
  };

  render() {

    const { fetching, data, value, fetching1, data1, value1 } = this.state;

    const sendNewTicket = values => {
      this.setState({ loading: true }, () => {
        const formData = new FormData();
        formData.append('Id', 0)
        formData.append('Expiry', moment(values.Expiry._d).format('YYYY-MM-DD'))
        formData.append('TicketId', values.TicketId)
        formData.append('IssuedById', parseInt(values.IssuedBy.value))
        formData.append('IssuedOn', moment(values.IssuedOn._d).format('YYYY-MM-DD'))
        formData.append('TicketTypeId', parseInt(values.TicketTypeId.value))
        formData.append('FrontPictureUrl', "")
        formData.append('BackPictureUrl', "")
        formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')))
        formData.append('PublicTicket', this.state.PublicTicket)
        formData.append('ImageFront', this.state.FrontPictureUrl ? this.state.FrontPictureUrl[0] : "")
        formData.append('ImageBack', this.state.BackPictureUrl ? this.state.BackPictureUrl[0] : "")
        addNewTicket(formData).then(res => {
          if (res.data.status === true) {
            this.setState({ loading: false, file: '', file2: '' }, () => {
              this.formRef.current.resetFields();
              notification.success({
                message: 'Success',
                description: 'Ticket successfully added!'
              });
            })
          }
        }).catch(err => {
          notification.error({
            message: 'Error',
            description: 'There was an error while adding new Ticket!'
          });
        });
      });
    }

    return (

      <>
        {this.state.loading ? <Loader /> :
          <div className="index-main">
            <div className="edit-sec"><h2>Add Ticket</h2></div>
            <div className="container-fluid">
              <div className="addticketform row">
                <div className="form-border col-lg-5 col-md-8 mt-4 ml-md-4 pt-4">
                  <Form className="card-body" onFinish={sendNewTicket} ref={this.formRef}>
                    <div className="form-group">
                      <label className="form-label formlabel">Ticket Type</label>
                      <Form.Item name="TicketTypeId" rules={[{ required: true, message: 'Please select a ticket type!' }]}>
                        <Select
                          key="TicketTypeId"
                          showSearch
                          labelInValue
                          value={value1}
                          placeholder="Search ticket type"
                          notFoundContent={fetching1 ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={(e) => this.fetchTicketType(e)}
                          style={{ width: '100%' }}>
                          {data1.map(d => (
                            <Select.Option key={d.value}>{d.text}</Select.Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label className="formlabel">Issued On</label>
                      <Form.Item name="IssuedOn" rules={[{ required: true, message: 'Please select an issued on date!' }]}>
                        <DatePicker className="w-100 inputstyle" />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label className="formlabel">Expiry Date</label>
                      <Form.Item name="Expiry" rules={[{ required: true, message: 'Please select an expiry date!' }]}>
                        <DatePicker className="w-100 inputstyle" />
                      </Form.Item>
                    </div>
                    <div className="form-group">
                      <label className="formlabel">Ticket Name</label>
                      <Form.Item name="TicketId" rules={[{ required: true, message: "Please enter ticket name!" }]}>
                        <Input className="w-100 inputstyle" />
                      </Form.Item>
                    </div>
                    <div className="form-row">
                      <div className="form-group col-lg-12">
                        <label for="issuedby">Issued By</label>
                        <Form.Item name="IssuedBy" rules={[{ required: true, message: "Please enter your issued type!" }]}>
                          <Select
                            key="IssuedBy"
                            showSearch
                            labelInValue
                            value={value}
                            placeholder="Search issued by"
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
                    </div>
                    <div className="form-row">
                      <div className="form-group col-lg-6 img-upload-btn">
                        <label for="img"><span className="mr-2"><i className="fas fa-upload"></i></span>  Front Picture
                          <input type="file" id="img" name="img" accept="image/*" className="img-upload manu_upload" onChange={(e) => this.fileChangedHandler(e, 'front_picture')} />
                          <img src={this.state.file} alt="" />
                        </label>
                      </div>
                      <div className="form-group col-lg-6 img-upload-btn">
                        <label for="img2"><span className="mr-2"><i className="fas fa-upload"></i></span> Back Picture
                       <input type="file" id="img2" name="img2" accept="image/*" className="img-upload manu_upload" onChange={(e) => this.fileChangedHandler(e, 'back_picture')} />
                          <img src={this.state.file2} alt="" />
                        </label>
                      </div>
                    </div>
                    <div className="form-check">
                      <Checkbox onChange={(e) => this.onChange(e)}>Public Ticket</Checkbox>
                    </div>
                    <button type="submit" className="btn btn-blue btnManufacturer mt-3 mb-3">Add New Ticket</button>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        }
      </>
    )
  }

}
