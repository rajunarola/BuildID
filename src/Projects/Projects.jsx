import React from 'react';
import { userProjects, userWorkHistory } from '../Services/CommonAPI';
import * as moment from "moment";
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { notification } from 'antd';
export default class Projects extends React.Component {

  state = {
    loading: false,
    projectArray: [],
    pictureList: '',
    emptyProject: '',
    projectName: '',
    companyName: '',
    noImageAvailable: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      userWorkHistory().then((values) => {
        if (values && values.status === 200) {
          this.setState({
            projectArray: values.data.data.sort().reverse(),
            projectName: values.data.data && values.data.data[0].projectName,
            companyName: values.data.data && values.data.data[0].companyName
          }, () => {
            if (values.data.data.length > 0) {
              const firstData = values.data.data[0].projectId;
              userProjects(firstData).then(response => {
                if (response.data.data && response.data.data.pictureList.length > 0) {
                  this.setState({
                    loading: false,
                    pictureList: response.data.data && response.data.data.pictureList,
                  });
                } else {
                  this.setState({
                    loading: false,
                    noImageAvailable: 'No Image Available for this Project!',
                    pictureList: []
                  })
                }
              });
            } else {
              this.setState({ loading: false, emptyProject: 'Start adding some projects' })
            }
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
        });
      });
    });
  }

  getProjectDetails = (id) => {
    this.props.history.push(`/project-details/${id}`)
  }

  editProject = (data) => {
    this.props.history.push(`/edit-project/${data.id}`)
  }

  changePicInCarousel = (data) => {
    userProjects(data.projectId).then(response => {
      if (response.data.data && response.data.data.pictureList.length > 0) {
        this.setState({
          pictureList: response.data.data && response.data.data.pictureList,
          projectName: data.projectName,
          companyName: data.companyName,
          noImageAvailable: ''
        });
      } else {
        this.setState({
          pictureList: [],
          projectName: data.projectName,
          companyName: data.companyName,
          noImageAvailable: 'No Image Available for this Project!'
        });
      }
    });
  }

  render() {

    const { noImageAvailable } = this.state;

    const userName = localStorage.getItem('userName');

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec">
                <h1 className="p-0">{userName}</h1>
              </div>
              <div className="com-padding newpage_section">
                <div className="row">
                  <div className="col-md-12">
                    {this.state.emptyProject &&
                      <p className="text_blank">{this.state.emptyProject}</p>
                    }
                    <div className="accordion" id="projectaccordion">
                      <div className="crd-wrap">
                        {this.state.projectArray && this.state.projectArray.length > 0 &&
                          <>
                            <div className="crd-header" id="projectOne">
                              <h4>Projects</h4>
                              <Link className="add-btn btn-blue" to="/search-project"><i className="fas fa-plus-circle"></i> Add Projects</Link>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="projectOne" data-parent="#projectaccordion">
                              <div className="crd-body slider-pad">
                                <div className="row">
                                  <div className="col-md-6">
                                    <div className="pro-details">
                                      <div className="wrap">
                                        <h4>{this.state.projectName}</h4>
                                        <span>{this.state.companyName}</span>
                                      </div>
                                    </div>
                                    <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                                      {noImageAvailable &&
                                        <div className="w_worn text-danger text-uppercase">
                                          <span>No Image Available For This Project</span>
                                        </div>
                                      }
                                      <Carousel autoPlay key="carousel">
                                        {this.state.pictureList && this.state.pictureList.map((data, index) => (
                                          <img src={data.imageUrl} alt="" />
                                        ))}
                                      </Carousel>
                                    </div>
                                  </div>
                                  <div className="col-md-6">
                                    <div className="proj-timeline">
                                      <h4>My Projects</h4>
                                      <ul className="timeline-sec">
                                        {this.state.projectArray.map((data, index) => (
                                          <li style={{ cursor: 'pointer' }} onClick={() => this.changePicInCarousel(data)}>
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
                          </>
                        }
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