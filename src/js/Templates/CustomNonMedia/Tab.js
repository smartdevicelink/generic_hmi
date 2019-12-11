import React from 'react';
import { Link } from 'react-router';
import Image from '../../Templates/Shared/Image'
import StaticIcon from '../../Templates/Shared/StaticIcon'

export default class Tab extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { menuItem } = this.props;
        var fill = this.props.theme ? "#FFFFFF" : "#000000";
        var graphic = (menuItem.imageType === "STATIC")
                 ? <StaticIcon image={menuItem.image} />
                 : <Image image={menuItem.image} isTemplate={menuItem.isTemplate} fillColor={fill} />;

        var highlighted = menuItem.name === this.props.templateTitle ? "tab-highlighted" : "th-tab-background-color"         
        return (
            <Link
                to={menuItem.link}
                onClick={() => this.props.onSelection(menuItem.appID, menuItem.cmdID, menuItem.menuID)}>
                <div
                    className={"tab-item th-b-color-custom " + highlighted}>
                    <div className="tab-item__image">
                        { graphic }
                    </div>
                    <div className="tab-item__name">
                        <p className="t-small t-light th-f-color">{menuItem.name}</p>
                    </div>
                </div>
            </Link>
        )
    }
}
