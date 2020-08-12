import React from 'react';
import { Link } from 'react-router-dom';
import SoftButtonImage from './Templates/Shared/SoftButtonImage'
import {ReactComponent as IconArrowRight} from '../img/icons/icon-arrow-right.svg';

export default class VScrollMenuItem extends React.Component {
    render() {
        let subMenuIndicator = this.props.menuID ? (
                <span className="vscrollmenu-item__arrow svg-wrap" > 
                    <IconArrowRight/>
                </span>
            ) : null;
        
        var classString = "vscrollmenu-item th-b-color th-bb-color-secondary";

        if (this.props.enabled === false) {
            classString += " vscrollmenu-item-disabled"
        }

        var secondaryText = this.props.enabled === false ? 
            "Driver Distraction Disabled" : this.props.menuItem.info;

        return (
            <Link
                to={this.props.menuItem.link}
<<<<<<< HEAD
                className="vscrollmenu-item th-b-color th-bb-color-secondary"
=======
                className={classString}
>>>>>>> origin/develop
                onClick={(e) => (this.props.enabled === false) ? e.preventDefault() : 
                    this.props.onSelection(this.props.appID, this.props.cmdID, 
                                            this.props.menuID, this.props.enabled, 
                                            this.props.isPerformingInteraction, 
                                            this.props.interactionId)}>
                <div className={"vscrollmenu-item__primary " + (this.props.enabled ? "th-f-color" : "th-f-color-secondary")}>
                    <SoftButtonImage class="vscrollmenu-item__image" image={this.props.image ? this.props.image : null} 
                        imageType={this.props.imageType ? this.props.imageType : null}
                        isTemplate={this.props.isTemplate ? this.props.isTemplate : null}
                        theme={this.props.theme}
                    />
                    <div className="vscrollmenu-item__name">
                        <p className="t-large t-light th-f-color">{this.props.menuItem.name}</p>
                        <p className="t-small t-light th-f-color-secondary">{secondaryText}</p>
                    </div>
                    {subMenuIndicator}
                </div>
            </Link>
        )
    }
}
