import React from 'react';
import { Link } from 'react-router';
import SoftButtonImage from './Templates/Shared/SoftButtonImage'
import iconArrowRight from '../img/icons/icon-arrow-right.svg';

export default class VScrollMenuItem extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
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
                    <span className="vscrollmenu-item__arrow svg-wrap" dangerouslySetInnerHTML={{__html: iconArrowRight}} />
                </div>
            </Link>
        )
    }
}
