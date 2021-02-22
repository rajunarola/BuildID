import React, { Component } from 'react';
import Loader from '../Loader/Loader';
import { getNewQuestionForTheUser, saveUserQuestion } from '../Services/CommonAPI';
import { Form, Input, Select, Spin, notification } from 'antd';
import debounce from 'lodash/debounce';

export default class Quiz extends Component {

  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.lastFetchId = 0;
    this.fetchSelectData = debounce(this.fetchSelectData, 800);
  }

  state = {
    loading: false,
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
    fetching: false,
    location: '',
    data: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getNewQuestionForTheUser().then(res => {
        if (res.status === 200) {
          this.setState({
            loading: false,
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
          });
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while fetching data!'
            });
          })
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

  render() {

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
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Quiz</h1></div>
              <div className="com-padding newpage_section">
                <div className="row">
                  <div className="col-md-12">
                    <div className="accordion" id="qaaccordion">
                      <div className="crd-wrap">
                        <div className="crd-header" id="ticketOne">
                          <h4>Quiz Question</h4>
                        </div>

                        <div className="row">
                          <div className="col-md-5">
                            <div id="collapseOne" className="collapse show" aria-labelledby="ticketOne" data-parent="#qaaccordion">
                              {this.state.emptyQuestions &&
                                <p className="note_class">{this.state.emptyQuestions}</p>
                              }
                              <div className="qa-sec">
                                <h4 className="p-0">{this.state.question}</h4>
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
                </div>
              </div>
            </section>
          </main>
        }
      </>
    )
  }
}