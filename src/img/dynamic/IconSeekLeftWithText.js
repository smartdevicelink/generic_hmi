import React from 'react';

export default class IconSeekLeftWithText extends React.Component {
    render() {
        return (
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                preserveAspectRatio="xMidYMid meet" viewBox="19 9.8 35 29.3" width="75" height="54">
            <path d="M49,39l-1.4-1.4C50.4,34.8,52,31,52,27c0-4-1.5-7.8-4.4-10.6S41,12.1,37,12.1c-4,0-7.8,1.5-10.6,4.4
                C21.1,21.8,20.5,30,25,36l-1.6,1.2C18.3,30.4,18.9,21.1,25,15c3.2-3.2,7.5-4.9,12-4.9c4.6,0,8.8,1.8,12,4.9c3.2,3.2,4.9,7.5,4.9,12
                C54,31.6,52.2,35.8,49,39z"/>
            <polyline class="svg-fill-important" points="19,37 25.2,38.8 27,33 "/>
            <text transform="matrix(1.5 0 0 1.5 28 32)" style={{fontFamily : "Arial-BoldMT", fontSize : 12}} 
                class="svg-stroke">{this.props.seekTime}</text>
            </svg>
        )
    }
}