# &lt;NavButton&gt;&lt;/NavButton&gt;
A clickable component for navigation.

## Preview

```jsx
<NavButton tag='a' theme='primary' size='lg' gradient={true} outlined={true} press={true} onClick={() => alert('hello world')} >
    <Link to='about'>
        click me
    </Link>
</NavButton>
```
Rendered to:
```html
<a class="c1 thPrimary szLg gradient outlined pressed">
    click me
</a>
```

## Features
* Includes all features in [`<ActionControl />`](https://www.npmjs.com/package/@nodestrap/button).
* Automatically highlighted (active) when the provided `<Link>` maches the current url.
* Customizable via [`@cssfn/css-config`](https://www.npmjs.com/package/@cssfn/css-config).

## Installation

Using npm:
```
npm i @nodestrap/nav-button
```

## Support Us

If you feel our lib is useful for your projects,  
please make a donation to avoid our project from extinction.

We always maintain our projects as long as we're still alive.

[[Make a donation](https://ko-fi.com/heymarco)]
