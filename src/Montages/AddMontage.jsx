import React, { Component } from 'react'
import { Input, Form, notification } from 'antd'
import { getUserProjectPicture } from '../Services/Project';
import Loader from '../Loader/Loader';
import { getMusicFiles, saveMontage, saveMontageFile } from '../Services/Montage';
import moment from 'moment';

export default class AddMontage extends Component {

  formRef = React.createRef();
  audio = new Audio();

  state = {
    loading: false,
    userPictures: [],
    musicFiles: [],
    playedMusicFile: '',
    selectedFiles: [],
    montageId: '',
    selectedMusicFile: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([getUserProjectPicture(), getMusicFiles()]).then(values => {
        if (values[0] && values[0].status === 200 && values[1] && values[1].status === 200) {
          this.setState({
            loading: false,
            userPictures: values[0].data.data,
            musicFiles: values[1].data.data
          });
        } else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: 'There was an error while fetching results!'
            })
          })
        }
      }).catch(Err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching results!'
          });
        });
      });
    });
  }

  selectedImages(e, data, projectId) {
    const clonedSuggestion = [...this.state.selectedFiles];
    var categoryTag = Object.assign([], this.state.selectedFiles);
    if (e.target.checked) {
      clonedSuggestion.push(data);
      this.setState({ selectedFiles: clonedSuggestion })
    } else {
      let index3 = categoryTag.findIndex((data) => data.projectId === projectId);
      this.state.selectedFiles.splice(index3, 1);
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

  saveMontageFiles() {
    for (let index = 0; index < this.state.selectedFiles.length; index++) {
      const element = this.state.selectedFiles[index];
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
          if (index + 1 === this.state.selectedFiles.length) {
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Success',
                description: 'A new montage has been successfully added!'
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
      });
    }
  }

  selectMusicFile = (id) => {
    this.setState({ selectedMusicFile: id })
  }

  render() {

    const { userPictures, musicFiles } = this.state;

    const onFinish = (values) => {
      this.setState({ loading: true }, () => {
        const data = {
          Id: 0,
          Name: values.montageName,
          MusicUrl: this.state.selectedMusicFile,
          ModifiedBy: parseInt(localStorage.getItem('userID')),
          DateModified: moment(new Date()).format()
        }
        saveMontage(data).then(Res => {
          if (Res.status === 201) {
            this.setState({ montageId: Res.data.data }, () => {
              this.saveMontageFiles();
            });
          } else {
            this.setState({ loading: false }, () => {
              notification.success({
                message: 'Error',
                description: 'There was an error while creating a new montage!'
              });
            });
          }
        }).catch(err => {
          this.setState({ loading: false }, () => {
            notification.success({
              message: 'Error',
              description: 'There was an error while creating a new montage!'
            });
          });
        });
      });
    }

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Edit Ticket</h1></div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header">
                    <h4>Edit Ticket</h4>
                  </div>
                  <div className="addticketform container-fluid">
                    <div className="row">
                      <div className="col-md-12 p-0">
                        <div className="crd-wrp">
                          <div className="proj-timeline">
                            <div className="">
                              <Form className="row" onFinish={onFinish} ref={this.formRef}>
                                <div className="form-group col-md-12">
                                  <Form.Item name="montageName" rules={[{ required: true, message: 'Please enter montage name!' }]}>
                                    <Input placeholder="Montage Name" />
                                  </Form.Item>
                                </div>
                                <div className="col-md-12">
                                  <div className="row">
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
                                            <button type="button" className="btn btn-blue" onClick={(e) => this.playAudio(e, files.fileUrl, 'play')}> <i className="fa fa-play" aria-hidden="true"></i></button>
                                            <button type="button" className="btn btn-dark" onClick={(e) => this.playAudio(e, files.fileUrl, 'pause')}> <i className="fa fa-pause" aria-hidden="true"></i></button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <div className="row">
                                    {userPictures.map((data, index) => (
                                      <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
                                        <div className="gallary_section_s">
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
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                <div className="form-group col-md-12 d-flex mb-3 justify-content-end">
                                  <button type="submit" className="btn btn-blue">Submit</button>
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
