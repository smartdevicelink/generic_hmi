import React from 'react';
import { connect } from 'react-redux'
import SoftButtonImage from './Templates/Shared/SoftButtonImage';

import AppHeader from './containers/Header';
import sdlController from './Controllers/SDLController';

const mapStateToProps = (state) => {
    return {
        theme: state.theme,
        appOptions: state.appList
    };
}

class Permissions extends React.Component {
    render() {
        var options = this.props.appOptions.map((app) => {
            var icon = ""
            if (app.icon) {
                icon = app.icon.replace("local:", "file:")
            }

            return <div className="vscrollmenu-item th-b-color th-bb-color-secondary" key={app.appID}
                    onClick={(e) => { sdlController.getListOfPermissions(app.appID); }}>
                <SoftButtonImage class="vscrollmenu-item__image" image={icon} 
                    imageType={'DYNAMIC'}
                    theme={this.props.theme}
                />
                <div className="vscrollmenu-item__primary th-f-color" style={{ marginLeft: '2%' }}>
                    <p class="t-large t-light th-f-color">{app.appName} Permissions</p>
                </div>
            </div>;
        });

        return (
            <div>
                <AppHeader backLink={'/'} menuName="Exit" />
                <div className="vscrollmenu">
                    { options }
                </div>
            </div>
        )
    }
}

const PermissionsView = connect(mapStateToProps)(Permissions);
export default PermissionsView;
