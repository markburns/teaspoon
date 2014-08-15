(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Teaspoon = (function() {
    function Teaspoon() {}

    Teaspoon.defer = false;

    Teaspoon.slow = 75;

    Teaspoon.root = window.location.pathname.replace(/\/+(index\.html)?$/, "").replace(/\/[^\/]*$/, "");

    Teaspoon.started = false;

    Teaspoon.finished = false;

    Teaspoon.Reporters = {};

    Teaspoon.Date = Date;

    Teaspoon.location = window.location;

    Teaspoon.messages = [];

    Teaspoon.execute = function() {
      if (Teaspoon.defer) {
        Teaspoon.defer = false;
        return;
      }
      if (Teaspoon.started) {
        Teaspoon.reload();
      }
      Teaspoon.started = true;
      return new Teaspoon.Runner();
    };

    Teaspoon.reload = function() {
      return window.location.reload();
    };

    Teaspoon.onWindowLoad = function(method) {
      var originalOnload;
      originalOnload = window.onload;
      return window.onload = function() {
        if (originalOnload && originalOnload.call) {
          originalOnload();
        }
        return method();
      };
    };

    Teaspoon.resolveDependenciesFromParams = function(all) {
      var dep, deps, file, parts, path, paths, _i, _j, _len, _len1;
      if (all == null) {
        all = [];
      }
      deps = [];
      if ((paths = Teaspoon.location.search.match(/[\?&]file(\[\])?=[^&\?]*/gi)) === null) {
        return all;
      }
      for (_i = 0, _len = paths.length; _i < _len; _i++) {
        path = paths[_i];
        parts = decodeURIComponent(path.replace(/\+/g, " ")).match(/\/(.+)\.(js|js.coffee|coffee)$/i);
        if (parts === null) {
          continue;
        }
        file = parts[1].substr(parts[1].lastIndexOf("/") + 1);
        for (_j = 0, _len1 = all.length; _j < _len1; _j++) {
          dep = all[_j];
          if (dep.indexOf(file) >= 0) {
            deps.push(dep);
          }
        }
      }
      return deps;
    };

    Teaspoon.log = function() {
      var e;
      Teaspoon.messages.push(arguments[0]);
      try {
        return console.log.apply(console, arguments);
      } catch (_error) {
        e = _error;
        throw new Error("Unable to use console.log for logging");
      }
    };

    Teaspoon.getMessages = function() {
      var messages;
      messages = Teaspoon.messages;
      Teaspoon.messages = [];
      return messages;
    };

    return Teaspoon;

  })();

  Teaspoon.Error = (function(_super) {
    __extends(Error, _super);

    function Error(message) {
      this.name = "TeaspoonError";
      this.message = message || "";
    }

    return Error;

  })(Error);

}).call(this);
/* <![CDATA[ */
/* File:        linkify.js
 * Version:     20101010_1000
 * Copyright:   (c) 2010 Jeff Roberson - http://jmrware.com
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Summary: This script linkifys http URLs on a page.
 *
 * Usage:   See demonstration page: linkify.html
 */

function linkify(text) {
    /* Here is a commented version of the regex (in PHP string format):
    $url_pattern = '/# Rev:20100913_0900 github.com\/jmrware\/LinkifyURL
    # Match http & ftp URL that is not already linkified.
      # Alternative 1: URL delimited by (parentheses).
      (\()                     # $1  "(" start delimiter.
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $2: URL.
      (\))                     # $3: ")" end delimiter.
    | # Alternative 2: URL delimited by [square brackets].
      (\[)                     # $4: "[" start delimiter.
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $5: URL.
      (\])                     # $6: "]" end delimiter.
    | # Alternative 3: URL delimited by {curly braces}.
      (\{)                     # $7: "{" start delimiter.
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $8: URL.
      (\})                     # $9: "}" end delimiter.
    | # Alternative 4: URL delimited by <angle brackets>.
      (<|&(?:lt|\#60|\#x3c);)  # $10: "<" start delimiter (or HTML entity).
      ((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]+)  # $11: URL.
      (>|&(?:gt|\#62|\#x3e);)  # $12: ">" end delimiter (or HTML entity).
    | # Alternative 5: URL not delimited by (), [], {} or <>.
      (                        # $13: Prefix proving URL not already linked.
        (?: ^                  # Can be a beginning of line or string, or
        | [^=\s\'"\]]          # a non-"=", non-quote, non-"]", followed by
        ) \s*[\'"]?            # optional whitespace and optional quote;
      | [^=\s]\s+              # or... a non-equals sign followed by whitespace.
      )                        # End $13. Non-prelinkified-proof prefix.
      ( \b                     # $14: Other non-delimited URL.
        (?:ht|f)tps?:\/\/      # Required literal http, https, ftp or ftps prefix.
        [a-z0-9\-._~!$\'()*+,;=:\/?#[\]@%]+ # All URI chars except "&" (normal*).
        (?:                    # Either on a "&" or at the end of URI.
          (?!                  # Allow a "&" char only if not start of an...
            &(?:gt|\#0*62|\#x0*3e);                  # HTML ">" entity, or
          | &(?:amp|apos|quot|\#0*3[49]|\#x0*2[27]); # a [&\'"] entity if
            [.!&\',:?;]?        # followed by optional punctuation then
            (?:[^a-z0-9\-._~!$&\'()*+,;=:\/?#[\]@%]|$)  # a non-URI char or EOS.
          ) &                  # If neg-assertion true, match "&" (special).
          [a-z0-9\-._~!$\'()*+,;=:\/?#[\]@%]* # More non-& URI chars (normal*).
        )*                     # Unroll-the-loop (special normal*)*.
        [a-z0-9\-_~$()*+=\/#[\]@%]  # Last char can\'t be [.!&\',;:?]
      )                        # End $14. Other non-delimited URL.
    /imx';
    */
    var url_pattern = /(\()((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\))|(\[)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\])|(\{)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(\})|(<|&(?:lt|#60|#x3c);)((?:ht|f)tps?:\/\/[a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]+)(>|&(?:gt|#62|#x3e);)|((?:^|[^=\s'"\]])\s*['"]?|[^=\s]\s+)(\b(?:ht|f)tps?:\/\/[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]+(?:(?!&(?:gt|#0*62|#x0*3e);|&(?:amp|apos|quot|#0*3[49]|#x0*2[27]);[.!&',:?;]?(?:[^a-z0-9\-._~!$&'()*+,;=:\/?#[\]@%]|$))&[a-z0-9\-._~!$'()*+,;=:\/?#[\]@%]*)*[a-z0-9\-_~$()*+=\/#[\]@%])/img;
//    var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14">$2$5$8$11$14</a>$3$6$9$12';
//    return text.replace(url_pattern, url_replace);
//    var url_replace = '$1$4$7$10$13<a href="$2$5$8$11$14">$2$5$8$11$14</a>$3$6$9$12';
    return text.replace(url_pattern,
    		function ($0, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) {
	    		var len = arguments.length;
	    		for (var i = 0; i < len; ++i) {
	    			if (arguments[i] === undefined) arguments[i] = "";
	    		}
	    		var pre  = $1+$4+$7+$10+$13;
	    		var url  = $2+$5+$8+$11+$14;
	    		var post = $3+$6+$9+$12;
	    		if (allBalanced(url)) {
	    			return pre +'<a href="'+ url +'">'+ url +'</a>'+ post;
	    		} else {
		    		// Fixup urls ending with orphan "]" or "}"
		    		switch (url.slice(-1)) {
		    		case ')':
			    		if (!parensBalanced(url)) {
			    			if (parensBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ')'+ post
			    			}
			    		}
			    		if (!bracketsBalanced(url)) {
			    			if (bracketsBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ']'+ post
			    			}
			    		}
			    		break;
		    		case ']':
			    		if (!bracketsBalanced(url)) {
			    			if (bracketsBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ']'+ post
			    			}
			    		}
			    		if (!parensBalanced(url)) {
			    			if (parensBalanced(url.slice(0,-1))) {
			    				url = url.slice(0,-1);
			    				post = ')'+ post
			    			}
			    		}
			    		break;
		    		}
	    		}
	    		if (allBalanced(url)) {
	    			return pre +'<a href="'+ url +'">'+ url +'</a>'+ post;
	    		} else return $0;
    		});
	function allBalanced(url) {
		return parensBalanced(url) && bracketsBalanced(url);
	}
	function parensBalanced(url) {
	    var re = /\([^()]*\)/g;
        while (url.search(re) !== -1) {
        	url = url.replace(re, '');
        }
		if (url.search(/[()]/) === -1) return true;
		return false;
	}
	function bracketsBalanced(url) {
	    var re = /\[[^[\]]*\]/g;
        while (url.search(re) !== -1) {
        	url = url.replace(re, '');
        }
		if (url.search(/[[\]]/) === -1) return true;
		return false;
	}

}

window.linkify = linkify;
/* ]]> */

;
(function() {
  Teaspoon.Runner = (function() {
    Runner.run = false;

    function Runner() {
      if (this.constructor.run) {
        return;
      }
      this.constructor.run = true;
      this.fixturePath = "" + Teaspoon.root + "/fixtures";
      this.params = Teaspoon.params = this.getParams();
      this.setup();
    }

    Runner.prototype.getParams = function() {
      var name, param, params, value, _i, _len, _ref, _ref1;
      params = {};
      _ref = Teaspoon.location.search.substring(1).split("&");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        if (param !== "") {
          _ref1 = param.split("="), name = _ref1[0], value = _ref1[1];
          params[decodeURIComponent(name)] = decodeURIComponent(value);
        }
      }
      return params;
    };

    Runner.prototype.getReporter = function() {
      if (this.params["reporter"]) {
        return Teaspoon.Reporters[this.params["reporter"]];
      } else {
        if (window.navigator.userAgent.match(/PhantomJS/)) {
          return Teaspoon.Reporters.Console;
        } else {
          return Teaspoon.Reporters.HTML;
        }
      }
    };

    Runner.prototype.setup = function() {};

    return Runner;

  })();

}).call(this);
(function() {
  var __slice = [].slice;

  Teaspoon.fixture = (function() {
    var addContent, cleanup, create, load, loadComplete, preload, putContent, set, xhr, xhrRequest;

    fixture.cache = {};

    fixture.el = null;

    fixture.$el = null;

    fixture.json = [];

    fixture.preload = function() {
      var url, urls, _i, _len, _results;
      urls = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
      _results = [];
      for (_i = 0, _len = urls.length; _i < _len; _i++) {
        url = urls[_i];
        _results.push(preload(url));
      }
      return _results;
    };

    fixture.load = function() {
      var append, index, url, urls, _i, _j, _len, _results;
      urls = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), append = arguments[_i++];
      if (append == null) {
        append = false;
      }
      if (typeof append !== "boolean") {
        urls.push(append);
        append = false;
      }
      _results = [];
      for (index = _j = 0, _len = urls.length; _j < _len; index = ++_j) {
        url = urls[index];
        _results.push(load(url, append || index > 0));
      }
      return _results;
    };

    fixture.set = function() {
      var append, html, htmls, index, _i, _j, _len, _results;
      htmls = 2 <= arguments.length ? __slice.call(arguments, 0, _i = arguments.length - 1) : (_i = 0, []), append = arguments[_i++];
      if (append == null) {
        append = false;
      }
      if (typeof append !== "boolean") {
        htmls.push(append);
        append = false;
      }
      _results = [];
      for (index = _j = 0, _len = htmls.length; _j < _len; index = ++_j) {
        html = htmls[index];
        _results.push(set(html, append || index > 0));
      }
      return _results;
    };

    fixture.cleanup = function() {
      return cleanup();
    };

    function fixture() {
      Teaspoon.fixture.load.apply(window, arguments);
    }

    xhr = null;

    preload = function(url) {
      return load(url, false, true);
    };

    load = function(url, append, preload) {
      var cached, value;
      if (preload == null) {
        preload = false;
      }
      if (cached = Teaspoon.fixture.cache[url]) {
        return loadComplete(url, cached.type, cached.content, append, preload);
      }
      value = null;
      xhrRequest(url, function() {
        if (xhr.readyState !== 4) {
          return;
        }
        if (xhr.status !== 200) {
          throw "Unable to load fixture \"" + url + "\".";
        }
        return value = loadComplete(url, xhr.getResponseHeader("content-type"), xhr.responseText, append, preload);
      });
      return value;
    };

    loadComplete = function(url, type, content, append, preload) {
      Teaspoon.fixture.cache[url] = {
        type: type,
        content: content
      };
      if (type.match(/application\/json;/)) {
        return fixture.json[fixture.json.push(JSON.parse(content)) - 1];
      }
      if (preload) {
        return content;
      }
      if (append) {
        addContent(content);
      } else {
        putContent(content);
      }
      return Teaspoon.fixture.el;
    };

    set = function(content, append) {
      if (append) {
        return addContent(content);
      } else {
        return putContent(content);
      }
    };

    putContent = function(content) {
      cleanup();
      create();
      return Teaspoon.fixture.el.innerHTML = content;
    };

    addContent = function(content) {
      if (!Teaspoon.fixture.el) {
        create();
      }
      return Teaspoon.fixture.el.innerHTML += content;
    };

    create = function() {
      var _ref;
      Teaspoon.fixture.el = document.createElement("div");
      if (typeof window.$ === 'function') {
        Teaspoon.fixture.$el = $(Teaspoon.fixture.el);
      }
      Teaspoon.fixture.el.id = "teaspoon-fixtures";
      return (_ref = document.body) != null ? _ref.appendChild(Teaspoon.fixture.el) : void 0;
    };

    cleanup = function() {
      var _base, _ref, _ref1;
      (_base = Teaspoon.fixture).el || (_base.el = document.getElementById("teaspoon-fixtures"));
      if ((_ref = Teaspoon.fixture.el) != null) {
        if ((_ref1 = _ref.parentNode) != null) {
          _ref1.removeChild(Teaspoon.fixture.el);
        }
      }
      return Teaspoon.fixture.el = null;
    };

    xhrRequest = function(url, callback) {
      var e;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (_error) {
          e = _error;
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (_error) {
            e = _error;
          }
        }
      }
      if (!xhr) {
        throw "Unable to make Ajax Request";
      }
      xhr.onreadystatechange = callback;
      xhr.open("GET", "" + Teaspoon.root + "/fixtures/" + url, false);
      return xhr.send();
    };

    return fixture;

  })();

}).call(this);
(function() {
  Teaspoon.hook = function(name, options) {
    var xhr, xhrRequest;
    if (options == null) {
      options = {};
    }
    xhr = null;
    xhrRequest = function(url, options, callback) {
      var e;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (_error) {
          e = _error;
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (_error) {
            e = _error;
          }
        }
      }
      if (!xhr) {
        throw "Unable to make Ajax Request";
      }
      xhr.onreadystatechange = callback;
      xhr.open(options['method'] || "GET", "" + Teaspoon.root + "/" + url, false);
      return xhr.send(options['payload']);
    };
    return xhrRequest("" + Teaspoon.suites.active + "/" + name, options, function() {
      if (xhr.readyState !== 4) {
        return;
      }
      if (xhr.status !== 200) {
        throw "Unable to call hook \"" + url + "\".";
      }
    });
  };

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Teaspoon.ErrorWrapper = (function() {
    var angularRegex, jasmineRegex, lineEndingRegex, lineNumberRegex, urlRegex;

    function ErrorWrapper(error) {
      this.error = error;
      this.removeErrorMessageFromStack = __bind(this.removeErrorMessageFromStack, this);
      this.lineNumber = __bind(this.lineNumber, this);
      this.characters = __bind(this.characters, this);
      this.lastApplicationStackTrace = __bind(this.lastApplicationStackTrace, this);
      this.url = __bind(this.url, this);
      this.stackEntryAvailable = __bind(this.stackEntryAvailable, this);
      this.stack = __bind(this.stack, this);
      this.message = __bind(this.message, this);
    }

    urlRegex = /\b(https?):\/\/[\-A-Za-z0-9+&@#\/%?=~_|!:,.;]*[\-A-Za-z0-9+&@#\/%=~_|‌​]/g;

    lineEndingRegex = /(:[0-9]+)+$/;

    ErrorWrapper.prototype.message = function() {
      return this.removeErrorMessageFromStack()[0];
    };

    ErrorWrapper.prototype.stack = function() {
      return this.removeErrorMessageFromStack()[1] || "Stack trace unavailable";
    };

    ErrorWrapper.prototype.stackEntryAvailable = function() {
      return (this.url() != null) && (this.lineNumber() != null);
    };

    ErrorWrapper.prototype.url = function() {
      var _ref;
      return (_ref = this.lastApplicationStackTrace()) != null ? _ref.replace(lineEndingRegex, "") : void 0;
    };

    ErrorWrapper.prototype.lastApplicationStackTrace = function() {
      return this.applicationStackTraceEntries()[0];
    };

    lineNumberRegex = /(?::([0-9]+))?:([0-9]+)$/;

    ErrorWrapper.prototype.characters = function() {
      var number, result, _ref;
      result = (_ref = this.lastApplicationStackTrace()) != null ? _ref.match(lineNumberRegex) : void 0;
      number = result[1] != null ? result[2] : null;
      if (number) {
        return parseInt(number);
      }
    };

    ErrorWrapper.prototype.lineNumber = function() {
      var number, result;
      result = this.lastApplicationStackTrace().match(lineNumberRegex);
      number = result[1] != null ? result[1] : result[2];
      return parseInt(number);
    };

    jasmineRegex = /jasmine\/\d\.\d\.\d\.js/;

    angularRegex = /angular.*\.js/;

    ErrorWrapper.prototype.applicationStackTraceEntries = function() {
      return this.rawStackTraceEntries().filter(function(url) {
        var isAngular, isJasmine;
        isJasmine = url.match(jasmineRegex) != null;
        isAngular = url.match(angularRegex) != null;
        return (!isJasmine) && (!isAngular);
      });
    };

    ErrorWrapper.prototype.rawStackTraceEntries = function() {
      return this.compact(this.error.stack.match(urlRegex));
    };

    ErrorWrapper.prototype.compact = function(array) {
      return array.filter(function(item) {
        return item != null;
      });
    };

    ErrorWrapper.prototype.removeErrorMessageFromStack = function() {
      var effectivelySame, isSubstring, keepLineInStacktrace, message, stack, _ref;
      _ref = [this.error.stack.split("\n"), this.error.message.split("\n")], stack = _ref[0], message = _ref[1];
      isSubstring = function(a, b) {
        return a.lastIndexOf(b) >= 0;
      };
      effectivelySame = function(a, b) {
        return isSubstring(a, b) || isSubstring(b, a);
      };
      keepLineInStacktrace = function(a, b) {
        return !effectivelySame(a, b);
      };
      stack = stack.filter(function(stackLine, index) {
        var a, b, _ref1;
        _ref1 = [stackLine || "", message[index] || ""], a = _ref1[0], b = _ref1[1];
        if (a === "" || b === "") {
          return true;
        }
        return keepLineInStacktrace(a, b);
      });
      return [message.join("\n"), stack.join("\n")];
    };

    return ErrorWrapper;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Teaspoon.errorToFileMapper = (function() {
    var xhr, xhrRequest;

    function errorToFileMapper(error, linesOfContext) {
      if (linesOfContext == null) {
        linesOfContext = 5;
      }
      this.extractLines = __bind(this.extractLines, this);
      this.fetchSourceCode = __bind(this.fetchSourceCode, this);
      this.fetch = __bind(this.fetch, this);
      this.error = new Teaspoon.ErrorWrapper(error);
      this.linesOfContext = linesOfContext;
    }

    errorToFileMapper.prototype.fetch = function(loadComplete) {
      if (!this.error.stackEntryAvailable()) {
        return loadComplete();
      }
      return this.fetchSourceCode(loadComplete);
    };

    errorToFileMapper.prototype.fetchSourceCode = function(loadComplete) {
      var url;
      url = this.error.url();
      return xhrRequest(url, (function(_this) {
        return function() {
          if (xhr.readyState !== 4) {
            return;
          }
          if (xhr.status !== 200) {
            throw "Unable to load file \"" + url + "\".";
          }
          return loadComplete.apply(null, _this.extractLines(xhr.responseText));
        };
      })(this));
    };

    errorToFileMapper.prototype.extractLines = function(body) {
      var after, before, finish, line, lineIndex, lines, start, surrounding;
      lines = body.split("\n");
      surrounding = Math.floor(this.linesOfContext / 2.0);
      lineIndex = this.error.lineNumber() - 1;
      start = parseInt(lineIndex - surrounding);
      finish = parseInt(lineIndex + surrounding);
      before = lines.slice(start, lineIndex).join("\n");
      line = lines[lineIndex];
      after = lines.slice(lineIndex + 1, finish + 1).join("\n");
      return [this.error, before, line, after];
    };

    xhr = null;

    xhrRequest = function(url, callback) {
      var e;
      if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
      } else if (window.ActiveXObject) {
        try {
          xhr = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (_error) {
          e = _error;
          try {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
          } catch (_error) {
            e = _error;
          }
        }
      }
      if (!xhr) {
        throw "Unable to make Ajax Request";
      }
      xhr.onreadystatechange = callback;
      xhr.open("GET", url, false);
      return xhr.send();
    };

    return errorToFileMapper;

  })();

}).call(this);
(function() {
  Teaspoon.Reporters.BaseView = (function() {
    function BaseView() {
      this.elements = {};
      this.build();
    }

    BaseView.prototype.build = function(className) {
      return this.el = this.createEl("li", className);
    };

    BaseView.prototype.appendTo = function(el) {
      return el.appendChild(this.el);
    };

    BaseView.prototype.append = function(el) {
      return this.el.appendChild(el);
    };

    BaseView.prototype.createEl = function(type, className) {
      var el;
      if (className == null) {
        className = "";
      }
      el = document.createElement(type);
      el.className = className;
      return el;
    };

    BaseView.prototype.findEl = function(id) {
      var _base;
      this.elements || (this.elements = {});
      return (_base = this.elements)[id] || (_base[id] = document.getElementById("teaspoon-" + id));
    };

    BaseView.prototype.setText = function(id, value) {
      var el;
      el = this.findEl(id);
      return el.innerHTML = value;
    };

    BaseView.prototype.setHtml = function(id, value, add) {
      var el;
      if (add == null) {
        add = false;
      }
      el = this.findEl(id);
      if (add) {
        return el.innerHTML += value;
      } else {
        return el.innerHTML = value;
      }
    };

    BaseView.prototype.setClass = function(id, value) {
      var el;
      el = this.findEl(id);
      return el.className = value;
    };

    BaseView.prototype.htmlSafe = function(str) {
      var el;
      el = document.createElement("div");
      el.appendChild(document.createTextNode(str));
      return el.innerHTML;
    };

    return BaseView;

  })();

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teaspoon.Reporters.HTML = (function(_super) {
    __extends(HTML, _super);

    function HTML() {
      this.changeSuite = __bind(this.changeSuite, this);
      this.toggleConfig = __bind(this.toggleConfig, this);
      this.reportRunnerResults = __bind(this.reportRunnerResults, this);
      this.start = new Teaspoon.Date().getTime();
      this.config = {
        "use-catch": true,
        "build-full-report": false,
        "display-progress": true
      };
      this.total = {
        exist: 0,
        run: 0,
        passes: 0,
        failures: 0,
        skipped: 0
      };
      this.views = {
        specs: {},
        suites: {}
      };
      this.filters = [];
      this.setFilters();
      this.readConfig();
      HTML.__super__.constructor.apply(this, arguments);
    }

    HTML.prototype.build = function() {
      var _ref;
      this.buildLayout();
      this.setText("env-info", this.envInfo());
      this.setText("version", Teaspoon.version);
      this.findEl("toggles").onclick = this.toggleConfig;
      this.findEl("suites").innerHTML = this.buildSuiteSelect();
      if ((_ref = this.findEl("suite-select")) != null) {
        _ref.onchange = this.changeSuite;
      }
      this.el = this.findEl("report-all");
      this.showConfiguration();
      this.buildProgress();
      return this.buildFilters();
    };

    HTML.prototype.buildLayout = function() {
      var el;
      el = this.createEl("div");
      el.id = "teaspoon-interface";
      el.innerHTML = Teaspoon.Reporters.HTML.template();
      return document.body.appendChild(el);
    };

    HTML.prototype.buildSuiteSelect = function() {
      var filename, options, path, selected, suite, _i, _len, _ref;
      if (Teaspoon.suites.all.length === 1) {
        return "";
      }
      filename = "";
      if (/index\.html$/.test(window.location.pathname)) {
        filename = "/index.html";
      }
      options = [];
      _ref = Teaspoon.suites.all;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        suite = _ref[_i];
        path = [Teaspoon.root, suite].join("/");
        selected = Teaspoon.suites.active === suite ? " selected" : "";
        options.push("<option" + selected + " value=\"" + path + filename + "\">" + suite + "</option>");
      }
      return "<select id=\"teaspoon-suite-select\">" + (options.join("")) + "</select>";
    };

    HTML.prototype.buildProgress = function() {
      this.progress = Teaspoon.Reporters.HTML.ProgressView.create(this.config["display-progress"]);
      return this.progress.appendTo(this.findEl("progress"));
    };

    HTML.prototype.buildFilters = function() {
      if (this.filters.length) {
        this.setClass("filter", "teaspoon-filtered");
      }
      return this.setHtml("filter-list", "<li>" + (this.filters.join("</li><li>")), true);
    };

    HTML.prototype.reportRunnerStarting = function(runner) {
      this.total.exist = runner.total || (typeof runner.specs === "function" ? runner.specs().length : void 0) || 0;
      if (this.total.exist) {
        return this.setText("stats-duration", "...");
      }
    };

    HTML.prototype.reportSpecStarting = function(spec) {
      spec = new Teaspoon.Spec(spec);
      if (this.config["build-full-report"]) {
        this.reportView = new Teaspoon.Reporters.HTML.SpecView(spec, this);
      }
      return this.specStart = new Teaspoon.Date().getTime();
    };

    HTML.prototype.reportSpecResults = function(spec) {
      this.total.run += 1;
      this.updateProgress();
      return this.updateStatus(spec);
    };

    HTML.prototype.reportRunnerResults = function() {
      if (!this.total.run) {
        return;
      }
      this.setText("stats-duration", this.elapsedTime());
      if (!this.total.failures) {
        this.setStatus("passed");
      }
      this.setText("stats-passes", this.total.passes);
      this.setText("stats-failures", this.total.failures);
      if (this.total.run < this.total.exist) {
        this.total.skipped = this.total.exist - this.total.run;
        this.total.run = this.total.exist;
      }
      this.setText("stats-skipped", this.total.skipped);
      return this.updateProgress();
    };

    HTML.prototype.elapsedTime = function() {
      return "" + (((new Teaspoon.Date().getTime() - this.start) / 1000).toFixed(3)) + "s";
    };

    HTML.prototype.updateStat = function(name, value) {
      if (!this.config["display-progress"]) {
        return;
      }
      return this.setText("stats-" + name, value);
    };

    HTML.prototype.updateStatus = function(spec) {
      var elapsed, result, _ref, _ref1;
      spec = new Teaspoon.Spec(spec);
      result = spec.result();
      if (result.skipped || result.status === "pending") {
        this.updateStat("skipped", this.total.skipped += 1);
        return;
      }
      elapsed = new Teaspoon.Date().getTime() - this.specStart;
      if (result.status === "passed") {
        this.updateStat("passes", this.total.passes += 1);
        return (_ref = this.reportView) != null ? _ref.updateState("passed", elapsed) : void 0;
      } else {
        this.updateStat("failures", this.total.failures += 1);
        if ((_ref1 = this.reportView) != null) {
          _ref1.updateState("failed", elapsed);
        }
        if (!this.config["build-full-report"]) {
          new Teaspoon.Reporters.HTML.FailureView(spec).appendTo(this.findEl("report-failures"));
        }
        return this.setStatus("failed");
      }
    };

    HTML.prototype.updateProgress = function() {
      return this.progress.update(this.total.exist, this.total.run);
    };

    HTML.prototype.showConfiguration = function() {
      var key, value, _ref, _results;
      _ref = this.config;
      _results = [];
      for (key in _ref) {
        value = _ref[key];
        _results.push(this.setClass(key, value ? "active" : ""));
      }
      return _results;
    };

    HTML.prototype.setStatus = function(status) {
      return document.body.className = "teaspoon-" + status;
    };

    HTML.prototype.setFilters = function() {
      if (Teaspoon.params["file"]) {
        this.filters.push("by file: " + Teaspoon.params["file"]);
      }
      if (Teaspoon.params["grep"]) {
        return this.filters.push("by match: " + Teaspoon.params["grep"]);
      }
    };

    HTML.prototype.readConfig = function() {
      var config;
      if (config = this.store("teaspoon")) {
        return this.config = config;
      }
    };

    HTML.prototype.toggleConfig = function(e) {
      var button, name;
      button = e.target;
      if (button.tagName.toLowerCase() !== "button") {
        return;
      }
      name = button.getAttribute("id").replace(/^teaspoon-/, "");
      this.config[name] = !this.config[name];
      this.store("teaspoon", this.config);
      return Teaspoon.reload();
    };

    HTML.prototype.changeSuite = function(e) {
      var options;
      options = e.target.options;
      return window.location.href = options[options.selectedIndex].value;
    };

    HTML.prototype.store = function(name, value) {
      var _ref;
      if (((_ref = window.localStorage) != null ? _ref.setItem : void 0) != null) {
        return this.localstore(name, value);
      } else {
        return this.cookie(name, value);
      }
    };

    HTML.prototype.cookie = function(name, value) {
      var date, match;
      if (value == null) {
        value = void 0;
      }
      if (value === void 0) {
        name = name.replace(/([.*+?^=!:${}()|[\]\/\\])/g, "\\$1");
        match = document.cookie.match(new RegExp("(?:^|;)\\s?" + name + "=(.*?)(?:;|$)", "i"));
        return match && JSON.parse(unescape(match[1]).split(" ")[0]);
      } else {
        date = new Teaspoon.Date();
        date.setDate(date.getDate() + 365);
        return document.cookie = "" + name + "=" + (escape(JSON.stringify(value))) + "; expires=" + (date.toUTCString()) + "; path=/;";
      }
    };

    HTML.prototype.localstore = function(name, value) {
      if (value == null) {
        value = void 0;
      }
      if (value === void 0) {
        return JSON.parse(unescape(localStorage.getItem(name)));
      } else {
        return localStorage.setItem(name, escape(JSON.stringify(value)));
      }
    };

    return HTML;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teaspoon.Reporters.HTML.ProgressView = (function(_super) {
    __extends(ProgressView, _super);

    function ProgressView() {
      return ProgressView.__super__.constructor.apply(this, arguments);
    }

    ProgressView.create = function(displayProgress) {
      if (displayProgress == null) {
        displayProgress = true;
      }
      if (!displayProgress) {
        return new Teaspoon.Reporters.HTML.ProgressView();
      }
      if (Teaspoon.Reporters.HTML.RadialProgressView.supported) {
        return new Teaspoon.Reporters.HTML.RadialProgressView();
      } else {
        return new Teaspoon.Reporters.HTML.SimpleProgressView();
      }
    };

    ProgressView.prototype.build = function() {
      return this.el = this.createEl("div", "teaspoon-indicator teaspoon-logo");
    };

    ProgressView.prototype.update = function() {};

    return ProgressView;

  })(Teaspoon.Reporters.BaseView);

  Teaspoon.Reporters.HTML.SimpleProgressView = (function(_super) {
    __extends(SimpleProgressView, _super);

    function SimpleProgressView() {
      return SimpleProgressView.__super__.constructor.apply(this, arguments);
    }

    SimpleProgressView.prototype.build = function() {
      this.el = this.createEl("div", "simple-progress");
      return this.el.innerHTML = "<em id=\"teaspoon-progress-percent\">0%</em>\n<span id=\"teaspoon-progress-span\" class=\"teaspoon-indicator\"></span>";
    };

    SimpleProgressView.prototype.update = function(total, run) {
      var percent;
      percent = total ? Math.ceil((run * 100) / total) : 0;
      return this.setHtml("progress-percent", "" + percent + "%");
    };

    return SimpleProgressView;

  })(Teaspoon.Reporters.HTML.ProgressView);

  Teaspoon.Reporters.HTML.RadialProgressView = (function(_super) {
    __extends(RadialProgressView, _super);

    function RadialProgressView() {
      return RadialProgressView.__super__.constructor.apply(this, arguments);
    }

    RadialProgressView.supported = !!document.createElement("canvas").getContext;

    RadialProgressView.prototype.build = function() {
      this.el = this.createEl("div", "teaspoon-indicator radial-progress");
      return this.el.innerHTML = "<canvas id=\"teaspoon-progress-canvas\"></canvas>\n<em id=\"teaspoon-progress-percent\">0%</em>";
    };

    RadialProgressView.prototype.appendTo = function() {
      var canvas, e;
      RadialProgressView.__super__.appendTo.apply(this, arguments);
      this.size = 80;
      try {
        canvas = this.findEl("progress-canvas");
        canvas.width = canvas.height = canvas.style.width = canvas.style.height = this.size;
        this.ctx = canvas.getContext("2d");
        this.ctx.strokeStyle = "#fff";
        return this.ctx.lineWidth = 1.5;
      } catch (_error) {
        e = _error;
      }
    };

    RadialProgressView.prototype.update = function(total, run) {
      var half, percent;
      percent = total ? Math.ceil((run * 100) / total) : 0;
      this.setHtml("progress-percent", "" + percent + "%");
      if (!this.ctx) {
        return;
      }
      half = this.size / 2;
      this.ctx.clearRect(0, 0, this.size, this.size);
      this.ctx.beginPath();
      this.ctx.arc(half, half, half - 1, 0, Math.PI * 2 * (percent / 100), false);
      return this.ctx.stroke();
    };

    return RadialProgressView;

  })(Teaspoon.Reporters.HTML.ProgressView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teaspoon.Reporters.HTML.SpecView = (function(_super) {
    var viewId;

    __extends(SpecView, _super);

    viewId = 0;

    function SpecView(spec, reporter) {
      this.spec = spec;
      this.reporter = reporter;
      this.views = this.reporter.views;
      this.spec.viewId = viewId += 1;
      this.views.specs[this.spec.viewId] = this;
      SpecView.__super__.constructor.apply(this, arguments);
    }

    SpecView.prototype.build = function() {
      var classes;
      classes = ["spec"];
      if (this.spec.pending) {
        classes.push("state-pending");
      }
      SpecView.__super__.build.call(this, classes.join(" "));
      this.el.innerHTML = "<a href=\"" + this.spec.link + "\">" + (this.htmlSafe(this.spec.description)) + "</a>";
      this.parentView = this.buildParent();
      return this.parentView.append(this.el);
    };

    SpecView.prototype.buildParent = function() {
      var parent, view;
      parent = this.spec.parent;
      if (parent.viewId) {
        return this.views.suites[parent.viewId];
      } else {
        view = new Teaspoon.Reporters.HTML.SuiteView(parent, this.reporter);
        return this.views.suites[view.suite.viewId] = view;
      }
    };

    SpecView.prototype.buildErrors = function() {
      var div, error, html, mapper, _i, _len, _ref;
      div = this.createEl("div");
      html = "";
      _ref = this.spec.errors();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        mapper = new Teaspoon.errorToFileMapper(error);
        mapper.fetch((function(_this) {
          return function(error, before, line, after) {
            var characters, editUrl, sourceCode;
            sourceCode = "<pre class='source-code-extract'><code>" + (_this.htmlSafe(before)) + "\n</code>";
            sourceCode += "<code class='error-line'>" + (_this.htmlSafe(line)) + "\n</code>";
            if (error.characters()) {
              characters = Array(error.characters()).join(" ");
              sourceCode += "<code class='under-error-line'>" + characters + "^\n</code>";
            }
            sourceCode += "<code>" + (_this.htmlSafe(after)) + "\n</code>";
            sourceCode += "</pre>";
            editUrl = "mvim://open?url=file:///Users/markburns/kanji/teaspoon/lib/teaspoon/suite.rb&line=106";
            html += "<strong>" + (_this.htmlSafe(error.message())) + "</strong><a class=\"file\" href=\"" + editUrl + "\">" + sourceCode + "</a>";
            html += "<pre class=\"source-code-extract stack-trace\"><code>\n" + (linkify(_this.htmlSafe(error.stack()))) + "</code></pre>";
            return div.innerHTML = html;
          };
        })(this));
      }
      return this.append(div);
    };

    SpecView.prototype.updateState = function(state, elapsed) {
      var classes, result, _base;
      result = this.spec.result();
      classes = ["state-" + state];
      if (elapsed > Teaspoon.slow) {
        classes.push("slow");
      }
      if (state !== "failed") {
        this.el.innerHTML += "<span>" + elapsed + "ms</span>";
      }
      this.el.className = classes.join(" ");
      if (result.status !== "passed") {
        this.buildErrors();
      }
      return typeof (_base = this.parentView).updateState === "function" ? _base.updateState(state) : void 0;
    };

    return SpecView;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teaspoon.Reporters.HTML.FailureView = (function(_super) {
    __extends(FailureView, _super);

    function FailureView(spec) {
      this.spec = spec;
      FailureView.__super__.constructor.apply(this, arguments);
    }

    FailureView.prototype.build = function() {
      var error, html, mapper, _i, _len, _ref, _results;
      FailureView.__super__.build.call(this, "spec");
      html = "<h1 class=\"teaspoon-clearfix\"><a href=\"" + this.spec.link + "\">" + (this.htmlSafe(this.spec.fullDescription)) + "</a></h1>";
      _ref = this.spec.errors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        mapper = new Teaspoon.errorToFileMapper(error);
        _results.push(mapper.fetch((function(_this) {
          return function(error, before, line, after) {
            var sourceCode;
            sourceCode = "<pre class=\"source-code-extract\">" + (_this.htmlSafe(before)) + "</pre>";
            sourceCode += "<br/>";
            sourceCode += "<pre class=\"source-code-extract main-line\">" + (_this.htmlSafe(line)) + "</pre>";
            sourceCode += "<br/>";
            sourceCode += "<pre class=\"source-code-extract\">" + (_this.htmlSafe(after)) + "</pre>";
            html += "<div>" + sourceCode + "<strong>" + (_this.htmlSafe(error.message())) + "</strong><br/>" + (_this.htmlSafe(error.stack())) + "</div>";
            return _this.el.innerHTML = html;
          };
        })(this)));
      }
      return _results;
    };

    return FailureView;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teaspoon.Reporters.HTML.SuiteView = (function(_super) {
    var viewId;

    __extends(SuiteView, _super);

    viewId = 0;

    function SuiteView(suite, reporter) {
      this.suite = suite;
      this.reporter = reporter;
      this.views = this.reporter.views;
      this.suite.viewId = viewId += 1;
      this.views.suites[this.suite.viewId] = this;
      this.suite = new Teaspoon.Suite(suite);
      SuiteView.__super__.constructor.apply(this, arguments);
    }

    SuiteView.prototype.build = function() {
      SuiteView.__super__.build.call(this, "suite");
      this.el.innerHTML = "<h1><a href=\"" + this.suite.link + "\">" + (this.htmlSafe(this.suite.description)) + "</a></h1>";
      this.parentView = this.buildParent();
      return this.parentView.append(this.el);
    };

    SuiteView.prototype.buildParent = function() {
      var parent, view;
      parent = this.suite.parent;
      if (!parent) {
        return this.reporter;
      }
      if (parent.viewId) {
        return this.views.suites[parent.viewId];
      } else {
        view = new Teaspoon.Reporters.HTML.SuiteView(parent, this.reporter);
        return this.views.suites[view.suite.viewId] = view;
      }
    };

    SuiteView.prototype.append = function(el) {
      if (!this.ol) {
        SuiteView.__super__.append.call(this, this.ol = this.createEl("ol"));
      }
      return this.ol.appendChild(el);
    };

    SuiteView.prototype.updateState = function(state) {
      var _base;
      if (this.state === "failed") {
        return;
      }
      this.el.className = "" + (this.el.className.replace(/\s?state-\w+/, "")) + " state-" + state;
      if (typeof (_base = this.parentView).updateState === "function") {
        _base.updateState(state);
      }
      return this.state = state;
    };

    return SuiteView;

  })(Teaspoon.Reporters.BaseView);

}).call(this);
(function() {
  Teaspoon.Reporters.HTML.template = function() {
    return "<div class=\"teaspoon-clearfix\">\n  <div id=\"teaspoon-title\">\n    <h1><a href=\"" + Teaspoon.root + "\" id=\"teaspoon-root-link\">Teaspoon</a></h1>\n    <ul>\n      <li>version: <b id=\"teaspoon-version\"></b></li>\n      <li id=\"teaspoon-env-info\"></li>\n    </ul>\n  </div>\n  <div id=\"teaspoon-progress\"></div>\n  <ul id=\"teaspoon-stats\">\n    <li>passes: <b id=\"teaspoon-stats-passes\">0</b></li>\n    <li>failures: <b id=\"teaspoon-stats-failures\">0</b></li>\n    <li>skipped: <b id=\"teaspoon-stats-skipped\">0</b></li>\n    <li>duration: <b id=\"teaspoon-stats-duration\">&infin;</b></li>\n  </ul>\n</div>\n\n<div id=\"teaspoon-controls\" class=\"teaspoon-clearfix\">\n  <div id=\"teaspoon-toggles\">\n    <button id=\"teaspoon-use-catch\" title=\"Toggle using try/catch wrappers when possible\">Try/Catch</button>\n    <button id=\"teaspoon-build-full-report\" title=\"Toggle building the full report\">Full Report</button>\n    <button id=\"teaspoon-display-progress\" title=\"Toggle displaying progress as tests run\">Progress</button>\n  </div>\n  <div id=\"teaspoon-suites\"></div>\n</div>\n\n<hr/>\n\n<div id=\"teaspoon-filter\">\n  <h1>Applied Filters [<a href=\"" + window.location.pathname + "\" id=\"teaspoon-filter-clear\">remove</a>]</h1>\n  <ul id=\"teaspoon-filter-list\"></ul>\n</div>\n\n<div id=\"teaspoon-report\">\n  <ol id=\"teaspoon-report-failures\"></ol>\n  <ol id=\"teaspoon-report-all\"></ol>\n</div>";
  };

}).call(this);
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  Teaspoon.Reporters.Console = (function() {
    function Console() {
      this.reportRunnerResults = __bind(this.reportRunnerResults, this);
      this.start = new Teaspoon.Date();
      this.suites = {};
    }

    Console.prototype.reportRunnerStarting = function(runner) {
      return this.log({
        type: "runner",
        total: runner.total || (typeof runner.specs === "function" ? runner.specs().length : void 0) || 0,
        start: JSON.parse(JSON.stringify(this.start))
      });
    };

    Console.prototype.reportSuites = function() {
      var index, suite, _i, _len, _ref, _results;
      _ref = this.spec.getParents();
      _results = [];
      for (index = _i = 0, _len = _ref.length; _i < _len; index = ++_i) {
        suite = _ref[index];
        if (this.suites[suite.fullDescription]) {
          continue;
        }
        this.suites[suite.fullDescription] = true;
        _results.push(this.log({
          type: "suite",
          label: suite.description,
          level: index
        }));
      }
      return _results;
    };

    Console.prototype.reportSpecResults = function(spec) {
      var result;
      this.spec = new Teaspoon.Spec(spec);
      result = this.spec.result();
      if (result.skipped) {
        return;
      }
      this.reportSuites();
      switch (result.status) {
        case "pending":
          return this.trackPending();
        case "failed":
          return this.trackFailure();
        default:
          return this.log({
            type: "spec",
            suite: this.spec.suiteName,
            label: this.spec.description,
            status: result.status,
            skipped: result.skipped
          });
      }
    };

    Console.prototype.trackPending = function() {
      var result;
      result = this.spec.result();
      return this.log({
        type: "spec",
        suite: this.spec.suiteName,
        label: this.spec.description,
        status: result.status,
        skipped: result.skipped
      });
    };

    Console.prototype.trackFailure = function() {
      var error, result, _i, _len, _ref, _results;
      result = this.spec.result();
      _ref = this.spec.errors();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        error = _ref[_i];
        _results.push(this.log({
          type: "spec",
          suite: this.spec.suiteName,
          label: this.spec.description,
          status: result.status,
          skipped: result.skipped,
          link: this.spec.fullDescription,
          message: error.message,
          trace: error.stack || error.message || "Stack Trace Unavailable"
        }));
      }
      return _results;
    };

    Console.prototype.reportRunnerResults = function() {
      this.log({
        type: "result",
        elapsed: ((new Teaspoon.Date().getTime() - this.start.getTime()) / 1000).toFixed(5),
        coverage: window.__coverage__
      });
      return Teaspoon.finished = true;
    };

    Console.prototype.log = function(obj) {
      if (obj == null) {
        obj = {};
      }
      obj["_teaspoon"] = true;
      return Teaspoon.log(JSON.stringify(obj));
    };

    return Console;

  })();

}).call(this);
(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  Teaspoon.Reporters.HTML = (function(_super) {
    __extends(HTML, _super);

    function HTML() {
      return HTML.__super__.constructor.apply(this, arguments);
    }

    HTML.prototype.readConfig = function() {
      HTML.__super__.readConfig.apply(this, arguments);
      return jasmine.CATCH_EXCEPTIONS = this.config["use-catch"];
    };

    HTML.prototype.envInfo = function() {
      var ver, verString;
      ver = jasmine.getEnv().version();
      verString = [ver.major, ver.minor, ver.build].join(".");
      return "jasmine " + verString + " revision " + ver.revision;
    };

    return HTML;

  })(Teaspoon.Reporters.HTML);

}).call(this);
(function() {
  var env,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (typeof jasmine === "undefined" || jasmine === null) {
    throw new Teaspoon.Error('Jasmine not found -- use `suite.use_framework :jasmine` and adjust or remove the `suite.javascripts` directive.');
  }

  Teaspoon.Runner = (function(_super) {
    __extends(Runner, _super);

    function Runner() {
      Runner.__super__.constructor.apply(this, arguments);
      env.execute();
    }

    Runner.prototype.setup = function() {
      var grep, reporter;
      env.updateInterval = 1000;
      if (grep = this.params["grep"]) {
        env.specFilter = function(spec) {
          return spec.getFullName().indexOf(grep) === 0;
        };
      }
      reporter = new (this.getReporter())();
      env.addReporter(reporter);
      return this.addFixtureSupport();
    };

    Runner.prototype.addFixtureSupport = function() {
      if (!(jasmine.getFixtures && this.fixturePath)) {
        return;
      }
      jasmine.getFixtures().containerId = "teaspoon-fixtures";
      jasmine.getFixtures().fixturesPath = this.fixturePath;
      jasmine.getStyleFixtures().fixturesPath = this.fixturePath;
      return jasmine.getJSONFixtures().fixturesPath = this.fixturePath;
    };

    return Runner;

  })(Teaspoon.Runner);

  Teaspoon.Spec = (function() {
    function Spec(spec) {
      this.spec = spec;
      this.fullDescription = this.spec.getFullName();
      this.description = this.spec.description;
      this.link = "?grep=" + (encodeURIComponent(this.fullDescription));
      this.parent = this.spec.suite;
      this.suiteName = this.parent.getFullName();
      this.viewId = this.spec.viewId;
      this.pending = this.spec.pending;
    }

    Spec.prototype.errors = function() {
      var item, _i, _len, _ref, _results;
      if (!this.spec.results) {
        return [];
      }
      _ref = this.spec.results().getItems();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        item = _ref[_i];
        if (item.passed()) {
          continue;
        }
        _results.push({
          message: item.message,
          stack: item.trace.stack
        });
      }
      return _results;
    };

    Spec.prototype.getParents = function() {
      var parent;
      if (this.parents) {
        return this.parents;
      }
      this.parents || (this.parents = []);
      parent = this.parent;
      while (parent) {
        parent = new Teaspoon.Suite(parent);
        this.parents.unshift(parent);
        parent = parent.parent;
      }
      return this.parents;
    };

    Spec.prototype.result = function() {
      var results, status;
      results = this.spec.results();
      status = "failed";
      if (results.passed()) {
        status = "passed";
      }
      if (this.spec.pending) {
        status = "pending";
      }
      return {
        status: status,
        skipped: results.skipped
      };
    };

    return Spec;

  })();

  Teaspoon.Suite = (function() {
    function Suite(suite) {
      this.suite = suite;
      this.fullDescription = this.suite.getFullName();
      this.description = this.suite.description;
      this.link = "?grep=" + (encodeURIComponent(this.fullDescription));
      this.parent = this.suite.parentSuite;
      this.viewId = this.suite.viewId;
    }

    return Suite;

  })();

  Teaspoon.fixture = (function(_super) {
    __extends(fixture, _super);

    function fixture() {
      return fixture.__super__.constructor.apply(this, arguments);
    }

    window.fixture = fixture;

    fixture.load = function() {
      var args;
      args = arguments;
      if (!(env.currentSuite || env.currentSpec)) {
        throw "Teaspoon can't load fixtures outside of describe.";
      }
      if (env.currentSuite) {
        env.beforeEach((function(_this) {
          return function() {
            return fixture.__super__.constructor.load.apply(_this, args);
          };
        })(this));
        env.afterEach((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.load.apply(this, arguments);
      } else {
        env.currentSpec.after((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.load.apply(this, arguments);
      }
    };

    fixture.set = function() {
      var args;
      args = arguments;
      if (!(env.currentSuite || env.currentSpec)) {
        throw "Teaspoon can't load fixtures outside of describe.";
      }
      if (env.currentSuite) {
        env.beforeEach((function(_this) {
          return function() {
            return fixture.__super__.constructor.set.apply(_this, args);
          };
        })(this));
        env.afterEach((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.set.apply(this, arguments);
      } else {
        env.currentSpec.after((function(_this) {
          return function() {
            return _this.cleanup();
          };
        })(this));
        return fixture.__super__.constructor.set.apply(this, arguments);
      }
    };

    return fixture;

  })(Teaspoon.fixture);

  env = jasmine.getEnv();

}).call(this);
