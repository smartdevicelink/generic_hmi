import React from 'react';

export default class MenuFooter extends React.Component {
    render() {
<<<<<<< HEAD
=======
        var classString = "t-large t-light th-f-color-secondary vscrollmenu-item-primary";
        if (this.props.textAlign === "center") {
            classString += "t-center";
        }
>>>>>>> origin/develop
        return (
            <div
                className="vscrollmenu-item th-b-color th-bb-color-secondary">
                <div className={"vscrollmenu-item__name "}>
<<<<<<< HEAD
                    <div className="t-large t-light th-f-color-secondary vscrollmenu-item-primary">
=======
                    <div className={classString}>
>>>>>>> origin/develop
                        Additional items are hidden for your safety
                    </div>
                </div>
            </div>
        )
    }
}
