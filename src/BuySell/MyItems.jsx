import React, { Component } from 'react'
import Loader from '../Loader/Loader';
import { getUserItems, getUserItemStatuses } from '../Services/BuySell';
import { notification } from 'antd';
import moment from 'moment';

export default class MyItems extends Component {

  state = {
    loading: false,
    storeItems: [],
    emptyStoreItemResult: '',
    statusList: []
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      Promise.all([
        getUserItems(0),
        getUserItemStatuses()
      ]).then((values) => {
        if (values[0] && values[0].data.status === true && values[1] && values[1].data.status === true) {
          if (values[0].data.data && values[0].data.data.length > 0) {
            this.setState({ loading: false, storeItems: values[0].data.data, emptyStoreItemResult: '' });
          }
          if (values[1].data) {
            this.setState({ loading: false, statusList: values[1].data.data });
          } else {
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

    const { storeItems, emptyStoreItemResult, statusList } = this.state;

    return (
      <>
        {
          this.state.loading ? <Loader /> :
            <main className="index-main">
              <section className="index-sec">
                <div className="edit-sec"><h1>My Items</h1></div>
                <div className="com-padding newpage_section">
                  <div className="crd-wrap">
                    <div className="crd-header" id="ticketOne">
                    <h4>List of My Items</h4>
                      <div className="stor_buttons">
                        <button type="button" className="btn btn-blue" onClick={() => this.props.history.push(`/add-item`)}>
                        <i className="fas fa-plus-circle"></i>  Add Item</button>
                      </div>
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
                                      <th>Date Created</th>
                                      <th>Price</th>
                                      <th>Status Name</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {storeItems.map(items => (
                                      <tr>
                                        <td>
                                          {storeItems.buySellUserItemPictures && storeItems.buySellUserItemPictures.length > 0 ?
                                            <img src={storeItems.buySellUserItemPictures && storeItems.buySellUserItemPictures[0].thumbUrl} width={10} height={10} alt="table_img" className="tables_imgs" />
                                            : '-'}
                                        </td>
                                        <td>{items.title}</td>
                                        <td>{moment(items.dateCreated).format('DD MMM YYYY')}</td>
                                        <td>{items.price}</td>
                                        <td>{statusList && statusList.find(e => (e.id === items.statusId))?.name}</td>
                                        <td> <button type="button" className="btn btn-blue" onClick={() => this.props.history.push(`/edit-item/${items.id}`)}><i className="fa fa-edit"></i></button>
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
