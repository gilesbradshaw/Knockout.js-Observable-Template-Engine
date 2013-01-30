# Knockout.js-Observable-Template-Engine

Custom Template Engine and Template Source for Knockout.js that loads templates from observables.
Supports native and jQuery templates.

based on..
[ifandelse / Knockout.js-External-Template-Engine] (https://github.com/ifandelse/Knockout.js-External-Template-Engine)

## What Is It
The Knockout.js Observable Template Engine extends Knockout.js to allow you to load templates from observables in the view model. 
It currently supports both native and jquery templates.

It also allows your templates to be SVG elements (use the svg option)

## Prerequisites
Knockout.js 2.0 or later
jQuery 1.5 or later
jquery-tmpl only if you are using jquery templates

## How to use
In your HTML file, reference jQuery, jquery-tmpl (if you're using jquery templates), knockout.js, and the koObservableTemplateEngine.js file
By referencing koObservableTemplateEngine.js, you've automatically overridden the default Knockout.js template engine and added a new template source

To bind to a template from your view model do
    <div data-bind="template: { name: 'aname', template:myTemplate }"></div>

You need to give the template a name but this can be any name.

Where myTemplate binds to an observable in the view model and aname is not the name of a template.

If your template contains SVG elements ie elements below the root svg element itself then you need to use the svg option.
    <div data-bind="template: {svg:true, name: 'aname', template:myTemplate }"></div>

If you want the template to be a normal named template - ie the name indicates the id of an element in your DOM then miss out the template option.
    <div data-bind="template: { name: 'aname'}"></div>


