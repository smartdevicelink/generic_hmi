import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';

import AppHeader from '../../containers/Header'
import StaticIcon from '../Shared/StaticIcon'
import HScrollMenuItem from '../../HScrollMenuItem'

class MediaCustomMenu extends React.Component {
    render() {
        let menuItems = this.props.data.map((menuItem) => {
            return (<div className="hscrollmenu-block"
                key={menuItem.cmdID + menuItem.name}>
                    <HScrollMenuItem
                        menuItem={menuItem}
                        theme={this.props.theme}
                        onSelection={this.props.onSelection}/>
                </div>)
        })

        return (<div className="media-custom-template">
            <AppHeader backLink="/media-custom" menuName="BACK" />
            <div className="media-custom-template__head">
                <Link className="media-custom-template__head__link"
                    to="/media-custom" href="">
                    <StaticIcon class="static-icon" image="0x04" />
                </Link>
                <p className="t-large t-light th-f-color media-custom-queue-title">Menu</p>
            </div>
            <div className="hscrollmenu">
                { menuItems }
            </div>
        </div>)
    }
}

export default MediaCustomMenu