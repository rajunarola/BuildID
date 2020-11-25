import React, { Component } from 'react'

export default class Loader extends Component {
    render() {
        return (
            <div>
                <div className="card-body">
                    <div className="dimmer active">
                        <img src={require('../assets/images/loader.svg')} className="loader-img" alt="" />
                    </div>
                </div>
            </div>
        )
    }
}
