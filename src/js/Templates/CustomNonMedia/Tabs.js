import React from 'react';
import Tab from './Tab'

export default class Tabs extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let menuItems = this.props.data.slice(0,4).map((menuItem) => {
            return (<div className="tab-block th-b-color-custom"
                key={menuItem.cmdID + menuItem.name}>
                    <Tab
                        menuItem={menuItem}
                        theme={this.props.theme}
                        onSelection={this.props.onSelection}
                        templateTitle={this.props.templateTitle}    
                    />
                </div>)
        })
        return (
            <div className="tabs">
                { menuItems }
            </div>
        )
    }
}
