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

        return (
            <Link
                to={this.props.menuItem.link}
                className="vscrollmenu-item th-b-color th-bb-color-secondary"
                onClick={() => this.props.onSelection(this.props.appID, this.props.cmdID, this.props.menuID, this.props.isPerformingInteraction, this.props.interactionId)}>
                <div className="vscrollmenu-item__primary">
                    <SoftButtonImage class="vscrollmenu-item__image" image={this.props.image ? this.props.image : null} 
                        imageType={this.props.imageType ? this.props.imageType : null}
                        isTemplate={this.props.isTemplate ? this.props.isTemplate : null}
                        theme={this.props.theme}
                    />
                    <div className="vscrollmenu-item__name">
                        <p className="t-large t-light th-f-color">{this.props.menuItem.name}</p>
                        <p className="t-large t-light th-f-color-secondary">{this.props.menuItem.info}</p>
                    </div>
                    {subMenuIndicator}
                </div>
            </Link>
        )
    }
}
