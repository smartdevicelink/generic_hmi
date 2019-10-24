import React from 'react';
const svgs = require.context('../../../img/static', true, /\.svg$/);

const svgsObj = svgs.keys()
  .reduce((images, key) => {
    var svg = svgs(key)
    svg = svg.replace(/"st([0-9]{1})_([A-F|0-9]{2})"/g, '"st$1_$2 svg-stroke"')
    images[key] = svg
    return images
  }, {})

export default class StaticIcon extends React.Component {
    render() {
        if(this.props.image) {
            var path = "";
            var hex = this.props.image.substring(0, 2).toLowerCase();
            var value = this.props.image.substring(2, 4).toUpperCase();
            var image = hex + value;
            path = "./" + image + ".svg"
            return (
                <div className={this.props.class} dangerouslySetInnerHTML={{__html: svgsObj[path]}} />
            )
        } else {
            return(null)
        }
    }
}