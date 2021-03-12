import React from 'react'
import Loader from '../Loader/Loader';
import { getStoreItemsForSale } from '../Services/BuySell';
import { Link } from 'react-router-dom';
import { notification, Switch } from 'antd';

export default class BuySell extends React.Component {

  state = {
    loading: false,
    storeItems: [],
    emptyStoreItemResult: '',
    typeProCit: true
  }

  componentDidMount() {
    this.currentPage();
    localStorage.setItem("CurrentPage", "buySell");
  }

  currentPage(searchString) {
    getStoreItemsForSale((this.state.typeProCit === true) ? "project" : "city", searchString ? searchString : '').then((value) => {
      if (value.data.status === true) {
        if (value.data.data.length > 0) {
          this.setState({ loading: false, storeItems: value.data.data, emptyStoreItemResult: '' });
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
  }


  searchForItems = (e) => {
    if (e.target.value) {
      this.currentPage(e.target.value);
    } else {
      this.currentPage();
    }
  }

  handleDisabledChange() {
    if (this.state.typeProCit === true) {
      this.setState({ typeProCit: false });
    } else {
      this.setState({ typeProCit: true });
    }
    this.setState({ loading: true }, () => {
      this.currentPage();
    });
  }

  render() {

    const { storeItems, emptyStoreItemResult, typeProCit } = this.state;

    return (
      <>
        {this.state.loading ? <Loader /> :
          <main className="index-main">
            <section className="index-sec">
              <div className="edit-sec"><h1 className="p-0">Buy Sell</h1></div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header" id="ticketOne">
                    <div className="text-center check_cust_switch">
                      <label>Project</label>
                      <Switch checked={typeProCit} onChange={() => this.handleDisabledChange()} />
                      <label>City</label>
                    </div>
                    <div className="stor_buttons">
                      <button className="btn btn-blue mr-3" onClick={() => this.props.history.push(`/wish-list`)}>
                        <i className="fa fa-heart" title="Wish List"></i>
                      </button>
                      <button className="btn btn-blue mr-3" onClick={() => this.props.history.push(`/item-history`)}>
                        <i className="fa fa-history" title="History"></i>
                      </button>
                      <Link className="btn btn-blue" to={`/my-items`}>My Items</Link>
                    </div>
                  </div>
                  <div className="title_search_panel">
                    <h4>Items For Sale</h4>
                    <input className="form-control" placeholder="Search for an Item" onChange={(e) => this.searchForItems(e)} />
                  </div>
                  {emptyStoreItemResult && <p className="text-center not_found">{emptyStoreItemResult}</p>}
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
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {storeItems.map(items => (
                                    <tr>
                                      <td> {items.uri ? <img src={items.uri} width={10} height={10} alt="table_img" className="tables_imgs" /> : '-'}</td>
                                      <td>{items.title}</td>
                                      <td>{items.price}</td>
                                      <td>
                                        <button className="btn btn-blue" onClick={() => this.props.history.push(`/item-detail/${items.id}`)}>View Details</button>
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