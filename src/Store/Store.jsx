import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { getUserRewardAmount, getStoreItems, searchStoreItems, saveUserPurchase, getNrItemsShoppingCart } from '../Services/Store'
import { notification } from 'antd';
import { Modal, Image, Col } from 'react-bootstrap';
export default class Store extends React.Component {

  state = {
    storeBucks: '',
    loading: false,
    storeItems: [],
    emptySearchResult: '',
    modalShow: false,
    singleItem: [],
    originalQuantity: '',
    cartItems: '',
    newTemp: 1
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([getUserRewardAmount(), getStoreItems(), getNrItemsShoppingCart()]).then(values => {
        if (values[0] && values[1] && values[0].data.status === true && values[1].data.status === true && values[2].data.status === true) {
          this.setState({
            storeBucks: values[0].data.data && values[0].data.data.bucks,
            storeItems: values[1].data.data,
            originalQuantity: values[1].data.data,
            cartItems: values[2].data.data,
            loading: false
          })
        }
      }).catch(Err => {
        this.setState({ loading: false }, () => {
          notification.error({
            message: 'Error',
            description: 'There was an error while fetching data!'
          });
        })
      });
    })
  }

  searchForItems = (e) => {
    if (e.target.value) {
      searchStoreItems(e.target.value).then(res => {
        if (res.data.status === true) {
          if (res.data.data.length > 0) {
            this.setState({ storeItems: res.data.data, emptySearchResult: '' })
          } else {
            this.setState({ emptySearchResult: 'No Results Found', storeItems: [] })
          }
        }
      }).catch(Err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while fetching data!'
        });
      })
    } else {
      getStoreItems().then(res => {
        if (res.data.status === true) {
          this.setState({ storeItems: res.data.data })
        }
      });
    }
  }

  addToShoppingCart = (items, type) => {
    const { newTemp } = this.state;
    if (type === 'view') {
      this.setState({ singleItem: items, modalShow: true })
    } else if (type === 'cart') {
      const data = {
        Id: 0,
        UserId: parseInt(localStorage.getItem('userID')),
        ItemId: items.itemId,
        StoreItemId: items.id,
        StatusId: 1,
        Price: items.price,
        Qty: newTemp,
        ModifiedBy: parseInt(localStorage.getItem('userID'))
      }
      saveUserPurchase(data).then(res => {
        if (res.data.status === true) {
          this.setState({ modalShow: false }, () => {
            getNrItemsShoppingCart().then(res => {
              if (res.data.status === true) {
                this.setState({ cartItems: res.data.data })
              }
            }).catch(err => { })
            notification.success({
              message: 'Success',
              description: 'Item successfully added to the cart!'
            });
          })
        } else {
          notification.error({
            message: 'Error',
            description: 'There was an error while adding items to the cart!'
          });
        }
      }).catch(err => {
        notification.error({
          message: 'Error',
          description: 'There was an error while adding items to the cart!'
        });
      });
    }
  }

  addRemoveQty = (items, type, e) => {
    const { newTemp } = this.state;
    if (type === 'add') {
      this.setState({ newTemp: (newTemp + 1) })
    } else if (type === 'remove') {
      if (newTemp <= 0) {
        this.setState({ newTemp: newTemp - 1 })
      } else {
        this.setState({ newTemp: newTemp - 1 })
      }
    } else if (type === 'input') {
      if (e.target.value) {
        this.setState({ newTemp: e.target.value })
      } else {
        this.setState({ newTemp: 1 })
      }
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

    const { storeBucks, storeItems, emptySearchResult, singleItem, cartItems, newTemp } = this.state;

    return (
      <>
        {this.state.loading ? <Loader /> :
          <div className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1>Store</h1></div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header" id="ticketOne">
                    <h4>You currently have <b>{storeBucks}</b> bucks!</h4>
                    <div className="stor_buttons">
                      <button className="btn btn-blue cart_iteams" onClick={() => this.props.history.push(`/shopping-cart`)}>
                        <i className="fa fa-shopping-cart"></i>
                        <span>{cartItems}</span>
                      </button>
                      <Link className="btn btn-blue" to={`/purchase-history`}>Order History</Link>
                    </div>
                  </div>
                  <div className="title_search_panel">
                    <h4>Items For Sale</h4>
                    <input className="form-control" placeholder="Search for an Item" onChange={(e) => this.searchForItems(e)} />
                  </div>
                  {emptySearchResult && <p>{emptySearchResult}</p>}
                  {storeItems.length > 0 &&
                    <div className="container-fluid">
                      <div className="addticketform row">
                        <div className="col-md-12 p-0">
                          <div className="cart_tables_d table-responsive">
                            <table className="table table-bordered">
                              <thead>
                                <tr>
                                  <th>Image</th>
                                  <th>Item Name</th>
                                  <th>Quantity</th>
                                  <th>Price</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {storeItems.map(items => (
                                  <tr>
                                    <td><img src={items.fileUrl} width={10} height={10} alt="table_img" className="tables_imgs" /></td>
                                    <td>{items.itemName}</td>
                                    <td>{items.qty}</td>
                                    <td>${items.price}</td>
                                    <td>
                                      <Link className="btn btn-blue" onClick={() => this.addToShoppingCart(items, 'view')}>View Details</Link>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>}
                </div>
              </div>
            </section>
          </div>
        }
        <Modal show={this.state.modalShow} onHide={() => this.setState({ modalShow: !this.state.modalShow })}>
          <Modal.Header className="stagehead text-white" closeButton>
            <Modal.Title>{singleItem.itemName}</Modal.Title>
          </Modal.Header>
          <Col>
            <div className="stage-img">
              <Image className="w-100" src={singleItem && singleItem.fileUrl} />
            </div>
          </Col>
          <Modal.Body>
            {singleItem.price &&
              <div className="stage-detail align-items-center stage_det">
                <span className="stage-label">Price:</span> <span>{singleItem.price}</span>
              </div>
            }
            <div className="stage-detail stage_det">
              <button className="btn btn-blue" onClick={(e) => this.addRemoveQty(singleItem, 'add', e)}><i className="fa fa-plus-circle"></i></button>
              <input value={newTemp} type="text" onChange={(e) => this.addRemoveQty(singleItem, 'input', e)}
                onKeyPress={() => this.validate()} />
              <button className="btn btn-danger" onClick={(e) => this.addRemoveQty(singleItem, 'remove', e)} disabled={newTemp <= 0}><i className="fa fa-minus-circle"></i></button>
              <div className="text-danger custom_error_e">
                {newTemp > singleItem.qty ? `There are only ${singleItem.qty} quantities of this item in store!` : ''}
              </div>
            </div>
            <div className="model_buttons">
              <button className="btn btn-blue" onClick={() => this.addToShoppingCart(singleItem, 'cart')} disabled={newTemp > singleItem.qty}>Add To Cart</button>
            </div>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
