import React from 'react';
import App from './containers/App'

export default class HScrollMenu extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        let menuItems = this.props.data.map((menuItem) => {
            return <div key={menuItem.id + menuItem.name}><App appID={menuItem.id} menuItem={menuItem} /></div>;
        })
        return (
            <div className="hscrollmenu">
                { menuItems }
            </div>
        )
    }
}
