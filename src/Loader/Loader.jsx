import React, { Component } from 'react'

export default class Loader extends Component {
    render() {
        return (
            <>
                <div className="dimmer active customs_loaders">
                    <img src={require('../assets/images/loader.svg')} className="loader-img" alt="" />
                </div>
            </>
        )
    }
}
