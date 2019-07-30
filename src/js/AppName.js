import React from 'react'
import titleSeparator from '../img/static/0xFF.svg'

export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        let isShowingMenu = this.props.router.isActive('/inappmenu')
        let isShowingSubMenu = (this.props.router.isActive('/inapplist') && this.props.subMenuName)
        let subTitle = this.props.templateTitle
        subTitle = (isShowingMenu) ? "Menu" : subTitle
        subTitle = (isShowingSubMenu) ? this.props.subMenuName : subTitle 
        
        return (
            <div>
                <p className="t-oneline">
                    <span className="t-small t-medium th-f-color">{this.props.name}</span> <span className="svg-wrap-secondary" dangerouslySetInnerHTML={{__html: (subTitle) ? titleSeparator : ""}} /> <span className="t-small t-light th-f-color-secondary">{subTitle}</span>
                </p>
            </div>
        )
    }
}