let capabilities = {
	"displayCapabilities": {
		"displayType": "GEN2_8_DMA",
		"textFields": [{
				"name": "mainField1",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "mainField2",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "mainField3",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "mainField4",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "statusBar",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "mediaClock",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "mediaTrack",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "alertText1",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "alertText2",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "alertText3",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "scrollableMessageBody",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "initialInteractionText",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "navigationText1",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "navigationText2",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "ETA",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "totalDistance",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "navigationText",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "audioPassThruDisplayText1",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "audioPassThruDisplayText2",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "sliderHeader",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "sliderFooter",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "notificationText",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "menuName",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "secondaryText",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "tertiaryText",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "timeToDestination",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "turnText",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			},
			{
				"name": "menuTitle",
				"characterSet": "TYPE2SET",
				"width": 500,
				"rows": 1
			}
		],
		"imageFields": [{
				"name": "softButtonImage",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "choiceImage",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "choiceSecondaryImage",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "menuIcon",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "cmdIcon",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "appIcon",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "graphic",
				"imageTypeSupported": [],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			},
			{
				"name": "locationImage",
				"imageTypeSupported": ["GRAPHIC_PNG"],
				"imageResolution": {
					"resolutionWidth": 35,
					"resolutionHeight": 35
				}
			}
		],
		"mediaClockFormats": ["CLOCK1", "CLOCK2", "CLOCK3", "CLOCKTEXT1", "CLOCKTEXT2", "CLOCKTEXT3", "CLOCKTEXT4"],
		"graphicSupported": true,
		"templatesAvailable": [
			"DEFAULT", "MEDIA", "NON-MEDIA", "LARGE_GRAPHIC_WITH_SOFTBUTTONS", "LARGE_GRAPHIC_ONLY", 
			"GRAPHIC_WITH_TEXTBUTTONS", "TEXTBUTTONS_WITH_GRAPHIC", "TEXTBUTTONS_ONLY",
			"TEXT_WITH_GRAPHIC", "GRAPHIC_WITH_TEXT", "DOUBLE_GRAPHIC_WITH_SOFTBUTTONS"
		],
		"screenParams": {
			"resolution": {
				"resolutionWidth": 800,
				"resolutionHeight": 350
			},
			"touchEventAvailable": {
				"pressAvailable": true,
				"multiTouchAvailable": false,
				"doublePressAvailable": false
			}
		},
		"numCustomPresetsAvailable": 8,
		"imageCapabilities": ["DYNAMIC", "STATIC"]
	},
	"audioPassThruCapabilities": {
		"samplingRate": "44KHZ",
		"bitsPerSample": "RATE_8_BIT",
		"audioType": "PCM"
	},
	"hmiZoneCapabilities": "FRONT",
	"softButtonCapabilities": {
		"shortPressAvailable": true,
		"longPressAvailable": false,
		"upDownAvailable": false,
		"imageSupported": true
	},
	"hmiCapabilities": {
		"navigation": false,
		"phoneCall": false
	},
    "systemCapabilities": {
        "navigationCapability": {
            "sendLocationEnabled": true,
            "getWayPointsEnabled": true
        },
        "phoneCapability": {
            "dialNumberEnabled": true
        } 
    }
}

export default capabilities;
