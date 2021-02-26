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
                                    <button className="btn btn-blue" onClick={() => this.props.history.push(`/shopping-cart`)}>
                                        <i className="fa fa-shopping-cart"></i>
                                    </button>
                                    <div>
                                        <table className="table table-bordered">
                                            <tr>
                                                <th>Image</th>
                                                <th>Item Name</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                            {purchaseHistory.map((items, index) => (
                                                <tr>
                                                    <td><img src={items.fileUrl} width={10} height={10} /></td>
                                                    <td>{items.itemName}</td>
                                                    <td>{items.qty}
                                                    </td>
                                                    <td>${items.price}</td>
                                                </tr>
                                            ))}
                                        </table>
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
