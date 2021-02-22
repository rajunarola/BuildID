import React from 'react';
import { deleteMontage, getMontages } from '../Services/Montage';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import swal from 'sweetalert';
import Loader from '../Loader/Loader';

export default class SideNavMontage extends React.Component {

    state = {
        userMontages: [],
        loading: false
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            getMontages().then(res => {
                if (res.status === 200) {
                    this.setState({
                        userMontages: res.data.data !== [] ? res.data.data : [],
                        loading: false
                    })
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
            })
        })
    }

    editMontage = (id) => {
        this.props.history.push(`/edit-montage/${id}`)
    }

    montagePreview = (id) => {
        this.props.history.push(`/preview-montage/${id}`)
    }

    deleteOneMontage = (id) => {
        swal({
            title: "Are you sure you want to delete the selected montage?",
            text: "Once deleted, you will not be able to recover this data!",
            icon: "warning",
            buttons: true,
            dangerMode: true,
        }).then((willDelete) => {
            if (willDelete) {
                deleteMontage(id).then(res => {
                    if (res.data.status === true) {
                        notification.success({
                            message: 'Success',
                            description: 'Montage deleted successfully!'
                        });
                        getMontages().then(res => {
                            if (res.status === 200) {
                                this.setState({ userMontages: res.data.data })
                            }
                        })
                    } else {
                        notification.error({
                            message: 'Error',
                            description: 'There was an error while deleting a montage'
                        });
                    }
                }).catch(err => {
                    notification.error({
                        message: 'Error',
                        description: 'There was an error while deleting a montage'
                    });
                })
            } else {
                notification.info({
                    message: 'Success',
                    description: 'Your montage data is Safe!'
                });
            }
        })
    }
    render() {

        const { userMontages } = this.state;

        return (
            <>
                {this.state.loading ? <Loader /> :
                    <main className="index-main">
                        <section className="index-sec">
                            <div className="edit-sec"><h1>Montages</h1></div>
                            <div className="com-padding newpage_section">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="accordion montages_sec">
                                            <div className="crd-wrap">
                                                <div className="crd-header">
                                                    <h4>List of Montages</h4>
                                                    <Link className="add-btn btn-blue" to="/add-montage"><i className="fas fa-plus-circle"></i> Add Montage</Link>
                                                </div>
                                                {this.state.userMontages.length > 0 &&
                                                    <>
                                                        {/* <div> <h4 className="k-card-title">List of Montages</h4> </div> */}
                                                        <div className="row">
                                                            {userMontages.map(data => (
                                                                <div className="col-lg-3">
                                                                    <div className="playlist_sec">
                                                                        <h4>{data.name}</h4>
                                                                        <button className="btn btn-blue" onClick={() => this.editMontage(data.id)}><i className="fa fa-edit"></i></button>
                                                                        <button className="btn btn-danger" onClick={() => this.deleteOneMontage(data.id)}><i className="fa fa-trash"></i></button>
                                                                        <button className="btn btn-dark fa fa-play" onClick={() => this.montagePreview(data.id)}></button>
                                                                    </div>
                                                                </div>
                                                            ))}
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
