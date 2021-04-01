import React from 'react'
import Loader from '../Loader/Loader';
import { getStoreItemsForSale } from '../Services/BuySell';
import { Link } from 'react-router-dom';
import { notification, Switch } from 'antd';
import Support from '../Support/Support';

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
              <div className="edit-sec"><h1 className="p-0">Buy Sell</h1>
                <Support dataParentToChild={this.props.location.pathname} history={this.props.history} />
              </div>
              <div className="com-padding newpage_section">
                <div className="crd-wrap">
                  <div className="crd-header" id="ticketOne">
                    <div className="text-center check_cust_switch">
                      <label>Project</label>
                      <Switch checked={typeProCit} onChange={() => this.handleDisabledChange()} />
                      <label>City</label>
                    </div>
                    <div className="stor_buttons">
                      <button className="btn btn-blue mr-2" onClick={() => this.props.history.push(`/wish-list`)}>
                        <i className="fa fa-heart" title="Wish List"></i>
                      </button>
                      <button className="btn btn-blue mr-2" onClick={() => this.props.history.push(`/item-history`)}>
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
                    <div className="row">
                      {storeItems.map(items => (
                        <div className="col-md-2">
                          <div className="product_section">
                            <div className="product_images">
                              <Link className onClick={() => this.props.history.push(`/item-detail/${items.id}`)}>
                                {items.uri ? <img src={items.uri} alt="table_img" className="product_img" /> : '-'}
                              </Link>
                            </div>
                            <div className="product_texts">
                              <Link className onClick={() => this.props.history.push(`/item-detail/${items.id}`)}>
                                <h3 className="item_name"> {items.title} </h3>
                                <div className="quantity_name">
                                  <labe>Price : </labe>
                                  <h5> {items.price}</h5>
                                </div>
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
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