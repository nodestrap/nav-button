// react:
import { default as React, } from 'react'; // base technology of our nodestrap components
// doesn't work:
// import {
//     useInRouterContext,
//     useResolvedPath,
// }                        from 'react-router'
import * as reactRouter from 'react-router';
import * as history from 'history';
import { 
// utilities:
isReactRouterLink, isNextLink, } from '@nodestrap/action-control';
import { Button, } from '@nodestrap/button';
const { useInRouterContext, useResolvedPath, } = reactRouter;
const { parsePath, } = history;
/* forked from react-router v6 */
export const resolvePath = (to, fromPathname = '/') => {
    const { pathname: toPathname, } = (typeof (to) === 'string') ? parsePath(to) : to;
    const pathname = (toPathname
        ?
            (toPathname.startsWith('/')
                ?
                    toPathname // absolute path, eg:   /shoes/foo
                :
                    resolveRelativePath(toPathname, fromPathname) // relative path, eg:   ../shoes/foo
            )
        :
            fromPathname);
    return pathname;
};
const resolveRelativePath = (relativePath, fromPathname) => {
    const segments = (fromPathname
        .replace(/\/+$/, '') // remove the last /   =>   /products/foo/  =>   /products/foo
        .split('/') // split by /          =>   /products/foo   =>   ['', 'products', 'foo']
    );
    const relativeSegments = relativePath.split('/');
    relativeSegments.forEach((segment) => {
        if (segment === '..') {
            // Keep the root '' segment so the pathname starts at / when `join()`ed
            if (segments.length > 1)
                segments.pop(); // remove the last segment
        }
        else if (segment !== '.') {
            segments.push(segment); // add a new segment to the last
        } // if
    });
    return (segments.length > 1) ? segments.join('/') : '/';
};
// hacks:
const _useInRouterContext = () => {
    return (() => {
        return useInRouterContext; // hack: conditionally call react hook
    })()();
};
const _useResolvedPath = (to) => {
    return (() => {
        return useResolvedPath; // hack: conditionally call react hook
    })()(to).pathname;
};
export const useCurrentActive = (props) => {
    if (typeof (window) === 'undefined')
        return undefined; // server side rendering => not supported yet
    const children = props.children;
    const to = isReactRouterLink(children) ? children.props.to : (isNextLink(children) ? children.props.href : undefined);
    if (to === undefined)
        return undefined; // neither ReactRouterLink nor NextLink exists
    // let currentPathname = useLocation().pathname;        // only works in react-router
    let currentPathname = window?.location?.pathname ?? ''; // works both in react-router & nextjs
    let targetPathname = _useInRouterContext() ? _useResolvedPath(to) : resolvePath(to, currentPathname);
    if (!(props.caseSensitive ?? false)) {
        currentPathname = currentPathname.toLocaleLowerCase();
        targetPathname = targetPathname.toLocaleLowerCase();
    } // if
    return ((currentPathname === targetPathname) // exact match
        ||
            (!(
            // user defined:
            props.end
                ??
                    // default:
                    (targetPathname === '/') // for home page always exact match, otherwise sub match
            ) // sub match
                &&
                    (currentPathname.startsWith(targetPathname)
                        &&
                            (currentPathname.charAt(targetPathname.length) === '/') // sub segment
                    )));
};
export function NavButton(props) {
    // rest props:
    const { 
    // accessibilities:
    active, press, ...restProps } = props;
    // fn props:
    const activeDn = useCurrentActive(props);
    const activeFn = active ?? activeDn;
    const pressFn = press ?? activeDn;
    // jsx:
    return (React.createElement(Button
    // other props:
    , { ...restProps, "aria-current": props['aria-current'] ?? (activeFn ? 'page' : undefined), 
        // accessibilities:
        active: activeFn, press: pressFn }));
}
NavButton.prototype = Button.prototype; // mark as Button compatible
export { NavButton as default };
