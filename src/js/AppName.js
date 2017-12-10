import React from 'react'
import bcController from './Controllers/BCController'
export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        return (
            <div onClick={() => bcController.onStartDeviceDiscovery()}>
                <p className="t-small t-light th-f-color">
                    {this.props.name}
                </p>
            </div>
        )
    }
}