import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import uiController from '../Controllers/UIController'
import { deactivateSubMenu, deactivateInteraction } from '../actions'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp]
    if (app.isPerformingInteraction) {
        // TODO: use the actual choices provided in the state
        return {data: [{
            appID: activeApp,
            cmdID: 2,
            name: "Performing!",
            image: undefined,
            link: '/media'
        }],
        isPerformingInteraction: true, interactionId: app.interactionId}
    }
    var menu = app.menu
    var activeSubMenu = app.activeSubMenu
    var data = menu.find((test) => {
        return test.menuID === activeSubMenu
    }).subMenu.map((command) => {
        var link = '/media' // TODO: only supports media right now
        return {
            appID: activeApp,
            cmdID: command.cmdID,
            name: command.menuName,
            image: command.cmdIcon ? command.cmdIcon.value : undefined,
            link: link
        }
    })
    return {data: data, isPerformingInteraction: false}
}

const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, isPerformingInteraction, interactionID) => {
            uiController.onSystemContext("MAIN", appID)
            if (isPerformingInteraction) {
                uiController.onChoiceSelection(cmdID, appID, interactionID)
                dispatch(deactivateInteraction(appID))
            } else {
                uiController.onCommand(cmdID, appID)
                dispatch(deactivateSubMenu(appID))
            }
        }
    }
}

const SubMenu = connect(
    mapStateToProps,
    mapDispatchToProps
)(VScrollMenu)

export default SubMenu