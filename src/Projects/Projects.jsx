import React from 'react'
import SideNav from '../SideNav/SideNav';
import { userProjects, userWorkHistory, getTicketsByUserId, getTicketDetails } from '../Services/CommonAPI';
import * as moment from "moment";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Modal, Image, Col } from 'react-bootstrap';

export default class Projects extends React.Component {

  state = {
    projectArray: [],
    ticketArray: [],
    projectID: '',
    projectName: '',
    companyName: '',
    pictureList: [],
    updatedProject: '',
    changeBackground: false,
    modalShow: false,
    singleTicketDetail: ''
  }

  componentDidMount() {
    userWorkHistory().then(response => {
      const datenewd = response.data.data.sort((a, b) => new Date(moment(b.endDate).format('YYYY')) - new Date(moment(a.endDate).format('YYYY')))
      this.setState({ projectArray: response.data.data });
      const firstData = this.state.projectArray[0].projectId;
      const projectName = this.state.projectArray[0].projectName;
      const companyName = this.state.projectArray[0].companyName;
      this.setState({ projectName: projectName, projectID: firstData, companyName: companyName })
      userProjects(firstData).then(response => {
        const pictureList = response.data.data.pictureList;
        this.setState({ pictureList: pictureList });
      });
    });

    getTicketsByUserId().then(response => {
      response.data.data.map((data, index) => {
        if (moment(data.expiry).format('MM-DD-YYYY') < moment(new Date()).format('MM-DD-YYYY')) {
          this.setState({ changeBackground: true });
        } else {
          this.setState({ changeBackground: false });
        }
      })

      this.setState({ ticketArray: response.data.data });
    });
  }

  getProjectDetails = (id) => {
    userProjects(id).then(response => {
      const pictureList = response.data.data.pictureList;
      this.state.projectArray.map(data => {
        if (data.projectId === id) {
          this.setState({ companyName: data.companyName })
        }
      });
      this.setState({ pictureList: pictureList, updatedProject: response.data.data, projectName: response.data.data.project.name });
    }).catch(error => {
      console.log('error', error)
    });
  }

  onModalPopUp = (id) => {
    this.setState({ modalShow: true });
    getTicketDetails(id).then(res => {
      this.setState({ singleTicketDetail: res.data.data });
      console.log('res => ', res.data.data);

    }).catch(err => {
      console.log('err => ', err);

    })
  }

  onModalPopUpHide = () => {
    this.setState({ modalShow: false });

  }


  render() {

    return (
      <div>
        <SideNav />
        <main class="index-main">
          <section class="index-sec">
            <h1>Grant Morgan</h1>
            <div class="edit-sec">
              <h2>Company Name</h2>
              <a href="javascript:;" class="editprofile"><i class="fas fa-cog"></i> Edit Profile</a>
            </div>
            <div class="com-padding">
              <div class="row">
                <div class="col-lg-4">
                  <a class="add-btn btn-blue" href="javascript:;"><i class="fas fa-plus-circle"></i> Add Projects</a>
                  <div class="accordion" id="projectaccordion">
                    <div class="crd-wrap">
                      <div class="crd-header" id="projectOne">
                        <h4>Projects</h4>
                        <i class="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                      </div>
                      <div id="collapseOne" class="collapse show" aria-labelledby="projectOne" data-parent="#projectaccordion">
                        <div class="crd-body slider-pad">
                          <div class="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                            <Carousel autoPlay>
                              {this.state.pictureList.map((data, index) => (
                                <img src={data.imageUrl} alt="data" />
                              ))}
                            </Carousel>
                          </div>
                          <div class="pro-details">
                            <a class="close-proj"><i class="fas fa-times-circle"></i></a>
                            <div class="wrap">
                              <h4>{this.state.projectName}</h4>
                              <span>{this.state.companyName}</span>
                              {/* <a href="javascript:;" class="btn btn-blue">Project Details</a> */}
                            </div>
                            <a class="approve-proj"><i class="fas fa-check-circle"></i></a>
                          </div>
                          <div class="proj-timeline">
                            <h4>My Projects</h4>
                            <ul class="timeline-sec">
                              {this.state.projectArray.map((data, index) => (
                                <li>
                                  <h4 class="year">{moment(data.endDate).format('YYYY')}</h4>
                                  <div class="timeline-block">
                                    <h4>{data.projectName}</h4>
                                    <span>{moment(data.startDate).format('MMM YYYY')} - {moment(data.endDate).format('MMM YYYY')}</span>
                                    <span>{data.tradeName}</span>
                                    <span>{data.roleName}</span>
                                    <h5>{data.companyName}</h5>
                                    {/* <p>18 Questions <a class="links" href="javascript:;">Questions</a></p> */}
                                    <button onClick={() => this.getProjectDetails(data.projectId)} class="btn btn-blue">Project Details</button>
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
                <div class="col-lg-4">
                  <a class="add-btn btn-blue" href="javascript:;"><i class="fas fa-plus-circle"></i> Add Projects</a>
                  <div class="accordion" id="ticketaccordion">
                    <div class="crd-wrap">
                      <div class="crd-header" id="ticketOne">
                        <h4><img src={require("../assets/images/icon_ticket.png")} alt="Project icon" /> Tickets</h4>
                        <i class="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                      </div>
                      <div id="collapseOne" class="collapse show" aria-labelledby="ticketOne" data-parent="#ticketaccordion">
                        <ul class="ticket-list">
                          {this.state.ticketArray.map((data, index) => (
                            <li onClick={() => this.onModalPopUp(data.id)} class="ticket-block" style={this.state.changeBackground ? { 'backgroundColor': "#fcecc3" } : { 'backgroundColor': "white" }}>
                              <div class="ticket-img"><img src={data.backPictureUrl} alt="Tickets" /></div>
                              <div class="ticket-detail">
                                <h4>{data.ticketType}</h4>
                                <span>{data.issuedBy}</span>
                              </div>
                              <div class="ticket-date">{moment(data.dateCreated).format('ll')}</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="col-lg-4">
                  <div class="accordion" id="qaaccordion">
                    <div class="crd-wrap">
                      <div class="crd-header" id="ticketOne">
                        <h4>Quiz</h4>
                        <i class="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                      </div>
                      <div id="collapseOne" class="collapse show" aria-labelledby="ticketOne" data-parent="#qaaccordion">
                        <div class="qa-sec">
                          <h4>The question wll go here it should take up a maximum of two lines of copy?</h4>
                          <form>
                            <ul class="ans-sec">
                              <li>
                                <input type="radio" name="ansradio" checked />
                                <span>An answer will go here</span>
                              </li>
                              <li>
                                <input type="radio" name="ansradio" />
                                <span>An answer will go here</span>
                              </li>
                              <li>
                                <input type="radio" name="ansradio" />
                                <span>An answer will go here</span>
                              </li>
                            </ul>
                            <div class="crd-body">
                              <button type="submit" class="add-btn btn-blue" href="javascript:;">Submit Answer</button>
                              <a class="link-btn" href="javascript:;">Skip Questions</a>
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
        <Modal show={this.state.modalShow} onHide={() => this.onModalPopUpHide()}>
          <Modal.Header className="stagehead text-white" closeButton>
            <Modal.Title>{this.state.singleTicketDetail.ticketType}</Modal.Title>
          </Modal.Header>
          <Col>
            <div class="stage-img">
              <Image className="w-100" src={this.state.singleTicketDetail.backPictureUrl} />
            </div>
          </Col>
          <Modal.Body>
            <p class="stage-detail">
              <span class="stage-label">Issued By:</span> <span>{this.state.singleTicketDetail.issuedBy ? this.state.singleTicketDetail.issuedBy : '-'}</span>
            </p>
            <p class="stage-detail">
              <span class="stage-label">Created On:</span> <span>{this.state.singleTicketDetail.dateCreated ? moment(this.state.singleTicketDetail.dateCreated).format('ll') : '-'}</span>
            </p>
            <p class="stage-detail border-bottom-0">
              <span class="stage-label">Expiry Date:</span> <span>{(this.state.singleTicketDetail.expiry) ? moment(this.state.singleTicketDetail.expiry).format('ll') : '-'}</span>
            </p>
          </Modal.Body>
          {/* <Modal.Body>Created On: {this.state.singleTicketDetail.dateCreated ? this.state.singleTicketDetail.dateCreated : '-'}</Modal.Body>
          <Modal.Body>Expiry Date: {(this.state.singleTicketDetail.expiry) ? moment(this.state.singleTicketDetail.expiry).format('ll') : '-'}</Modal.Body> */}
        </Modal>
      </div>
    )
  }
}
