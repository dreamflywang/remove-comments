## Usage

```js
    
    rm = require('remove-comments'),
    fs = require('fs');

    fileData = fs.readFileSync('file/to/path.js', 'utf8');

    rm.js(fileData);

    //rm.css(fileData);
    //rm.html(fileData);

```
