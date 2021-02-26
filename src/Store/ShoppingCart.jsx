import React, { Component } from 'react'
import { getUserShoppingCart, saveUserPurchase, getNrItemsShoppingCart } from '../Services/Store';
import { notification } from 'antd';

export default class ShoppingCart extends Component {

  state = {
    shoppingItems: [],
    cartItems: ''
  }

  componentDidMount() {
    this.apiCall();
  }

  apiCall() {
    Promise.all([getUserShoppingCart(), getNrItemsShoppingCart()]).then(values => {
      console.log('values => ', values);
      if (values[0] && values[1] && values[0].data.status === true && values[1].data.status === true) {
        this.setState({
          shoppingItems: values[0].data.data,
          cartItems: values[1].data.data
        });
      }
    });
  }

  addRemoveQty = (items, type, index) => {
    console.log('items => ', items);
    const { shoppingItems } = this.state;
    const data = {
      Id: 0,
      UserId: parseInt(localStorage.getItem('userID')),
      ItemId: items.itemId,
      StoreItemId: items.id,
      StatusId: 4,
      Price: items.price,
      ModifiedBy: parseInt(localStorage.getItem('userID'))
    }
    if (type === 'add') {
      shoppingItems[index].qty = (items.qty + 1)
      this.setState({ shoppingItems: shoppingItems })
    } else if (type === 'remove') {
      if (shoppingItems[index].qty <= 0) {
        console.log('here');
        shoppingItems[index].qty = 0;
        this.setState({ shoppingItems: shoppingItems })
      } else {
        shoppingItems[index].qty = (items.qty - 1)
        this.setState({ shoppingItems: shoppingItems })
      }
    } else if (type === 'delete') {
      data.qty = 0;
      console.log('data => ', data);
      this.deleteOrPurchaseCart(data, 'deleted')
    } else if (type === 'purchase') {
      data.qty = shoppingItems[index].qty;
      console.log('purchasedata => ', data);
      this.deleteOrPurchaseCart(data, 'purchased')
    }
  }

  deleteOrPurchaseCart = (data, type) => {
    saveUserPurchase(data).then(res => {
      if (res.data.status === true) {
        this.apiCall();
        notification.success({
          message: 'Success',
          description: `Item successfully ${type} from the cart!`
        });
      } else {
        notification.error({
          message: 'Error',
          description: `There was an error while ${type === 'deleted' ? 'deleting' : 'purchasing'} items from the cart!`
        });
      }
    }).catch(err => {
      notification.error({
        message: 'Error',
        description: `There was an error while ${type === 'deleted' ? 'deleting' : 'purchasing'} items from the cart!`
      });
    });
  }

  getInputValue = (e, index) => {
    console.log('e.target.value => ', e.target.value);
    const { shoppingItems } = this.state;
    shoppingItems[index].qty = parseInt(e.target.value)
    this.setState({ shoppingItems: shoppingItems })
  }

  render() {

    const { shoppingItems, cartItems } = this.state;

    return (
      <>
        <div className="index-main">
          <section className="index-sec">
            <div className="edit-sec"><h1>Shopping Cart</h1></div>
            <button className="btn btn-blue">{cartItems}<i className="fa fa-shopping-cart"></i></button>
            <div className="com-padding newpage_section">
              <div className="crd-wrap">
                <div className="crd-header" id="ticketOne">
                  <table className="table table-bordered">
                    <tr>
                      <th>Image</th>
                      <th>Item Name</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                    {shoppingItems.map((items, index) => (
                      <tr>
                        <td><img src={items.fileUrl} width={10} height={10} /></td>
                        <td>{items.itemName}</td>
                        <td>
                          <button className="btn btn-blue" onClick={() => this.addRemoveQty(items, 'add', index)}><i className="fa fa-plus-circle"></i></button>
                          <input value={items.qty} type="number" onChange={(e) => this.getInputValue(e, index)} />
                          <button className="btn btn-danger" onClick={() => this.addRemoveQty(items, 'remove', index)}><i className="fa fa-minus-circle"></i></button>
                        </td>
                        <td>${items.price}</td>
                        <td style={{ cursor: 'pointer' }} onClick={() => this.addRemoveQty(items, 'delete', index)}>
                          <button className="btn btn-danger">Delete</button>
                        </td>
                        <td style={{ cursor: 'pointer' }} onClick={() => this.addRemoveQty(items, 'purchase', index)}>
                          <button className="btn btn-danger">Purchase</button>
                        </td>
                      </tr>
                    ))}
                  </table>
                </div>
              </div>
            </div>
          </section>
        </div>
      </>
    )
  }
}
