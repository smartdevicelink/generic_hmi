import React from 'react';
import { Link } from 'react-router-dom';
import Image from './Templates/Shared/Image'
import StaticIcon from './Templates/Shared/StaticIcon'
import {ReactComponent as IconArrowRight} from '../img/icons/icon-arrow-right.svg'

export default class HScrollMenuItem extends React.Component {
    render() {
        const { menuItem } = this.props;
        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        var deviceName = menuItem.devicename;
        var warningText = "Driver Distraction Disabled";
        var headerText = menuItem.enabled === false ? warningText : deviceName
        var header = menuItem.enabled === false || deviceName;
        var header_html = (header) ? 
            (<div className="hscrollmenu-item__header">
                <p className="t-light th-f-color-secondary t-oneline">{ headerText }</p>
            </div>)
            : null;
        var graphic = (menuItem.imageType === "STATIC")
                 ? <StaticIcon image={menuItem.image} />
                 : <Image image={menuItem.image} isTemplate={menuItem.isTemplate} fillColor={fill} />;

        var buttonClass = "hscrollmenu-item th-b-color th-tile-background-color";
        var clickHandler = () => this.props.onSelection(menuItem.appID, menuItem.cmdID, menuItem.menuID, menuItem.enabled);
        
        if (menuItem.greyOut) {
            clickHandler = undefined;
            menuItem.link = undefined;
            buttonClass += " hscrollmenu-item-disabled";
        } else if (menuItem.enabled === false) {
            buttonClass += " hscrollmenu-item-disabled";
        }

        let subMenuIndicator = menuItem.menuID ? (
            <span className="hscrollmenu-item__arrow svg-wrap" > 
                <IconArrowRight/>
            </span>
        ) : null;

        return (
            <Link
                to={menuItem.link}
                onClick={(e) => (menuItem.enabled === false) ? 
                    e.preventDefault() : clickHandler()}
                >
                <div
                    className={buttonClass}>
                    { header_html }
                    <div className="hscrollmenu-item__image">
                        { graphic }
                    </div>
                    <div className="hscrollmenu-item__name">
                        <p className="t-small t-light th-f-color">{menuItem.name}</p>
                    </div>
                    {subMenuIndicator}
                </div>
            </Link>
        )
    }
}
