import React, { Component } from 'react'
import Loader from '../Loader/Loader';
import { getUserItemsHistory } from '../Services/BuySell';
import { notification } from 'antd';
import moment from 'moment';
export default class ItemHistory extends Component {
    state = {
        loading: false,
        storeItems: [],
        emptyStoreItemResult: ''
    }

    componentDidMount() {
        this.setState({ loading: true }, () => {
            getUserItemsHistory().then((value) => {
                if (value.data.status === true) {
                    if (value.data.data.length > 0) {
                        this.setState({ loading: false, storeItems: value.data.data, emptyStoreItemResult: '' });
                    }
                    else {
                        this.setState({ loading: false, storeItems: [], emptyStoreItemResult: 'No Results Found' });
                    }
                }
            }).catch(Err => {
                this.setState({ loading: false }, () => {
                    notification.error({
                        message: 'Error',
                        description: 'There was an error while fetching data!'
                    });
                });
            });
        });
    }

    render() {

        const { storeItems, emptyStoreItemResult } = this.state;

        return (
            <>
                {
                    this.state.loading ? <Loader /> :
                        <main className="index-main">
                            <section className="index-sec">
                                <div className="edit-sec"><h1>History</h1></div>
                                <div className="com-padding newpage_section">
                                    <div className="crd-wrap">
                                        <div className="crd-header" id="ticketOne">
                                            <h4>List of History</h4>
                                        </div>
                                        {emptyStoreItemResult && <p className="text-center">{emptyStoreItemResult}</p>}
                                        {storeItems.length > 0 &&
                                            <>
                                                <div className="container-fluid">
                                                    <div className="addticketform row">
                                                        <div className="col-md-12 p-0">
                                                            <div className="cart_tables_d table-responsive">
                                                                <table className="table table-bordered">
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Image</th>
                                                                            <th>Title</th>
                                                                            <th>Price</th>
                                                                            <th>Status Name</th>
                                                                            <th>Date Created</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {storeItems.map(items => (
                                                                            <tr>
                                                                                <td>{items.uri ? <img src={items.uri} width={10} height={10} alt="table_img" className="tables_imgs" /> : '-'}</td>
                                                                                <td>{items.title}</td>
                                                                                <td>{items.price}</td>
                                                                                <td>{items.statusName}</td>
                                                                                <td>{moment(items.dateCreated).format('DD MMM YYYY')}</td>
                                                                            </tr>
                                                                        ))}
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        }
                                    </div>
                                </div>
                            </section>
                        </main>
                }
            </>
        )
    }
}
