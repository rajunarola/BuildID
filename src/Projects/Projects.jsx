import React from 'react'
import {
  userProjects, userWorkHistory, getTicketsByUserId,
  getTicketDetails, getNewQuestionForTheUser, saveUserQuestion
} from '../Services/CommonAPI';
import * as moment from "moment";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Modal, Image, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { notification, Form, Select, Spin, Input } from 'antd';
import Loader from '../Loader/Loader';
import debounce from 'lodash/debounce';
export default class Projects extends React.Component {

  formRef = React.createRef()

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchSelectData = debounce(this.fetchSelectData, 800);
  }

  state = {
    loading: false,
    projectArray: [],
    ticketArray: [],
    pictureList: [],
    changeBackground: false,
    modalShow: false,
    singleTicketDetail: [],
    type: '',
    parameter1: '',
    parameter2: '',
    question: '',
    questionId: '',
    option1: '',
    option2: '',
    option3: '',
    option4: '',
    option1A: '',
    option2A: '',
    option3A: '',
    option4A: '',
    notSure: '',
    emptyQuestions: '',
    location: '',
    data: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([userWorkHistory(),
      getTicketsByUserId(), getNewQuestionForTheUser()]).then((values) => {
        console.log('values => ', values[2].data);

        if (values[0] && values[1] && values[2] && values[0].status === 200 && values[1].status === 200 && values[2].status === 200) {
          this.setState({
            projectArray: values[0].data.data,
            ticketArray: values[1].data.data,
            parameter1: values[2].data.data !== null && values[2].data.data.parameter1,
            parameter2: values[2].data.data !== null && values[2].data.data.parameter2,
            question: values[2].data.data !== null && values[2].data.data.description,
            location: values[2].data.data !== null && values[2].data.data.searchAnswerIn,
            type: values[2].data.data !== null && values[2].data.data.type,
            questionId: values[2].data.data !== null && values[2].data.data.id,
            option1: values[2].data.data !== null && values[2].data.data.option1,
            option2: values[2].data.data !== null && values[2].data.data.option2,
            option3: values[2].data.data !== null && values[2].data.data.option3,
            option4: values[2].data.data !== null && values[2].data.data.option4,
            emptyQuestions: values[2].data.data === null && 'No more questions available this time. Please try again later!'
          }, () => {
            const firstData = values[0].data.data[0].projectId;
            userProjects(firstData).then(response => {
              const pictureList = response.data.data.pictureList;
              this.setState({ pictureList: pictureList, loading: false });
            });
          });
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while fetching data!'
            });
          })
        }
      }).catch(err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching data!'
          });
        })
      });
    });
  }

  onModalPopUp = (id) => {
    this.setState({ modalShow: true }, () => {
      getTicketDetails(id).then(res => {
        this.setState({ singleTicketDetail: res.data.data });
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching ticket details!'
        });
      });
    });
  }

  editTicket = (id) => {
    this.props.history.push(`/edit-ticket/${id}`)
  }

  getProjectDetails = (id) => {
    this.props.history.push(`/project-details/${id}`)
  }

  fetchSelectData = (value) => {
    this.lastFetchId += 1;
    const fetchId = this.lastFetchId;
    this.setState({ data: [], fetching: true }, () => {
      fetch(process.env.REACT_APP_API_URL + `api/misc/GetSearchResults/${parseInt(localStorage.getItem('userID'))}/${this.state.location}/${value}`).then(response => response.json()).then(body => {
        if (fetchId !== this.lastFetchId) {
          // for fetch callback order
          return;
        }
        const data = body.data.map(user => ({
          text: `${user.name}`,
          value: user.id,
        }));
        this.setState({ data, fetching: false });
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching search results!'
        });
      });
    });
  }

  postAnswer(data) {
    saveUserQuestion(data).then(res => {
      if (res.data && res.data.status === true) {
        this.setState({ option1: '', option2: '', option3: '', option4: '', answer1: '', option1A: '', option2A: '', option3A: '', option4A: '' }, () => {
          this.formRef.current.resetFields();
          getNewQuestionForTheUser().then(res => {
            if (res.status === 200) {
              this.setState({
                parameter1: res.data.data !== null && res.data.data.parameter1,
                parameter2: res.data.data !== null && res.data.data.parameter2,
                question: res.data.data !== null && res.data.data.description,
                location: res.data.data !== null && res.data.data.searchAnswerIn,
                type: res.data.data !== null && res.data.data.type,
                questionId: res.data.data !== null && res.data.data.id,
                option1: res.data.data !== null && res.data.data.option1,
                option2: res.data.data !== null && res.data.data.option2,
                option3: res.data.data !== null && res.data.data.option3,
                option4: res.data.data !== null && res.data.data.option4,
                emptyQuestions: res.data.data === null && 'No more questions available this time. Please try again later!'
              }, () => {
                notification.success({
                  message: 'Success',
                  description: 'Your answer has been saved!'
                });
              });
            }
          });
        })
      }
    }).catch(err => {
      notification.error({
        message: 'Error',
        description: 'There was an error while submitting your answer!'
      });
    });
  }

  getCheckBoxValue = (key, state, e) => {
    if (key === 'option1') {
      this.setState({ option1A: state }, () => {
        this.validatorRule()
      });
    } else if (key === 'option2') {
      this.setState({ option2A: state }, () => {
        this.validatorRule()
      });
    } else if (key === 'option3') {
      this.setState({ option3A: state }, () => {
        this.validatorRule()
      });
    } else if (key === 'option4') {
      this.setState({ option4A: state }, () => {
        this.validatorRule()
      });
    }
  }

  skipQuestion = () => {
    const skipped = {
      Id: 0,
      UserId: parseInt(localStorage.getItem('userID')),
      QuestionId: this.state.questionId,
      Answer1: "",
      Answer2: "",
      Answer3: "",
      Answer4: "",
      Parameter1: parseInt(this.state.parameter1),
      Parameter2: parseInt(this.state.parameter2),
      Answered: false
    }
    this.postAnswer(skipped);
  }

  validatorRule = () => {
    const checkBoxes = document.getElementsByClassName('myCheckBox');
    let isChecked = false;
    for (var i = 0; i < checkBoxes.length; i++) {
      if (checkBoxes[i].checked) {
        isChecked = true;
      };
    };
    if (isChecked) {
      this.setState({ notSure: '' })
      return true;
    } else {
      this.setState({ notSure: "Please select atleast one checkbox!" })
      return false;
    }
  }

  multipleCheck = () => {
    if (this.validatorRule()) {
      const answer = {
        Id: 0,
        UserId: parseInt(localStorage.getItem('userID')),
        QuestionId: this.state.questionId,
        Answer1: this.state.option1A,
        Answer2: this.state.option2A,
        Answer3: this.state.option3A,
        Answer4: this.state.option4A,
        Parameter1: parseInt(this.state.parameter1),
        Parameter2: parseInt(this.state.parameter2),
        Answered: this.state.notSure === false ? this.state.notSure : true
      }
      this.postAnswer(answer);
    }
  }

  yesNo = (values) => {
    const answer = {
      Id: 0,
      UserId: parseInt(localStorage.getItem('userID')),
      QuestionId: this.state.questionId,
      Answer1: values,
      Parameter1: this.state.parameter1 !== "" ? parseInt(this.state.parameter1) : "",
      Parameter2: this.state.parameter2 !== "" ? parseInt(this.state.parameter2) : "",
      Answered: this.state.notSure === false ? this.state.notSure : true
    }
    this.postAnswer(answer);
  }

  editProject = (data) => {
    this.props.history.push(`/edit-project/${data.id}`)
  }

  render() {

    const userName = localStorage.getItem('userName');
    const { fetching, data } = this.state;

    const textTypeAnswer = (values) => {
      const answer = {
        Id: 0,
        UserId: parseInt(localStorage.getItem('userID')),
        QuestionId: this.state.questionId,
        Answer1: values.answer !== undefined ? values.answer : "",
        Parameter1: parseInt(this.state.parameter1),
        Parameter2: parseInt(this.state.parameter2),
        Answered: values.answer !== undefined ? true : false
      }
      this.postAnswer(answer);
    }

    const generalSubmit = (values) => {
      const answer = {
        Id: 0,
        UserId: parseInt(localStorage.getItem('userID')),
        QuestionId: this.state.questionId,
        Answer1: values.companyName !== undefined ? parseInt(values.companyName.value) : "",
        Parameter1: parseInt(this.state.parameter1),
        Parameter2: parseInt(this.state.parameter2),
        Answered: values.companyName !== undefined ? true : false
      }
      this.postAnswer(answer);
    }

    return (
      <>
        {this.state.loading ? <Loader /> : <>
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec">
                <h1 className="p-0">{userName}</h1>
                <Link to="/edit-profile" className="editprofile"><i className="fas fa-cog"></i> Edit Profile</Link>
              </div>
              <div className="com-padding">
                <div className="row">
                  <div className="col-lg-4 col-md-6">
                    <Link className="add-btn btn-blue" to="/search-project"><i className="fas fa-plus-circle"></i> Add Projects</Link>
                    <div className="accordion" id="projectaccordion">
                      <div className="crd-wrap">
                        <div className="crd-header" id="projectOne">
                          <h4>Projects</h4>
                          <i className="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                        </div>
                        <div id="collapseOne" className="collapse show" aria-labelledby="projectOne" data-parent="#projectaccordion">
                          <div className="crd-body slider-pad">
                            <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                              <Carousel autoPlay key="carousel">
                                {this.state.pictureList && this.state.pictureList.map((data, index) => (
                                  <img src={data.imageUrl} alt="" />
                                ))}
                              </Carousel>
                            </div>
                            <div className="pro-details">
                              <span className="close-proj"><i className="fas fa-times-circle"></i></span>
                              <div className="wrap">
                                <h4>{this.state.projectArray[0] && this.state.projectArray[0].projectName}</h4>
                                <span>{this.state.projectArray[0] && this.state.projectArray[0].companyName}</span>
                              </div>
                              <span className="approve-proj"><i className="fas fa-check-circle"></i></span>
                            </div>
                            <div className="proj-timeline">
                              <h4>My Projects</h4>
                              <ul className="timeline-sec">
                                {this.state.projectArray.map((data, index) => (
                                  <li>
                                    <h4 className="year">{moment(data.endDate).format('YYYY')}</h4>
                                    <div className="timeline-block">
                                      <h4>{data.projectName}</h4>
                                      <span>{moment(data.startDate).format('MMM YYYY')} - {moment(data.endDate).format('MMM YYYY')}</span>
                                      <span>{data.tradeName}</span>
                                      <span>{data.roleName}</span>
                                      <h5>{data.companyName}</h5>
                                      <button onClick={() => this.getProjectDetails(data.projectId)} className="btn btn-blue mr-3">Project Details</button>
                                      <button onClick={() => this.editProject(data)} className="btn btn-dark">Edit Details</button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <Link className="add-btn btn-blue" to="/add-ticket"><i className="fas fa-plus-circle"></i> Add Ticket</Link>
                    <div className="accordion" id="ticketaccordion">
                      <div className="crd-wrap">
                        <div className="crd-header" id="ticketOne">
                          <h4><img src={require("../assets/images/icon_ticket.png")} alt="" /> Tickets</h4>
                          <i className="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                        </div>
                        <div id="collapseOne" className="collapse show" aria-labelledby="ticketOne" data-parent="#ticketaccordion">
                          <ul className="ticket-list overlay-scroll">
                            {this.state.ticketArray.map((data, index) => (
                              <li onClick={() => this.onModalPopUp(data.id)} className="ticket-block li-position" style={moment(data.expiry).isBefore(new Date()) ? { 'backgroundColor': "#fcecc3" } : { 'backgroundColor': "white" }}>
                                <div className="ticket-img"><img src={data.backPictureUrl || data.frontPictureUrl} alt="" /></div>
                                <div className="ticket-detail">
                                  <h4>{data.ticketType}</h4>
                                  <span>{data.issuedBy}</span>
                                </div>
                                <div className="ticket-date">{moment(data.expiry).format('ll')}</div>
                                <button onClick={() => this.editTicket(data.id)} className="edit-btn">Edit</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4 col-md-6">
                    <div className="accordion" id="qaaccordion">
                      <div className="crd-wrap">
                        <div className="crd-header" id="ticketOne">
                          <h4>Quiz</h4>
                          <i className="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                        </div>
                        <div id="collapseOne" className="collapse show" aria-labelledby="ticketOne" data-parent="#qaaccordion">
                          <p className="note_class">{this.state.emptyQuestions}</p>
                          <div className="qa-sec"><h4>{this.state.question}</h4>
                            {this.state.type === 'Text' &&
                              <Form className="custom_inputs" onFinish={textTypeAnswer} ref={this.formRef}>
                                <Form.Item name="answer" rules={[{ required: true, message: 'Please enter an answer!' }]}>
                                  <Input placeholder="Type in your answer" />
                                </Form.Item>
                                <div className="crd-body form_c_button">
                                  <button className="add-btn btn-blue" type="submit">Submit Answer</button>
                                  <button className="add-btn btn-blue" type="reset" onClick={() => this.skipQuestion()}>Skip Questions</button>
                                </div>
                              </Form>
                            }
                            {this.state.type === 'MultipleChoicePredefined' &&
                              <Form className="custom_inputs" onFinish={() => this.multipleCheck()} ref={this.formRef}>
                                <div className="multiple_checkbox row">
                                  <div className="col-md-6 p-0">
                                    {this.state.option1 !== "" && <label> <input type="checkbox" class='myCheckBox' name="c1" onChange={(e) => this.getCheckBoxValue('option1', this.state.option1, e.target.checked)} />{this.state.option1} </label>}
                                  </div>
                                  <div className="col-md-6 p-0">
                                    {this.state.option2 !== "" && <label><input type="checkbox" class='myCheckBox' name="c1" onChange={(e) => this.getCheckBoxValue('option2', this.state.option2, e.target.checked)} />{this.state.option2} </label>}
                                  </div>
                                  <div className="col-md-6 p-0">
                                    {this.state.option3 !== "" && <label><input type="checkbox" class='myCheckBox' name="c1" onChange={(e) => this.getCheckBoxValue('option3', this.state.option3, e.target.checked)} />{this.state.option3} </label>}
                                  </div>
                                  <div className="col-md-6 p-0">
                                    {this.state.option4 !== "" && <label><input type="checkbox" class='myCheckBox' name="c1" onChange={(e) => this.getCheckBoxValue('option4', this.state.option4, e.target.checked)} />{this.state.option4} </label>}
                                  </div>
                                  <div className="col-md-12 p-0">
                                    <p className="color-danger">{this.state.notSure}</p>
                                  </div>
                                </div>
                                <div className="crd-body form_c_button">
                                  <button className="add-btn btn-blue" type="submit">Submit Answer</button>
                                  <button className="add-btn btn-blue" type="reset" onClick={() => this.skipQuestion()}>Skip Question</button>
                                </div>
                              </Form>}
                            {this.state.type === 'General' &&
                              <Form onFinish={generalSubmit} ref={this.formRef} className="question_one">
                                <Form.Item name="companyName" rules={[{ required: true, message: 'Please select an answer!' }]}>
                                  <Select
                                    showSearch
                                    labelInValue
                                    placeholder="Search for an answer"
                                    notFoundContent={fetching ? <Spin size="small" /> : null}
                                    filterOption={false}
                                    onSearch={(e) => this.fetchSelectData(e)}
                                    style={{ width: '100%' }}>
                                    {data.map(d => (
                                      <Select.Option key={d.value}>{d.text}</Select.Option>
                                    ))}
                                  </Select>
                                </Form.Item>
                                <div className="crd-body form_c_button">
                                  <button className="add-btn btn-blue" type="submit">Submit Answer</button>
                                  <button className="add-btn btn-blue" type="reset" onClick={() => this.skipQuestion()}>Skip Questions</button>
                                </div>
                              </Form>
                            }
                            {this.state.type === 'YesNo' &&
                              <Form ref={this.formRef}>
                                <div className="crd-body form_c_button">
                                  <button className="btn btn-blue" onClick={() => this.yesNo("YES")}>Yes</button>
                                  <button className="btn btn-danger" onClick={() => this.yesNo("NO")}>No</button>
                                  <button className="btn btn-dark" onClick={() => this.skipQuestion()}>Not Sure</button>
                                </div>
                              </Form>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </main>
        </>
        }
        <Modal show={this.state.modalShow} onHide={() => this.setState({ modalShow: !this.state.modalShow })}>
          <Modal.Header className="stagehead text-white" closeButton>
            <Modal.Title>{this.state.singleTicketDetail.ticketType}</Modal.Title>
          </Modal.Header>
          {(this.state.singleTicketDetail.backPictureUrl || this.state.singleTicketDetail.frontPictureUrl) &&
            <Col>
              <div className="stage-img">
                <Image className="w-100" src={this.state.singleTicketDetail.backPictureUrl ? this.state.singleTicketDetail.backPictureUrl : this.state.singleTicketDetail.frontPictureUrl} />
              </div>
            </Col>}
          <Modal.Body>
            {this.state.singleTicketDetail.issuedBy &&
              <p className="stage-detail">
                <span className="stage-label">Issued By:</span> <span>{this.state.singleTicketDetail.issuedBy}</span>
              </p>}
            {this.state.singleTicketDetail.dateCreated &&
              <p className="stage-detail">
                <span className="stage-label">Created On:</span> <span>{moment(this.state.singleTicketDetail.dateCreated).format('ll')}</span>
              </p>}
            {this.state.singleTicketDetail.expiry &&
              <p className="stage-detail border-bottom-0">
                <span className="stage-label">Expiry Date:</span> <span>{moment(this.state.singleTicketDetail.expiry).format('ll')}</span>
              </p>}
          </Modal.Body>
        </Modal>
      </>
    )
  }
}