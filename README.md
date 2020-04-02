# Getting Started 

## Get an instance of SDL Core running

Note: This requires you to use Ubuntu 16.04 or 18.04.

Clone the [SDL Core repository](https://github.com/smartdevicelink/sdl_core) and follow the setup instructions for the project. After the project is built, run an instance of SDL Core in your terminal.

## Start the HMI

Once SDL Core is running, follow these steps to set up the Generic HMI.

First, clone this repository. Once cloned, you can initialize the git submodules in this project by running the following commands:
```
cd generic_hmi
git submodule init
git submodule update
```
Alternatively, you can clone this repository with the --recurse-submodules flag.

After initializing the git submodules for this project, you can launch the Generic HMI in a web browser:
```
chromium-browser index.html
```

### PTU with vehicle modem (optional)

In order to get policy table updates using the vehicle modem, some additional setup is required

1. Run `deploy_server.sh` in the root folder
2. Run the HMI normally
3. Select the `PTU using in-vehicle modem` checkbox to enable the feature

## Developing/Modifying the HMI

The main third-party technologies we use to develop this HMI are React, React-Redux, and React-Router. The HMI component of SDL is responsible for processing and responding to RPCs which are received from a connected SDL Core instance.

### Building the HMI

Before any changes can be made to the HMI, you will first need to set up your environment to allow for building the Generic HMI.

Note: These instructions are written for Node version 7.2 

Install webpack:
```
npm install -g webpack@1.11
```

Install dependencies (you might need to clean the `node_modules` folder):
```
npm install
```

Run webpack:
```
webpack
```
Note: This command must be run before relaunching the HMI in the browser to see any changes made.

### Key Files

#### entry.js

This is the main entry point for the entire application. It sets up the routes and highest level components in the React app. Once the application is loaded, it attempts to connect to an instance of SDL Core.

#### Controllers/Controller.js

This is the main path to all things SDL related. The Controller routes RPCs coming from SDL to sub-controllers so that they can be handled, and responds to SDL. Sub-controllers all implement a `handleRPC()` function. The handleRPC function returns true if the Controller should respond with a generic success to SDL, return false for a generic false, return an object with a key of `rpc` to respond with a custom RPC, and return `null` if the Controller should not respond (such as in the case of incoming notifications from SDL). The Controller also implements a `sanitize` function which can be used to manipulate RPCs before they're sent off to a sub-controller to be handled.

### Implementing an RPC

Implementing an RPC is the main activity when developing this HMI as it related to communicating with SDL Core. There are three basic behaviors that can be implemented

  1. An RPC comes in from SDL Core which changes some information displayed to the user in a view (Implementing Requests)
  2. The user takes action on an element in the React Application which generates a message to SDL Core (Sending messages to SDL Core)
  3. An RPC comes in from SDL Core which forces the current view in the React Applicaton to change (Changing the router history)

#### Implementing Requests

First, add a case statement to the appropriate Sub-Controller. If the RPC is named `UI.something`, the appropriate sub-controller is the UIController. The case statement should dispatch a method to the store that you'll define shortly. Import that method name from actions at the top of the Controller. Head over to `actions.js`, add a new string to the `Actions` const and export a new method of the same name which returns an object containing the same parameters you passed and a `type` property which is the new `Action` you defined. In `reducers.js` you can now add a case statement for the Action name you created. Return a new state object based on the parameters passed into the action from the Controller. This state will be used in a container to send the appropriate information to a React Component. For more information about actions and reducers check out http://redux.js.org/docs/basics/index.html. Example of all this below.

```js
// UIController.js
import {
    show // Importing the new action for use with store.dispatch
} from '../actions'
...
handleRPC(rpc) {
    ...
        case "Show":
            store.dispatch(show( // dispatching the action with the needed info
                rpc.params.appID,
                rpc.params.showStrings,
                rpc.params.graphic,
                rpc.params.softButtons
            ))
            return true
    ...

// actions.js
export const Actions = {
    SHOW: "SHOW" // Defining the new type
}
...
export const show = (appID, showStrings, graphic, softButtons) => { // exporting the show action
    return {
        type: Actions.SHOW, // Specifying the new type
        appID: appID,
        showStrings: showStrings,
        graphic: graphic,
        softButtons: softButtons
    }
}

// reducers.js
function ui(state = {}, action) {
    switch (action.type) {
        case Actions.SHOW: // implementing the reducer, you can do this in any of the functions that are to be reduced into state
            var newState = { ...state } // Copy over the old state
            var app = newState[action.appID] ? newState[action.appID] : newAppState() // Find the app specified by the action that we're changing state for or create a new one
            newState[action.appID] = app // set it back in case we created a new one
            if (action.showStrings && action.showStrings.length > 0) {
                app.showStrings = action.showStrings // Change show strings if they changed
            }
            if (action.graphic) { // Add the graphic to the state if it exists
                app.graphic = action.graphic
            }
            if (action.softButtons && action.softButtons.length > 0) { // Change soft buttons if they changed
                app.softButtons = action.softButtons
            }
            return newState // self explanatory
...

```

At this point, you'll need to think about what component needs the information in the React application which you've just added to the state. In the example above, the information in the Show RPC is used in the MediaPlayerBody component as MetaData. So create a file for the container which will be hooked up directly to the React Component which needs the information about show. Below is a commented version of the Metadata container which parses out the useful information added to the state by the Show RPC for use in the React Component.

```js
// Metadata.js
import { connect } from 'react-redux' // so we can connect this container with the appropriate react component
import MediaPlayerBody from '../MediaPlayerBody' // this is the React component we're connecting it which will use the props we create off the state

const mapStateToProps = (state) => { // a function you always have to implement
    var activeApp = state.activeApp // The active application in the react component
    var metadata = state.ui[activeApp] // The UI metadata for that application (we created all this in reducers.js when we implemented Actions.SHOW)
    if (metadata === undefined) return {} // Do nothing if there is no metadata yet
    var props = { // Default mainfields for the react component
        mainField1: null,
        mainField2: null,
        mainField3: null
    }
    metadata.showStrings.map ((textField) => { // Iterate all the strings added by the show
        switch (textField.fieldName) { // Each textField has a fieldName which is its type
            case "mainField1": // Map types to props that'll be used by the Component
                props.mainField1 = textField.fieldText
                break
            case "mainField2":
                props.mainField2 = textField.fieldText
                break
            case "mainField3":
                props.mainField3 = textField.fieldText
                break
        }
    })
    // If there is a graphic, add it to the props
    props.graphic = metadata.graphic ? metadata.graphic.value : "http://www.unrecorded.mu/wp-content/uploads/2014/02/St.-Vincent-St.-Vincent1.jpg"
    return props // Return the props to the component
}

// This is where we would implement a way to communicate back to redux if there was some action the user can take to change our state. More on that later
const mapDispatchToProps = (dispatch) => {
    return {}
}

// Connect this container with the component which will use it and export it
export const MediaMetadata = connect(
    mapStateToProps,
    mapDispatchToProps
)(MediaPlayerBody)

export default MediaMetadata

```

The last thing we need to do is make sure that in our react application we are now using our container instead of the original react component which is not connected, and that the react component is using the properly named props which were passed by the container in render.
In this example, this was done in MediaPlayer.js

```js
// MediaPlayer.js
...
import { MediaMetadata } from './containers/Metadata';

export default class MediaPlayer extends React.Component {
    constructor() {
        super();
    }

    render() {
        return ( // We created the MediaMetadata container in this tutorial
            <div>
                <AppHeader backLink="/" menuName="Apps"/>
                <MediaMetadata />
                <ProgressBar />
                <Buttons />
            </div>
        )
    }
}

```

The component we actually connected was the MediaPlayerBody, let's take a look to see how the props we created off the state in the container are used

```js
import React from 'react';

import AlbumArt from './AlbumArt';
import MediaTrackInfo from './containers/MediaTrackInfo_c'

export default class MediaPlayerBody extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            // mainFields and graphic - Perfect. Those exist because this component is connected to our redux state by the container.
            // Any time SDL changes the state that is tied to this component, this component will re-render and update. 
            <div className="media-player-body">
                <AlbumArt image={this.props.graphic} />
                <div className="media-track">
                    <p className="t-small t-medium th-f-color">{this.props.mainField3}</p>
                    <p className="t-large t-light th-f-color">{this.props.mainField1}</p>
                    <p className="t-large t-light th-f-color-secondary">{this.props.mainField2}</p>
                    <MediaTrackInfo />
                </div>
            </div>
        )
    }
}
```

#### Sending Messages to SDL Core

There are many situations where a user's action in the React Application needs to trigger a message to be sent to SDL. For example, after an application uses the `AddCommand` RPC to add items to the App's in-HMI menu, and the user selects one of those items, we need to be able to tell SDL about that selection by sending the notification called `UI.OnCommand` to SDL Core so it can be relayed to the connected application. We do this by implementing the `mapDispatchToProps` function in our container. For the menu, this function does two things - changes state by called dispatch (in the same way we changed our state before in our sub-controller) and sending a message to a sub controller to notify SDL Core about the event.

```js
const mapDispatchToProps = (dispatch) => {
    return {
        onSelection: (appID, cmdID, menuID) => { // Our function is called onSelection, so the component can use this.props.onSelection()
            if (menuID) {
                dispatch(activateSubMenu(appID, menuID)) // We can used the passed in dispatch to change state (don't forget to define and import the action activateSubMenu)
            }
            else if (cmdID) {
                uiController.onSystemContext("MAIN", appID) // We can call functions on uiController (again, don't forget to import) which send messages to SDL
                uiController.onCommand(cmdID, appID)
            }
        }
    }
}
```

From here, the only thing left to do is implement the functions called on the sub controller. When the sub controllers imported by the main Controller, the main controller adds a function called `addListener`. The sub-controller can use the listener to send messages directly to SDL Core.

```js
// UIController.js
onSystemContext(context, appID) {
    this.listener.send(RpcFactory.OnSystemContextNotification(context, appID))
}
onCommand(cmdID, appID) {
    this.listener.send(RpcFactory.OnCommandNotification(cmdID, appID))
}
```

The only thing left to do now is to make sure the connected React Component is properly using the method we defined in `mapDispatchToProps`. In this example, it's the `HScrollMenu` which passes the onSelection prop to an HScrollMenuItem which calls onSelection as we've defined

```js
// HScrollMenuItem.js
onClick={() => this.props.onSelection(this.props.appID, this.props.cmdID, this.props.menuID)}>
```

### Changing the router history

The last common activity required to implement an SDL HMI completely is the ability to change views based on messages received by SDL. Views in the React Application are defined by Routes. When a user selects an item that changes the view, a route is taken such as `/inapplist`. We can force a route to be taken using React Routers `withRouter`. Right now, since the AppHeader component is rendered in every single view, it is responsible for forcing a change to routing history (thereby changing the view) when it renders. So the flow is

  1. Message comes into SDL
  2. Dispatch to store
  3. Implement Action and change app state in Reducer
  4. AppHeader is rendered
  5. AppHeader checks state to see if a change needs to be forced
  6. If a change needs to be forced, AppHeader makes the change
  7. Everything re-renders

This forced change is done in the React lifecycle method called `componentWillReceiveProps`, which gives the AppHeader access to the nextProps that will be used in the components render _before_ it's rendered and in time to make a change.

```js
// AppHeader.js
// withRouter will give us access to router on this components props
import { withRouter } from 'react-router';
...
    componentWillReceiveProps (nextProps) {
        if (nextProps.isDisconnected) {
            this.props.router.push("/") // The app got disconnected so we force a change back to the menu
        }
    }
...
export default withRouter(AppHeader) // Hook this component up with router.
```
