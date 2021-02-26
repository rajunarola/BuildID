import React, { Component } from 'react';
import { addNewTicket, getTicketByID } from '../Services/TicketAPI';
import * as moment from "moment";
import { Form, Input, Select, DatePicker, notification, Spin, Checkbox, Image } from 'antd';
import debounce from 'lodash/debounce';
import Loader from '../Loader/Loader';
import { withRouter } from 'react-router-dom';
class EditTicketFinal extends Component {

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
    data: [],
    fetching: false,
    data1: [],
    fetching1: false,
    getfrontPicture: '',
    getBackPicture: '',
    file: '',
    file2: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.apiCall();
    });
  }

  apiCall = () => {
    getTicketByID(parseInt(this.props.match.params.id)).then(res => {
      if (res.status === 200) {
        this.setState({
          loading: false,
          PublicTicket: res.data.data.publicTicket,
          getfrontPicture: res.data.data.frontPictureUrl,
          getBackPicture: res.data.data.backPictureUrl
        }, () => {
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
      this.setState({ loading: false }, () => {
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

  getCheckBoxValue = (e) => {
    this.setState({ PublicTicket: e });
  }

  pictureHandler = (typeOfPicture, event) => {
    if (typeOfPicture === 'frontPicture') {
      this.setState({ FrontPictureUrl: event.target.files[0], getfrontPicture: URL.createObjectURL(event.target.files[0]) });
    } else if (typeOfPicture === 'backPicture') {
      this.setState({ BackPictureUrl: event.target.files[0], getBackPicture: URL.createObjectURL(event.target.files[0]) });
    }
  }

  cancelChanges() {
    this.props.history.push('/projects');
  }

  render() {

    const { fetching, data, fetching1, data1 } = this.state;
    const { Option } = Select;

    const sendNewTicket = values => {
      this.setState({ loading: true }, () => {
        const formData = new FormData();
        formData.append('Id', this.props.match.params.id)
        formData.append('TicketTypeId', parseInt(values.TicketTypeId.value))
        formData.append('Expiry', moment(values.Expiry._d).format())
        formData.append('TicketId', values.TicketId)
        formData.append('IssuedById', parseInt(values.IssuedBy.value))
        formData.append('IssuedOn', moment(values.IssuedOn._d).format())
        formData.append('FrontPictureUrl', this.state.FrontPictureUrl ? "" : this.state.getfrontPicture)
        formData.append('BackPictureUrl', this.state.BackPictureUrl ? "" : this.state.getBackPicture)
        formData.append('CreatedBy', parseInt(localStorage.getItem('userID')))
        formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')))
        formData.append('PublicTicket', this.state.PublicTicket)
        formData.append('ImageFront', this.state.FrontPictureUrl ? this.state.FrontPictureUrl : this.state.getfrontPicture)
        formData.append('ImageBack', this.state.BackPictureUrl ? this.state.BackPictureUrl : this.state.getBackPicture)
        addNewTicket(formData).then(res => {
          if (res.data.status === true) {
            notification.success({
              message: 'Success',
              description: 'Ticket successfully updated!'
            });
            this.apiCall();
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while updating ticket!'
            });
          });
        });
      });
    }

    return (

      <>
        {this.state.loading ? <Loader /> :
          <div className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Edit Ticket</h1></div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header">
                    <h4>Edit Ticket</h4>
                  </div>
                  <div className="container-fluid">
                    <div className="addticketform row">
                      <div className="col-md-12 p-0">
                        <Form className="card-body row" onFinish={sendNewTicket} ref={this.formRef}>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <div className="dropdown dd-type">
                              <label className="form-label formlabel">Ticket Type</label>
                              <Form.Item name="TicketTypeId" rules={[{ required: true, message: 'Please select a ticket type!' }]}>
                                <Select
                                  key="TicketTypeId"
                                  showSearch
                                  labelInValue
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
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label className="formlabel">Issued On</label>
                            <Form.Item name="IssuedOn" rules={[{ required: true, message: "Please enter an issued on date!" }]}>
                              <DatePicker className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label className="formlabel">Expiry Date</label>
                            <Form.Item name="Expiry" rules={[{ required: true, message: "Please enter an expiry date!" }]}>
                              <DatePicker className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label className="formlabel">Ticket Name</label>
                            <Form.Item name="TicketId" rules={[{ required: true, message: "Please enter ticket name!" }]}>
                              <Input className="w-100 inputstyle" />
                            </Form.Item>
                          </div>
                          <div className="form-row col-lg-3 col-md-4 col-sm-6">
                            <div className="form-group col-lg-12">
                              <label for="issuedby">Issued By</label>
                              <Form.Item name="IssuedBy" rules={[{ required: true, message: "Please enter your issued type!" }]}>
                                <Select
                                  key="IssuedBy"
                                  showSearch
                                  labelInValue
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
                          <div className="form-group col-md-2 d-flex align-items-center">
                            <Checkbox checked={this.state.PublicTicket} onChange={(e) => this.getCheckBoxValue(e.target.checked)} >Public Ticket</Checkbox>
                          </div>
                          <div className="form-row col-md-12">
                            <div className="form-group col-lg-3 img-upload-btn">
                              <label for="img"><span className="mr-2"><i className="fas fa-upload"></i></span> Front Picture</label>
                              <Form.Item name="getfrontPicture">
                                <Image src={this.state.getfrontPicture} />
                                <input type="file" id="img" name="img" accept="image/*" className="img-upload manu_upload" onChange={(e) => this.pictureHandler('frontPicture', e)} />
                              </Form.Item>
                            </div>
                            <div className="form-group col-lg-3 img-upload-btn">
                              <label for="img2"><span className="mr-2"><i className="fas fa-upload"></i></span> Back Picture</label>
                              <Form.Item name="getfrontPicture">
                                <Image src={this.state.getBackPicture} />
                                <input type="file" id="img2" name="img2" accept="image/*" className="img-upload manu_upload" onChange={(e) => this.pictureHandler('backPicture', e)} />
                              </Form.Item>
                            </div>
                          </div>
                          <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                            <button type="submit" className="btn btn-blue btnManufacturer mr-2">Update Ticket</button>
                            <button type="reset" onClick={() => this.cancelChanges()} className="btn btn-danger btnManufacturer">Cancel</button>
                          </div>
                        </Form>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        }
      </>
    )
  }
}

export default withRouter(EditTicketFinal);