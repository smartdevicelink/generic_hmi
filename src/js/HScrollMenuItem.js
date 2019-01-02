import React from 'react';
import { Link } from 'react-router';

export default class HScrollMenuItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { menuItem } = this.props;
        const graphic = this.props.menuItem.class == 'with-icon' ?
        (<span className="svg-wrap" dangerouslySetInnerHTML={{__html: `${menuItem.image}`}} />)
        : <img src={menuItem.image} /> ;
        return (
            <div
                className={`hscrollmenu-item th-b-color th-tile-background-color ${menuItem.class}`}
                onClick={() => this.props.onSelection(this.props.appID, this.props.cmdID, this.props.menuID)}
                style={this.props.style}>
                <div className="hscrollmenu-item__image" style={this.props.style}>
                    { graphic }
                </div>
                <div className="hscrollmenu-item__name">
                    <p className="t-small t-light th-f-color" style={this.props.style}>{menuItem.name}</p>
                </div>
            </div>
        )
    }
}
