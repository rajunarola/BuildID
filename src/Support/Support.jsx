import React, { Component } from 'react'

export default class Support extends Component {

    addSupport = () => {
        localStorage.setItem("SupportPage", this.props.dataParentToChild)
        this.props.history.push(`/add-support`)
    }

    render() {
        return (
            <span>
                <img src={require('../assets/images/BrokenHammer.png')} title="Support" alt="Support" onClick={() => { this.addSupport() }} style={{ 'height': '25px', 'width': '25px' }} />
            </span>
        )
    }
}
