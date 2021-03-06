import React from 'react';
import { userProjects, userWorkHistory, getGoogleAPIKey } from '../Services/CommonAPI';
import * as moment from "moment";
import Loader from '../Loader/Loader';
import { Link } from 'react-router-dom';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { notification } from 'antd';
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} from "react-google-maps";
import Support from '../Support/Support';

export default class Projects extends React.Component {

  state = {
    loading: false,
    projectArray: [],
    pictureList: '',
    emptyProject: '',
    projectName: '',
    companyName: '',
    noImageAvailable: '',
    latitude: 0,
    longitude: 0,
    googleAPIKey: '',
    loading1: false
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([userWorkHistory(), getGoogleAPIKey()]).then((values) => {
        if (values[0] && values[0].status === 200 && values[0].data.data && values[0].data.data !== [] && values[1] && values[1].status === 200) {
          if (values[0].data.data.length > 0) {
            this.setState({
              projectArray: values[0].data.data.sort().reverse(),
              projectName: values[0].data.data && values[0].data.data[0].projectName,
              companyName: values[0].data.data && values[0].data.data[0].companyName,
              latitude: values[0].data.data && values[0].data.data[0].latitude,
              longitude: values[0].data.data && values[0].data.data[0].longitude,
              googleAPIKey: `https://maps.googleapis.com/maps/api/js?key=${values[1].data.data}&v=3.exp&libraries=geometry,drawing,places`
            }, () => {
              const firstData = values[0].data.data[0].projectId;
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
            });
          } else {
            this.setState({ loading: false, emptyProject: 'Start adding some projects' })
          }
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
    this.setState({ loading1: true }, () => {
      userProjects(data.projectId).then(response => {
        if (response.data.data && response.data.data.pictureList.length > 0) {
          this.setState({
            pictureList: response.data.data && response.data.data.pictureList,
            projectName: data.projectName,
            companyName: data.companyName,
            noImageAvailable: '',
            latitude: response.data.data.project.latitude,
            longitude: response.data.data.project.longitude,
            loading1: false
          });
        } else {
          this.setState({
            pictureList: [],
            projectName: data.projectName,
            companyName: data.companyName,
            noImageAvailable: 'No Image Available for this Project!',
            latitude: response.data.data.project.latitude,
            longitude: response.data.data.project.longitude,
            loading1: false
          });
        }
      });
    })
  }

  render() {

    const { noImageAvailable, loading1 } = this.state;
    const userName = localStorage.getItem('userName');
    const labelSize = { width: "auto" };
    const labelPadding = 8;
    const {
      MarkerWithLabel
    } = require("react-google-maps/lib/components/addons/MarkerWithLabel");

    const mapStyle = [
      {
        "featureType": "all",
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      }
    ];

    const defaultMapOptions = {
      styles: mapStyle
    };

    const MapWithAMarker = withScriptjs(withGoogleMap(props =>
      <GoogleMap defaultOptions={defaultMapOptions} defaultZoom={4} defaultCenter={{ lat: parseFloat(this.state.latitude), lng: parseFloat(this.state.longitude) }}>
        {this.state.projectArray.map((data, index) => (
          <MarkerWithLabel
            labelStyle={{
              textAlign: "center",
              width: labelSize.width + "px",
              backgroundColor: "#fff",
              fontSize: "12px",
              padding: labelPadding + "px",
              fontWeight: "600",
              whiteSpace: "nowrap",
              borderRadius: "5px",
              boxShadow: "0 0 2px rgba(0,0,0,.2)",
              "text-transform": "capitalize"
            }}
            labelClass="map-label"
            labelAnchor={{ x: labelSize.width / 2 + labelPadding, y: 80 }} // key={this.state.googleAPIKey}
            icon={require('../assets/images/MapIcon.png')}
            position={{ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) }}
          >
            <span>{data.projectName}</span>
          </MarkerWithLabel>
        ))}
      </GoogleMap>
    ));

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec">
                <h1 className="p-0">{userName}</h1>
                <Support dataParentToChild={this.props.location.pathname} history={this.props.history} />
              </div>
              <div className="com-padding newpage_section">
                <div className="row">
                  <div className="col-md-12">
                    {this.state.emptyProject &&
                      <p className="text_blank">{this.state.emptyProject}</p>
                    }
                    <div className="accordion" id="projectaccordion">
                      {this.state.projectArray && this.state.projectArray.length > 0 &&
                        <div className="crd-wrap">
                          <>
                            <div className="crd-header" id="projectOne">
                              <h4>Projects</h4>
                              <Link className="add-btn btn-blue" to="/search-project"><i className="fas fa-plus-circle"></i> Add Projects</Link>
                            </div>
                            <div id="collapseOne" className="collapse show" aria-labelledby="projectOne" data-parent="#projectaccordion">
                              <div className="crd-body slider-pad">
                                <div className="row">
                                  <div className="col-md-4">
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
                                              <h5 className="timeline_datas">{data.companyName}</h5>
                                              <button onClick={() => this.getProjectDetails(data.projectId)} className="btn btn-blue mr-3">Project Details</button>
                                              <button onClick={() => this.editProject(data)} className="btn btn-dark">Edit Details</button>
                                            </div>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  </div>
                                  <div className="col-md-8">
                                    {loading1 ? <Loader /> :
                                      <div className="row">
                                        <div className="col-md-7">
                                          <div className="proj-timeline">
                                            <h4>Project Locations</h4>
                                            <span></span>
                                          </div>
                                          <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                                            <MapWithAMarker
                                              googleMapURL={this.state.googleAPIKey}
                                              loadingElement={<div style={{ height: `100%` }} />}
                                              containerElement={<div style={{ height: `400px` }} />}
                                              mapElement={<div style={{ height: `100%` }} />}
                                            />
                                          </div>
                                        </div>
                                        <div className="col-md-5">
                                          <div className="pro-details">
                                            <div className="wrap">
                                              <h4>{this.state.projectName}</h4>
                                              <span>{this.state.companyName}</span>
                                            </div>
                                          </div>
                                          <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                                            {noImageAvailable &&
                                              <div className="w_worn text-danger text-uppercase">
                                                <span className="mb-5">No Image Available For This Project</span>
                                              </div>
                                            }
                                            <Carousel autoPlay key="carousel">
                                              {this.state.pictureList && this.state.pictureList.map((data, index) => (
                                                <img src={data.imageUrl} alt="" />
                                              ))}
                                            </Carousel>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        </div>
                      }
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
