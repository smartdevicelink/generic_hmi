import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'

export default class HScrollMenuItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { menuItem } = this.props;
        var header = menuItem.devicename;
        var header_html = (header) ? 
            (<div className="hscrollmenu-item__header">
                <p className="t-light th-f-color-secondary t-oneline">{ header }</p>
            </div>)
            : null;
        var graphic = (this.props.menuItem.imageType === "STATIC")
                 ? <StaticIcon image={this.props.menuItem.image} />
                 : <Image image={this.props.menuItem.image} />;

        return (
            <Link
                to={this.props.menuItem.link}
                onClick={() => this.props.onSelection(this.props.appID, this.props.cmdID, this.props.menuID)}>
                <div
                    className="hscrollmenu-item th-b-color th-tile-background-color">
                    { header_html }
                    <div className="hscrollmenu-item__image">
                        { graphic }
                    </div>
                    <div className="hscrollmenu-item__name">
                        <p className="t-small t-light th-f-color">{menuItem.name}</p>
                    </div>
                </div>
            </Link>
        )
    }
}
