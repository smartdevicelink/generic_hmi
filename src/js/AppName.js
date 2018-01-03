import React from 'react'
import bcController from './Controllers/BCController'
export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        var name = this.props.name
        if (name.length > 12) {
            name = name.substring(0,12) + '...';
        }
        return (
            <div onClick={() => bcController.onStartDeviceDiscovery()}>
                <p className="t-small t-light th-f-color">
                    {name}
                </p>
            </div>
        )
    }
}