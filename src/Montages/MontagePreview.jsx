import React, { Component } from 'react';
import { notification } from 'antd';
import Loader from '../Loader/Loader';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { getMontageFiles, getMontageFilesByUserIdAndId } from '../Services/Montage';
import Support from '../Support/Support';

export default class MontagePreview extends Component {

  audio = new Audio();

  state = {
    loading: false,
    musicUrl: '',
    pauseButton: false
  }

  formRef = React.createRef();

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([
        getMontageFilesByUserIdAndId(this.props.match.params.id),
        getMontageFiles(this.props.match.params.id)
      ]).then(values => {
        if (values[0] && values[0].status === 200 && values[1] && values[1].status === 200) {
          this.setState({
            loading: false,
            images: values[1].data.data,
            musicUrl: values[0].data.data.musicUrl
          }, () => {
            if (this.state.musicUrl !== '') {
              this.setState({ pauseButton: true }, () => {
                this.audio.src = this.state.musicUrl;
                this.audio.play();
              });
            }
          });
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while fetching results!'
            });
          });
        }
      }).catch(err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching results!'
          });
        });
      });
    });
  }

  componentWillUnmount() {
    this.audio.pause();
  }

  playPause() {
    this.setState({ pauseButton: !this.state.pauseButton }, () => {
      this.state.pauseButton ? this.audio.play() : this.audio.pause();
    });
  }

  render() {

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="addticketform com-padding mt-4">
                <div className="row">
                  <div className="col-12 col-md-6 offset-md-3">
                    <div className="form-border crd-wrp">
                      <div className="proj-timeline">
                        <h4 className="k-card-title mb-0 text-uppercase mon_p"> Montage Preview
                            {this.state.pauseButton ?
                            <button className="btn btn-dark support_Mon_Pre"  onClick={() => this.playPause()}>
                              <i className="fa fa-pause"></i>
                            </button> :
                            <button className="btn btn-dark support_Mon_Pre" onClick={() => this.playPause()}>
                              <i className="fa fa-play"></i>
                            </button>
                          }
                           <Support dataParentToChild={this.props.location.pathname} history={this.props.history}/>
                        </h4>
                        <div className="manufacture-content p-4">
                          <div id="collapseOne" className="collapse show" aria-labelledby="projectOne" data-parent="#projectaccordion">
                            <div className="crd-body slider-pad">
                              <div className="pro-img slider-main mb-2 embed-responsive embed-responsive-16by9">
                                <Carousel autoPlay key="carousel" infiniteLoop={true} interval={5000}>
                                  {this.state.images && this.state.images.map((data, index) => (
                                    <img src={data.fileUrl} alt="" />
                                  ))}
                                </Carousel>
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
