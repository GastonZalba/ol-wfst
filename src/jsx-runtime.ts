type DOMChild = Node | string | number;
type JSXChild = DOMChild | boolean | null | undefined | JSXChild[];

type Component<P = any> = (
    props: P,
    children?: JSXChild[]
) => HTMLElement | DocumentFragment;

function appendChildren(
    parent: HTMLElement | DocumentFragment,
    children: JSXChild[]
): void {
    for (const child of children) {
        if (child == null || typeof child === 'boolean') {
            continue;
        }
        if (Array.isArray(child)) {
            appendChildren(parent, child);
        } else if (child instanceof Node) {
            parent.appendChild(child);
        } else {
            parent.appendChild(document.createTextNode(String(child)));
        }
    }
}

function createElement(
    tagName: string | Component,
    props: { [key: string]: any } | null
): HTMLElement | DocumentFragment {
    props = props || {};

    const { children, ...attributes } = props;
    const kids: JSXChild[] = Array.isArray(children) ? children : [children];

    if (typeof tagName === 'function') {
        return tagName({ ...attributes, children: kids }, kids);
    }

    const elem: HTMLElement | DocumentFragment =
        tagName === 'fragment'
            ? document.createDocumentFragment()
            : document.createElement(tagName);

    if (elem instanceof HTMLElement) {
        Object.entries(attributes).forEach(([name, value]) => {
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

    appendChildren(elem, kids);
    return elem;
}

export function jsx(type: any, props: any): HTMLElement | DocumentFragment {
    return createElement(type, props);
}

export function jsxs(type: any, props: any): HTMLElement | DocumentFragment {
    return createElement(type, props);
}

export function Fragment(type: any, children?: JSXChild[]): DocumentFragment {
    return createElement('fragment', { children }) as DocumentFragment;
}

/**
 * Type declarations consumed by TypeScript's automatic JSX runtime
 * (`"jsx": "react-jsx"` + `"jsxImportSource": "src"`).
 *
 * Only the props/tags actually used by the library are declared; adding a
 * new tag or prop means extending `IntrinsicElements` / `HTMLAttributes`
 * (this is intentional: typos like `class=` fail to compile).
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace JSX {
    export type EventHandler<E extends Event = Event> = (evt: E) => void;

    /**
     * Fragments (`<>`) resolve to a `DocumentFragment` at runtime but are
     * typed as `HTMLElement` to keep assignment to OL options (`element`,
     * control `render()` returns...) frictionless. Use fragments as
     * children, never as the root passed to an OL control/overlay.
     */
    export type Element = HTMLElement;

    export interface ElementChildrenAttribute {
        // eslint-disable-next-line @typescript-eslint/ban-types
        children: {};
    }

    export interface ElementAttributesProperty {
        // eslint-disable-next-line @typescript-eslint/ban-types
        props: {};
    }

    export interface IntrinsicAttributes {
        key?: string | number | null;
    }

    export interface HTMLAttributes {
        children?: JSXChild;
        className?: string;
        htmlFor?: string;
        id?: string;
        name?: string;
        title?: string;
        type?: string;
        value?: string | number | null;
        placeholder?: string;
        step?: string | number;
        accept?: string;
        autocomplete?: string;
        selected?: boolean | null;
        onClick?: EventHandler<MouseEvent>;
        onChange?: EventHandler;
        onInput?: EventHandler;
        [key: `data-${string}`]: string | number | boolean | undefined;
        [key: `aria-${string}`]: string | number | boolean | undefined;
    }

    export interface IntrinsicElements {
        a: HTMLAttributes;
        article: HTMLAttributes;
        aside: HTMLAttributes;
        b: HTMLAttributes;
        br: HTMLAttributes;
        button: HTMLAttributes;
        code: HTMLAttributes;
        div: HTMLAttributes;
        em: HTMLAttributes;
        fieldset: HTMLAttributes;
        footer: HTMLAttributes;
        form: HTMLAttributes;
        h1: HTMLAttributes;
        h2: HTMLAttributes;
        h3: HTMLAttributes;
        h4: HTMLAttributes;
        h5: HTMLAttributes;
        h6: HTMLAttributes;
        header: HTMLAttributes;
        i: HTMLAttributes;
        input: HTMLAttributes;
        label: HTMLAttributes;
        legend: HTMLAttributes;
        li: HTMLAttributes;
        main: HTMLAttributes;
        nav: HTMLAttributes;
        ol: HTMLAttributes;
        option: HTMLAttributes;
        optgroup: HTMLAttributes;
        p: HTMLAttributes;
        pre: HTMLAttributes;
        section: HTMLAttributes;
        select: HTMLAttributes;
        small: HTMLAttributes;
        span: HTMLAttributes;
        strong: HTMLAttributes;
        table: HTMLAttributes;
        tbody: HTMLAttributes;
        td: HTMLAttributes;
        textarea: HTMLAttributes;
        th: HTMLAttributes;
        thead: HTMLAttributes;
        tr: HTMLAttributes;
        ul: HTMLAttributes;
    }
}
