# Contributing

🎉🎉🎉 Thank you for contributing! 🎉🎉🎉

I greatly appreciate anyone taking the time to help make Typed.js better.

## Development

First, clone the repo onto your local machine.
```
git clone git@github.com:mattboldt/typed.js.git
cd typed.js
```

Then, make sure you have all the development dependencies installed.
```
npm install
```
(note: you will need Node.js, `npm`, and `gulp` installed globally on your system)

To get things going:
```
gulp serve
open http://localhost:3000
```
There you will see a list of pre-made demos showing each feature of Typed.js in action.

**Comb through these demos carefully and insure all features are working as expected with your additions**

## Pull Request Etiquette

If this it is purely a README update, you can skip everything below.

You need to include a demo of your changes (new features, a bug fix, etc) in a fork of this JSFiddle: https://jsfiddle.net/mattboldt/1xs3LLmL/

To include your branch's version of Typed.js, simply add this JavaScript url as a dependency in JSFiddle, and remove the default:

```
https://rawgit.com/<YOUR GITHUB USERNAME>/typed.js/<YOUR BRANCH NAME>/lib/typed.min.js
```

Include a link to the fiddle in the details of your pull request.

Thank you, and happy typing!
