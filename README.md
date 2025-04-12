## 📦 Installation

This package is built for **React 18**.

If you're using React 18, simply install via npm:

```bash
npm i fullpage-nestedscroll-react
```

## Usage

This library works only with PC(Desktop, laptop ...) devices.

When using this library, you need to wrap your components with specific div elements in the following order:

1. Wrap each of your components with a `section` class div (Each section must be at least a screen viewport size. 'height:100vh' is the best.)
2. Wrap all `section` divs with `FullPageWrapper`
3. Finally, wrap everything with a `container` div at the top level

Example structure:
```jsx
/* App.tsx */
import { FullPageWrapper } from "fullpage-nestedscroll-react";

<div className="container">
  <FullPageWrapper>
    <div className="section">
      {/* Your first component */}
    </div>
    <div className="section">
      {/* Your second component */}
    </div>
    <div className="section">
      {/* Your third component */}
    </div>
  </FullPageWrapper>
</div>
```
then, `section` and `conatiner` divs need following css.

```css
/* App.css */

.container{
  overflow: hidden !important;
}
.section{
  overflow-y: auto;
  max-height: 100vh;
}
```

if something wrong, check your `global css`