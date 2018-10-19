import React from 'react';
const svgs = require.context('../../../img/static', true, /\.svg$/);
const keys = svgs.keys()

const svgsObj = svgs.keys()
  .reduce((images, key) => {
    var svg = svgs(key)
    svg = svg.replace(/"st0"/g, '"st0 svg-stroke"')
    svg = svg.replace(/"st1"/g, '"st1 svg-stroke"')
    svg = svg.replace(/"st2"/g, '"st2 svg-stroke"')
    images[key] = svg
    return images
  }, {})

export default class StaticIcon extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.image) {
            var path = "";
            var image = this.props.image.toUpperCase()
            path = "./" + image + ".svg"
            return (
                <div className={this.props.class} dangerouslySetInnerHTML={{__html: svgsObj[path]}} />
            )
        } else {
            return(null)
        }
    }
}