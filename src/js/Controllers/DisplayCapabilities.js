import config from '../../css/_config.scss';
const masterWidth = parseInt(config.masterWidth);
const masterHeight = parseInt(config.masterHeight);
const templateHeight = masterHeight - 75;

let softButtonCapability = {
	"shortPressAvailable": true,
	"longPressAvailable": true,
	"upDownAvailable": true,
	"imageSupported": true,
	"textSupported": true
}

let imageOnlySoftButtonCapability = {
	"shortPressAvailable": true,
	"longPressAvailable": true,
	"upDownAvailable": true,
	"imageSupported": true,
	"textSupported": false
}

let templatesAvailable = [
	"DEFAULT", "MEDIA", "NON-MEDIA", "LARGE_GRAPHIC_WITH_SOFTBUTTONS", "LARGE_GRAPHIC_ONLY",
	"GRAPHIC_WITH_TEXTBUTTONS", "TEXTBUTTONS_WITH_GRAPHIC", "TEXTBUTTONS_ONLY",
	"TEXT_WITH_GRAPHIC", "GRAPHIC_WITH_TEXT", "DOUBLE_GRAPHIC_WITH_SOFTBUTTONS", "WEB_VIEW",
	"NAV_FULLSCREEN_MAP", "TILES_ONLY"
]

let screenParams = {
	"resolution": {
		"resolutionWidth": masterWidth,
		"resolutionHeight": masterHeight
	},
	"touchEventAvailable": {
		"pressAvailable": true,
		"multiTouchAvailable": false,
		"doublePressAvailable": false
	}
}

function textField(name, width=500, rows=1, characterSet="UTF_8") {
	return {
		"name": name,
		"characterSet": characterSet,
		"width": width,
		"rows": rows
	}
}

function imageField(name, width, height) {
	height = height ? height : width
	return {
		"name": name,
		"imageTypeSupported": ["GRAPHIC_PNG"],
		"imageResolution": {
			"resolutionWidth": width,
			"resolutionHeight": height
		}
	}
}

// Store capabilities of mirrored templates
let textWithGraphicCapabilities = {
	"displayCapabilities": {
		"displayType": "SDL_GENERIC",
		"displayName": "GENERIC_DISPLAY",
		"textFields": [
			textField("mainField1"),
			textField("mainField2"),
			textField("mainField3"),
			textField("mainField4"),
			textField("templateTitle", 50),
			textField("scrollableMessageBody", 44, 15),
			textField("alertText1"),
			textField("alertText2"),
			textField("alertText3"),
			textField("initialInteractionText", 50),
			textField("sliderHeader", 70),
			textField("sliderFooter", 70),
			textField("subtleAlertText1"),
			textField("subtleAlertText2"),
			textField("subtleAlertSoftButtonText"),
			textField("menuName"),
			textField("secondaryText"),
			textField("tertiaryText", 20),
			textField("menuCommandSecondaryText"),
			textField("menuCommandTertiaryText", 20),
			textField("menuSubMenuSecondaryText"),
			textField("menuSubMenuTertiaryText", 20),
			textField("audioPassThruDisplayText1", 50),
			textField("audioPassThruDisplayText2", 50)
		],
		"imageFields": [
			imageField("choiceImage", 40),
			imageField("choiceSecondaryImage", 40),
			imageField("menuIcon", 40),
			imageField("cmdIcon", 150),
			imageField("secondaryImage", 40),
			imageField("menuCommandSecondaryImage", 40),
			imageField("menuSubMenuSecondaryImage", 40),
			imageField("appIcon", 50),
			imageField("graphic", 410),
			imageField("alertIcon", 225),
			imageField("subtleAlertIcon", 225)
		],
		"mediaClockFormats": ["CLOCK3", "CLOCKTEXT4"],
		"graphicSupported": true,
		"templatesAvailable": templatesAvailable,
		"screenParams": screenParams,
		"imageCapabilities": ["DYNAMIC", "STATIC"],
		"menuLayoutsAvailable": ["LIST", "TILES"]
	}
}

let textbuttonsWithGraphicCapabilities = {
	"displayCapabilities": {
		"displayType": "SDL_GENERIC",
		"displayName": "GENERIC_DISPLAY",
		"textFields": [
			textField("scrollableMessageBody", 44, 15),
			textField("alertText1"),
			textField("alertText2"),
			textField("alertText3"),
			textField("subtleAlertText1"),
			textField("subtleAlertText2"),
			textField("subtleAlertSoftButtonText"),
			textField("templateTitle", 50),
			textField("initialInteractionText", 50),
			textField("sliderHeader", 70),
			textField("sliderFooter", 70),
			textField("menuName"),
			textField("secondaryText"),
			textField("tertiaryText", 20),
			textField("menuCommandSecondaryText"),
			textField("menuCommandTertiaryText", 20),
			textField("menuSubMenuSecondaryText"),
			textField("menuSubMenuTertiaryText", 20),
			textField("audioPassThruDisplayText1", 50),
			textField("audioPassThruDisplayText2", 50)
		],
		"imageFields": [
			imageField("choiceImage", 40),
			imageField("choiceSecondaryImage", 40),
			imageField("softButtonImage", 50),
			imageField("softButtonImage", 50),
			imageField("softButtonImage", 50),
			imageField("softButtonImage", 50),
			imageField("softButtonImage", 50),
			imageField("softButtonImage", 50),
			imageField("menuIcon", 40),
			imageField("cmdIcon", 150),
			imageField("secondaryImage", 40),
			imageField("menuCommandSecondaryImage", 40),
			imageField("menuSubMenuSecondaryImage", 40),
			imageField("appIcon", 50),
			imageField("graphic", 410),
			imageField("alertIcon", 225),
			imageField("subtleAlertIcon", 225)
		],
		"mediaClockFormats": [],
		"graphicSupported": true,
		"templatesAvailable": templatesAvailable,
		"screenParams": screenParams,
		"imageCapabilities": ["DYNAMIC", "STATIC"],
		"menuLayoutsAvailable": ["LIST", "TILES"]
	},
	"softButtonCapabilities": [
		softButtonCapability,
		softButtonCapability,
		softButtonCapability,
		softButtonCapability,
		softButtonCapability,
		softButtonCapability
	]
}

let capabilities = {
	"TEXT_WITH_GRAPHIC": textWithGraphicCapabilities,
	"GRAPHIC_WITH_TEXT": textWithGraphicCapabilities,
	"TEXTBUTTONS_WITH_GRAPHIC": textbuttonsWithGraphicCapabilities,
	"GRAPHIC_WITH_TEXTBUTTONS": textbuttonsWithGraphicCapabilities,
	"MEDIA": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("mainField1"),
				textField("mainField2"),
				textField("mainField3"),
				textField("statusBar"),
				textField("mediaClock"),
				textField("mediaTrack"),
				textField("templateTitle", 50),
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("graphic", 360),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": ["CLOCK3", "CLOCKTEXT4"],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}, 
		"softButtonCapabilities": [
			imageOnlySoftButtonCapability,
			imageOnlySoftButtonCapability
		],
		"buttonCapabilities": [{
				"shortPressAvailable": true,
				"longPressAvailable": true,
				"upDownAvailable": true,
				"name": "OK"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": true,
				"upDownAvailable": true,
				"name": "PLAY_PAUSE"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": true,
				"upDownAvailable": true,
				"name": "SEEKLEFT"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": true,
				"upDownAvailable": true,
				"name": "SEEKRIGHT"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": true,
				"upDownAvailable": true,
				"name": "CUSTOM_BUTTON"
			}
		]
	},
	"NON-MEDIA": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("mainField1"),
				textField("mainField2"),
				textField("mainField3"),
				textField("mainField4"),
				textField("templateTitle", 50),
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("graphic", 410),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		},
		"softButtonCapabilities": [
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability
		]
	},
	"WEB_VIEW": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("templateTitle", 50),
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("appIcon", 50),
				imageField("alertIcon", 225)
			],
			"mediaClockFormats": [],
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}
	},
	"LARGE_GRAPHIC_WITH_SOFTBUTTONS": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("templateTitle", 50),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("graphic", 915, 490),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		},
		"softButtonCapabilities": [
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability
		]
	},
	"DOUBLE_GRAPHIC_WITH_SOFTBUTTONS": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("templateTitle", 50),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("graphic", 480),
				imageField("secondaryGraphic", 480),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		},
		"softButtonCapabilities": [
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability
		]
	},
	"LARGE_GRAPHIC_ONLY": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("templateTitle", 50),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("graphic", 915, 490),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}
	},
	"TEXTBUTTONS_ONLY": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("templateTitle", 50),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		},
		"softButtonCapabilities": [
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability
		]
	},
	"TILES_ONLY": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("templateTitle", 50),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("secondaryImage", 40),
				imageField("menuCommandSecondaryImage", 40),
				imageField("menuSubMenuSecondaryImage", 40),
				imageField("appIcon", 50),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		},
		"softButtonCapabilities": [
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability,
			softButtonCapability
		]
	},
	"NAV_FULLSCREEN_MAP": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("templateTitle", 50),
				textField("scrollableMessageBody", 44, 15),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("initialInteractionText", 50),
				textField("sliderHeader", 70),
				textField("sliderFooter", 70),
				textField("subtleAlertText1"),
				textField("subtleAlertText2"),
				textField("subtleAlertSoftButtonText"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText", 20),
				textField("menuCommandSecondaryText"),
				textField("menuCommandTertiaryText", 20),
				textField("menuSubMenuSecondaryText"),
				textField("menuSubMenuTertiaryText", 20),
				textField("audioPassThruDisplayText1", 50),
				textField("audioPassThruDisplayText2", 50)
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("choiceSecondaryImage", 40),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("alertIcon", 225),
				imageField("subtleAlertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": false,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		},
		"softButtonCapabilities": []
	},
	"COMMON": {
		"audioPassThruCapabilities": {
			"samplingRate": "44KHZ",
			"bitsPerSample": "8_BIT",
			"audioType": "PCM"
		},
		"audioPassThruCapabilitiesList": [{
			"samplingRate": "44KHZ",
			"bitsPerSample": "8_BIT",
			"audioType": "PCM"
		}],
		"pcmStreamCapabilities": {
			"samplingRate": "16KHZ",
			"bitsPerSample": "16_BIT",
			"audioType": "PCM"
		},
		"speechCapabilities": [
			"FILE"
		],
		"prerecordedSpeechCapabilities": ["INITIAL_JINGLE"],
		"hmiZoneCapabilities": "FRONT",
		"hmiCapabilities": {
			"navigation": false,
			"phoneCall": false,
			"videoStreaming": true
		},
		"systemCapabilities": {
			"navigationCapability": {
				"sendLocationEnabled": false,
				"getWayPointsEnabled": false
			},
			"phoneCapability": {
				"dialNumberEnabled": false
			},
			"driverDistractionCapability": {
				"menuLength": 3,
				"subMenuDepth": 2
			},
			videoStreamingCapability: {
				preferredResolution: {
					resolutionWidth: masterWidth,
					resolutionHeight: templateHeight
				},
				maxBitrate: 400000,
				supportedFormats: [
					{ protocol:  "RAW", codec: "H264" },
					{ protocol:  "RTP", codec: "H264" },
					{ protocol:  "RTSP", codec: "Theora" },
					{ protocol:  "RTMP", codec: "VP8" },
					{ protocol:  "WEBM", codec: "VP9" }
				],
				hapticSpatialDataSupported: true,
				diagonalScreenSize: 7,
				pixelPerInch: 96,
				scale: 1,
				preferredFPS: 30,
				additionalVideoStreamingCapabilities: [
					{
						preferredResolution: {
							resolutionWidth: masterWidth,
							resolutionHeight: templateHeight
						},
						maxBitrate: 400000,
						supportedFormats: [
							{ protocol:  "RAW", codec: "H264" },
							{ protocol:  "RTP", codec: "H264" },
							{ protocol:  "RTSP", codec: "Theora" },
							{ protocol:  "RTMP", codec: "VP8" },
							{ protocol:  "WEBM", codec: "VP9" }
						],
						hapticSpatialDataSupported: true,
						diagonalScreenSize: 7,
						pixelPerInch: 72,
						scale: 1.5,
						preferredFPS: 30
					},
					{
						preferredResolution: {
							resolutionWidth: masterWidth,
							resolutionHeight: templateHeight
						},
						maxBitrate: 400000,
						supportedFormats: [
							{ protocol:  "RAW", codec: "H264" },
							{ protocol:  "RTP", codec: "H264" },
							{ protocol:  "RTSP", codec: "Theora" },
							{ protocol:  "RTMP", codec: "VP8" },
							{ protocol:  "WEBM", codec: "VP9" }
						],
						hapticSpatialDataSupported: true,
						diagonalScreenSize: 7,
						pixelPerInch: 48,
						scale: 2,
						preferredFPS: 30
					}
				]
			}
		}
	}
}

const mainWindowTypeCapability = {
	type: "MAIN",
	maximumNumberOfWindows: 1
}

const dynamicUpdateCapabilities = {
	supportedDynamicImageFieldNames: ["subMenuIcon", "menuIcon", "secondaryImage"],
	supportsDynamicSubMenus: true
}

const keyboardCapabilities = {
	maskInputCharactersSupported: true,
	supportedKeyboards: [
		{
			keyboardLayout: "QWERTY",
			numConfigurableKeys: 10
		},
		{
			keyboardLayout: "QWERTZ",
			numConfigurableKeys: 7
		},
		{
			keyboardLayout: "AZERTY",
			numConfigurableKeys: 10
		},
		{
			keyboardLayout: "NUMERIC",
			numConfigurableKeys: 0
		}
	]
}

const getWindowCapability = (template) => {
	if (!template || !capabilities[template]) {
		return null;
	}
	var templateCapability = capabilities[template];
	var templateDisplayCapability = templateCapability.displayCapabilities
	var capability = {
		textFields: templateDisplayCapability.textFields,
		imageFields: templateDisplayCapability.imageFields,
		imageTypeSupported: ["STATIC", "DYNAMIC"],
		templatesAvailable: templateDisplayCapability.templatesAvailable,
		buttonCapabilities: templateCapability.buttonCapabilities,
		softButtonCapabilities: templateCapability.softButtonCapabilities,
		menuLayoutsAvailable: templateDisplayCapability.menuLayoutsAvailable,
		dynamicUpdateCapabilities: dynamicUpdateCapabilities,
		keyboardCapabilities: keyboardCapabilities
	}
	return capability;
}

const getDisplayCapability = (template) => {
	var templateCapability = capabilities[template];
	if (!templateCapability) {
		console.log("Error: Trying to access capability for unsupported template")
		return {}
	}
	var capability = {
		displayName: templateCapability.displayCapabilities.displayName,
		windowTypeSupported: [mainWindowTypeCapability],
		windowCapabilities: [getWindowCapability(template)],
		screenParams: screenParams
	}
	return capability;
	
}

export {capabilities, getDisplayCapability};
