window.app = window.app || {};

var Component = {
  el: '<span />',

  create: function(props){
    // creates a new component
    var me = Object.create(this);

    me._initProps(props);
    //me._registerDerived();
    me._registerBindings(props);

    me._events = {};

    if(me.initialize){
      me.initialize(props);
    }

    if(me.autoRender) me.render();

    return me;
  },

  render: function(){
    this.renderDom();
    // overwrite!
  },

  renderDom: function(){
    this._el = document.createElement('span');
    this._el.innerHTML = this.el;
    this._el = this._el.firstChild;
    this._renderBindings();
    this._attachEvents();

    if(this._attachTo){
      var el = document.querySelector(this._attachTo);
      el.textContent = '';
      el.appendChild(this._el);
    }

    return this;
  },

  getElement: function(){
    return this._el || console.error('Tried to getElement but Component is not rendered yet!');
  },

  clearElement: function(){
    if(!this._el) return;
    this.getElement().textContent = "";
    return this;
  },

  appendComponent: function(component){
    this.getElement().appendChild(component.getElement());
    return this;
  },

  attachTo: function(query){
    this._attachTo = query;
    return this;
  },

  query: function(selector){
    return this._el.querySelector(selector);
  },

  /**

    Private stuff!


  **/

  _attachEvents: function(){
    if(!this.events) return;

    Object.keys(this.events).forEach(function(event){
      var split = event.split(' '),
          type = split[0],
          selector = split[1],
          method = this[this.events[event]].bind(this);

      this._el.addEventListener(type, function(e){
        if(this.querySelector(selector) === e.target){
          method(e);
        }

      })
    }, this)
  },

  _registerBindings: function(props){
    if(!this.bindings) return;

    this._bindings = {};
    var bindings = Object.keys(this.bindings),
        values = Object.assign({}, props, this._props);

    Object.keys(this.bindings).forEach(function(key){
      if(typeof this.bindings[key] === 'object' && this.bindings[key] instanceof Array){
        // array - for each
        this.bindings[key].forEach(function(bindingObj){
          this._registerBoundElement(bindingObj, key, values);
        }, this)
      } else {
        this._registerBoundElement(this.bindings[key], key, values);
      }
    }, this)
  },

  _registerBoundElement: function(bindingObj, key, values){
    this._bindings[bindingObj.hook || bindingObj] = {
      value: values[key],
      decorator: bindingObj.decorator,
      attribute: bindingObj.attribute,
    };
  },

  _initProps: function(props){
    if(!this.props) return;
    this._props = {};

    var values = Object.assign({}, props, this.props);

    Object.keys(this.props).forEach(function(key){
      this._props[key] = values[key];

      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get: function(){
          return this._props[key];
        },
        set: function(val){
          this._props[key] = val;
          if(this.bindings[key]){
            if(typeof this.bindings[key] === 'object' && this.bindings[key] instanceof Array){
              // array... for each
              this.bindings[key].forEach(function(bindingObj){
                this._updateBinding(bindingObj.hook || bindingObj, val);
              }, this)
            } else {
              this._updateBinding(this.bindings[key].hook || this.bindings[key], val);
            }
          }
        }
      });
    }, this);
  },

  // _registerDerived: function(){
  //   if(!this.derived) return;
  //   this._derived = {};

  //   Object.keys(this.derived).forEach(function(key){
  //     this._derived[key] = this.derived[key];
  //   }, this);
  // },

  _renderBindings: function(){
    if(!this._bindings) return;
    Object.keys(this._bindings).forEach(function(key){
      this._setBoundElementValue(key, this._el.parentNode.querySelector('[data-hook~="'+key+'"]'));
    }, this);
  },

  _updateBinding: function(key, newVal){
    var bindingObj = this.bindings[key];
    this._bindings[key].value = newVal;
    if(this._el) this._setBoundElementValue(key);
  },

  _setBoundElementValue: function(key, elm){
    var elm = elm || this._el.querySelector('[data-hook~="'+key+'"]'),
        val = (this._bindings[key].decorator ?
            this._bindings[key].decorator(this._bindings[key].value) :
            this._bindings[key].value) || '';

    if(this._bindings[key].attribute){
      // set attribute
      elm.setAttribute(this._bindings[key].attribute, val);
    } else {
      // default: text
      if(elm.tagName === 'INPUT')
        elm.value = val;
      else
        elm.innerText = val
    }
  },

  /**

    Events

  **/

  trigger: function(){
    var evt = arguments[0],
        args = Array.prototype.slice.call(arguments, 1);

    // trigger ...
    if(this._events[evt]){
      this._events[evt].forEach(function(eventObj){
        eventObj.fn.apply(this, args);
      })
    }
  },

  on: function(evt, fn){
    this._events[evt] = this._events[evt] || [];
    this._events[evt].push({
      fn: fn
    })
  },

  listenTo: function(obj, evt, fn){
    obj.on(evt, fn.bind(this));
  },


}

window.app.Component = Component;