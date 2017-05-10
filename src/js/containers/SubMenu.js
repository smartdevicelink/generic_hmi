import { connect } from 'react-redux'
import VScrollMenu from '../VScrollMenu'
import uiController from '../Controllers/UIController'
import { deactivateSubMenu, deactivateInteraction } from '../actions'
import '../polyfill_find'

const mapStateToProps = (state) => {
    var activeApp = state.activeApp
    var app = state.ui[activeApp]
    if (app.isPerformingInteraction) {
        var data = app.choices.map((choice) => {
            return {
                appID: activeApp,
                cmdID: choice.choiceID,
                name: choice.menuName,
                image: undefined,
                link: '/media'
            }
        })
        return {
            data:data,
            isPerformingInteraction: true,
            interactionId: app.interactionId
        }
    }
    // The app isn't performing an interaction, so pass the sub menu items 
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
        onSelection: (appID, cmdID, menuID, isPerformingInteraction, interactionID) => {
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