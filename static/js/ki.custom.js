!function (b, c, d, e) {
  /*
   * init function (internal use)
   * a = selector, dom element or function
   */
  function i(a) {
    c.push.apply(this, a && a.nodeType ? [a] : '' + a === a ? b.querySelectorAll(a) : e)
  }

  /*
   * $ main function
   * a = css selector, dom object, or function
   * http://www.dustindiaz.com/smallest-domready-ever
   * returns instance or executes function on ready
   */
  $ = function (a) {
    return /^f/.test(typeof a)?  
             /c/.test(b.readyState)?
               a():
               $(b).on('DOMContentLoaded', a)
             :new i(a)
  }

  // set ki prototype
  $[d] = i[d] = {

    // default length
    length: 0,

    /*
     * on method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    on: function (a, b) {
      return this.each(function (c) {
        c.addEventListener(a, b)
      })
    },

    /*
     * off method
     * a = string event type i.e 'click'
     * b = function
     * return this
     */
    off: function (a, b) {
      return this.each(function (c) {
        c.removeEventListener(a, b)
      })
    },

    /*
     * each method
     * use native forEach to iterate collection
     * a = the function to call on each iteration
     * b = the this value for that function
     */
    each: function (a, b) {
      c.forEach.call(this, a, b)
      return this
    },

    // for some reason is needed to get an array-like
    // representation instead of an object
    splice: c.splice
  }
}(document, [], 'prototype');

// taken from ki.extend.js
(function() {

$.each = function(arr, callback) {
  var i = 0, l = arr.length;
  for(; i < l; ++i) {
    callback(i, arr[i]);
  }
  return this;
};
// map some classlist functions to the jQuery counterpart
var props = ['addClass', 'removeClass', 'toggleClass'],
maps = ['add', 'remove', 'toggle'];

props.forEach(function(prop, index) {
  $.prototype[prop] = function(a) {
    return this.each(function(b) {
      b.classList[maps[index]](a);
    });
  };
});

$.prototype.hasClass = function(a) {
  return this[0].classList.contains(a);
};

$.prototype.append = function(a) {
  return this.each(function(b) {
    b.appendChild(a[0]);
  });
};

$.prototype.prepend = function(a) {
  return this.each(function(b) {
    b.insertBefore(a[0], b.parentNode.firstChild);
  });
};

$.prototype.hide = function() {
  return this.each(function(b) {
    b.style.display = 'none';
  });
};

$.prototype.show = function() {
  return this.each(function(b) {
    b.style.display = '';
  });
};

$.prototype.attr = function(a, b) {
  return b === []._ ? this[0].getAttribute(a) : this.each(function(c) {
    c.setAttribute(a, b);
  });
};

$.prototype.removeAttr = function(a) {
  return this.each(function(b) {
    b.removeAttribute(a);
  });
};

$.prototype.hasAttr = function(a) {
  return this[0].hasAttribute(a);
};

$.prototype.before = function(a) {
  return this.each(function(b) {
    b.insertAdjacentHTML('beforebegin', a);
  });
};

$.prototype.after = function(a) {
  return this.each(function(b) {
    b.insertAdjacentHTML('afterend', a);
  });
};

$.prototype.css = function(a, b) {
  if(typeof(a)==='object'){
    Object.keys(a).map(function(prop){
      this.each(function(c) {
        c.style[prop] = a[prop];
      });
    });
    return this;
  }else{
    return b === []._ ? this[0].style[a] : this.each(function(c) {
      c.style[a] = b;
    });
  }
};

$.prototype.first = function() {
  return $(this[0]);
};

$.prototype.last = function() {
  return $(this[this.length - 1]);
};

$.prototype.get = function(a) {
  return $(this[a]);
};

$.prototype.text = function(a) {
  return a === []._ ? this[0].textContent : this.each(function(b) {
    b.textContent = a;
  });
};

$.prototype.html = function(a) {
  return a === []._ ? this[0].innerHTML : this.each(function(b) {
    b.innerHTML = a;
  });
};

$.prototype.parent = function() {
  return (this.length < 2) ? $(this[0].parentNode): [];
};

$.prototype.remove = function() {
  return this.each(function(b) {
    b.parentNode.removeChild(b);
  });
};

$.trim = function(a) {
  return a.replace(/^\s+|\s+$/g, '');
};

$.prototype.trigger = function(a) {
  if (document.createEvent) {
    var event = document.createEvent('HTMLEvents');
    event.initEvent(a, true, false);
    this.each(function(b) {
      b.dispatchEvent(event);
    });
  } else {
    this.each(function(b) {
      b.fireEvent('on' + a);
    });
  }
};

$.prototype.is = function(a) {
  var m = (this[0].matches || this[0].matchesSelector || this[0].msMatchesSelector || this[0].mozMatchesSelector || this[0].webkitMatchesSelector || this[0].oMatchesSelector);
  if (m) {
    return m.call(this[0], a);
  } else {
    var n = this[0].parentNode.querySelectorAll(a);
    for (var i = n.length; i--;) {
      if (n[i] === this[0]) {
        return true;
      }
    }
    return false;
  }
};

$.prototype.create=function(type,id){
  var temp=document.createElement(type);
  if(id)temp.id=id;
  this[0].appendChild(temp);
  return temp;
};

$.prototype.resize=function(e,f){
  e.addEventListener('resize',f);
};

$.map = function(arr, fn) {
  var results = [];
  var i = 0, l = arr.length;
  for(; i < l; ++i) {
    results.push(fn(arr[i], i));
  }
  return results;
};

$.stop = function(e) {
  if (!e.preventDefault) {
    e.returnValue = false;
  } else {
    e.preventDefault();
  }
};

$.param = function(obj, prefix) {
  var str = [];
  for(var p in obj) {
    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
    str.push(typeof v == "object" ? $.param(v, k) : encodeURIComponent(k) + "=" + encodeURIComponent(v));
  }
  return str.join("&");
};

$.ajax = function(url,b,c){  // a tiny little ajax function
  c=c||b;
//  var type = (typeof(b) === 'object') ?"POST":"GET";
  var type="GET";
  var xmlHTTP = new XMLHttpRequest();
  xmlHTTP.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200)
      c(this.responseText);
  }
  xmlHTTP.open(type, url, true);
  xmlHTTP.send();
};

})();
