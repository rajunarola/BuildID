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
    pictureList: [],
    emptyProject: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      userWorkHistory().then((values) => {
        if (values && values.status === 200) {
          this.setState({
            projectArray: values.data.data
          }, () => {
            if (values.data.data.length > 0) {
              const firstData = values.data.data[0].projectId;
              userProjects(firstData).then(response => {
                const pictureList = response.data.data.pictureList;
                this.setState({ pictureList: pictureList, loading: false });
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

  render() {

    const userName = localStorage.getItem('userName');

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec">
                <h1 className="p-0">{userName}</h1>
                {/* <Link to="/edit-profile" className="editprofile"><i className="fas fa-cog"></i> Edit Profile</Link> */}
              </div>
              <div className="com-padding">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    {this.state.emptyProject &&
                      <p className="text_blank">{this.state.emptyProject}</p>
                    }
                    <Link className="add-btn btn-blue" to="/search-project"><i className="fas fa-plus-circle"></i> Add Projects</Link>
                    <div className="accordion" id="projectaccordion">
                      <div className="crd-wrap">
                        {this.state.projectArray && this.state.projectArray.length > 0 &&
                          <>
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