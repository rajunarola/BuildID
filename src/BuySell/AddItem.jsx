import React, { Component } from 'react'
import { Input, Form, notification, Select, Checkbox } from 'antd'
import { getUserItemStatuses, saveUserItem } from '../Services/BuySell';
import Loader from '../Loader/Loader';

export default class AddItem extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.files = [];
  }

  state = {
    loading: false,
    statusList: [],
    contactByEmail: false,
    contactByChat: false,
    contactByPhone: false,
    visibleOnCurrentJob: false,
    gallery: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getUserItemStatuses().then((value) => {
        if (value.data.status === true) {
          this.setState({ loading: false, statusList: value.data.data });
        } else {
          this.setState({ loading: false });
        }
      }).catch(Err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching data!'
          });
        });
      });
    });
  }

  getCheckBoxValue = (key, e) => {
    if (key === "ContactByPhone") {
      this.setState({ contactByPhone: e });
    } else if (key === "ContactByChat") {
      this.setState({ contactByChat: e });
    } else if (key === "ContactByEmail") {
      this.setState({ contactByEmail: e });
    } else if (key === "VisibleOnCurrentJob") {
      this.setState({ visibleOnCurrentJob: e });
    }
  }

  handleFile = ({ target }) => {
    if (!target.files) return;
    Array.prototype.forEach.call(target.files, (file) => {
      const { gallery } = this.state;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target: { result } }) => {
        gallery.push(result);
        this.setState({ gallery }, () => {
          this.files.push(file)
        })
      }
    })
  };

  removeImage = (i) => {
    const { gallery } = this.state;
    gallery.splice(i, 1);
    this.setState({ gallery });
  };


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
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  render() {

    const { statusList, contactByPhone, contactByChat, contactByEmail, visibleOnCurrentJob } = this.state;
    const { TextArea } = Input;
    const { Option } = Select;

    const onFinish = (values) => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: 0,
          UserId: parseInt(localStorage.getItem("userID")),
          Title: values.Title,
          Description: values.Description,
          Price: values.Price,
          ContactByPhone: contactByPhone,
          ContactByEmail: contactByEmail,
          ContactByChat: contactByChat,
          StatusId: parseInt(values.Status.key),
          Tags: values.Tags,
          VisibleOnCurrentJob: visibleOnCurrentJob
        }
        saveUserItem(data).then((res) => {
          if (res.data.status === true) {
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Success',
                description: 'A new item has been successfully added to the list of your items!'
              });
            });
          }
        }).catch(Err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while adding a new item to the list of your items!'
            });
          });
        });
      });
    }

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Add Item</h1></div>
              <div className="addticketform com-padding">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <div className="manufacture-form manufacture-content pt-3">
                          <Form onFinish={onFinish} ref={this.formRef}>
                            <div className="form-group">
                              <label>Title</label>
                              <Form.Item name="Title" rules={[{ required: true, message: 'Please enter a Title!' }]}>
                                <Input />
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <label>Price</label>
                              <Form.Item name="Price" rules={[{ required: true, message: 'Please enter a Price!' }]}>
                                <Input onKeyPress={() => this.validate()} />
                              </Form.Item>
                            </div>
                            <div className="dropdown dd-type">
                              <label className="form-label formlabel">Status</label>
                              <Form.Item name="Status" rules={[{ required: true, message: 'Please select a Status!' }]}>
                                <Select
                                  key="Status"
                                  labelInValue
                                  filterOption={false}
                                  style={{ width: '100%' }}>
                                  {statusList.map(d => (
                                    <Option key={d.id}>{d.name}</Option>
                                  ))}
                                </Select>
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <label>Description</label>
                              <Form.Item name="Description" rules={[{ required: true, message: 'Please enter a Description!' }]}>
                                <TextArea rows={4}></TextArea>
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <label>Tags</label>
                              <Form.Item name="Tags" rules={[{ required: true, message: 'Please enter a Tags!' }]}>
                                <TextArea rows={4}></TextArea>
                              </Form.Item>
                            </div>

                            <div className="form-group d-flex align-items-center">
                              <Checkbox checked={contactByEmail} onChange={(e) => this.getCheckBoxValue("ContactByEmail", e.target.checked)} >Contact By Email</Checkbox>
                            </div>
                            <div className="form-group d-flex align-items-center">
                              <Checkbox checked={contactByChat} onChange={(e) => this.getCheckBoxValue("ContactByChat", e.target.checked)} >Contact By Chat</Checkbox>
                            </div>
                            <div className="form-group d-flex align-items-center">
                              <Checkbox checked={contactByPhone} onChange={(e) => this.getCheckBoxValue("ContactByPhone", e.target.checked)} >Contact By Phone</Checkbox>
                            </div>
                            <div className="form-group d-flex align-items-center">
                              <Checkbox checked={visibleOnCurrentJob} onChange={(e) => this.getCheckBoxValue("VisibleOnCurrentJob", e.target.checked)} >Visible on current job</Checkbox>
                            </div>
                            <button type="button" className="add-btn btn-blue mb-4">
                              <label htmlFor="file" className="mb-0"><i className="fas fa-plus-circle"></i> Add Picture</label>
                            </button>
                            <input type="file" id="file" style={{ 'display': 'none' }} onChange={this.handleFile} multiple />
                            <div className="gallery-content">
                              {this.state.gallery.map((res, e) => (
                                <div className="preview" key={res}>
                                  <div className="gallary_bg_hn" htmlFor="gallery" style={{ backgroundImage: `url(${res})`, pointerEvents: 'none' }}>
                                    <div className="removeImage" onClick={() => this.removeImage(e)}>
                                      <svg width="10" height="10" viewBox="0 0 10 10" fill="white" xmlns="http://www.w3.org/2000/svg" >
                                        <path d="M1 9L5 5M9 1L5 5M5 5L1 1L9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                      </svg>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                              <button type="submit" className="btn btn-blue">Submit</button>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        }
      </>
    )
  }
}
