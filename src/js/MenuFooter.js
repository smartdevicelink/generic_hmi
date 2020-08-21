import React from 'react';

export default class MenuFooter extends React.Component {
    render() {
        var classString = "t-large t-light th-f-color-secondary vscrollmenu-item-primary";
        if (this.props.textAlign === "center") {
            classString += "t-center";
        }
        return (
            <div
                className="vscrollmenu-item th-b-color th-bb-color-secondary">
                <div className={"vscrollmenu-item__name "}>
                    <div className={classString}>
                        Additional items are hidden for your safety
                    </div>
                </div>
            </div>
        )
    }
}
