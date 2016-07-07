import React from 'react'

export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        return (
            <div>
                <p className="t-small t-light th-f-color">
                    {this.props.name}
                </p>
            </div>
        )
    }
}