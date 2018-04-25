import React from 'react';

export default class TextBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="text-body">
                <p className="t-large t-light th-f-color">{this.props.mainField1}</p>
                <p className="t-large t-light th-f-color">{this.props.mainField2}</p>
                <p className="t-large t-light th-f-color">{this.props.mainField3}</p>
                <p className="t-large t-light th-f-color">{this.props.mainField4}</p>
            </div>
        )
    }
}
