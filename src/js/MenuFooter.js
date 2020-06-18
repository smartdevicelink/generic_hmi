import React from 'react';

export default class MenuFooter extends React.Component {
    render() {
        return (
            <div
                className="vscrollmenu-item th-b-color th-bb-color-secondary">
                <div className={"vscrollmenu-item__name "}>
                    <div className="t-large t-light th-f-color-secondary vscrollmenu-item-primary">
                        Additional items are hidden for your safety
                    </div>
                </div>
            </div>
        )
    }
}
