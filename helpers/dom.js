/* eslint no-cond-assign: "error" */

export function getScrollParent(element, includeHidden = false) {
    let style = getComputedStyle(element);
    const excludeStaticParent = style.position === 'absolute';
    const overflowRegex = includeHidden ? /(auto|scroll|hidden)/ : /(auto|scroll)/;

    if (style.position === 'fixed') return document.body;
    for (let parent = element; (parent = parent.parentElement); ) {
        style = getComputedStyle(parent);
        if (excludeStaticParent && style.position === 'static') {
            continue;
        }
        if (overflowRegex.test(style.overflow + style.overflowY + style.overflowX)) return parent;
    }

    return document.body;
}

export function scrollToError(id, margin = 150) {
    const parent = document.getElementById(id);
    const element = parent.querySelector('.error-message');
    if (element) {
        element.focus();
        const top = getCoords(element).top - margin;
        const wrapper = getScrollParent(element);
        if (wrapper) wrapper.scrollTo({ top, behavior: 'smooth' });
        else window.scrollTo({ top, behavior: 'smooth' });
    }
}

function getCoords(element) {
    const bodyRect = document.body.getBoundingClientRect();
    const elemRect = element.getBoundingClientRect();
    const offset = elemRect.top - bodyRect.top;

    return { top: offset, left: elemRect.left };
}
