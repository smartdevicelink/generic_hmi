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
                <div className="vscrollmenu-item__name">
                    <div className="t-large t-light th-f-color vscrollmenu-item-primary">
                        {this.props.menuItem.name}
                        <SoftButtonImage class="vscrollmenu-item-image" image={this.props.image ? this.props.image : null} 
                                    imageType={this.props.image ? this.props.imageType : null}
                                />   
                    </div>
                    <p className="t-large t-light th-f-color-secondary">{this.props.menuItem.info}</p>
                </div>
                <div>
                    <span className="svg-wrap" dangerouslySetInnerHTML={{__html: iconArrowRight}} />
                </div>
            </Link>
        )
    }
}
