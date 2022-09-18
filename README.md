# reactCompare
Comparison app example - display, filter, sort and graph some arbitrary data. 
Check it out at [my website](https://dorianm.com/demos/react-compare/).

## Background and purpose
I wanted to try progressive enchancement with React and I decided on a simple 
comparison app. What's been progressing, however, was the script's length, so
I finally split it to be more manageable and packed the bundle with Rollup.

## How it's made
React script with class-based stateful components hooked up onto a premade HTML page,
styled with SCSS to be responsive with dark mode support.
All js files bundled together and minified via rollup with babel-react and terser plugins.

~ npm run bld to build the missing minified js and css into /public

## Concluding remarks
Although I'm still all in for Vue, working with React was quite a nice experience, 
even if the quirks of jsx will never cease to amaze me. Also, I really like the 
simplicity and friendliness of introducing Rollup to the build, definitely 
tramples Webpack in terms of usability. 
I was considering working with BEM - but I already use Facebook's React, so I didn't
want to further tank my morality score by introducing a "tool" developed at Yandex.
Code and assets licensed MIT.