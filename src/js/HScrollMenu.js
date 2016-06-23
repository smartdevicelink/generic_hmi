import React from 'react';
import HScrollMenuItem from './HScrollMenuItem';

export default class HScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props.data)
        let menuItems = this.props.data.map((menuItem) => {
            return <div key={menuItem.id + menuItem.name}><HScrollMenuItem menuItem={menuItem} /></div>;
        })
        return (
            <div className="hscrollmenu">
                { menuItems }
            </div>
        )
    }
}
