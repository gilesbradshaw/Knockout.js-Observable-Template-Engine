
// Knockout Observable Template Engine
// Author: Giles Bradshaw
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 0.0.1
// unashamably based on https://github.com/ifandelse/Knockout.js-External-Template-Engine/blob/master/src/ExternalTemplateSource.js


define(['knockout', 'jquery'], function (ko, jQuery) {

    var ObservableTemplateSource = function (templateId, options) {
        var self = this, origAfterRender;
        self.templateId = templateId;
        self.loaded = false;
        self.template = ko.observable();
        self.template.data = {};
        self.options = ko.utils.extend({}, options);
        self.options.templateId = templateId;
        if (self.options && self.options.afterRender) {
            origAfterRender = self.options.afterRender;
            self.options.afterRender = function () {
                if (self.loaded) {
                    origAfterRender.apply(self.options, arguments);
                }
            }
        }
    };

    ko.utils.extend(ObservableTemplateSource.prototype, {
        data: function (key, value) {
            if (arguments.length === 1) {
                if (key === "precompiled") {
                    this.template();
                }
                return this.template.data[key];
            }
            this.template.data[key] = value;
        },

        text: function (value) {
            if (!this.loaded) {
                if (this.options.template) {
                    this.template(ko.utils.unwrapObservable(this.options.template));
                    if (ko.isObservable(this.options.template)) {
                        var _this = this;
                        this.options.template.subscribe(function (data) { _this.template(data); });
                    }
       
                }
                this.loaded = true;

            }

            if (arguments.length === 0) {
                return this.template();
            } else {
                this.template(arguments[0]);
            }
        }
    });
    
    var KoObservableTemplateEngine = function (koEngineType) {
        var engine = koEngineType ? new koEngineType() : new ko.nativeTemplateEngine();
        engine.cachedTemplates ={};
        var cacheId = 0;
        engine.makeTemplateSource = function (template, bindingContext, options) {
            // Named template
            if (typeof template == "string") {
                
                var elem = document.getElementById(template) && !options.template;
                if (elem)
                    return new ko.templateSources.domElement(elem);
                else {
                    //no cache means don't cache the template by the name
                    if (!template.cacheId) {
                        template.cacheId = "cache" + cacheId++;
                        engine.cachedTemplates[template.cacheId] = new ObservableTemplateSource(template, options);
                    }
                    return engine.cachedTemplates[template.cacheId];
                }
            }
            else if ((template.nodeType == 1) || (template.nodeType == 8)) {
                // Anonymous template
                return new ko.templateSources.anonymousTemplate(template);
            }

        };

        engine.renderTemplate = function (template, bindingContext, options) {
            var templateSource = engine.makeTemplateSource(template, bindingContext, options);
            if (!options.svg)
                return engine.renderTemplateSource(templateSource, bindingContext, options);
            else {
                var doc = new window.DOMParser().parseFromString(
                   '<svg xmlns="http://www.w3.org/2000/svg">' + templateSource.text() + '</svg>',
                   'application/xml');
                doc = document.importNode(doc.documentElement, true);
                var ret = [];
                var child = doc.firstChild;
                while (child) {
                    ret.push(child);

                    child = child.nextSibling;
                }
                return ret;
            }
        };

        return engine;
    };

    ko.KoObservableTemplateEngine = KoObservableTemplateEngine;

    if (jQuery['tmpl'] && jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {
        ko.setTemplateEngine(new KoObservableTemplateEngine(ko.jqueryTmplTemplateEngine));
    }
    else {
        ko.setTemplateEngine(new KoObservableTemplateEngine());
    }

});