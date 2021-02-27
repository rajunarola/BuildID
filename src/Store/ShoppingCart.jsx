import React, { Component } from 'react';
import { notification } from 'antd';
import { getStoreItems, getUserShoppingCart, saveUserPurchase } from '../Services/Store';
import Loader from '../Loader/Loader';
export default class ShoppingCart extends Component {

  state = {
    loading: false,
    cartItem: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getUserShoppingCart().then(res => {
        if (res.data.status === true) {
          res.data.data.map(data => {
            const obj = {
              fileUrl: data.fileUrl,
              id: 0,
              userId: data.userId,
              itemId: 0,
              itemName: data.itemName,
              storeItemId: 0,
              statusId: 0,
              price: data.price,
              qty: data.qty,
              currentAvaQty: 0
            }
            getStoreItems(data.itemId).then(value => {
              obj.id = value.data.data[0].id;
              obj.itemId = value.data.data[0].itemId;
              obj.storeItemId = value.data.data[0].id;
              obj.currentAvaQty = value.data.data[0].qty;
              this.setState({
                loading: false,
                cartItem: this.state.cartItem.concat(obj)
              });
            });

          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching data!'
        });
      });
    });
  }

  increaseQty(i) {
    let item = [...this.state.cartItem];
    item[i].qty = (isNaN(item[i].qty)) ? 0 : parseInt(item[i].qty) + 1;
    this.setState({ cartItem: item });
  }

  decreaseQty(i) {
    let item = [...this.state.cartItem];
    item[i].qty = (isNaN(item[i].qty)) ? 0 : parseInt(item[i].qty) - 1;
    this.setState({ cartItem: item });
  }

  saveUserPurchaseItem(isDelete, item) {
    const data = {
      Id: 0,
      UserId: parseInt(localStorage.getItem("userID")),
      ItemId: item.id,
      StoreItemId: item.itemId,
      StatusId: 4,
      Price: item.price,
      Qty: isDelete ? 0 : item.qty,
      ModifiedBy: parseInt(localStorage.getItem("userID"))
    }
    console.log('data => ', data);

    saveUserPurchase(data).then(res => {
      if (res.data.status === true) {
        this.setState({ loading: false }, () => {
          notification.success({
            message: 'Success',
            description: `Item successfully ${isDelete ? 'deleted' : 'purchased'}  from your cart!`
          });
          getUserShoppingCart().then(res => {
            this.setState({
              loading: false,
              cartItem: res.data.data
            });
          });
        });
      }
      else {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: `Item successfully ${isDelete ? 'deleting' : 'purchasing'}  from your cart!`
          });
        });
      }
    }).catch(err => {
      this.setState({ loading: false }, () => {
        notification.error({
          message: 'Error',
          description: `Item successfully ${isDelete ? 'deleting' : 'purchasing'}  from your cart!`
        });
      });
    });
  }

  handleQty(e, i) {
    let item = [...this.state.cartItem];
    if (e) {
      item[i].qty = parseInt(e);
      this.setState({ cartItem: item });
    } else {
      item[i].qty = 0;
      this.setState({ cartItem: item });
    }
  }

  validate = (evt) => {
    var theEvent = evt || window.event;
    // Handle paste
    if (theEvent.type === 'paste') {
      key = evt.clipboardData.getData('text/plain');
    } else {
      // Handle key press
      var key = theEvent.keyCode || theEvent.which;
      key = String.fromCharCode(key);
    }
    var regex = /[0-9]|\./;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  render() {

    const { cartItem } = this.state
    return (
      <>
        <div className="index-main">
          {this.state.loading ? <Loader /> :
            <section className="index-sec">
              <div className="edit-sec"><h1>Shopping Cart</h1></div>
              {/* <button className="btn btn-blue">{cartItems}<i className="fa fa-shopping-cart"></i></button> */}
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header" id="ticketOne">
                    <h4>Shopping Cart</h4>
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
                                <th colSpan="2" className="text-center">Action</th>
                              </tr>
                            </thead>
                            {cartItem.length > 0 ?
                              cartItem.map((data, i) => (
                                <>
                                  <tr>
                                    <td><img src={data.fileUrl} alt=""></img></td>
                                    <td>{data.itemName}</td>
                                    <td>
                                      <div className="d-flex">
                                        <button type="button" className="btn-blue" onClick={() => this.increaseQty(i)}>
                                          <i className="fa fa-plus" aria-hidden="true"></i>
                                        </button>
                                        <input className="cart_input_num" type="text" value={data.qty} onChange={(e) => this.handleQty(e.target.value, i)}
                                          onKeyPress={() => this.validate()} />
                                        <div className="text-danger">
                                          {data.qty > data.currentAvaQty ? `There are only ${data.currentAvaQty} quantities of this item in store!` : ''}
                                        </div>
                                        <button type="button" className="btn-danger" onClick={() => this.decreaseQty(i)} disabled={data.qty <= 0}>
                                          <i className="fa fa-minus" aria-hidden="true"></i>
                                        </button>
                                      </div>
                                    </td>
                                    <td>{data.price}</td>
                                    <td className="text-center">
                                      <button className="btn btn-danger mr-2" onClick={() => this.saveUserPurchaseItem(true, data)}>Delete</button>
                                      <button className="btn btn-dark" onClick={() => this.saveUserPurchaseItem(false, data)}>Purchase</button>
                                    </td>
                                  </tr>
                                </>
                              )) : <tr><td colSpan="4">No item found</td></tr>
                            }
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          }
        </div>
      </>
    )
  }
}
