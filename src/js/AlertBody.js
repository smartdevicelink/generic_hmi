import React from 'react'

export default class AlertBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="alert-text-fields">
                <p className="t-small t-medium th-f-color">{this.props.alertText1}</p>
                <p className="t-small t-medium th-f-color">{this.props.alertText2}</p>
                <p className="t-small t-medium th-f-color">{this.props.alertText3}</p>
            </div>
        )
    }
}