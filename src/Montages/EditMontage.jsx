import React, { Component } from 'react';
import Loader from '../Loader/Loader';
import {
  deleteMontageFile,
  getMontageFiles,
  getMontageFilesByUserIdAndId,
  getMusicFiles,
  saveMontage,
  saveMontageFile
} from '../Services/Montage'
import { Form, Input, notification } from 'antd';
import { getUserProjectPicture } from '../Services/Project';
import moment from 'moment';
import swal from 'sweetalert';

export default class EditMontage extends Component {

  formRef = React.createRef();
  audio = new Audio();

  state = {
    loading: false,
    images: [],
    selectedFiles: [],
    userPictures: [],
    musicUrl: '',
    musicFiles: [],
    newlySelectedImages: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      this.apiCall();
    });
  }

  apiCall = () => {
    Promise.all([
      getMontageFilesByUserIdAndId(this.props.match.params.id),
      getMontageFiles(this.props.match.params.id),
      getUserProjectPicture(),
      getMusicFiles()
    ]).then(values => {
      if (values[0] && values[0].status === 200 &&
        values[1] && values[1].status === 200 &&
        values[2] && values[2].status === 200 &&
        values[3] && values[3].status === 200
      ) {
        this.setState({
          loading: false,
          selectedMusicFile: values[0].data.data.musicUrl,
          images: values[1].data.data,
          userPictures: values[2].data.data,
          musicFiles: values[3].data.data
        }, () => {
          this.formRef.current.setFieldsValue({
            montageName: values[0].data.data.name,
          });
        });
      }
    });
  }

  removeImage = (i, data) => {
    const { images } = this.state;
    images.splice(i, 1);
    this.setState({ images }, () => {
      if (data.id) {
        deleteMontageFile(data.id).then(res => {
          if (res.status === 200) {
            notification.success({
              message: 'Success',
              description: 'Image deleted successfully!'
            })
          } else {
            notification.error({
              message: 'Error',
              description: 'There was an error while deleting an image!'
            });
          }
        }).catch(err => {
          notification.error({
            message: 'Error',
            description: 'There was an error while deleting an image!'
          });
        });
      }
    });
  };

  selectedImages(e, data, projectId) {
    const clonedSuggestion = [...this.state.newlySelectedImages];
    var categoryTag = Object.assign([], this.state.newlySelectedImages);
    if (e.target.checked) {
      clonedSuggestion.push(data);
      this.setState({ newlySelectedImages: clonedSuggestion })
    } else {
      let index3 = categoryTag.findIndex((data) => data.projectId === projectId);
      this.state.newlySelectedImages.splice(index3, 1);
    }
  }

  saveMontageFiles() {
    for (let index = 0; index < this.state.newlySelectedImages.length; index++) {
      const element = this.state.newlySelectedImages[index];
      const data = {
        Id: 0,
        MontageId: this.state.montageId,
        FileUrl: element.imageUrl,
        FileOrder: index + 1,
        ModifiedBy: parseInt(localStorage.getItem('userID')),
        DateModified: moment(new Date()).format()
      }
      saveMontageFile(data).then(res => {
        if (res.data.status === true) {
          if (index + 1 === this.state.newlySelectedImages.length) {
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Success',
                description: 'Montage have been successfully edited!'
              });
            });
          }
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while uploading images to the montage!'
            });
          });
        }
      }).catch(err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while uploading images to the montage!'
          });
        });
      });
    }
  }

  removeMusicUrl = () => {
    swal({
      title: "Are you sure you want to delete the selected montage music file?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({ selectedMusicFile: '' })
      } else {
        notification.info({
          message: 'Success',
          description: 'Your montage music file is Safe!'
        });
      }
    });
  }

  playPauseMusic = (value) => {
    this.audio.src = this.state.selectedMusicFile;
    if (value === "Play") {
      this.audio.play()
    } else if (value === "Pause") {
      this.audio.pause()
    }
  }

  playAudio = (e, data, type) => {
    e.preventDefault();
    this.setState({ playedMusicFile: data }, () => {
      this.audio.src = this.state.playedMusicFile;
      if (type === 'play') {
        this.audio.play();
      } else if (type === 'pause') {
        this.audio.pause();
      }
    })
  }

  selectMusicFile = (id) => {
    this.setState({ selectedMusicFile: id })
  }

  render() {

    const { images, userPictures, musicFiles } = this.state;

    const editMontage = (values) => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: this.props.match.params.id,
          Name: values.montageName,
          MusicUrl: this.state.selectedMusicFile,
          ModifiedBy: parseInt(localStorage.getItem('userID')),
          DateModified: moment(new Date()).format()
        }
        saveMontage(data).then(Res => {
          if (Res.status === 201) {
            this.setState({ montageId: Res.data.data }, () => {
              if (this.state.newlySelectedImages.length > 0) {
                this.saveMontageFiles();
              } else {
                this.setState({ loading: false }, () => {
                  notification.success({
                    message: 'Success',
                    description: 'Montage have been successfully edited!'
                  });
                  this.apiCall();
                });
              }
            });
          } else {
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Error',
                description: 'There was an error while edting a montage!'
              });
            });
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.success({
              message: 'Error',
              description: 'There was an error while edting a montage!'
            });
          });
        });
      })
    }

    return (

      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Edit Montage</h1></div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header">
                    <h4>Edit Montage</h4>
                  </div>
                  <div className="addticketform container-fluid">
                    <div className="row">
                      <div className="col-12 p-0">
                        <div className="crd-wrp">
                          <div className="proj-timeline">
                            <div className="">
                              <Form className="row" ref={this.formRef} onFinish={editMontage}>
                                <div className="form-group col-md-12">
                                  <Form.Item name="montageName">
                                    <Input />
                                  </Form.Item>
                                </div>
                                <div className="col-md-12">
                                  {this.state.selectedMusicFile &&
                                    <div className="music_file_section">
                                      <div>{this.state.selectedMusicFile}</div>
                                      <div className="plays_buttons">
                                        <button type="button" className="btn btn-danger fa fa-trash" onClick={() => this.removeMusicUrl()}></button>
                                        <div className="btn btn-blue" onClick={() => this.playPauseMusic("Play")}><i className="fa fa-play" aria-hidden="true"></i></div>
                                        <div className="btn btn-dark" onClick={() => this.playPauseMusic("Pause")}><i className="fa fa-pause" aria-hidden="true"></i></div>
                                      </div>
                                    </div>
                                  }
                                </div>

                                {musicFiles.map((files, index) => (
                                  <div className="col-xl-4 col-lg-6 col-md-6">
                                    <div className="music_file_section">
                                      <div className="music_name_f">
                                        <label>
                                          <input type="radio" name="radio" id={index + 1} value={index + 1} onChange={() => this.selectMusicFile(files.fileUrl)}></input>
                                    Music File - {index + 1}
                                        </label>
                                      </div>
                                      <div className="plays_buttons">
                                        <button type="button" className="btn btn-blue" onClick={(e) => this.playAudio(e, files.fileUrl, 'play')}><i className="fa fa-play" aria-hidden="true"></i></button>
                                        <button type="button" className="btn btn-dark" onClick={(e) => this.playAudio(e, files.fileUrl, 'pause')}><i className="fa fa-pause" aria-hidden="true"></i></button>
                                      </div>
                                    </div>
                                  </div>
                                ))}

                                <div className="col-md-12">
                                  <div className="gallary_section_s row">
                                    {images.map((data, index) => (
                                      <div className="col-xl-4 col-lg-6 col-md-6">
                                        <div className="preview" key={index}>
                                          <div className="gallary_bg_hn" htmlFor="gallery"
                                            style={{ backgroundImage: `url(${data.fileUrl ? data.fileUrl : data.imageUrl})`, pointerEvents: 'none' }}>
                                            <div className="removeImage" onClick={() => this.removeImage(index, data)}>
                                              <svg width="10" height="10" viewBox="0 0 10 10" fill="white" xmlns="http://www.w3.org/2000/svg" >
                                                <path d="M1 9L5 5M9 1L5 5M5 5L1 1L9 9" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                              </svg>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="col-md-12">
                                  <div className="gallary_section_s row">
                                    {userPictures.map((data, index) => (
                                      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                        <div className="preview" key={index}>
                                          <label>
                                            <div className="gallary_name_sec">
                                              <input type="checkbox" onChange={(e) => this.selectedImages(e, data, data.projectId)} />
                                              <p>{data.projectName}</p>
                                            </div>
                                            <div className="gallary_bg_hn" htmlFor="gallery" style={{ backgroundImage: `url(${data.imageUrl})`, pointerEvents: 'none' }}>
                                            </div>
                                          </label>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                                  <button className="btn btn-blue" type="submit">Edit Montage</button>
                                </div>

                              </Form>
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
