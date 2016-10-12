# FADED
*A standalone JavaScript plug-in for visually hinted lists. Yep, zero dependencies.*

## Demo
Have a look. [:cloud: DEMO :flashlight:](http://nelsoncash.github.io/faded/)

## Installation
Add `./dist/faded.min.js` to your project.


## Usage
Built with a [UMD](https://github.com/umdjs/umd) (Universal Module Definition) pattern.
### Plain JavaScript
Insert script into your HTML.
```html
<script type="text/javascript" src="./path/to/faded.min.js"></script>
```
Faded constructor is then attached to browser `window` global.
```javascript
window.Faded("list_to_faded");
```

### CommonJS
```javascript
var Faded = require("./path/to/faded.min.js");
```

### RequireJS
```javascript
define('module/id/string', ["./path/to/faded.min.js"],
function(Faded){
  // Faded Usage
});
```


## API
### Faded(element[, opts])
#### element
**Type:** `<String>|<HTMLElement>`

**Description:** Reference to HTML DOM node

**Restriction:**
* Only *ONE* `HTMLElement` node reference permitted
* **NO** tree traversal (looks for element with all specified class's)

**Ex:**
```js
// HTMLElement ID
Faded("#listID");

// HTMLElement class
Faded(".list_class_name.active");

// HTMLElement reference
var node = document.getElementById("listID");
Faded(node);
```



#### opts
**Type:** `<Object>`

**Description:** The selected element children style configuration

**Ex:**
```js
var opts = {};
Faded("listID", opts);
```

#### opts.range
**Type:** `<Number>`

**Default:** `0.6`

**Ex:**
```js
var opts = {
  range: 0.6
};
Faded("listID", opts);
```

#### opts.style
**Type:** `<AllStyle>`

**Default:** `{opacity: {min: 0.1, max: 1}}`

**Ex:**
```js
var opts = {
  color: {
    min: "rgba(12, 66, 144, 0.2)",
    max: "#FFF"
  }
};
Faded("listID", opts);
```



## Type Definition
```js
@typedef <Object> AllStyle
@prop <Style> 

@typedef <Object> Style
@property <Number|String> max
@property <Number|String> min

// Data Structure
{
  CSS_Property: {
    min: <Number|Color>,
    max: <Number|Color>
  }
}
```

#### AllStyle
**Type:** `<Object>`

**Description:** `<AllStyle>` is a collection `<Style>` definitions where each
`KEY` represents a valid CSS property to modify on the `<element>`'s children.

**Restriction:**
* `KEY` *MUST* reference a valid CSS style property
* `KEY` *REQUIRED* as *camelcase* or *hyphen* separated words ('backgroundColor', 'border-color')


**Ex:**
```js
var opts = {
  style: {
    color: {/*<Style>*/},
    backgroundColor: {/*<Style>*/},
    'border-radius': {/*<Style>*/}
  }
};
```


#### Style
**Type:** `<Object>`

**Description:** Configures the corresponding CSS property (`KEY`) to which
it's assigned.

**Restriction:**
* One or more declared properties
* Single simple data type property - ONLY `<Number|String>`
* (`min`,`max`) value should be selected CSS appropriate

**Note:** Use `<String>` to specify a color value. Accepts (hex, rgb, rgba).

**Ex:**
```js
var opts = {
  style: {
    opacity: {
      min: 0.1,
    },
    color: {
      min: 'rgba(0,0,0,0.3)',
      max: 'black'
    },
    backgroundColor: {
      min: '#222',
      max: 'rgb(255,255,255)'
    }
  }
};
```

#### Style.min
**Type:** `Number|String`

**Description:** Edge styling for selected list.


#### Style.max
**Type:** `<Number>|<String>`

**Description:** Center styling for selected list


## Contribution
- Franky Martinez ([@FrankyMartz](http://twitter.com/frankymartz))
