function AdjustColor(hex) {
    hex = hex / 255.00
    if (hex <= 0.03928) {
        hex = hex / 12.92
    } else {
        hex = Math.pow((hex+0.055)/1.055, 2.4)
    }
    return hex
}

export function UseDarkText(color) { 
    var red = color.red
    var green = color.green
    var blue = color.blue

    red = AdjustColor(red)
    green = AdjustColor(green)
    blue = AdjustColor(blue)

    var lum = 0.2126 * red + 0.7152 * green + 0.0722 * blue
    if (lum > 0.179) {
        return true
    }
    return false
}