import React from 'react';
import { Link } from 'react-router';

export default class HScrollMenuItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Link to={this.props.menuItem.link} className="launcher-item th-b-color">
                <div className="launcher-item__image">
                    <img className="th-box-shadow" src={this.props.menuItem.image} />
                </div>
                <div className="launcher-item__name">
                    <p className="t-small t-light th-f-color">{this.props.menuItem.name}</p>
                </div>
            </Link>
        )
    }
}
