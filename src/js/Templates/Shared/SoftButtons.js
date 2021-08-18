import React from 'react';
import Radium from 'radium'

import SoftButtonImage from './SoftButtonImage'

class SoftButtonsBody extends React.Component {
    getSecondaryColorScheme() {
        if (this.props.colorScheme && this.props.colorScheme.secondary) {
            var redInt = this.props.colorScheme.secondary.red;
            var blueInt = this.props.colorScheme.secondary.blue;
            var greenInt = this.props.colorScheme.secondary.green;
            var cssColorScheme = {
                backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
            }
            return cssColorScheme;
        } else {
            return null;
        } 
    }

    getPrimaryColorScheme() {
        if (this.props.colorScheme && this.props.colorScheme.primary) {
            var redInt = this.props.colorScheme.primary.red;
            var blueInt = this.props.colorScheme.primary.blue;
            var greenInt = this.props.colorScheme.primary.green;
            var cssColorScheme = {
                ':active': {
                    backgroundColor: `rgb(${redInt}, ${greenInt}, ${blueInt})`
                  }
                
            }
            return cssColorScheme;
        } else {
            return null;
        } 
    }

    render() {
        var items;
        var softButtons = this.props.softButtons.slice(0, 6)

        var secondaryStyle = this.getSecondaryColorScheme();
        var primaryStyle = this.getPrimaryColorScheme();
        var cssColorStyle = Object.assign(primaryStyle ? primaryStyle : {}, 
                                            secondaryStyle ? secondaryStyle : {});
        
        var mouseDown = (button) => this.props.onButtonDown(this.props.appID, button.softButtonID, "CUSTOM_BUTTON");
        var mouseUp = (button) => this.props.onButtonUp(this.props.appID, button.softButtonID, "CUSTOM_BUTTON");

        if(softButtons.length === 1) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`soft-button-tile-large th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            style={cssColorStyle}
                            key={softButton.softButtonID}
                            /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                            onMouseDown={() => mouseDown(softButton)}
                            onMouseUp={() => mouseUp(softButton)}                            
                        >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
            })
        } else if (softButtons.length === 2) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`soft-button-tile-wide-large th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            style={cssColorStyle}
                            key={softButton.softButtonID}
                            /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                            onMouseDown={() => mouseDown(softButton)}
                            onMouseUp={() => mouseUp(softButton)}                            
                        >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
            })
        } else if (softButtons.length === 3) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`soft-button-tile-wide th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            style={cssColorStyle}
                            key={softButton.softButtonID}
                            /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                            onMouseDown={() => mouseDown(softButton)}
                            onMouseUp={() => mouseUp(softButton)}                            
                        >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
            })            
        } else if (softButtons.length === 4) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`soft-button-tile th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            style={cssColorStyle}
                            key={softButton.softButtonID}
                            /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                            onMouseDown={() => mouseDown(softButton)}
                            onMouseUp={() => mouseUp(softButton)}                           
                        >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
            })         
        } else if (softButtons.length === 5) {
            items = softButtons.map((softButton, index) => {
                if (index === 4) {
                    return (<div className={`soft-button-tile-wide th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                                style={cssColorStyle}
                                key={softButton.softButtonID}
                                /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                                onMouseDown={() => mouseDown(softButton)}
                                onMouseUp={() => mouseUp(softButton)}                                
                            >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
                } else {
                    return (<div className={`soft-button-tile-small th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                                style={cssColorStyle}
                                key={softButton.softButtonID}
                                /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                                onMouseDown={() => mouseDown(softButton)}
                                onMouseUp={() => mouseUp(softButton)}                                
                            >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
                }
            })
        } else if (softButtons.length === 6) {
            items = softButtons.map((softButton, index) => {
                return (<div className={`soft-button-tile-small th-f-color t-small t-light th-soft-buttons soft-button ${softButton.isHighlighted ? 'bg-highlighted' : 'th-bg-color'}`}
                            style={cssColorStyle}
                            key={softButton.softButtonID}
                            /*onClick={() => this.props.onButtonPress(this.props.appID, softButton.softButtonID, "CUSTOM_BUTTON")}*/
                            onMouseDown={() => mouseDown(softButton)}
                            onMouseUp={() => mouseUp(softButton)}                            
                        >
                                {softButton.text ? (<p>{softButton.text}</p>) : null}
                                {softButton.image ? (<SoftButtonImage image={softButton.image.value} 
                                    imageType={softButton.image.imageType}
                                    isTemplate={softButton.image.isTemplate}
                                    theme={this.props.theme}
                                />) : null}
                        </div>)
            })
        }
        if (this.props.graphicPresent) {
            return (
                <div className={this.props.class}>
                    <div className="soft-buttons soft-buttons-with-graphic">
                        {items}
                    </div>
                </div>
            )
        } else {
            return (
                <div className={this.props.class}>
                    <div className="soft-buttons">
                        {items}
                    </div>
                </div>
            )
        } 
    }
}


export default Radium(SoftButtonsBody);