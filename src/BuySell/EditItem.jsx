import React, { Component } from 'react'
import { Input, Form, notification, Select, Checkbox } from 'antd'
import { getUserItemStatuses, saveUserItem, getUserItem } from '../Services/BuySell';
import Loader from '../Loader/Loader';

export default class EditItem extends Component {
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
    gallery: [],
    itemData: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([
        getUserItemStatuses(),
        getUserItem(this.props.match.params.id)
      ]).then((values) => {
        if (values[0] && values[0].data.status === true && values[1] && values[1].data.status === true) {
          this.setState({
            loading: false, statusList: values[0].data.data, itemData: values[1].data.data,
            contactByEmail: values[1].data.data.contactByEmail, contactByChat: values[1].data.data.contactByChat, contactByPhone: values[1].data.data.contactByPhone, visibleOnCurrentJob: values[1].data.data.visibleOnCurrentJob
          }, () => {
            this.formRef.current.setFieldsValue({
              Title: values[1].data.data.title,
              Description: values[1].data.data.description,
              Price: values[1].data.data.price,
              Tags: values[1].data.data.tags,
              Status: { value: values[1].data.data.statusId, label: this.state.statusList && this.state.statusList.find(e => (e.id === values[1].data.data.statusId))?.name, key: values[1].data.data.statusId },
            });
          });
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while fetching data!'
            });
          });
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

  render() {

    const { statusList, contactByPhone, contactByChat, contactByEmail, visibleOnCurrentJob } = this.state;
    const { TextArea } = Input;
    const { Option } = Select;

    const onFinish = (values) => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: this.props.match.params.id,
          UserId: localStorage.getItem("userID"),
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
                description: 'Item Updated successfully!'
              });
            });
            this.props.history.push(`/my-items`);
          }
        }).catch(Err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while updating the item details!'
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
              <div className="edit-sec"><h1>Edit Item</h1></div>
              <div className="addticketform com-padding">
                <div className="row">
                  <div className="col-lg-4 col-md-6 col-12">
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <div className="manufacture-form manufacture-content pt-3">
                          <Form onFinish={onFinish} ref={this.formRef}>
                            <div className="form-group">
                              <label>Title</label>
                              <Form.Item name="Title" rules={[{ required: true, message: 'Please enter Title!' }]}>
                                <Input placeholder="Title" />
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <label>Price</label>
                              <Form.Item name="Price" rules={[{ required: true, message: 'Please enter Price!' }]}>
                                <Input placeholder="Price" />
                              </Form.Item>
                            </div>
                            <div className="dropdown dd-type">
                              <label className="form-label formlabel">Status</label>
                              <Form.Item name="Status" rules={[{ required: true, message: 'Please select a Status!' }]}>
                                <Select
                                  key="Status"
                                  labelInValue
                                  placeholder="Search Status"
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
                              <Form.Item name="Description" rules={[{ required: true, message: 'Please enter Description!' }]}>
                                <TextArea placeholder="Description" rows={4}></TextArea>
                              </Form.Item>
                            </div>
                            <div className="form-group">
                              <label>Tags</label>
                              <Form.Item name="Tags" rules={[{ required: true, message: 'Please enter Tags!' }]}>
                                <TextArea placeholder="Tags" rows={4}></TextArea>
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
