# polymer-carousel

A simple, responsive, image slider (carousel) built and designed for Polymer. Only dependencies are Polymer elements.

## Demo

For a demo and full property rundown see [GH Pages](http://jwwisgerhof.github.io/polymer-carousel).

## Usage
- Install [npm](https://nodejs.org/en/download/)
- Install bower
```sh
npm install bower -g
```
- Install the polymer-carousel into your project directory
```sh
bower install jwwisgerhof/polymer-carousel --save
```
- Include the element HTML in your page (with Polymer included)
```sh
<link rel="import" href="bower_components/polymer-carousel/element/polymer-carousel.html">
```
- Add the polymer-carousel HTML anywhere in your page
```sh
<polymer-carousel auto-play="true" transition-duration="1000"></polymer-carousel>
```
- Add images via JS
```sh
HTMLImports.whenReady(function () {
    var carousel = document.querySelector('polymer-carousel');
    carousel.slides = [
        {
            link: "http://www.wisgerhof.io/",
            image: {
                href: "http://lorempixel.com/800/300/abstract",
                description: "Test image"
            }
        }
    ]
});
```

## Options
For a full list of options see [GH Pages](http://jwwisgerhof.github.io/polymer-carousel)

## Browser Support
- IE9+
- Chrome ~
- Firefox ~
- Safari ~

## License
[MIT](http://opensource.org/licenses/MIT)