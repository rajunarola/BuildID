import React, { Component } from 'react';
import { notification } from 'antd';
import { getStoreItems, getUserShoppingCart, saveUserPurchase } from '../../Services/Store';
import Loader from '../../Loader/Loader';
export default class ShoppingCart extends Component {

  state = {
    loading: false,
    cartItem: '',
    originalQty: ''
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getUserShoppingCart().then(res => {
        if (res.data.status === true) {
          this.setState({ cartItem: res.data.data, loading: false })
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching data!'
        });
      });
    });
  }

  increaseQty(data, i) {
    getStoreItems(data.itemId).then(value => {
      this.setState({ originaQty: value.data.data && value.data.data[0].qty }, () => {
        let item = [...this.state.cartItem];
        item[i].qty = (isNaN(item[i].qty)) ? 0 : parseInt(item[i].qty) + 1;
        this.setState({ cartItem: item });
      });
    });
  }

  decreaseQty(i) {
    let item = [...this.state.cartItem];
    item[i].qty = (isNaN(item[i].qty)) ? 0 : parseInt(item[i].qty) - 1;
    this.setState({ cartItem: item });
  }

  saveUserPurchaseItem(isDelete, item) {
    this.setState({ loading: true }, () => {
      const data = {
        Id: item.id,
        UserId: parseInt(localStorage.getItem("userID")),
        ItemId: item.itemId,
        StoreItemId: item.storeItemId,
        StatusId: 4,
        Price: item.price,
        Qty: isDelete ? 0 : item.qty,
        ModifiedBy: parseInt(localStorage.getItem("userID"))
      }
      saveUserPurchase(data).then(res => {
        if (res.data.message !== "OK") {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: `${res.data.message}`
            });
          });
        } else if (res.data.message === "OK") {
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
        }
        else {
          this.setState({ loading: false }, () => {
            notification.error({
              message: 'Error',
              description: `There was an error while ${isDelete ? 'deleting' : 'purchasing'} from your cart!`
            });
          });
        }
      }).catch(err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: `There was an error while ${isDelete ? 'deleting' : 'purchasing'} from your cart!`
          });
        });
      });
    })
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
    var regex = /[0-9]/;
    if (!regex.test(key)) {
      theEvent.returnValue = false;
      if (theEvent.preventDefault) theEvent.preventDefault();
    }
  }

  render() {

    const { cartItem, originaQty } = this.state

    return (
      <>
        <div className="index-main">
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
                        {this.state.loading ? <Loader /> :
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
                                      <div className="d-flex stage_det justify-content-start">
                                        <button type="button" className="btn-blue" onClick={() => this.increaseQty(data, i)}>
                                          <i className="fa fa-plus" aria-hidden="true"></i>
                                        </button>
                                        <input className="cart_input_num" type="text" value={data.qty} onChange={(e) => this.handleQty(e.target.value, i)}
                                          onKeyPress={() => this.validate()} />
                                        <button type="button" className="btn-danger" onClick={() => this.decreaseQty(i)} disabled={data.qty <= 0}>
                                          <i className="fa fa-minus" aria-hidden="true"></i>
                                        </button>
                                        <div className="text-danger custom_error_e text-left">
                                          {data.qty > originaQty ? `There are only ${originaQty} quantities of this item in store!` : ''}
                                        </div>
                                      </div>
                                    </td>
                                    <td>{data.price}</td>
                                    <td className="text-center">
                                      <button className="btn btn-danger mr-2" onClick={() => this.saveUserPurchaseItem(true, data)}>Delete</button>
                                      <button className="btn btn-dark" onClick={() => this.saveUserPurchaseItem(false, data)}>Purchase</button>
                                    </td>
                                  </tr>
                                </>
                              )) : <tr><td colSpan="5">
                                <h4 className="no_data_f">No item found</h4>
                              </td></tr>
                            }
                          </table>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  }
}
