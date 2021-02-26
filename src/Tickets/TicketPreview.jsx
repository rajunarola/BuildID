import React, { Component } from 'react'
import Loader from '../Loader/Loader';
import * as moment from "moment";
import { Link } from 'react-router-dom';
import { getTicketDetails, getTicketsByUserId } from '../Services/CommonAPI';
import { Modal, Image, Col } from 'react-bootstrap';
import { notification } from 'antd';

export default class TicketPreview extends Component {

  state = {
    ticketArray: [],
    singleTicketDetail: [],
    modalShow: false,
    loading: false
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getTicketsByUserId().then(Res => {
        if (Res.status === 200) {
          this.setState({ ticketArray: Res.data.data, loading: false })
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while fetching data!'
            });
          });
        }
      }).catch(err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching data!'
          });
        });
      });
    })
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

  render() {
    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Tickets</h1></div>
              <div className="com-padding newpage_section">
                <div className="row">
                  <div className="col-md-12">

                    {this.state.ticketArray.length > 0 &&
                      <div className="accordion" id="ticketaccordion">
                        <div className="crd-wrap">

                          <div className="crd-header" id="ticketOne">
                            <h4>Tickets</h4>
                            <Link className="add-btn btn-blue" to="/add-ticket"><i className="fas fa-plus-circle"></i> Add Ticket</Link>
                          </div>

                          <div id="collapseOne" className="collapse show" aria-labelledby="ticketOne" data-parent="#ticketaccordion">
                            <div className="ticket-list overlay-scroll row">
                              {this.state.ticketArray.map((data, index) => (
                                <div className="col-xl-4 col-lg-6 col-md-12">
                                  <div onClick={() => this.onModalPopUp(data.id)} className="ticket-block li-position" style={moment(data.expiry).isBefore(new Date()) ? { 'backgroundColor': "#fcecc3" } : { 'backgroundColor': "white" }}>
                                    <div className="ticket-img"><img src={data.backPictureUrl || data.frontPictureUrl} alt="" /></div>
                                    <div className="ticket-detail">
                                      <h4>{data.ticketType}</h4>
                                      <span>{data.issuedBy}</span>
                                    </div>
                                    <div className="ticket-date">{moment(data.expiry).format('ll')}</div>
                                    <button onClick={() => this.editTicket(data.id)} className="edit-btn">Edit</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
            </section>
          </main>
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
