import React from 'react';

import VScrollMenuItem from './VScrollMenuItem';

export default class VScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let menuItems = this.props.data.map((menuItem) => {
            return <div key={menuItem.id + menuItem.name}><VScrollMenuItem menuItem={menuItem} /></div>;
        })
        return (
            <div className="vscrollmenu">
                { menuItems }
            </div>
        )
    }
}
