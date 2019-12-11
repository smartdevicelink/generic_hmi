import React from 'react'
import titleSeparator from '../img/static/0xFF.svg'

export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        let isShowingMenu = this.props.router.isActive('/inappmenu')
        let isShowingSubMenu = (this.props.router.isActive('/inapplist') && this.props.subMenuName)
        let subTitle = this.props.disableTemplateTitle ? "" : this.props.templateTitle
        subTitle = (isShowingMenu) ? "Menu" : subTitle
        subTitle = (isShowingSubMenu) ? this.props.subMenuName : subTitle 
        
        let appName_html = <span className="t-small t-medium th-f-color">{this.props.name}</span>
        let separator_html = (subTitle) ? <span className="svg-wrap-secondary" dangerouslySetInnerHTML={{__html:titleSeparator}} /> : null
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