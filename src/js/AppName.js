import React from 'react'
import {ReactComponent as TitleSeparator} from '../img/static/0xFF.svg'

export default class AppName extends React.Component {
    render () {
        let isShowingMenu = this.props.location.pathname === '/inappmenu'
        let isShowingSubMenu = (this.props.location.pathname === '/inapplist' && this.props.subMenuName)
        let subTitle = this.props.templateTitle
        subTitle = (isShowingMenu) ? "Menu" : subTitle
        subTitle = (isShowingSubMenu) ? this.props.subMenuName : subTitle 
        
        let appName_html = <span className="t-small t-medium th-f-color">{this.props.name}</span>
        let separator_html = (subTitle) ? <span className="svg-wrap-secondary"><TitleSeparator/></span> : null
        let subTitle_html = (subTitle) ? <span className="t-small t-light th-f-color-secondary">{subTitle}</span> : null

        return (
            <div>
                <p className="t-oneline">
                    {appName_html}
                    {separator_html}
                    {subTitle_html}
                </p>
            </div>
        )
    }
}