import React from 'react';

const icons = require.context('!@svgr/webpack?{svgo:false}!../../../img/static', true, /\.svg$/);
const iconCache = {};
icons.keys().forEach(key => iconCache[key] = icons(key).default());

export default class StaticIcon extends React.Component {
    render() {
        if(this.props.image) {
            var path = "";
            var hex = this.props.image.substring(0, 2).toLowerCase();
            var value = this.props.image.substring(2, 4).toUpperCase();
            var image = hex + value;
            path = "./" + image + ".svg"
            console.log("Static icon: ", cache2[path]);
            return (
                <div className={this.props.class} >
                    {iconCache[path]}
                </div>
            )
        } else {
            return(null)
        }
    }
}