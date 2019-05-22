import React from 'react';
import mediaIcon from "../img/app_services/media.svg";
import MediaServiceDataImage from "./MediaServiceDataImage";

export default class AppServiceMediaCard extends React.Component {

    constructor() {
        super();
    }

    render() {
        if (!this.props.mediaActive || !this.props.mediaData) {
            return null;
        }

        var mediaData = this.props.mediaData;

        var artistLine = mediaData.artist ? (
            <p className="t-large t-medium th-f-color ">
                {mediaData.artist}
            </p>) : null;

        var titleLine = mediaData.title ? (
            <p className="t-light t-small th-f-color">
                {mediaData.title}
            </p>
        ) : null;

        return (
            <div className="app-service-media-card app-service-medium-tab">
                <MediaServiceDataImage image={mediaData.mediaImage} />
                {artistLine}
                {titleLine}
                <p className="app-service-card-footer th-f-color">
                    MEDIA
                </p>
            </div>
        )
    }

}