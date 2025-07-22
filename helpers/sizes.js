
export const convertCmToPx = (cm) => {
    const px = cm * 96 / 2.54;
    return Math.round(px);
}

export const convertPxToCm = (px) => {
    const cm = px * 2.54 / 96;
    return Math.round(cm);
}