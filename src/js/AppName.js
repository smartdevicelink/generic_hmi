import React from 'react'

export default class AppName extends React.Component {
    constructor (props) {
        super(props)
    }
    render () {
        let isShowingMenu = this.props.router.isActive('/inappmenu') || 
            (this.props.router.isActive('/inapplist') && this.props.menuName)
        let subTitle = (!isShowingMenu) ? this.props.templateTitle : (this.props.menuName || 'Menu');
        
        return (
            <div>
                <p>
                    <span className="t-small t-medium th-f-color">{this.props.name}</span>
                    <br />
                    <span className="t-small t-light th-f-color t-oneline">{subTitle}</span>
                </p>
            </div>
        )
    }
}