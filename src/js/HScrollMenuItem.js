import React from 'react';
import { Link } from 'react-router';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'

export default class HScrollMenuItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { menuItem } = this.props;
        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        var header = null; // menuItem.devicename;
        var header_html = (header) ? 
            (<div className="hscrollmenu-item__header">
                <p className="t-light th-f-color-secondary t-oneline">{ header }</p>
            </div>)
            : null;
        var graphic = (menuItem.imageType === "STATIC")
                 ? <StaticIcon image={menuItem.image} />
                 : <Image image={menuItem.image} isTemplate={menuItem.isTemplate} fillColor={fill} />;

        return (
            <Link
                to={menuItem.link}
                onClick={() => this.props.onSelection(menuItem.appID, menuItem.cmdID, menuItem.menuID)}>
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
