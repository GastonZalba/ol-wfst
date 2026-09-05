function createElement(
    tagName: string | ((props, children) => HTMLElement),
    props: { [key: string]: any }
): HTMLElement | DocumentFragment {
    props = props || {};

    let children = props.children || [];
    children = Array.isArray(children) ? children : [children];

    delete props.children;

    if (typeof tagName === 'function') {
        return tagName(props, children);
    }

    const elem: HTMLElement | DocumentFragment =
        tagName === 'fragment'
            ? document.createDocumentFragment()
            : document.createElement(tagName);

    if (elem instanceof HTMLElement) {
        Object.entries(props).forEach(([name, value]) => {
            if (value != null) {
                // listener
                if (name.startsWith('on') && typeof value === 'function') {
                    elem.addEventListener(
                        name
                            .slice(2)
                            .toLowerCase() as keyof HTMLElementEventMap,
                        value as EventListenerOrEventListenerObject
                    );
                } else if (name === 'className') {
                    elem.setAttribute('class', value.toString());
                } else if (name === 'htmlFor') {
                    elem.setAttribute('for', value.toString());
                } else {
                    elem.setAttribute(name, value.toString());
                }
            }
        });
    }

    for (const child of children) {
        if (!child) {
            continue;
        }
        if (Array.isArray(child)) {
            elem.append(...child);
        } else if (child instanceof Node) {
            elem.appendChild(child);
        } else {
            (elem as HTMLElement).innerHTML += child;
        }
    }
    return elem;
}

export function jsx(type: any, props: any) {
    return createElement(type, props) as HTMLElement;
}

export function jsxs(type: any, props: any) {
    return createElement(type, props) as HTMLElement;
}

export function Fragment(type: any, children) {
    return createElement('fragment', { children }) as DocumentFragment;
}
