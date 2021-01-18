import React, { Component } from 'react';
import { addNewTicket, getTicketByID } from '../Services/TicketAPI';
import * as moment from "moment";
import { Form, Input, Select, DatePicker, notification, Spin, Checkbox } from 'antd';
import debounce from 'lodash/debounce';
import Loader from '../Loader/Loader';
export default class EditTicketFinal extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.lastFetchId1 = 0;
    this.fetchCompany = debounce(this.fetchCompany, 800);
    this.fetchTicketType = debounce(this.fetchTicketType, 800);
  }

  state = {
    loading: false,
    FrontPictureUrl: '',
    BackPictureUrl: '',
    PublicTicket: false,
    value: [],
    data: [],
    fetching: false,
    value1: [],
    data1: [],
    fetching1: false
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getTicketByID(parseInt(this.props.match.params.id)).then(res => {
        if (res.status === 200) {
          this.setState({ loading: false, PublicTicket: res.data.data.publicTicket }, () => {
            this.formRef.current.setFieldsValue({
              TicketTypeId: { value: res.data.data.ticketTypeId, label: res.data.data.ticketType, key: res.data.data.ticketTypeId },
              IssuedOn: moment(moment(res.data.data.issuedOn).format('YYYY-MM-DD'), ('YYYY-MM-DD')),
              Expiry: moment(moment(res.data.data.expiry).format('YYYY-MM-DD'), ('YYYY-MM-DD')),
              TicketId: res.data.data.ticketId,
              IssuedBy: { value: res.data.data.issuedById, label: res.data.data.issuedBy, key: res.data.data.issuedById },
            });
          });
        }
      }).catch(err => {
        this.setState({ loading: false });
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching ticket data!'
        });
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
      this.setState({ data, fetching: false });
    });
  };

  fetchTicketType = () => {
    this.lastFetchId1 += 1;
    const fetchId = this.lastFetchId1;
    this.setState({ data1: [], fetching1: true });
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
  };

  getCheckBoxValue = (e) => {
    this.setState({ PublicTicket: e })
  }

  frontPictureHandler = (event) => {
    this.setState({ FrontPictureUrl: event.target.files[0].name }, () => {
      console.log('this.state.FrontPictureUrl => ', this.state.FrontPictureUrl);
    })
  }

  backPictureHandler = (event) => {
    this.setState({ BackPictureUrl: event.target.files[0].name })
  }

  render() {

    const { fetching, data, value, fetching1, data1, value1 } = this.state;
    const { Option } = Select;

    const onFinishFailed = () => { };

    const sendNewTicket = values => {
      const formData = new FormData();
      formData.append('Id', this.props.match.params.id)
      formData.append('TicketTypeId', parseInt(values.TicketTypeId.value))
      formData.append('Expiry', moment(values.Expiry._d).format())
      formData.append('TicketId', values.TicketId)
      formData.append('IssuedById', parseInt(values.IssuedBy.value))
      formData.append('IssuedOn', moment(values.IssuedOn._d).format())
      formData.append('UserId', parseInt(localStorage.getItem('userID')))
      formData.append('FrontPictureUrl', this.state.FrontPictureUrl)
      formData.append('BackPictureUrl', this.state.BackPictureUrl)
      formData.append('CreatedBy', parseInt(localStorage.getItem('userID')))
      formData.append('DateCreated', moment(new Date()).format())
      formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')))
      formData.append('DateModified', moment(new Date()).format())
      formData.append('PublicTicket', this.state.PublicTicket)
      addNewTicket(formData).then(res => {
        if (res.data.status === true) {
          notification.success({
            message: 'Success',
            description: 'Ticket successfully updated!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while updating ticket!'
        });
      });
    }

    return (

      <>
        {this.state.loading ? <Loader /> :
          <div className="index-main">
            <div className="edit-sec mt-80"><h2>Edit Ticket</h2></div>
            <div className="addticketform ml-4">
              <div className="form-border p-4 w-30 mt-5 crd-wrap">
                <Form className="card-body" onFinish={sendNewTicket} onFinishFailed={onFinishFailed} ref={this.formRef}>
                  <div className="form-group">
                    <div className="dropdown dd-type">
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
                            <Option key={d.value}>{d.text}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="formlabel">Issued On</label>
                    <Form.Item name="IssuedOn" rules={[{ required: true, message: "Please enter an issued on date!" }]}>
                      <DatePicker className="w-100 inputstyle" />
                    </Form.Item>
                  </div>
                  <div className="form-group">
                    <label className="formlabel">Expiry Date</label>
                    <Form.Item name="Expiry" rules={[{ required: true, message: "Please enter an expiry date!" }]}>
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
                            <Option key={d.value}>{d.text}</Option>
                          ))}
                        </Select>
                      </Form.Item>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group col-lg-6 img-upload-btn">
                      <label for="img"><span className="mr-2"><i className="fas fa-upload"></i></span> Front Picture
                        {this.state.FrontPictureUrl !== "" ?
                          <>
                            <img src={this.state.FrontPictureUrl} alt="ImageFront" className="mt-2 mb-2 d-block" />
                            <input type="file" id="img" name="img" accept="image/*" className="img-upload" onChange={(e) => this.frontPictureHandler(e)} />
                          </> :
                          <input type="file" id="img" name="img" accept="image/*" className="img-upload" onChange={(e) => this.frontPictureHandler(e)} />
                        }
                      </label>
                    </div>
                    <div className="form-group col-lg-6 img-upload-btn">
                      <label for="img2"><span className="mr-2"><i className="fas fa-upload"></i></span> Back Picture
                          {this.state.BackPictureUrl !== '' ?
                          <>
                            <img src={this.state.BackPictureUrl} alt="ImageBack" className="mt-2 mb-2 d-block" />
                            <input type="file" id="img2" name="img2" accept="image/*" className="img-upload" onChange={(e) => this.backPictureHandler(e)} />
                          </> :
                          <input type="file" id="img2" name="img2" accept="image/*" className="img-upload" onChange={(e) => this.backPictureHandler(e)} />
                        }
                      </label>
                    </div>
                  </div>
                  <div className="form-check">
                    <Checkbox checked={this.state.PublicTicket === true ? true : false} onChange={(e) => this.getCheckBoxValue(e.target.checked)} >Public Ticket</Checkbox>
                  </div>
                  <button type="submit" className="btn btn-blue btnManufacturer mt-3">Update Ticket</button>
                </Form>
              </div>
            </div>
          </div>
        }
      </>
    )
  }
}
