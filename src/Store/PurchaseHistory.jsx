import React, { Component } from 'react'
import { getUserPurchases } from '../Services/Store';

export default class PurchaseHistory extends Component {


    state = {
        purchaseHistory: []
    }


    componentDidMount() {
        getUserPurchases().then(res => {
            console.log('getUserPurchases res => ', res);
            if (res.data.status === true) {
                this.setState({ purchaseHistory: res.data.data })
            }
        }).catch(Err => {
            console.log('Err => ', Err);

        })
    }


    render() {

        const { purchaseHistory } = this.state;

        return (
            <div>
                <div className="index-main">
                    <section className="index-sec">
                        <div className="edit-sec"><h1>Purchase History</h1></div>
                        <div className="com-padding newpage_section">
                            <div className="crd-wrap">
                                <div className="crd-header" id="ticketOne">
                                    <h4>Your Order History</h4>
                                </div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-md-12 p-0">
                                            <div className="cart_tables_d table-responsive">
                                                <table className="table table-bordered">
                                                    <thead>
                                                        <tr>
                                                            <th>Image</th>
                                                            <th>Item Name</th>
                                                            <th>Quantity</th>
                                                            <th>Price</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {purchaseHistory.map((items, index) => (
                                                            <tr>
                                                                <td><img src={items.fileUrl} alt="table_img" className="tables_imgs" /></td>
                                                                <td>{items.itemName}</td>
                                                                <td>{items.qty}
                                                                </td>
                                                                <td>${items.price}</td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        )
    }
}
