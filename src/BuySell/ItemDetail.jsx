import React, { Component } from 'react'
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import Loader from '../Loader/Loader';
import { getStoreItemsForSaleByItemId, saveUserWishItem } from '../Services/BuySell';
import { notification } from 'antd';
import swal from 'sweetalert';

export default class ItemDetail extends Component {

  state = {
    loading: false,
    itemDetail: null,
    pictureList: [],
    buySellUserItemId: 0
  }

  componentDidMount() {
    this.setState({ loading: true }, () => {
      getStoreItemsForSaleByItemId(this.props.match.params.itemId).then((value) => {
        if (value.data.status === true) {
          if (value.data.data !== null) {
            this.setState({ loading: false, itemDetail: value.data.data, pictureList: value.data.data.buySellUserItemPictures });
          }
          else {
            this.setState({ loading: false, itemDetail: null });
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

  componentWillUnmount() {
    localStorage.removeItem("CurrentPage");
  }

  addContactSeller() { }

  saveUserWishItem() {
    swal({
      title: "Do you want to save this item in the wish list ?",
      icon: "info",
      buttons: true,
    }).then((willDelete) => {
      if (willDelete) {
        this.setState({ loading: true }, () => {
          const data = {
            Id: 0,
            UserId: localStorage.getItem("userID"),
            BuySellUserItemId: this.props.match.params.itemId
          };
          saveUserWishItem(data).then((res) => {
            if (res.data.status === true) {
              notification.success({
                message: 'Success',
                description: 'The item has been added to the wishlist!'
              });
              this.setState({ loading: false });
            }
            else this.setState({ loading: false });
          }).catch(err => {
            this.setState({ loading: false });
            notification.error({
              message: 'Error',
              description: 'There was an error while adding item to the wishlist!'
            });
          });
        });
      }
    });
  }

  render() {

    const { itemDetail, pictureList, loading } = this.state;

    return (
      <>
        {
          loading ? <Loader /> :
            <main className="index-main">
              <section className="index-sec">
                <div className="addticketform com-padding mt-4">
                  <div className="row">
                    <div className="col-12 col-md-6 offset-md-3">
                      <div className="form-border crd-wrp">
                        <div className="proj-timeline">
                          <h4 className="k-card-title mb-0 text-uppercase"> Item Details</h4>
                          <div className="manufacture-content p-4">
                            <div className="pro-img slider-main mb-2 embed-responsive">
                              <Carousel autoPlay>
                                {pictureList.map((data, index) => (
                                  (data && data.thumbUrl) ? <img key="image" src={data.thumbUrl} alt="-" /> : "-"
                                ))}
                              </Carousel>
                            </div>
                            <div className="pro-details">
                              <div className="wrap">
                                <h4>{itemDetail && itemDetail.title}</h4>
                              </div>
                            </div>
                            <div className="proj-timeline project-address-location">
                              <p className="stage-detail"><span className="stage-label">Price:</span> <span>{itemDetail && itemDetail.price}</span></p>
                              <p className="stage-detail"><span className="stage-label">Description:</span> <span>{itemDetail && itemDetail.description}</span></p>
                            </div>
                            <div className="mb-3 text-center">
                              <button className="btn btn-blue mr-3" onClick={() => this.addContactSeller()}>Contact Seller</button>
                              {localStorage.getItem("CurrentPage") !== 'WishList' ?
                                <button className="btn btn-blue" onClick={() => this.saveUserWishItem()}>Add to Wishlist</button>
                                :
                                <div></div>
                              }
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </main>
        }
      </>
    )
  }
}
