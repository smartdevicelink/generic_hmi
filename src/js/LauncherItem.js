import React from 'react';
import { Link } from 'react-router';

export default class AppLauncher extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Link to={this.props.app.link} className="launcher-item th-b-color">
                <div className="launcher-item__image">
                    <img className="th-box-shadow" src={this.props.app.image} />
                </div>
                <div className="launcher-item__name">
                    <p className="t-small t-light th-f-color">{this.props.app.name}</p>
                </div>
            </Link>
        )
    }
}
