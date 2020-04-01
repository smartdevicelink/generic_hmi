let softButtonCapability = {
	"shortPressAvailable": true,
	"longPressAvailable": false,
	"upDownAvailable": false,
	"imageSupported": true,
	"textSupported": true
}

let imageButtonCapability = {
	"shortPressAvailable": true,
	"longPressAvailable": false,
	"upDownAvailable": false,
	"imageSupported": true,
	"textSupported": false
}

let templatesAvailable = [
	"DEFAULT", "MEDIA", "NON-MEDIA", "LARGE_GRAPHIC_WITH_SOFTBUTTONS", "LARGE_GRAPHIC_ONLY",
	"GRAPHIC_WITH_TEXTBUTTONS", "TEXTBUTTONS_WITH_GRAPHIC", "TEXTBUTTONS_ONLY",
	"TEXT_WITH_GRAPHIC", "GRAPHIC_WITH_TEXT", "DOUBLE_GRAPHIC_WITH_SOFTBUTTONS"
]

let screenParams = {
	"resolution": {
		"resolutionWidth": 960,
		"resolutionHeight": 675
	},
	"touchEventAvailable": {
		"pressAvailable": true,
		"multiTouchAvailable": false,
		"doublePressAvailable": false
	}
}

function textField(name, width, rows) {
	width = width ? width : 500
	rows = rows ? rows : 1
	return {
		"name": name,
		"characterSet": "TYPE2SET",
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

let capabilities = {
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
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 360),
				imageField("alertIcon", 225)
			],
			"mediaClockFormats": ["CLOCK3", "CLOCKTEXT4"],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}, 
		"softButtonCapabilities": [
			imageButtonCapability,
			imageButtonCapability
		],
		"buttonCapabilities": [{
				"shortPressAvailable": true,
				"longPressAvailable": false,
				"upDownAvailable": false,
				"name": "OK"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": false,
				"upDownAvailable": false,
				"name": "PLAY_PAUSE"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": false,
				"upDownAvailable": false,
				"name": "SEEKLEFT"
			},
			{
				"shortPressAvailable": true,
				"longPressAvailable": false,
				"upDownAvailable": false,
				"name": "SEEKRIGHT"
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
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 410),
				imageField("alertIcon", 225)
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
	"LARGE_GRAPHIC_WITH_SOFTBUTTONS": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 915, 490),
				imageField("alertIcon", 225)
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
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 480),
				imageField("secondaryGraphic", 480),
				imageField("alertIcon", 225)
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
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 915, 490),
				imageField("alertIcon", 225)
			],
			"mediaClockFormats": [],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}
	},
	"GRAPHIC_WITH_TEXTBUTTONS": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 410),
				imageField("alertIcon", 225)
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
	"TEXTBUTTONS_WITH_GRAPHIC": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 410),
				imageField("alertIcon", 225)
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
	"TEXTBUTTONS_ONLY": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("alertIcon", 225)
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
	"TEXT_WITH_GRAPHIC": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("mainField1"),
				textField("mainField2"),
				textField("mainField3"),
				textField("mainField4"),
				textField("templateTitle", 50),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 410),
				imageField("alertIcon", 225)
			],
			"mediaClockFormats": ["CLOCK3", "CLOCKTEXT4"],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}
	},
	"GRAPHIC_WITH_TEXT": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("mainField1"),
				textField("mainField2"),
				textField("mainField3"),
				textField("mainField4"),
				textField("templateTitle", 50),
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("graphic", 410),
				imageField("alertIcon", 225)
			],
			"mediaClockFormats": ["CLOCK3", "CLOCKTEXT4"],
			"graphicSupported": true,
			"templatesAvailable": templatesAvailable,
			"screenParams": screenParams,
			"imageCapabilities": ["DYNAMIC", "STATIC"],
			"menuLayoutsAvailable": ["LIST", "TILES"]
		}
	},
	"TILES_ONLY": {
		"displayCapabilities": {
			"displayType": "SDL_GENERIC",
			"displayName": "GENERIC_DISPLAY",
			"textFields": [
				textField("alertText1"),
				textField("alertText2"),
				textField("alertText3"),
				textField("templateTitle", 50),
				textField("menuName"),
				textField("secondaryText"),
				textField("tertiaryText"),
				textField("menuTitle")
			],
			"imageFields": [
				imageField("choiceImage", 40),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("softButtonImage", 50),
				imageField("menuIcon", 40),
				imageField("cmdIcon", 150),
				imageField("appIcon", 50),
				imageField("alertIcon", 225)
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
		"speechCapabilities": [
			"FILE"
		],
		"prerecordedSpeechCapabilities": ["INITIAL_JINGLE"],
		"hmiZoneCapabilities": "FRONT",
		"hmiCapabilities": {
			"navigation": false,
			"phoneCall": false,
			"videoStreaming": false
		},
		"systemCapabilities": {
			"navigationCapability": {
				"sendLocationEnabled": false,
				"getWayPointsEnabled": false
			},
			"phoneCapability": {
				"dialNumberEnabled": false
			}
		}
	}
}

const mainWindowTypeCapability = {
	type: "MAIN",
	maximumNumberOfWindows: 1
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
		menuLayoutsAvailable: templateDisplayCapability.menuLayoutsAvailable
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
		windowCapabilities: [getWindowCapability(template)]
	}
	return capability;
	
}

export {capabilities, getDisplayCapability};
