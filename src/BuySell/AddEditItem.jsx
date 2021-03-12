import React, { Component } from 'react'
import { Input, Form, notification, Select, Checkbox } from 'antd'
import { getUserItemStatuses, saveUserItem, getUserItem, saveUserItemPicture2, deleteUserItemPicture } from '../Services/BuySell';
import Loader from '../Loader/Loader';
import { get } from 'lodash';

export default class AddEditItem extends Component {
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
    itemData: '',
    buySellUserItemId: 0,
    customAry: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([
        getUserItemStatuses(),
        this.props.match.params.id && getUserItem(this.props.match.params.id)
      ]).then((values) => {
        if (values[0] && values[0].data.status === true) {
          this.setState({
            loading: false, statusList: values[0].data.data
          });
          if (values[1] && values[1].data.status === true) {
            this.setState({
              itemData: values[1].data.data,
              contactByEmail: values[1].data.data.contactByEmail,
              contactByChat: values[1].data.data.contactByChat,
              contactByPhone: values[1].data.data.contactByPhone,
              visibleOnCurrentJob: values[1].data.data.visibleOnCurrentJob,
              gallery: values[1].data.data.buySellUserItemPictures
            }, () => {
              this.formRef.current.setFieldsValue({
                Title: values[1].data.data.title,
                Description: values[1].data.data.description,
                Price: values[1].data.data.price,
                Tags: values[1].data.data.tags,
                Status: { value: values[1].data.data.statusId, label: this.state.statusList && this.state.statusList.find(e => (e.id === values[1].data.data.statusId))?.name, key: values[1].data.data.statusId },
              });
            });
          }
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
      const { gallery, customAry } = this.state;
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = ({ target: { result } }) => {
        gallery.push(result);
        this.setState({ gallery }, () => {
          this.files.push(file)
          customAry.push({ name: result, fileObj: file })
        });
      }
    });
  };


  removeImage = (i, data) => {
    const { gallery, customAry } = this.state;
    customAry.splice(customAry.findIndex(e => e.name === data), 1);
    gallery.splice(i, 1);
    this.files = [];
    customAry.map(data => (
      this.files.push(data.fileObj)
    ))
    this.setState({ gallery }, () => {
      if (data.id & data.buySellUserItemId) {
        deleteUserItemPicture(data.id, data.buySellUserItemId).then(res => {
          if (res.data.status === true) {
            notification.success({
              message: 'Success',
              description: 'Image deleted successfully!'
            });
          } else {
            notification.error({
              message: 'Error',
              description: 'There was an error while deleting an image!'
            });
          }
        }).catch(err => {
          notification.error({
            message: 'Error',
            description: 'There was an error while deleting an image!'
          });
        });
      }
    });
    notification.success({
      message: 'Success',
      description: 'Image deleted successfully!'
    });
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

    const { statusList, contactByPhone, contactByChat, contactByEmail, visibleOnCurrentJob, gallery, buySellUserItemId } = this.state;
    const { TextArea } = Input;
    const { Option } = Select;

    const SaveImageAPI = () => {
      for (let index = 0; index < this.files.length; index++) {
        const element = this.files[index];
        const formData = new FormData();
        formData.append('Id', 0);
        formData.append('BuySellUserItemId', this.props.match.params.id ? parseInt(this.props.match.params.id) : parseInt(buySellUserItemId));
        formData.append('Name', element.name);
        formData.append('Main', index === 0 && (gallery[0].thumbUrl && !gallery[0].thumbUrl.includes("biappstoragetest") !== "") ? true : false);
        formData.append('ModifiedBy', parseInt(localStorage.getItem('userID')));
        formData.append('Picture', element);
        saveUserItemPicture2(formData).then(res => {
          if (res.data.status === true) {
            if (index + 1 === this.files.length) {
              this.setState({ loading: false }, () => {
                notification.success({
                  message: 'Success',
                  description: 'A new item has been successfully added to the list of your items!'
                });
              });
            }
          } else {
            this.setState({ loading: false }, () => {
              notification.error({
                message: 'Error',
                description: 'There was an error while uploading an image to the current item!'
              });
            });
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while uploading an image to the current item!'
            });
          });
        });
      }
    }

    const onFinish = (values) => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: this.props.match.params.id ? parseInt(this.props.match.params.id) : 0,
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
          if (res.data && res.data.status === true) {
            this.setState({ buySellUserItemId: res.data.data }, () => {
              if (this.files && this.files.length > 0) {
                SaveImageAPI();
              } else {
                this.setState({
                  loading: false,
                  contactByChat: false,
                  contactByEmail: false,
                  contactByPhone: false,
                  visibleOnCurrentJob: false,
                  gallery: []
                }, () => {
                  notification.success({
                    message: 'Success',
                    description: this.props.match.params.id > 0 ? 'Item Updated successfully!' : 'A new item has been successfully added to the list of your items!'
                  });
                });
              }
            });
            return this.props.match.params.id && this.props.history.push(`/my-items`);
          }
        }).catch(Err => {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: `There was an error while ${this.props.match.params.id ? 'updating' : 'adding'} a new item to the list of your items!`
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
              <div className="edit-sec"><h1>{this.props.match.params.id ? 'Edit' : 'Add'} Item</h1></div>
              <div className="newpage_section com-padding">
                <div className="crd-wrap">
                  <div className="crd-header">
                    <h4>{this.props.match.params.id > 0 ? 'Edit' : 'Add'} Item</h4>
                  </div>
                  <div className="container-fluid">
                    <div className="addticketform row">
                      <div className="col-md-12 p-0">
                        <Form className="card-body row" onFinish={onFinish} ref={this.formRef}>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel">Title</label>
                            <Form.Item name="Title" rules={[{ required: true, message: 'Please enter a Title!' }]}>
                              <Input />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
                            <label className="form-label formlabel">Price</label>
                            <Form.Item name="Price" rules={[{ required: true, message: 'Please enter a Price!' }]}>
                              <Input onKeyPress={() => this.validate()} />
                            </Form.Item>
                          </div>
                          <div className="form-group col-md-4 col-sm-6">
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
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label formlabel">Description</label>
                            <Form.Item name="Description" rules={[{ required: true, message: 'Please enter a Description!' }]}>
                              <TextArea rows={4}></TextArea>
                            </Form.Item>
                          </div>
                          <div className="form-group col-lg-3 col-md-4 col-sm-6">
                            <label className="form-label formlabel">Tags</label>
                            <Form.Item name="Tags" rules={[{ required: true, message: 'Please enter a Tags!' }]}>
                              <TextArea rows={4}></TextArea>
                            </Form.Item>
                          </div>

                          <div className="col-md-12">
                            <div className="row">
                              <div className="form-group d-flex align-items-center col-md-2">
                                <Checkbox checked={contactByEmail} onChange={(e) => this.getCheckBoxValue("ContactByEmail", e.target.checked)} >Contact By Email</Checkbox>
                              </div>
                              <div className="form-group d-flex align-items-center col-md-2">
                                <Checkbox checked={contactByChat} onChange={(e) => this.getCheckBoxValue("ContactByChat", e.target.checked)} >Contact By Chat</Checkbox>
                              </div>
                              <div className="form-group d-flex align-items-center col-md-2">
                                <Checkbox checked={contactByPhone} onChange={(e) => this.getCheckBoxValue("ContactByPhone", e.target.checked)} >Contact By Phone</Checkbox>
                              </div>
                              <div className="form-group d-flex align-items-center col-md-2">
                                <Checkbox checked={visibleOnCurrentJob} onChange={(e) => this.getCheckBoxValue("VisibleOnCurrentJob", e.target.checked)} >Visible on current job</Checkbox>
                              </div>
                            </div>
                          </div>

                          <input type="file" id="file" style={{ 'display': 'none' }} onChange={this.handleFile} multiple />
                          <div className="gallery-content">
                            {gallery && gallery.map((res, e) => (
                              <div className="preview" key={res}>
                                <div className="gallary_bg_hn" htmlFor="gallery" style={{ backgroundImage: `url(${res.thumbUrl && res.thumbUrl.includes("biappstoragetest") ? res.thumbUrl : res})`, pointerEvents: 'none' }}>
                                  <div className="removeImage" onClick={() => this.removeImage(e, res)}>
                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="white" xmlns="http://www.w3.org/2000/svg" >
                                      <path d="M1 9L5 5M9 1L5 5M5 5L1 1L9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                            <button type="button" className="add-btn btn-blue mr-3">
                              <label htmlFor="file" className="mb-0"><i className="fas fa-plus-circle"></i> Add Picture</label>
                            </button>
                            <button type="submit" className="btn btn-blue mr-3">{this.props.match.params.id ? 'Edit' : 'Add'} Item</button>
                            <button className="btn btn-danger" onClick={() => this.props.history.push(`/my-items`)}>Cancel</button>
                          </div>
                        </Form>
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
