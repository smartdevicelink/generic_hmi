import React from 'react';
import { connect } from 'react-redux'

import AppHeader from '../../containers/Header'
import Buttons from '../../containers/Buttons';
import ControlBarItem from '../../ControlBarItem'
import ProgressBar from '../../containers/ProgressBar_c';

import uiController from '../../Controllers/UIController'

class MediaCustom extends React.Component {
    constructor() {
        super();
    }

    render() {
        var activeApp = this.props.activeApp;

        var divStyle = {}

        var softButtons = [];
        var showStrings = {
            mainField1: 'SONG TITLE',
            mainField2: 'ARTIST/ALBUM NAME'
        };

        if (activeApp) {
            softButtons = this.props.ui[activeApp].softButtons;
            showStrings = this.props.ui[activeApp].showStrings;

            if (this.props.ui[activeApp].graphic) {
                divStyle.backgroundImage = `linear-gradient(-180deg, rgba(0,0,0,0.85) 2%, rgba(0,0,0,0.00) 18%), linear-gradient(0deg, rgba(0,0,0,0.70) 5%, rgba(0,0,0,0.00) 50%), url(${this.props.ui[activeApp].graphic.value})`;
            }
        }

        return (<div className="media-custom-template">
            <AppHeader backLink="/" menuName="APPS" />
            <div className="media-custom-template__container" style={divStyle}>
                <div className="media-custom-template__body" key="0">
                    <div className="media-custom-template__body__text" key="0">
                        <p className="t-large t-light" style={{ fontSize: 42 }}>{showStrings.mainField1}</p>
                        <p className="t-light"style={{ fontSize: 24, fontWeight: 600 }}>{showStrings.mainField2}</p>
                    </div>
                    {
                        softButtons.map((button, i) => {
                            if (i < 2) {
                                return null;
                            }

                            return (<div key={i} className={i == 2 ? "media-custom-template__body__right" : (i == 3) ? "media-custom-template__body__botleft" : "media-custom-template__body__botright"}>
                                <ControlBarItem
                                    class="tertiary"
                                    image={button.image.value}
                                    imageType={button.image.imageType}
                                    key={button.softButtonID}
                                    name="CUSTOM_BUTTON"
                                    id={button.softButtonID}
                                    appID={activeApp}
                                    onButtonPress={this.props.onButtonPress}
                                    theme={this.props.theme}
                                    isTemplate={button.image.isTemplate}
                                    highlightColor={button.isHighlighted ? '#65a0ff' : null}
                                />
                            </div>)
                        })
                    }
                </div>
                <div className="media-custom-template__controls" key="1">
                    <ProgressBar />
                    <Buttons />
                </div>
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => { 
    return { 
        activeApp: state.activeApp,
        theme: state.theme,
        ui: state.ui     
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onButtonPress: (appID, buttonID, buttonName) => {
            uiController.onButtonPress(appID, buttonID, buttonName)
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaCustom);