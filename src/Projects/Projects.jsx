import React from 'react'
import SideNav from '../SideNav/SideNav';
import { userProjects, userWorkHistory, getTicketsByUserId, getTicketDetails } from '../Services/CommonAPI';
import * as moment from "moment";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { Modal, Image, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getUserWorkHistory } from '../Services/Experience';

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
        singleTicketDetail: '',
        workHistory: []
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
            });
            this.setState({ ticketArray: response.data.data });
        });

        getUserWorkHistory().then(workRes => {
            console.log('workRes => ', workRes);
            this.setState({ workHistory: workRes.data.data })
        }).catch(err => {
            console.log('err => ', err);

        })
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

    editTicket = (id) => {
        this.props.history.push(`/edit-ticket/${id}`)
    }

    editExperience = (id) => {
        this.props.history.push(`/edit-experience/${id}`)
    }

    render() {

        const userName = localStorage.getItem('userName');

        return (
            <div>
                <SideNav />
                <main className="index-main">
                    <section className="index-sec">
                        <h1>{userName}</h1>
                        <div className="edit-sec">
                            <h2>Company Name</h2>
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
                                                            {this.state.pictureList.map((data, index) => (
                                                                <img src={data.imageUrl} alt="" />
                                                            ))}
                                                        </Carousel>
                                                    </div>
                                                    <div className="pro-details">
                                                        <a className="close-proj"><i className="fas fa-times-circle"></i></a>
                                                        <div className="wrap">
                                                            <h4>{this.state.projectName}</h4>
                                                            <span>{this.state.companyName}</span>
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
                                                <ul className="ticket-list">
                                                    {this.state.ticketArray.map((data, index) => (
                                                        <li onClick={() => this.onModalPopUp(data.id)} className="ticket-block li-position" style={this.state.changeBackground ? { 'backgroundColor': "#fcecc3" } : { 'backgroundColor': "white" }}>
                                                            <div className="ticket-img"><img src={data.backPictureUrl ? data.backPictureUrl : ''} alt="" /></div>
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
                                    <Link className="add-btn btn-blue" to="/add-experience"><i className="fas fa-plus-circle"></i> Add Experience</Link>
                                    <div className="accordion" id="ticketaccordion">
                                        <div className="crd-wrap">
                                            <div className="crd-header" id="ticketOne">
                                                <h4><img src={require("../assets/images/icon_ticket.png")} alt="" /> Experience</h4>
                                                <i className="far fa-chevron-up" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne"></i>
                                            </div>
                                            <div id="collapseOne" className="collapse show" aria-labelledby="ticketOne" data-parent="#ticketaccordion">
                                                <ul className="ticket-list">
                                                    {this.state.workHistory.map((data, index) => (
                                                        <li className="ticket-block li-position">
                                                            <div className="ticket-img"></div>
                                                            <div className="ticket-detail">
                                                                <h4>{data.companyName}</h4>
                                                                <h4>{data.roleName}</h4>
                                                                <h4>{data.companyName}</h4>
                                                                <span>{data.tradeName}</span>
                                                            </div>
                                                            <div className="ticket-date">{moment(data.startDate).format('ll')}</div>
                                                            <div className="ticket-date">{moment(data.endDate).format('ll')}</div>
                                                            <button onClick={() => this.editExperience(data.id)} className="edit-btn">Edit</button>
                                                        </li>
                                                    ))}
                                                </ul>
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
                        <div className="stage-img">
                            <Image className="w-100" src={this.state.singleTicketDetail.backPictureUrl} />
                        </div>
                    </Col>
                    <Modal.Body>
                        <p className="stage-detail">
                            <span className="stage-label">Issued By:</span> <span>{this.state.singleTicketDetail.issuedBy ? this.state.singleTicketDetail.issuedBy : '-'}</span>
                        </p>
                        <p className="stage-detail">
                            <span className="stage-label">Created On:</span> <span>{this.state.singleTicketDetail.dateCreated ? moment(this.state.singleTicketDetail.dateCreated).format('ll') : '-'}</span>
                        </p>
                        <p className="stage-detail border-bottom-0">
                            <span className="stage-label">Expiry Date:</span> <span>{(this.state.singleTicketDetail.expiry) ? moment(this.state.singleTicketDetail.expiry).format('ll') : '-'}</span>
                        </p>
                    </Modal.Body>
                    {/* <Modal.Body>Created On: {this.state.singleTicketDetail.dateCreated ? this.state.singleTicketDetail.dateCreated : '-'}</Modal.Body>
          <Modal.Body>Expiry Date: {(this.state.singleTicketDetail.expiry) ? moment(this.state.singleTicketDetail.expiry).format('ll') : '-'}</Modal.Body> */}
                </Modal>
            </div>
        )
    }
}
