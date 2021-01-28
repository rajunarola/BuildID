import React, { Component } from 'react';
import { userProjects } from '../Services/CommonAPI';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import { notification } from 'antd';
import Loader from '../Loader/Loader';

export default class ViewSearchedProject extends Component {

    state = {
        loading: false,
        projectDetails: [],
        pictureList: []
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            userProjects(localStorage.getItem('projectId')).then(res => {
                if (res.status === 200) {
                    this.setState({ loading: false, pictureList: res.data.data.pictureList, projectDetails: res.data.data.project })
                }
            }).catch(err => {
                this.setState({ loading: false }, () => {
                    notification.error({
                        message: 'Error',
                        description: 'There was an error while fetching Project Details!'
                    });
                });
            });
        });
    }

    render() {

        return (
            <>
                {this.state.loading ? <Loader /> :
                    <main className="index-main">
                        <section className="index-sec">
                            <div className="edit-sec">
                                {/* <div className="editprofile">Searched Project</div> */}
                            </div>
                            <div className="addticketform com-padding">
                                <div className="row">
                                    <div className="col-lg-4 col-md-6 col-12">
                                        <div className="form-border crd-wrp atf-card">
                                            <div className="proj-timeline">
                                                <h4 className="k-card-title">Searched Project</h4>
                                                <h3>Is this a project that you worked on?</h3>
                                                <p className="pt-subtext">We will add it to your resume, ask you questions about it so you can earn more BuildBucks!</p>
                                                <div className="manufacture-form manufacture-content pt-3">
                                                    {this.state.pictureList && this.state.pictureList.length > 0 ?
                                                        <Carousel autoPlay key="carousel">
                                                            {this.state.pictureList.map((data, index) => (
                                                                <img src={data.imageUrl} alt="" />
                                                            ))}
                                                        </Carousel>
                                                        :
                                                        <span className="text-danger text-uppercase">No Image Available</span>}
                                                </div>
                                                {this.state.projectDetails &&
                                                    <div className="proj-timeline project-address-location">
                                                        <>
                                                            <p className="stage-detail">
                                                                <span className="stage-label">Name:</span> <span>{this.state.projectDetails.name}</span>
                                                            </p>
                                                            <p className="stage-detail">
                                                                <span className="stage-label">Address:</span> <span>{this.state.projectDetails.address}</span>
                                                            </p>
                                                        </>
                                                    </div>
                                                }
                                            </div>
                                            <div className="atfc-bottom d-flex align-items-center justify-content-between">
                                                <button className="btn btn-blue" onClick={() => this.props.history.push(`/select-project`)}><i className="fa fa-check"></i></button>
                                                <button className="btn btn-dark" onClick={() => this.props.history.push(`project-details/${localStorage.getItem('projectId')}`)}>Project Details</button>
                                                <button className="btn btn-danger" onClick={() => this.props.history.push(`/search-project`)}><i className="fa fa-times"></i></button>
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
