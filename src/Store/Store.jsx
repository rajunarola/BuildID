import React from 'react';
import { Link } from 'react-router-dom';
import Loader from '../Loader/Loader';
import { getUserRewardAmount, getStoreItems, searchStoreItems, saveUserPurchase } from '../Services/Store'
import swal from 'sweetalert';
import { notification } from 'antd';
import { Modal, Image, Col } from 'react-bootstrap';

export default class Store extends React.Component {

  state = {
    storeBucks: '',
    loading: false,
    storeItems: [],
    emptySearchResult: '',
    modalShow: false,
    singleItem: []
  }

  componentDidMount() {
    Promise.all([getUserRewardAmount(), getStoreItems()]).then(values => {
      console.log('values => ', values);
      if (values[0] && values[1] && values[0].data.status === true && values[1].data.status === true) {
        this.setState({
          storeBucks: values[0].data.data && values[0].data.data.bucks,
          storeItems: values[1].data.data
        })
      }
    }).catch(Err => {
      console.log('Err => ', Err);

    })
  }

  searchForItems = (e) => {
    console.log('e.target.value => ', e.target.value);
    if (e.target.value) {
      searchStoreItems(e.target.value).then(res => {
        console.log('res => ', res);
        if (res.data.status === true) {
          if (res.data.data.length > 0) {
            this.setState({ storeItems: res.data.data, emptySearchResult: '' })
          } else {
            this.setState({ emptySearchResult: 'No Results Found', storeItems: [] })
          }
        }
      }).catch(Err => {
        console.log('Err => ', Err);

      })
    } else {
      console.log('in else');
      getStoreItems().then(res => {
        if (res.data.status === true) {
          this.setState({ storeItems: res.data.data })
        }
      });
    }
  }

  addToShoppingCart = (items, type) => {
    console.log('items => ', items);
    if (type === 'view') {
      this.setState({ singleItem: items, modalShow: true })
    } else if (type === 'cart') {
      console.log('here');
      const data = {
        Id: 0,
        UserId: parseInt(localStorage.getItem('userID')),
        ItemId: items.itemId,
        StoreItemId: items.id,
        StatusId: 1,
        Price: items.price,
        Qty: 1,
        ModifiedBy: parseInt(localStorage.getItem('userID'))
      }
      saveUserPurchase(data).then(res => {
        console.log('saveUserPurchase res => ', res);
        if (res.data.status === true) {
          this.setState({ modalShow: false }, () => {
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

  render() {

    const { storeBucks, storeItems, emptySearchResult, singleItem } = this.state;

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
                    <Link className="btn btn-blue" to={`/purchase-history`}>Order History</Link>
                  </div>
                  <div className="mb-2">
                    <input className="form-control" placeholder="Search for an Item" onChange={(e) => this.searchForItems(e)} />
                  </div>
                  {emptySearchResult && <p>{emptySearchResult}</p>}
                  {storeItems.length > 0 &&
                    <div className="container-fluid">
                      <div className="addticketform row">
                        <div className="col-md-12 p-0">
                          <h4>Items For Sale</h4>
                          <table className="table table-bordered">
                            <tr>
                              <th>Image</th>
                              <th>Item Name</th>
                              <th>Quantity</th>
                              <th>Price</th>
                              <th>Action</th>
                            </tr>
                            {storeItems.map(items => (
                              <tr>
                                <td><img src={items.fileUrl} width={10} height={10} /></td>
                                <td>{items.itemName}</td>
                                <td>{items.qty}</td>
                                <td>${items.price}</td>
                                <td style={{ cursor: 'pointer' }} onClick={() => this.addToShoppingCart(items, 'view')}>View Details</td>
                              </tr>
                            ))}
                          </table>
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
              <p className="stage-detail">
                <span className="stage-label">Price:</span> <span>{singleItem.price}</span>
              </p>}
            {singleItem.qty &&
              <p className="stage-detail">
                <span className="stage-label">Quantity:</span> <span>{singleItem.qty}</span>
              </p>}
            <button className="btn btn-blue" onClick={() => this.addToShoppingCart(singleItem, 'cart')}>Add To Cart</button>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}
