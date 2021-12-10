import React from 'react';

export default class IconSeekRightWithText extends React.Component {
    render() {
        return (
            <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                preserveAspectRatio="xMidYMid meet" viewBox="19.9 9.8 35 29.3" width="75" height="54">
            <path d="M20.1,27c0-4.5,1.7-8.8,4.9-12c3.2-3.1,7.4-4.9,12-4.9c4.5,0,8.8,1.7,12,4.9c6.1,6.1,6.7,15.4,1.6,22.2L49,36
                c4.5-6,3.9-14.2-1.4-19.5c-2.8-2.9-6.6-4.4-10.6-4.4s-7.7,1.5-10.6,4.3S22,23,22,27s1.6,7.8,4.4,10.6L25,39
                C21.8,35.8,20,31.6,20.1,27z"/>
            <polyline className="svg-fill-important" points="47,33 48.8,38.8 55,37 "/>
            <text transform="matrix(1.5 0 0 1.5 28 32)" style={{fontFamily : "Arial-BoldMT", fontSize : 12}} 
                className="svg-stroke">{this.props.seekTime}</text>
            </svg>
        )
    }
}