// react:
import {
    default as React,
}                           from 'react'         // base technology of our nodestrap components
import {
    useInRouterContext,
    useResolvedPath,
}                           from 'react-router'

// others libs:
import {
    To,
    parsePath,
}                           from 'history'

// nodestrap components:
import {
    // hooks:
    OrientationName,
    OrientationVariant,
}                           from '@nodestrap/basic'
import {
    // utilities:
    isReactRouterLink,
    isNextLink,
}                           from '@nodestrap/action-control'
import {
    // hooks:
    ButtonStyle,
    ButtonVariant,
    
    
    
    // react components:
    ButtonType,
    ButtonProps,
    Button,
}                           from '@nodestrap/button'



/* forked from react-router v6 */
export const resolvePath = (to: To, fromPathname = '/'): string => {
    const {
        pathname : toPathname,
    } = (typeof(to) === 'string') ? parsePath(to) : to;
    
    const pathname = (
        toPathname
        ?
        (
            toPathname.startsWith('/')
            ?
            toPathname                                    // absolute path, eg:   /shoes/foo
            :
            resolveRelativePath(toPathname, fromPathname) // relative path, eg:   ../shoes/foo
        )
        :
        fromPathname
    );
    
    return pathname;
};

const resolveRelativePath = (relativePath: string, fromPathname: string): string => {
    const segments = (
        fromPathname
        .replace(/\/+$/, '') // remove the last /   =>   /products/foo/  =>   /products/foo
        .split('/')          // split by /          =>   /products/foo   =>   ['', 'products', 'foo']
    );
    const relativeSegments = relativePath.split('/');
    
    relativeSegments.forEach((segment) => {
        if (segment === '..') {
            // Keep the root '' segment so the pathname starts at / when `join()`ed
            if (segments.length > 1) segments.pop(); // remove the last segment
        }
        else if (segment !== '.') {
            segments.push(segment); // add a new segment to the last
        } // if
    });
    
    return (segments.length > 1) ? segments.join('/') : '/';
};



// hacks:
const _useInRouterContext = (): boolean => {
    return (() => {
        return useInRouterContext; // hack: conditionally call react hook
    })()();
};
const _useResolvedPath = (to: To): string => {
    return (() => {
        return useResolvedPath; // hack: conditionally call react hook
    })()(to).pathname;
};



// hooks:
export interface CurrentActiveProps {
    // nav matches:
    caseSensitive? : boolean
    end?           : boolean
    
    
    // children:
    children?      : React.ReactNode
}
const useCurrentActive = (props: CurrentActiveProps): boolean|undefined => {
    if (typeof(window) === 'undefined') return undefined; // server side rendering => not supported yet
    
    
    
    const children = props.children;
    const to = isReactRouterLink(children) ? children.props.to : (isNextLink(children) ? children.props.href : undefined);
    if (to === undefined) return undefined; // neither ReactRouterLink nor NextLink exists
    
    
    
    // let currentPathname = useLocation().pathname;        // only works in react-router
    let currentPathname = window?.location?.pathname ?? ''; // works both in react-router & nextjs
    let targetPathname = _useInRouterContext() ? _useResolvedPath(to) : resolvePath(to, currentPathname);
    
    
    
    if (!(props.caseSensitive ?? false)) {
        currentPathname = currentPathname.toLocaleLowerCase();
        targetPathname  = targetPathname.toLocaleLowerCase();
    } // if
    
    
    
    return (
        (currentPathname === targetPathname) // exact match
        ||
        (
            !(props.end ?? false) // sub match
            &&
            (
                currentPathname.startsWith(targetPathname)
                &&
                (currentPathname.charAt(targetPathname.length) === '/') // sub segment
            )
        )
    );
};



// react components:

export interface NavButtonProps
    extends
        ButtonProps,
        CurrentActiveProps
{
}
export function NavButton(props: NavButtonProps) {
    // rest props:
    const {
        // accessibilities:
        active,
    ...restProps} = props;
    
    
    
    // fn props:
    const activeDn = useCurrentActive(props);
    const activeFn = active ?? activeDn;
    
    
    
    // jsx:
    return (
        <Button
            // other props:
            {...restProps}
            
            
            // semantics:
            aria-current={props['aria-current'] ?? (activeFn ? 'page' : undefined)}
            
            
            // accessibilities:
            active={activeFn}
        />
    );
}
NavButton.prototype = Button.prototype; // mark as Button compatible
export { NavButton as default }

export type { OrientationName, OrientationVariant }

export type { ButtonStyle, ButtonVariant, ButtonType }