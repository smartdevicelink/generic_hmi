import React from 'react';
import { connect } from 'react-redux'
import { Link } from 'react-router';

import AppHeader from '../../containers/Header'
import StaticIcon from '../Shared/StaticIcon'

import uiController from '../../Controllers/UIController'
import { deactivateInteraction } from '../../actions'

import MediaCustomQueueItem from './MediaCustomQueueItem'

class MediaCustomPerformInteraction extends React.Component {
    constructor() {
        super();
    }

    render() {
        var divStyle = {};

        const bgColor = this.props.theme ? '#222222' : '#FFFFFF';

        if (this.props.albumArt) {
            divStyle.backgroundImage = `linear-gradient(-180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.00) 15%), url(${this.props.albumArt})`;
        }

        var header = "Queue";
        
        if (this.props.text && this.props.text.fieldName == "initialInteractionText") {
            header = this.props.text.fieldText;
        }

        return (<div className="media-custom-template" style={divStyle}>
            <AppHeader />
            <div className="media-custom-template__head">
                <Link className="media-custom-template__head__link"
                    to="/media-custom" href=""
                    onClick={() => this.props.onSelection(this.props.appID)}>
                    <StaticIcon class="static-icon" image="0x04" />
                </Link>
                <p className="t-large t-light text-strong-contrast">{header}</p>
            </div>
            <div className="media-custom-template__queue" style={{background: bgColor}}>
                {
                    this.props.data ? this.props.data.map((dat, i) => {
                        return (<MediaCustomQueueItem onClick={() => this.props.queueItemClicked(dat.cmdID, this.props.appID, this.props.interactionId)} 
                                    key={i} index={i+1} song={dat.name} artist={dat.artist} theme={this.props.theme} image={dat.image} />);
                    }) : null
                }
            </div>
        </div>)
    }
}

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp]
    var theme = state.theme
    var data = app.choices.map((choice) => {
        return {
            cmdID: choice.choiceID,
            name: choice.menuName,
            artist: choice.secondaryText,
            image: choice.image
        }
    })
    return {
        appID: activeApp,
        data:data,
        albumArt: app.graphic.value,
        isPerformingInteraction: app.isPerformingInteraction,
        interactionId: app.interactionId,
        theme: theme,
        text: app.interactionText
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        queueItemClicked: (cmdID, appID, interactionID) => {
            uiController.onSystemContext("MAIN", appID)
            uiController.onChoiceSelection(cmdID, appID, interactionID)
            dispatch(deactivateInteraction(appID))
        },
        onSelection: (appID) => {
            uiController.onSystemContext("MAIN", appID)
            uiController.failInteractions()
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MediaCustomPerformInteraction);