import { connect } from 'react-redux'
import ControlBar from '../ControlBar'

import iconSeekLeft from '../../img/icons/icon-seek-left.svg';
import iconSeekRight from '../../img/icons/icon-seek-right.svg';
import iconPlay from '../../img/icons/icon-play.svg';

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var buttons = {}
    if (activeApp) {
        buttons = state.ui[activeApp].subscribedButtons
    }
    var subscribedButtons = []
    if (buttons.SEEKLEFT === true) {
        subscribedButtons.push({
            class: "secondary",
            name: "SEEKLEFT",
            icon: iconSeekLeft
        })
    }
    if (buttons.OK === true) {
        subscribedButtons.push({
            class: "primary",
            name: "OK",
            icon: iconPlay
        })
    }
    if (buttons.SEEKRIGHT === true) {
        subscribedButtons.push({
            class: "secondary",
            name: "SEEKRIGHT",
            icon: iconSeekRight
        })
    }
    return {subscribedButtons: subscribedButtons}
}

const mapDispatchToProps = (dispatch) => {
    return {}
}

export const Buttons = connect(
    mapStateToProps,
    mapDispatchToProps
)(ControlBar)

export default Buttons