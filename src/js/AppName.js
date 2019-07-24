import React from 'react'

export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        let templateTitle = this.props.templateTitle;
        return (
            <div>
                <p>
                    <span className="t-small t-medium th-f-color">{this.props.name}</span>
                    <br />
                    <span className="t-small t-light th-f-color t-oneline">{templateTitle}</span>
                </p>
            </div>
        )
    }
}