import React from 'react'
import { userProjects, userWorkHistory, getTicketsByUserId, getTicketDetails } from '../Services/CommonAPI';
import * as moment from "moment";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Modal, Image, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import Loader from '../Loader/Loader';
export default class Projects extends React.Component {

  state = {
    loading: false,
    projectArray: [],
    ticketArray: [],
    pictureList: [],
    changeBackground: false,
    modalShow: false,
    singleTicketDetail: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([userWorkHistory(),
      getTicketsByUserId()]).then((values) => {
        if (values[0] && values[1] && values[0].status === 200 && values[1].status === 200) {
          this.setState({ projectArray: values[0].data.data, ticketArray: values[1].data.data }, () => {
            const firstData = values[0].data.data[0].projectId;
            userProjects(firstData).then(response => {
              const pictureList = response.data.data.pictureList;
              this.setState({ pictureList: pictureList, loading: false });
            });
          });
        } else {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching data!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching data!'
        });
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

  render() {

    const userName = localStorage.getItem('userName');

    return (
      <>
        {this.state.loading ? <Loader /> : <>
          <main className="index-main">
            <section className="index-sec">
              <h1>{userName}</h1>
              <div className="edit-sec flex-end">
                <Link to="/edit-profile" className="editprofile"><i className="fas fa-cog"></i> Edit Profile</Link>
              </div>
              <div className="com-padding">
                <div className="row">
                  <div className="col-lg-4">
                    <a className="add-btn btn-blue" href="javascript:;"><i className="fas fa-plus-circle"></i> Add Projects</a>
                    <div className="accordion" id="projectaccordion">
                      <div className="crd-wrap">
                        <div className="crd-header" id="projectOne">
                          <h4>Projects</h4>
                          <i className="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                        </div>
                        <div id="collapseOne" className="collapse show" aria-labelledby="projectOne" data-parent="#projectaccordion">
                          <div className="crd-body slider-pad">
                            <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                              <Carousel autoPlay>
                                {this.state.pictureList && this.state.pictureList.map((data, index) => (
                                  <img src={data.imageUrl} alt="" />
                                ))}
                              </Carousel>
                            </div>
                            <div className="pro-details">
                              <a className="close-proj"><i className="fas fa-times-circle"></i></a>
                              <div className="wrap">
                                <h4>{this.state.projectArray[0] && this.state.projectArray[0].projectName}</h4>
                                <span>{this.state.projectArray[0] && this.state.projectArray[0].companyName}</span>
                              </div>
                              <a className="approve-proj"><i className="fas fa-check-circle"></i></a>
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
                                      <button onClick={() => this.getProjectDetails(data.projectId)} className="btn btn-blue">Project Details</button>
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
                  <div className="col-lg-4">
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
                                {console.log('data.frontPic => ', data.frontPictureUrl, data.backPictureUrl)}
                                <div className="ticket-img"><img src={data.backPictureUrl && data.backPictureUrl || data.frontPictureUrl && data.frontPictureUrl} alt="" /></div>
                                <div className="ticket-detail">
                                  <h4>{data.ticketType}</h4>
                                  <span>{data.issuedBy}</span>
                                </div>
                                <div className="ticket-date">{moment(data.dateCreated).format('ll')}</div>
                                <button onClick={() => this.editTicket(data.id)} className="edit-btn">Edit</button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="accordion" id="qaaccordion">
                      <div className="crd-wrap">
                        <div className="crd-header" id="ticketOne">
                          <h4>Quiz</h4>
                          <i className="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                        </div>
                        <div id="collapseOne" className="collapse show" aria-labelledby="ticketOne" data-parent="#qaaccordion">
                          <div className="qa-sec"><h4>The question wll go here it should take up a maximum of two lines of copy?</h4>
                            <form>
                              <ul className="ans-sec">
                                <li><input type="radio" name="ansradio" checked="" /><span>An answer will go here</span></li>
                                <li><input type="radio" name="ansradio" /><span>An answer will go here</span></li>
                                <li><input type="radio" name="ansradio" /><span>An answer will go here</span></li>
                              </ul>
                              <div className="crd-body">
                                <span className="add-btn btn-blue">Submit Answer</span>
                                {/* <a className="link-btn" href="javascript:;">Skip Questions</a> */}
                              </div>
                            </form>
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
          {this.state.singleTicketDetail.backPictureUrl &&
            <Col>
              <div className="stage-img">
                <Image className="w-100" src={this.state.singleTicketDetail.backPictureUrl} />
              </div>
            </Col>
          }
          <Modal.Body>
            {this.state.singleTicketDetail.issuedBy &&
              <p className="stage-detail">
                <span className="stage-label">Issued By:</span> <span>{this.state.singleTicketDetail.issuedBy}</span>
              </p>
            }
            {this.state.singleTicketDetail.dateCreated &&
              <p className="stage-detail">
                <span className="stage-label">Created On:</span> <span>{moment(this.state.singleTicketDetail.dateCreated).format('ll')}</span>
              </p>
            }
            {this.state.singleTicketDetail.expiry &&
              <p className="stage-detail border-bottom-0">
                <span className="stage-label">Expiry Date:</span> <span>{moment(this.state.singleTicketDetail.expiry).format('ll')}</span>
              </p>
            }
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
