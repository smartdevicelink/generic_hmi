import React from 'react';
import ReactSlider from 'rc-slider';
import 'rc-slider/assets/index.css';
import store from './store'
import { updateSliderPosition } from './actions'
import uiController from './Controllers/UIController'


export default class Slider extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            value: props.sliderData.position
        }
        this.onSliderChange = this.onSliderChange.bind(this)
        this.onButtonPress = this.onButtonPress.bind(this)
    }

    onSliderChange(value) {
        this.setState({ value }, () => {
            uiController.onSliderKeepContext(this.props.sliderData.msgID, this.props.sliderAppId)
            store.dispatch(updateSliderPosition(this.props.sliderAppId, value))
        })
    }

    onButtonPress(offset){
        if(this.state.value + offset > 0 && this.state.value + offset <= this.props.sliderData.numTicks) {
            this.onSliderChange(this.state.value + offset)
        }
    }

    render() {
        const sliderData = this.props.sliderData
        let markerColors = {
            active: this.props.theme ? "#E6E6E6" : "#666666",
            inactive: this.props.theme ? "#4D4D4D" : "#FFFFFF",
            selected: this.props.theme ? "#FFFFFF" : "#000000"
        }
        
        return (
            <div className="slider">
                <div className="slider-header">
                    <h1 className="t-small t-medium th-f-color">
                        {this.props.sliderName}
                    </h1>
                    <p className="t-small t-light th-f-color">
                        {sliderData.header}
                    </p>
                </div>
                <div className="slider-body">
                    <div className="slider-components">
                        <div className={`th-f-color t-large t-light th-bg-color th-soft-buttons slider-button`}
                                onClick={() => this.onButtonPress(-1)}>
                            <p>-</p>
                        </div>
                        <div className="slider-component-container" style={{borderColor: markerColors.active}}>
                            <div className="slider-react-component" style={{width: sliderData.numTicks * 10}}>
                                <ReactSlider
                                    dots
                                    min={1}
                                    max={sliderData.numTicks}
                                    step={1}
                                    value={this.state.value}
                                    onChange={this.onSliderChange}
                                    railStyle={{
                                        background: "none"
                                    }}
                                    trackStyle={{
                                        background: "none"
                                    }}
                                    handleStyle={{
                                        height: 25,
                                        width: 3,
                                        marginLeft: -2,
                                        marginTop: -19,
                                        borderColor: `${markerColors.selected}`
                                    }}
                                    dotStyle={{
                                        borderColor: `${markerColors.inactive}`,
                                        height: 25,
                                        width: 3
                                    }}
                                    activeDotStyle={{
                                        borderColor: `${markerColors.active}`
                                    }}
                                    
                                />
                            </div>
                        </div>
                        <div className={`th-f-color t-large t-light th-bg-color th-soft-buttons slider-button`}
                                onClick={() => this.onButtonPress(1)}>
                            <p>+</p>
                        </div>
                    </div>
                    <p className="t-small t-light th-f-color slider-footer">
                        {(sliderData.footer && sliderData.footer.length > this.state.value - 1) ? sliderData.footer[this.state.value - 1] : null}
                    </p>
                </div>
                
                <div className={`th-f-color t-small t-light th-bg-color th-soft-buttons slider-submit`}
                        onClick={() => this.props.submitCallback()}>
                    <p>Submit</p>
                </div>
            </div>
        )
    }
}
