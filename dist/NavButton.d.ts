import { default as React } from 'react';
import type { To } from 'history';
import { OrientationName, OrientationVariant } from '@nodestrap/basic';
import { ButtonStyle, ButtonVariant, ButtonType, ButtonProps } from '@nodestrap/button';
export declare const resolvePath: (to: To, fromPathname?: string) => string;
export interface CurrentActiveProps {
    caseSensitive?: boolean;
    end?: boolean;
    children?: React.ReactNode;
}
export interface NavButtonProps extends ButtonProps, CurrentActiveProps {
}
export declare function NavButton(props: NavButtonProps): JSX.Element;
export declare namespace NavButton {
    var prototype: any;
}
export { NavButton as default };
export type { OrientationName, OrientationVariant };
export type { ButtonStyle, ButtonVariant, ButtonType };
