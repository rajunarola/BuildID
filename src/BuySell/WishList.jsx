import React, { Component } from 'react'
import Loader from '../Loader/Loader';
import { getUserWishList, deleteUserWishItem } from '../Services/BuySell';
import { notification } from 'antd';
import moment from 'moment';
import swal from 'sweetalert';
import Support from '../Support/Support';

export default class WishList extends Component {

  state = {
    loading: false,
    storeItems: [],
    emptyStoreItemResult: ''
  }

  componentDidMount() {
    this.getItems();
    localStorage.setItem("CurrentPage", "WishList");
  }

  getItems() {
    this.setState({ loading: true }, () => {
      getUserWishList().then((value) => {
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

  deleteItem(id) {
    swal({
      title: "Are you sure you want to delete the selected item?",
      text: "Once deleted, you will not be able to recover this data!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({ loading: true }, () => {
          const data = {
            Id: id
          };
          deleteUserWishItem(data).then((res) => {
            if (res.data.status === true) {
              this.setState({ loading: false }, () => {
                notification.success({
                  message: 'Success',
                  description: 'Item successfully deleted from your wishlist!'
                });
                this.getItems();
              });
            } else {
              this.setState({ loading: false });
            }
          }).catch(Err => {
            this.setState({ loading: false }, () => {
              notification.error({
                message: 'Error',
                description: 'There was an error while deleting data!'
              });
            });
          });
        });
      }
      else {
        notification.info({
          message: 'Success',
          description: 'Your wishlist item is Safe!'
        });
      }
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
                <div className="edit-sec">
                  <h1>WishList</h1>
                  <Support dataParentToChild={this.props.location.pathname} history={this.props.history}/>
                </div>
                <div className="com-padding newpage_section">
                  <div className="crd-wrap">
                    <div className="crd-header" id="ticketOne">
                      <h4>Your WishList</h4>
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
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {storeItems.map(items => (
                                      <tr>
                                        <td>{items.uri ? <img src={items.uri} width={10} height={10} alt="-" className="tables_imgs" /> : '-'}</td>
                                        <td>{items.title}</td>
                                        <td>{items.price}</td>
                                        <td>{items.statusName}</td>
                                        <td>{moment(items.dateCreated).format('DD MMM YYYY')}</td>
                                        <td>
                                          <button className="btn btn-danger mr-3" onClick={() => this.deleteItem(items.id)}><i className="fa fa-trash"></i></button>
                                          <button className="btn btn-blue" onClick={() => this.props.history.push(`/item-detail/${items.buySellUserItemId}`)}>View Details</button>
                                        </td>
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
