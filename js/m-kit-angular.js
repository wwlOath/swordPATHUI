/*
 * Copyright 2013 Ivan Pusic
 * Contributors: Matjaz Lipus
 * https://github.com/ivpusic/angular-cookie
 */
angular.module('ivpusic.cookie', ['ipCookie']);
angular.module('ipCookie', ['ng']).
factory('ipCookie', ['$document',
  function ($document) {
    'use strict';

    return (function () {
      function cookieFun(key, value, options) {

        var cookies,
            list,
            i,
            cookie,
            pos,
            name,
            hasCookies,
            all,
            expiresFor;

        options = options || {};

        if (value !== undefined) {
          // we are setting value
          value = typeof value === 'object' ? JSON.stringify(value) : String(value);

          if (typeof options.expires === 'number') {
            expiresFor = options.expires;
            options.expires = new Date();
            // Trying to delete a cookie; set a date far in the past
            if (expiresFor === -1) {
              options.expires = new Date('Thu, 01 Jan 1970 00:00:00 GMT');
              // A new
            } else if (options.expirationUnit !== undefined) {
              if (options.expirationUnit === 'hours') {
                options.expires.setHours(options.expires.getHours() + expiresFor);
              } else if (options.expirationUnit === 'minutes') {
                options.expires.setMinutes(options.expires.getMinutes() + expiresFor);
              } else if (options.expirationUnit === 'seconds') {
                options.expires.setSeconds(options.expires.getSeconds() + expiresFor);
              } else {
                options.expires.setDate(options.expires.getDate() + expiresFor);
              }
            } else {
              options.expires.setDate(options.expires.getDate() + expiresFor);
            }
          }
          return ($document[0].cookie = [
            encodeURIComponent(key),
            '=',
            encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '',
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
          ].join(''));
        }

        list = [];
        all = $document[0].cookie;
        if (all) {
          list = all.split('; ');
        }

        cookies = {};
        hasCookies = false;

        for (i = 0; i < list.length; ++i) {
          if (list[i]) {
            cookie = list[i];
            pos = cookie.indexOf('=');
            name = cookie.substring(0, pos);
            value = decodeURIComponent(cookie.substring(pos + 1));

            if (key === undefined || key === name) {
              try {
                cookies[name] = JSON.parse(value);
              } catch (e) {
                cookies[name] = value;
              }
              if (key === name) {
                return cookies[name];
              }
              hasCookies = true;
            }
          }
        }
        if (hasCookies && key === undefined) {
          return cookies;
        }
      }
      cookieFun.remove = function (key, options) {
        var hasCookie = cookieFun(key) !== undefined;

        if (hasCookie) {
          if (!options) {
            options = {};
          }
          options.expires = -1;
          cookieFun(key, '', options);
        }
        return hasCookie;
      };
      return cookieFun;
    }());
  }
]);

/*
 * https://github.com/dolymood/angular-delegate-event
 */
'use strict'

;(function() {

  var root = document.documentElement;
  var matchesSelector = root.matches ||
      root.matchesSelector ||
      root.webkitMatchesSelector ||
      root.mozMatchesSelector ||
      root.msMatchesSelector ||
      root.oMatchesSelector;
  var mSelector = function(ele, selector) {
    if (typeof jQuery !== 'undefined') {
      return jQuery(ele).is(selector);
    }
    if (matchesSelector) {
      return matchesSelector.call(ele, selector);
    }
    return ele.tagName.toLowerCase() === selector;
  };
  var getClosest = function(ele, selector, rootE) {
    rootE || (rootE = root);
    while(ele && ele != rootE && (rootE.contains(ele))) {
      if (mSelector(ele, selector)) {
        return ele;
      } else {
        ele = ele.parentNode;
      }
    }
    return null;
  };
  var dgEventDirectives = {};

  if (!root.contains) {
    Node.prototype.contains = function(arg) {
      return !!(this.compareDocumentPosition(arg) & 16);
    }
  }

  var rtObj = /^\s*?{.+}\s*?$/;

  angular.forEach(
      'Event Click Dblclick Mousedown Mouseup Mouseover Mouseout Mousemove Mouseenter Mouseleave'.split(' '),
      function(name) {

        var dirName = 'ngd' + name;

        dgEventDirectives[dirName] = ['$parse', function($parse) {

          return function(scope, ele, attrs) {
            var selector = attrs.selector;
            var eventName = (name == 'Event' ? (attrs.eventName || 'click') : name.toLowerCase());
            var events = attrs[dirName];
            if (selector.match(rtObj)) {
              selector = scope.$eval(selector);
            }
            if (events.match(rtObj)) {
              // 是对象
              events = scope.$eval(events);
              angular.forEach(events, parseFn);
            } else {
              parseFn(events, eventName);
            }

            function parseFn(events, eventName) {
              var func = $parse(events);
              ele.on(eventName, function(e) {
                var target = e.target;
                var el;
                if (
                    (el = getClosest(
                            target,
                            typeof selector == 'string' ? selector : selector[eventName],
                            ele[0]
                        )
                    )
                ) {
                  e.delegationTarget = el;
                  func(angular.element(el).scope(), {$event: e, $params: [].slice.call(arguments, 1)});
                  if (!scope.$$phase) {
                    scope.$apply();
                  }
                }
              });
            }

          };
        }];
      }
  );

  angular.module('DelegateEvents', []).directive(dgEventDirectives);

})()

/*
 angular-file-upload v2.6.1
 https://github.com/nervgh/angular-file-upload
*/

;(function webpackUniversalModuleDefinition(root, factory) {
  if(typeof exports === 'object' && typeof module === 'object')
    module.exports = factory();
  else if(typeof define === 'function' && define.amd)
    define([], factory);
  else if(typeof exports === 'object')
    exports["angular-file-upload"] = factory();
  else
    root["angular-file-upload"] = factory();
})(this, function() {
  return /******/ (function(modules) { // webpackBootstrap
    /******/ 	// The module cache
    /******/ 	var installedModules = {};
    /******/
    /******/ 	// The require function
    /******/ 	function __webpack_require__(moduleId) {
      /******/
      /******/ 		// Check if module is in cache
      /******/ 		if(installedModules[moduleId])
      /******/ 			return installedModules[moduleId].exports;
      /******/
      /******/ 		// Create a new module (and put it into the cache)
      /******/ 		var module = installedModules[moduleId] = {
        /******/ 			exports: {},
        /******/ 			id: moduleId,
        /******/ 			loaded: false
        /******/ 		};
      /******/
      /******/ 		// Execute the module function
      /******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
      /******/
      /******/ 		// Flag the module as loaded
      /******/ 		module.loaded = true;
      /******/
      /******/ 		// Return the exports of the module
      /******/ 		return module.exports;
      /******/ 	}
    /******/
    /******/
    /******/ 	// expose the modules object (__webpack_modules__)
    /******/ 	__webpack_require__.m = modules;
    /******/
    /******/ 	// expose the module cache
    /******/ 	__webpack_require__.c = installedModules;
    /******/
    /******/ 	// __webpack_public_path__
    /******/ 	__webpack_require__.p = "";
    /******/
    /******/ 	// Load entry module and return exports
    /******/ 	return __webpack_require__(0);
    /******/ })
  /************************************************************************/
  /******/ ([
    /* 0 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      var _options = __webpack_require__(2);

      var _options2 = _interopRequireDefault(_options);

      var _FileUploader = __webpack_require__(3);

      var _FileUploader2 = _interopRequireDefault(_FileUploader);

      var _FileLikeObject = __webpack_require__(4);

      var _FileLikeObject2 = _interopRequireDefault(_FileLikeObject);

      var _FileItem = __webpack_require__(5);

      var _FileItem2 = _interopRequireDefault(_FileItem);

      var _FileDirective = __webpack_require__(6);

      var _FileDirective2 = _interopRequireDefault(_FileDirective);

      var _FileSelect = __webpack_require__(7);

      var _FileSelect2 = _interopRequireDefault(_FileSelect);

      var _Pipeline = __webpack_require__(8);

      var _Pipeline2 = _interopRequireDefault(_Pipeline);

      var _FileDrop = __webpack_require__(9);

      var _FileDrop2 = _interopRequireDefault(_FileDrop);

      var _FileOver = __webpack_require__(10);

      var _FileOver2 = _interopRequireDefault(_FileOver);

      var _FileSelect3 = __webpack_require__(11);

      var _FileSelect4 = _interopRequireDefault(_FileSelect3);

      var _FileDrop3 = __webpack_require__(12);

      var _FileDrop4 = _interopRequireDefault(_FileDrop3);

      var _FileOver3 = __webpack_require__(13);

      var _FileOver4 = _interopRequireDefault(_FileOver3);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      angular.module(_config2.default.name, []).value('fileUploaderOptions', _options2.default).factory('FileUploader', _FileUploader2.default).factory('FileLikeObject', _FileLikeObject2.default).factory('FileItem', _FileItem2.default).factory('FileDirective', _FileDirective2.default).factory('FileSelect', _FileSelect2.default).factory('FileDrop', _FileDrop2.default).factory('FileOver', _FileOver2.default).factory('Pipeline', _Pipeline2.default).directive('nvFileSelect', _FileSelect4.default).directive('nvFileDrop', _FileDrop4.default).directive('nvFileOver', _FileOver4.default).run(['FileUploader', 'FileLikeObject', 'FileItem', 'FileDirective', 'FileSelect', 'FileDrop', 'FileOver', 'Pipeline', function (FileUploader, FileLikeObject, FileItem, FileDirective, FileSelect, FileDrop, FileOver, Pipeline) {
        // only for compatibility
        FileUploader.FileLikeObject = FileLikeObject;
        FileUploader.FileItem = FileItem;
        FileUploader.FileDirective = FileDirective;
        FileUploader.FileSelect = FileSelect;
        FileUploader.FileDrop = FileDrop;
        FileUploader.FileOver = FileOver;
        FileUploader.Pipeline = Pipeline;
      }]);

      /***/ }),
    /* 1 */
    /***/ (function(module, exports) {

      module.exports = {"name":"angularFileUpload"}

      /***/ }),
    /* 2 */
    /***/ (function(module, exports) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = {
        url: '/',
        alias: 'file',
        headers: {},
        queue: [],
        progress: 0,
        autoUpload: false,
        removeAfterUpload: false,
        method: 'POST',
        filters: [],
        formData: [],
        queueLimit: Number.MAX_VALUE,
        withCredentials: false,
        disableMultipart: false
      };

      /***/ }),
    /* 3 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });

      var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      var _angular = angular,
          bind = _angular.bind,
          copy = _angular.copy,
          extend = _angular.extend,
          forEach = _angular.forEach,
          isObject = _angular.isObject,
          isNumber = _angular.isNumber,
          isDefined = _angular.isDefined,
          isArray = _angular.isArray,
          isUndefined = _angular.isUndefined,
          element = _angular.element;
      function __identity(fileUploaderOptions, $rootScope, $http, $window, $timeout, FileLikeObject, FileItem, Pipeline) {
        var File = $window.File,
            FormData = $window.FormData;

        var FileUploader = function () {
          /**********************
           * PUBLIC
           **********************/
          /**
           * Creates an instance of FileUploader
           * @param {Object} [options]
           * @constructor
           */
          function FileUploader(options) {
            _classCallCheck(this, FileUploader);

            var settings = copy(fileUploaderOptions);

            extend(this, settings, options, {
              isUploading: false,
              _nextIndex: 0,
              _directives: { select: [], drop: [], over: [] }
            });

            // add default filters
            this.filters.unshift({ name: 'queueLimit', fn: this._queueLimitFilter });
            this.filters.unshift({ name: 'folder', fn: this._folderFilter });
          }
          /**
           * Adds items to the queue
           * @param {File|HTMLInputElement|Object|FileList|Array<Object>} files
           * @param {Object} [options]
           * @param {Array<Function>|String} filters
           */


          FileUploader.prototype.addToQueue = function addToQueue(files, options, filters) {
            var _this = this;

            var incomingQueue = this.isArrayLikeObject(files) ? Array.prototype.slice.call(files) : [files];
            var arrayOfFilters = this._getFilters(filters);
            var count = this.queue.length;
            var addedFileItems = [];

            var next = function next() {
              var something = incomingQueue.shift();

              if (isUndefined(something)) {
                return done();
              }

              var fileLikeObject = _this.isFile(something) ? something : new FileLikeObject(something);
              var pipes = _this._convertFiltersToPipes(arrayOfFilters);
              var pipeline = new Pipeline(pipes);
              var onThrown = function onThrown(err) {
                var originalFilter = err.pipe.originalFilter;

                var _err$args = _slicedToArray(err.args, 2),
                    fileLikeObject = _err$args[0],
                    options = _err$args[1];

                _this._onWhenAddingFileFailed(fileLikeObject, originalFilter, options);
                next();
              };
              var onSuccessful = function onSuccessful(fileLikeObject, options) {
                var fileItem = new FileItem(_this, fileLikeObject, options);
                addedFileItems.push(fileItem);
                _this.queue.push(fileItem);
                _this._onAfterAddingFile(fileItem);
                next();
              };
              pipeline.onThrown = onThrown;
              pipeline.onSuccessful = onSuccessful;
              pipeline.exec(fileLikeObject, options);
            };

            var done = function done() {
              if (_this.queue.length !== count) {
                _this._onAfterAddingAll(addedFileItems);
                _this.progress = _this._getTotalProgress();
              }

              _this._render();
              if (_this.autoUpload) _this.uploadAll();
            };

            next();
          };
          /**
           * Remove items from the queue. Remove last: index = -1
           * @param {FileItem|Number} value
           */


          FileUploader.prototype.removeFromQueue = function removeFromQueue(value) {
            var index = this.getIndexOfItem(value);
            var item = this.queue[index];
            if (item.isUploading) item.cancel();
            this.queue.splice(index, 1);
            item._destroy();
            this.progress = this._getTotalProgress();
          };
          /**
           * Clears the queue
           */


          FileUploader.prototype.clearQueue = function clearQueue() {
            while (this.queue.length) {
              this.queue[0].remove();
            }
            this.progress = 0;
          };
          /**
           * Uploads a item from the queue
           * @param {FileItem|Number} value
           */


          FileUploader.prototype.uploadItem = function uploadItem(value) {
            var index = this.getIndexOfItem(value);
            var item = this.queue[index];
            var transport = this.isHTML5 ? '_xhrTransport' : '_iframeTransport';

            item._prepareToUploading();
            if (this.isUploading) return;

            this._onBeforeUploadItem(item);
            if (item.isCancel) return;

            item.isUploading = true;
            this.isUploading = true;
            this[transport](item);
            this._render();
          };
          /**
           * Cancels uploading of item from the queue
           * @param {FileItem|Number} value
           */


          FileUploader.prototype.cancelItem = function cancelItem(value) {
            var _this2 = this;

            var index = this.getIndexOfItem(value);
            var item = this.queue[index];
            var prop = this.isHTML5 ? '_xhr' : '_form';
            if (!item) return;
            item.isCancel = true;
            if (item.isUploading) {
              // It will call this._onCancelItem() & this._onCompleteItem() asynchronously
              item[prop].abort();
            } else {
              var dummy = [undefined, 0, {}];
              var onNextTick = function onNextTick() {
                _this2._onCancelItem.apply(_this2, [item].concat(dummy));
                _this2._onCompleteItem.apply(_this2, [item].concat(dummy));
              };
              $timeout(onNextTick); // Trigger callbacks asynchronously (setImmediate emulation)
            }
          };
          /**
           * Uploads all not uploaded items of queue
           */


          FileUploader.prototype.uploadAll = function uploadAll() {
            var items = this.getNotUploadedItems().filter(function (item) {
              return !item.isUploading;
            });
            if (!items.length) return;

            forEach(items, function (item) {
              return item._prepareToUploading();
            });
            items[0].upload();
          };
          /**
           * Cancels all uploads
           */


          FileUploader.prototype.cancelAll = function cancelAll() {
            var items = this.getNotUploadedItems();
            forEach(items, function (item) {
              return item.cancel();
            });
          };
          /**
           * Returns "true" if value an instance of File
           * @param {*} value
           * @returns {Boolean}
           * @private
           */


          FileUploader.prototype.isFile = function isFile(value) {
            return this.constructor.isFile(value);
          };
          /**
           * Returns "true" if value an instance of FileLikeObject
           * @param {*} value
           * @returns {Boolean}
           * @private
           */


          FileUploader.prototype.isFileLikeObject = function isFileLikeObject(value) {
            return this.constructor.isFileLikeObject(value);
          };
          /**
           * Returns "true" if value is array like object
           * @param {*} value
           * @returns {Boolean}
           */


          FileUploader.prototype.isArrayLikeObject = function isArrayLikeObject(value) {
            return this.constructor.isArrayLikeObject(value);
          };
          /**
           * Returns a index of item from the queue
           * @param {Item|Number} value
           * @returns {Number}
           */


          FileUploader.prototype.getIndexOfItem = function getIndexOfItem(value) {
            return isNumber(value) ? value : this.queue.indexOf(value);
          };
          /**
           * Returns not uploaded items
           * @returns {Array}
           */


          FileUploader.prototype.getNotUploadedItems = function getNotUploadedItems() {
            return this.queue.filter(function (item) {
              return !item.isUploaded;
            });
          };
          /**
           * Returns items ready for upload
           * @returns {Array}
           */


          FileUploader.prototype.getReadyItems = function getReadyItems() {
            return this.queue.filter(function (item) {
              return item.isReady && !item.isUploading;
            }).sort(function (item1, item2) {
              return item1.index - item2.index;
            });
          };
          /**
           * Destroys instance of FileUploader
           */


          FileUploader.prototype.destroy = function destroy() {
            var _this3 = this;

            forEach(this._directives, function (key) {
              forEach(_this3._directives[key], function (object) {
                object.destroy();
              });
            });
          };
          /**
           * Callback
           * @param {Array} fileItems
           */


          FileUploader.prototype.onAfterAddingAll = function onAfterAddingAll(fileItems) {};
          /**
           * Callback
           * @param {FileItem} fileItem
           */


          FileUploader.prototype.onAfterAddingFile = function onAfterAddingFile(fileItem) {};
          /**
           * Callback
           * @param {File|Object} item
           * @param {Object} filter
           * @param {Object} options
           */


          FileUploader.prototype.onWhenAddingFileFailed = function onWhenAddingFileFailed(item, filter, options) {};
          /**
           * Callback
           * @param {FileItem} fileItem
           */


          FileUploader.prototype.onBeforeUploadItem = function onBeforeUploadItem(fileItem) {};
          /**
           * Callback
           * @param {FileItem} fileItem
           * @param {Number} progress
           */


          FileUploader.prototype.onProgressItem = function onProgressItem(fileItem, progress) {};
          /**
           * Callback
           * @param {Number} progress
           */


          FileUploader.prototype.onProgressAll = function onProgressAll(progress) {};
          /**
           * Callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileUploader.prototype.onSuccessItem = function onSuccessItem(item, response, status, headers) {};
          /**
           * Callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileUploader.prototype.onErrorItem = function onErrorItem(item, response, status, headers) {};
          /**
           * Callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileUploader.prototype.onCancelItem = function onCancelItem(item, response, status, headers) {};
          /**
           * Callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileUploader.prototype.onCompleteItem = function onCompleteItem(item, response, status, headers) {};
          /**
           * Callback
           * @param {FileItem} item
           */


          FileUploader.prototype.onTimeoutItem = function onTimeoutItem(item) {};
          /**
           * Callback
           */


          FileUploader.prototype.onCompleteAll = function onCompleteAll() {};
          /**********************
           * PRIVATE
           **********************/
          /**
           * Returns the total progress
           * @param {Number} [value]
           * @returns {Number}
           * @private
           */


          FileUploader.prototype._getTotalProgress = function _getTotalProgress(value) {
            if (this.removeAfterUpload) return value || 0;

            var notUploaded = this.getNotUploadedItems().length;
            var uploaded = notUploaded ? this.queue.length - notUploaded : this.queue.length;
            var ratio = 100 / this.queue.length;
            var current = (value || 0) * ratio / 100;

            return Math.round(uploaded * ratio + current);
          };
          /**
           * Returns array of filters
           * @param {Array<Function>|String} filters
           * @returns {Array<Function>}
           * @private
           */


          FileUploader.prototype._getFilters = function _getFilters(filters) {
            if (!filters) return this.filters;
            if (isArray(filters)) return filters;
            var names = filters.match(/[^\s,]+/g);
            return this.filters.filter(function (filter) {
              return names.indexOf(filter.name) !== -1;
            });
          };
          /**
           * @param {Array<Function>} filters
           * @returns {Array<Function>}
           * @private
           */


          FileUploader.prototype._convertFiltersToPipes = function _convertFiltersToPipes(filters) {
            var _this4 = this;

            return filters.map(function (filter) {
              var fn = bind(_this4, filter.fn);
              fn.isAsync = filter.fn.length === 3;
              fn.originalFilter = filter;
              return fn;
            });
          };
          /**
           * Updates html
           * @private
           */


          FileUploader.prototype._render = function _render() {
            if (!$rootScope.$$phase) $rootScope.$apply();
          };
          /**
           * Returns "true" if item is a file (not folder)
           * @param {File|FileLikeObject} item
           * @returns {Boolean}
           * @private
           */


          FileUploader.prototype._folderFilter = function _folderFilter(item) {
            return !!(item.size || item.type);
          };
          /**
           * Returns "true" if the limit has not been reached
           * @returns {Boolean}
           * @private
           */


          FileUploader.prototype._queueLimitFilter = function _queueLimitFilter() {
            return this.queue.length < this.queueLimit;
          };
          /**
           * Checks whether upload successful
           * @param {Number} status
           * @returns {Boolean}
           * @private
           */


          FileUploader.prototype._isSuccessCode = function _isSuccessCode(status) {
            return status >= 200 && status < 300 || status === 304;
          };
          /**
           * Transforms the server response
           * @param {*} response
           * @param {Object} headers
           * @returns {*}
           * @private
           */


          FileUploader.prototype._transformResponse = function _transformResponse(response, headers) {
            var headersGetter = this._headersGetter(headers);
            forEach($http.defaults.transformResponse, function (transformFn) {
              response = transformFn(response, headersGetter);
            });
            return response;
          };
          /**
           * Parsed response headers
           * @param headers
           * @returns {Object}
           * @see https://github.com/angular/angular.js/blob/master/src/ng/http.js
           * @private
           */


          FileUploader.prototype._parseHeaders = function _parseHeaders(headers) {
            var parsed = {},
                key,
                val,
                i;

            if (!headers) return parsed;

            forEach(headers.split('\n'), function (line) {
              i = line.indexOf(':');
              key = line.slice(0, i).trim().toLowerCase();
              val = line.slice(i + 1).trim();

              if (key) {
                parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
              }
            });

            return parsed;
          };
          /**
           * Returns function that returns headers
           * @param {Object} parsedHeaders
           * @returns {Function}
           * @private
           */


          FileUploader.prototype._headersGetter = function _headersGetter(parsedHeaders) {
            return function (name) {
              if (name) {
                return parsedHeaders[name.toLowerCase()] || null;
              }
              return parsedHeaders;
            };
          };
          /**
           * The XMLHttpRequest transport
           * @param {FileItem} item
           * @private
           */


          FileUploader.prototype._xhrTransport = function _xhrTransport(item) {
            var _this5 = this;

            var xhr = item._xhr = new XMLHttpRequest();
            var sendable;

            if (!item.disableMultipart) {
              sendable = new FormData();
              forEach(item.formData, function (obj) {
                forEach(obj, function (value, key) {
                  sendable.append(key, value);
                });
              });

              sendable.append(item.alias, item._file, item.file.name);
            } else {
              sendable = item._file;
            }

            if (typeof item._file.size != 'number') {
              throw new TypeError('The file specified is no longer valid');
            }

            xhr.upload.onprogress = function (event) {
              var progress = Math.round(event.lengthComputable ? event.loaded * 100 / event.total : 0);
              _this5._onProgressItem(item, progress);
            };

            xhr.onload = function () {
              var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
              var response = _this5._transformResponse(xhr.response, headers);
              var gist = _this5._isSuccessCode(xhr.status) ? 'Success' : 'Error';
              var method = '_on' + gist + 'Item';
              _this5[method](item, response, xhr.status, headers);
              _this5._onCompleteItem(item, response, xhr.status, headers);
            };

            xhr.onerror = function () {
              var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
              var response = _this5._transformResponse(xhr.response, headers);
              _this5._onErrorItem(item, response, xhr.status, headers);
              _this5._onCompleteItem(item, response, xhr.status, headers);
            };

            xhr.onabort = function () {
              var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
              var response = _this5._transformResponse(xhr.response, headers);
              _this5._onCancelItem(item, response, xhr.status, headers);
              _this5._onCompleteItem(item, response, xhr.status, headers);
            };

            xhr.ontimeout = function (e) {
              var headers = _this5._parseHeaders(xhr.getAllResponseHeaders());
              var response = "Request Timeout.";
              _this5._onTimeoutItem(item);
              _this5._onCompleteItem(item, response, 408, headers);
            };

            xhr.open(item.method, item.url, true);

            xhr.timeout = item.timeout || 0;
            xhr.withCredentials = item.withCredentials;

            forEach(item.headers, function (value, name) {
              xhr.setRequestHeader(name, value);
            });

            xhr.send(sendable);
          };
          /**
           * The IFrame transport
           * @param {FileItem} item
           * @private
           */


          FileUploader.prototype._iframeTransport = function _iframeTransport(item) {
            var _this6 = this;

            var form = element('<form style="display: none;" />');
            var iframe = element('<iframe name="iframeTransport' + Date.now() + '">');
            var input = item._input;

            var timeout = 0;
            var timer = null;
            var isTimedOut = false;

            if (item._form) item._form.replaceWith(input); // remove old form
            item._form = form; // save link to new form

            input.prop('name', item.alias);

            forEach(item.formData, function (obj) {
              forEach(obj, function (value, key) {
                var element_ = element('<input type="hidden" name="' + key + '" />');
                element_.val(value);
                form.append(element_);
              });
            });

            form.prop({
              action: item.url,
              method: 'POST',
              target: iframe.prop('name'),
              enctype: 'multipart/form-data',
              encoding: 'multipart/form-data' // old IE
            });

            iframe.bind('load', function () {
              var html = '';
              var status = 200;

              try {
                // Fix for legacy IE browsers that loads internal error page
                // when failed WS response received. In consequence iframe
                // content access denied error is thrown becouse trying to
                // access cross domain page. When such thing occurs notifying
                // with empty response object. See more info at:
                // http://stackoverflow.com/questions/151362/access-is-denied-error-on-accessing-iframe-document-object
                // Note that if non standard 4xx or 5xx error code returned
                // from WS then response content can be accessed without error
                // but 'XHR' status becomes 200. In order to avoid confusion
                // returning response via same 'success' event handler.

                // fixed angular.contents() for iframes
                html = iframe[0].contentDocument.body.innerHTML;
              } catch (e) {
                // in case we run into the access-is-denied error or we have another error on the server side
                // (intentional 500,40... errors), we at least say 'something went wrong' -> 500
                status = 500;
              }

              if (timer) {
                clearTimeout(timer);
              }
              timer = null;

              if (isTimedOut) {
                return false; //throw 'Request Timeout'
              }

              var xhr = { response: html, status: status, dummy: true };
              var headers = {};
              var response = _this6._transformResponse(xhr.response, headers);

              _this6._onSuccessItem(item, response, xhr.status, headers);
              _this6._onCompleteItem(item, response, xhr.status, headers);
            });

            form.abort = function () {
              var xhr = { status: 0, dummy: true };
              var headers = {};
              var response;

              iframe.unbind('load').prop('src', 'javascript:false;');
              form.replaceWith(input);

              _this6._onCancelItem(item, response, xhr.status, headers);
              _this6._onCompleteItem(item, response, xhr.status, headers);
            };

            input.after(form);
            form.append(input).append(iframe);

            timeout = item.timeout || 0;
            timer = null;

            if (timeout) {
              timer = setTimeout(function () {
                isTimedOut = true;

                item.isCancel = true;
                if (item.isUploading) {
                  iframe.unbind('load').prop('src', 'javascript:false;');
                  form.replaceWith(input);
                }

                var headers = {};
                var response = "Request Timeout.";
                _this6._onTimeoutItem(item);
                _this6._onCompleteItem(item, response, 408, headers);
              }, timeout);
            }

            form[0].submit();
          };
          /**
           * Inner callback
           * @param {File|Object} item
           * @param {Object} filter
           * @param {Object} options
           * @private
           */


          FileUploader.prototype._onWhenAddingFileFailed = function _onWhenAddingFileFailed(item, filter, options) {
            this.onWhenAddingFileFailed(item, filter, options);
          };
          /**
           * Inner callback
           * @param {FileItem} item
           */


          FileUploader.prototype._onAfterAddingFile = function _onAfterAddingFile(item) {
            this.onAfterAddingFile(item);
          };
          /**
           * Inner callback
           * @param {Array<FileItem>} items
           */


          FileUploader.prototype._onAfterAddingAll = function _onAfterAddingAll(items) {
            this.onAfterAddingAll(items);
          };
          /**
           *  Inner callback
           * @param {FileItem} item
           * @private
           */


          FileUploader.prototype._onBeforeUploadItem = function _onBeforeUploadItem(item) {
            item._onBeforeUpload();
            this.onBeforeUploadItem(item);
          };
          /**
           * Inner callback
           * @param {FileItem} item
           * @param {Number} progress
           * @private
           */


          FileUploader.prototype._onProgressItem = function _onProgressItem(item, progress) {
            var total = this._getTotalProgress(progress);
            this.progress = total;
            item._onProgress(progress);
            this.onProgressItem(item, progress);
            this.onProgressAll(total);
            this._render();
          };
          /**
           * Inner callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileUploader.prototype._onSuccessItem = function _onSuccessItem(item, response, status, headers) {
            item._onSuccess(response, status, headers);
            this.onSuccessItem(item, response, status, headers);
          };
          /**
           * Inner callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileUploader.prototype._onErrorItem = function _onErrorItem(item, response, status, headers) {
            item._onError(response, status, headers);
            this.onErrorItem(item, response, status, headers);
          };
          /**
           * Inner callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileUploader.prototype._onCancelItem = function _onCancelItem(item, response, status, headers) {
            item._onCancel(response, status, headers);
            this.onCancelItem(item, response, status, headers);
          };
          /**
           * Inner callback
           * @param {FileItem} item
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileUploader.prototype._onCompleteItem = function _onCompleteItem(item, response, status, headers) {
            item._onComplete(response, status, headers);
            this.onCompleteItem(item, response, status, headers);

            var nextItem = this.getReadyItems()[0];
            this.isUploading = false;

            if (isDefined(nextItem)) {
              nextItem.upload();
              return;
            }

            this.onCompleteAll();
            this.progress = this._getTotalProgress();
            this._render();
          };
          /**
           * Inner callback
           * @param {FileItem} item
           * @private
           */


          FileUploader.prototype._onTimeoutItem = function _onTimeoutItem(item) {
            item._onTimeout();
            this.onTimeoutItem(item);
          };
          /**********************
           * STATIC
           **********************/
          /**
           * Returns "true" if value an instance of File
           * @param {*} value
           * @returns {Boolean}
           * @private
           */


          FileUploader.isFile = function isFile(value) {
            return File && value instanceof File;
          };
          /**
           * Returns "true" if value an instance of FileLikeObject
           * @param {*} value
           * @returns {Boolean}
           * @private
           */


          FileUploader.isFileLikeObject = function isFileLikeObject(value) {
            return value instanceof FileLikeObject;
          };
          /**
           * Returns "true" if value is array like object
           * @param {*} value
           * @returns {Boolean}
           */


          FileUploader.isArrayLikeObject = function isArrayLikeObject(value) {
            return isObject(value) && 'length' in value;
          };
          /**
           * Inherits a target (Class_1) by a source (Class_2)
           * @param {Function} target
           * @param {Function} source
           */


          FileUploader.inherit = function inherit(target, source) {
            target.prototype = Object.create(source.prototype);
            target.prototype.constructor = target;
            target.super_ = source;
          };

          return FileUploader;
        }();

        /**********************
         * PUBLIC
         **********************/
        /**
         * Checks a support the html5 uploader
         * @returns {Boolean}
         * @readonly
         */


        FileUploader.prototype.isHTML5 = !!(File && FormData);
        /**********************
         * STATIC
         **********************/
        /**
         * @borrows FileUploader.prototype.isHTML5
         */
        FileUploader.isHTML5 = FileUploader.prototype.isHTML5;

        return FileUploader;
      }

      __identity.$inject = ['fileUploaderOptions', '$rootScope', '$http', '$window', '$timeout', 'FileLikeObject', 'FileItem', 'Pipeline'];

      /***/ }),
    /* 4 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      var _angular = angular,
          copy = _angular.copy,
          isElement = _angular.isElement,
          isString = _angular.isString;
      function __identity() {

        return function () {
          /**
           * Creates an instance of FileLikeObject
           * @param {File|HTMLInputElement|Object} fileOrInput
           * @constructor
           */
          function FileLikeObject(fileOrInput) {
            _classCallCheck(this, FileLikeObject);

            var isInput = isElement(fileOrInput);
            var fakePathOrObject = isInput ? fileOrInput.value : fileOrInput;
            var postfix = isString(fakePathOrObject) ? 'FakePath' : 'Object';
            var method = '_createFrom' + postfix;
            this[method](fakePathOrObject, fileOrInput);
          }
          /**
           * Creates file like object from fake path string
           * @param {String} path
           * @private
           */


          FileLikeObject.prototype._createFromFakePath = function _createFromFakePath(path, input) {
            this.lastModifiedDate = null;
            this.size = null;
            this.type = 'like/' + path.slice(path.lastIndexOf('.') + 1).toLowerCase();
            this.name = path.slice(path.lastIndexOf('/') + path.lastIndexOf('\\') + 2);
            this.input = input;
          };
          /**
           * Creates file like object from object
           * @param {File|FileLikeObject} object
           * @private
           */


          FileLikeObject.prototype._createFromObject = function _createFromObject(object) {
            this.lastModifiedDate = copy(object.lastModifiedDate);
            this.size = object.size;
            this.type = object.type;
            this.name = object.name;
            this.input = object.input;
          };

          return FileLikeObject;
        }();
      }

      /***/ }),
    /* 5 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      var _angular = angular,
          copy = _angular.copy,
          extend = _angular.extend,
          element = _angular.element,
          isElement = _angular.isElement;
      function __identity($compile, FileLikeObject) {

        return function () {
          /**
           * Creates an instance of FileItem
           * @param {FileUploader} uploader
           * @param {File|HTMLInputElement|Object} some
           * @param {Object} options
           * @constructor
           */
          function FileItem(uploader, some, options) {
            _classCallCheck(this, FileItem);

            var isInput = !!some.input;
            var input = isInput ? element(some.input) : null;
            var file = !isInput ? some : null;

            extend(this, {
              url: uploader.url,
              alias: uploader.alias,
              headers: copy(uploader.headers),
              formData: copy(uploader.formData),
              removeAfterUpload: uploader.removeAfterUpload,
              withCredentials: uploader.withCredentials,
              disableMultipart: uploader.disableMultipart,
              method: uploader.method,
              timeout: uploader.timeout
            }, options, {
              uploader: uploader,
              file: new FileLikeObject(some),
              isReady: false,
              isUploading: false,
              isUploaded: false,
              isSuccess: false,
              isCancel: false,
              isError: false,
              progress: 0,
              index: null,
              _file: file,
              _input: input
            });

            if (input) this._replaceNode(input);
          }
          /**********************
           * PUBLIC
           **********************/
          /**
           * Uploads a FileItem
           */


          FileItem.prototype.upload = function upload() {
            try {
              this.uploader.uploadItem(this);
            } catch (e) {
              var message = e.name + ':' + e.message;
              this.uploader._onCompleteItem(this, message, e.code, []);
              this.uploader._onErrorItem(this, message, e.code, []);
            }
          };
          /**
           * Cancels uploading of FileItem
           */


          FileItem.prototype.cancel = function cancel() {
            this.uploader.cancelItem(this);
          };
          /**
           * Removes a FileItem
           */


          FileItem.prototype.remove = function remove() {
            this.uploader.removeFromQueue(this);
          };
          /**
           * Callback
           * @private
           */


          FileItem.prototype.onBeforeUpload = function onBeforeUpload() {};
          /**
           * Callback
           * @param {Number} progress
           * @private
           */


          FileItem.prototype.onProgress = function onProgress(progress) {};
          /**
           * Callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileItem.prototype.onSuccess = function onSuccess(response, status, headers) {};
          /**
           * Callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileItem.prototype.onError = function onError(response, status, headers) {};
          /**
           * Callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileItem.prototype.onCancel = function onCancel(response, status, headers) {};
          /**
           * Callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           */


          FileItem.prototype.onComplete = function onComplete(response, status, headers) {};
          /**
           * Callback
           */


          FileItem.prototype.onTimeout = function onTimeout() {};
          /**********************
           * PRIVATE
           **********************/
          /**
           * Inner callback
           */


          FileItem.prototype._onBeforeUpload = function _onBeforeUpload() {
            this.isReady = true;
            this.isUploading = false;
            this.isUploaded = false;
            this.isSuccess = false;
            this.isCancel = false;
            this.isError = false;
            this.progress = 0;
            this.onBeforeUpload();
          };
          /**
           * Inner callback
           * @param {Number} progress
           * @private
           */


          FileItem.prototype._onProgress = function _onProgress(progress) {
            this.progress = progress;
            this.onProgress(progress);
          };
          /**
           * Inner callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileItem.prototype._onSuccess = function _onSuccess(response, status, headers) {
            this.isReady = false;
            this.isUploading = false;
            this.isUploaded = true;
            this.isSuccess = true;
            this.isCancel = false;
            this.isError = false;
            this.progress = 100;
            this.index = null;
            this.onSuccess(response, status, headers);
          };
          /**
           * Inner callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileItem.prototype._onError = function _onError(response, status, headers) {
            this.isReady = false;
            this.isUploading = false;
            this.isUploaded = true;
            this.isSuccess = false;
            this.isCancel = false;
            this.isError = true;
            this.progress = 0;
            this.index = null;
            this.onError(response, status, headers);
          };
          /**
           * Inner callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileItem.prototype._onCancel = function _onCancel(response, status, headers) {
            this.isReady = false;
            this.isUploading = false;
            this.isUploaded = false;
            this.isSuccess = false;
            this.isCancel = true;
            this.isError = false;
            this.progress = 0;
            this.index = null;
            this.onCancel(response, status, headers);
          };
          /**
           * Inner callback
           * @param {*} response
           * @param {Number} status
           * @param {Object} headers
           * @private
           */


          FileItem.prototype._onComplete = function _onComplete(response, status, headers) {
            this.onComplete(response, status, headers);
            if (this.removeAfterUpload) this.remove();
          };
          /**
           * Inner callback
           * @private
           */


          FileItem.prototype._onTimeout = function _onTimeout() {
            this.isReady = false;
            this.isUploading = false;
            this.isUploaded = false;
            this.isSuccess = false;
            this.isCancel = false;
            this.isError = true;
            this.progress = 0;
            this.index = null;
            this.onTimeout();
          };
          /**
           * Destroys a FileItem
           */


          FileItem.prototype._destroy = function _destroy() {
            if (this._input) this._input.remove();
            if (this._form) this._form.remove();
            delete this._form;
            delete this._input;
          };
          /**
           * Prepares to uploading
           * @private
           */


          FileItem.prototype._prepareToUploading = function _prepareToUploading() {
            this.index = this.index || ++this.uploader._nextIndex;
            this.isReady = true;
          };
          /**
           * Replaces input element on his clone
           * @param {JQLite|jQuery} input
           * @private
           */


          FileItem.prototype._replaceNode = function _replaceNode(input) {
            var clone = $compile(input.clone())(input.scope());
            clone.prop('value', null); // FF fix
            input.css('display', 'none');
            input.after(clone); // remove jquery dependency
          };

          return FileItem;
        }();
      }

      __identity.$inject = ['$compile', 'FileLikeObject'];

      /***/ }),
    /* 6 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      var _angular = angular,
          extend = _angular.extend;
      function __identity() {
        var FileDirective = function () {
          /**
           * Creates instance of {FileDirective} object
           * @param {Object} options
           * @param {Object} options.uploader
           * @param {HTMLElement} options.element
           * @param {Object} options.events
           * @param {String} options.prop
           * @constructor
           */
          function FileDirective(options) {
            _classCallCheck(this, FileDirective);

            extend(this, options);
            this.uploader._directives[this.prop].push(this);
            this._saveLinks();
            this.bind();
          }
          /**
           * Binds events handles
           */


          FileDirective.prototype.bind = function bind() {
            for (var key in this.events) {
              var prop = this.events[key];
              this.element.bind(key, this[prop]);
            }
          };
          /**
           * Unbinds events handles
           */


          FileDirective.prototype.unbind = function unbind() {
            for (var key in this.events) {
              this.element.unbind(key, this.events[key]);
            }
          };
          /**
           * Destroys directive
           */


          FileDirective.prototype.destroy = function destroy() {
            var index = this.uploader._directives[this.prop].indexOf(this);
            this.uploader._directives[this.prop].splice(index, 1);
            this.unbind();
            // this.element = null;
          };
          /**
           * Saves links to functions
           * @private
           */


          FileDirective.prototype._saveLinks = function _saveLinks() {
            for (var key in this.events) {
              var prop = this.events[key];
              this[prop] = this[prop].bind(this);
            }
          };

          return FileDirective;
        }();

        /**
         * Map of events
         * @type {Object}
         */


        FileDirective.prototype.events = {};

        return FileDirective;
      }

      /***/ }),
    /* 7 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

      function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

      var _angular = angular,
          extend = _angular.extend;
      function __identity($compile, FileDirective) {

        return function (_FileDirective) {
          _inherits(FileSelect, _FileDirective);

          /**
           * Creates instance of {FileSelect} object
           * @param {Object} options
           * @constructor
           */
          function FileSelect(options) {
            _classCallCheck(this, FileSelect);

            var extendedOptions = extend(options, {
              // Map of events
              events: {
                $destroy: 'destroy',
                change: 'onChange'
              },
              // Name of property inside uploader._directive object
              prop: 'select'
            });

            var _this = _possibleConstructorReturn(this, _FileDirective.call(this, extendedOptions));

            if (!_this.uploader.isHTML5) {
              _this.element.removeAttr('multiple');
            }
            _this.element.prop('value', null); // FF fix
            return _this;
          }
          /**
           * Returns options
           * @return {Object|undefined}
           */


          FileSelect.prototype.getOptions = function getOptions() {};
          /**
           * Returns filters
           * @return {Array<Function>|String|undefined}
           */


          FileSelect.prototype.getFilters = function getFilters() {};
          /**
           * If returns "true" then HTMLInputElement will be cleared
           * @returns {Boolean}
           */


          FileSelect.prototype.isEmptyAfterSelection = function isEmptyAfterSelection() {
            return !!this.element.attr('multiple');
          };
          /**
           * Event handler
           */


          FileSelect.prototype.onChange = function onChange() {
            var files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
            var options = this.getOptions();
            var filters = this.getFilters();

            if (!this.uploader.isHTML5) this.destroy();
            this.uploader.addToQueue(files, options, filters);
            if (this.isEmptyAfterSelection()) {
              this.element.prop('value', null);
              this.element.replaceWith($compile(this.element.clone())(this.scope)); // IE fix
            }
          };

          return FileSelect;
        }(FileDirective);
      }

      __identity.$inject = ['$compile', 'FileDirective'];

      /***/ }),
    /* 8 */
    /***/ (function(module, exports) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      var _angular = angular,
          bind = _angular.bind,
          isUndefined = _angular.isUndefined;
      function __identity($q) {

        return function () {
          /**
           * @param {Array<Function>} pipes
           */
          function Pipeline() {
            var pipes = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            _classCallCheck(this, Pipeline);

            this.pipes = pipes;
          }

          Pipeline.prototype.next = function next(args) {
            var pipe = this.pipes.shift();
            if (isUndefined(pipe)) {
              this.onSuccessful.apply(this, _toConsumableArray(args));
              return;
            }
            var err = new Error('The filter has not passed');
            err.pipe = pipe;
            err.args = args;
            if (pipe.isAsync) {
              var deferred = $q.defer();
              var onFulfilled = bind(this, this.next, args);
              var onRejected = bind(this, this.onThrown, err);
              deferred.promise.then(onFulfilled, onRejected);
              pipe.apply(undefined, _toConsumableArray(args).concat([deferred]));
            } else {
              var isDone = Boolean(pipe.apply(undefined, _toConsumableArray(args)));
              if (isDone) {
                this.next(args);
              } else {
                this.onThrown(err);
              }
            }
          };

          Pipeline.prototype.exec = function exec() {
            for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
              args[_key] = arguments[_key];
            }

            this.next(args);
          };

          Pipeline.prototype.onThrown = function onThrown(err) {};

          Pipeline.prototype.onSuccessful = function onSuccessful() {};

          return Pipeline;
        }();
      }

      __identity.$inject = ['$q'];

      /***/ }),
    /* 9 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

      function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

      var _angular = angular,
          extend = _angular.extend,
          forEach = _angular.forEach;
      function __identity(FileDirective) {

        return function (_FileDirective) {
          _inherits(FileDrop, _FileDirective);

          /**
           * Creates instance of {FileDrop} object
           * @param {Object} options
           * @constructor
           */
          function FileDrop(options) {
            _classCallCheck(this, FileDrop);

            var extendedOptions = extend(options, {
              // Map of events
              events: {
                $destroy: 'destroy',
                drop: 'onDrop',
                dragover: 'onDragOver',
                dragleave: 'onDragLeave'
              },
              // Name of property inside uploader._directive object
              prop: 'drop'
            });

            return _possibleConstructorReturn(this, _FileDirective.call(this, extendedOptions));
          }
          /**
           * Returns options
           * @return {Object|undefined}
           */


          FileDrop.prototype.getOptions = function getOptions() {};
          /**
           * Returns filters
           * @return {Array<Function>|String|undefined}
           */


          FileDrop.prototype.getFilters = function getFilters() {};
          /**
           * Event handler
           */


          FileDrop.prototype.onDrop = function onDrop(event) {
            var transfer = this._getTransfer(event);
            if (!transfer) return;
            var options = this.getOptions();
            var filters = this.getFilters();
            this._preventAndStop(event);
            forEach(this.uploader._directives.over, this._removeOverClass, this);
            this.uploader.addToQueue(transfer.files, options, filters);
          };
          /**
           * Event handler
           */


          FileDrop.prototype.onDragOver = function onDragOver(event) {
            var transfer = this._getTransfer(event);
            if (!this._haveFiles(transfer.types)) return;
            transfer.dropEffect = 'copy';
            this._preventAndStop(event);
            forEach(this.uploader._directives.over, this._addOverClass, this);
          };
          /**
           * Event handler
           */


          FileDrop.prototype.onDragLeave = function onDragLeave(event) {
            if (event.currentTarget === this.element[0]) return;
            this._preventAndStop(event);
            forEach(this.uploader._directives.over, this._removeOverClass, this);
          };
          /**
           * Helper
           */


          FileDrop.prototype._getTransfer = function _getTransfer(event) {
            return event.dataTransfer ? event.dataTransfer : event.originalEvent.dataTransfer; // jQuery fix;
          };
          /**
           * Helper
           */


          FileDrop.prototype._preventAndStop = function _preventAndStop(event) {
            event.preventDefault();
            event.stopPropagation();
          };
          /**
           * Returns "true" if types contains files
           * @param {Object} types
           */


          FileDrop.prototype._haveFiles = function _haveFiles(types) {
            if (!types) return false;
            if (types.indexOf) {
              return types.indexOf('Files') !== -1;
            } else if (types.contains) {
              return types.contains('Files');
            } else {
              return false;
            }
          };
          /**
           * Callback
           */


          FileDrop.prototype._addOverClass = function _addOverClass(item) {
            item.addOverClass();
          };
          /**
           * Callback
           */


          FileDrop.prototype._removeOverClass = function _removeOverClass(item) {
            item.removeOverClass();
          };

          return FileDrop;
        }(FileDirective);
      }

      __identity.$inject = ['FileDirective'];

      /***/ }),
    /* 10 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

      function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

      function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

      var _angular = angular,
          extend = _angular.extend;
      function __identity(FileDirective) {

        return function (_FileDirective) {
          _inherits(FileOver, _FileDirective);

          /**
           * Creates instance of {FileDrop} object
           * @param {Object} options
           * @constructor
           */
          function FileOver(options) {
            _classCallCheck(this, FileOver);

            var extendedOptions = extend(options, {
              // Map of events
              events: {
                $destroy: 'destroy'
              },
              // Name of property inside uploader._directive object
              prop: 'over',
              // Over class
              overClass: 'nv-file-over'
            });

            return _possibleConstructorReturn(this, _FileDirective.call(this, extendedOptions));
          }
          /**
           * Adds over class
           */


          FileOver.prototype.addOverClass = function addOverClass() {
            this.element.addClass(this.getOverClass());
          };
          /**
           * Removes over class
           */


          FileOver.prototype.removeOverClass = function removeOverClass() {
            this.element.removeClass(this.getOverClass());
          };
          /**
           * Returns over class
           * @returns {String}
           */


          FileOver.prototype.getOverClass = function getOverClass() {
            return this.overClass;
          };

          return FileOver;
        }(FileDirective);
      }

      __identity.$inject = ['FileDirective'];

      /***/ }),
    /* 11 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function __identity($parse, FileUploader, FileSelect) {

        return {
          link: function link(scope, element, attributes) {
            var uploader = scope.$eval(attributes.uploader);

            if (!(uploader instanceof FileUploader)) {
              throw new TypeError('"Uploader" must be an instance of FileUploader');
            }

            var object = new FileSelect({
              uploader: uploader,
              element: element,
              scope: scope
            });

            object.getOptions = $parse(attributes.options).bind(object, scope);
            object.getFilters = function () {
              return attributes.filters;
            };
          }
        };
      }

      __identity.$inject = ['$parse', 'FileUploader', 'FileSelect'];

      /***/ }),
    /* 12 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function __identity($parse, FileUploader, FileDrop) {

        return {
          link: function link(scope, element, attributes) {
            var uploader = scope.$eval(attributes.uploader);

            if (!(uploader instanceof FileUploader)) {
              throw new TypeError('"Uploader" must be an instance of FileUploader');
            }

            if (!uploader.isHTML5) return;

            var object = new FileDrop({
              uploader: uploader,
              element: element
            });

            object.getOptions = $parse(attributes.options).bind(object, scope);
            object.getFilters = function () {
              return attributes.filters;
            };
          }
        };
      }

      __identity.$inject = ['$parse', 'FileUploader', 'FileDrop'];

      /***/ }),
    /* 13 */
    /***/ (function(module, exports, __webpack_require__) {

      'use strict';

      Object.defineProperty(exports, "__esModule", {
        value: true
      });
      exports.default = __identity;

      var _config = __webpack_require__(1);

      var _config2 = _interopRequireDefault(_config);

      function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

      function __identity(FileUploader, FileOver) {

        return {
          link: function link(scope, element, attributes) {
            var uploader = scope.$eval(attributes.uploader);

            if (!(uploader instanceof FileUploader)) {
              throw new TypeError('"Uploader" must be an instance of FileUploader');
            }

            var object = new FileOver({
              uploader: uploader,
              element: element
            });

            object.getOverClass = function () {
              return attributes.overClass || object.overClass;
            };
          }
        };
      }

      __identity.$inject = ['FileUploader', 'FileOver'];

      /***/ })
    /******/ ]);
});
;
//# sourceMappingURL=angular-file-upload.js.map
/**
 * Created by ChenJianfeng on 2014/7/11 0011.
 */
angular.module('m.kit.attachment', ['m.kit.utils'])
    .directive('mAttachment', ['mUtils',function (mUtils) {
      return {
        templateUrl: 'attachment.tmpl',
        scope: {
          isConnected: '=connected',
          multiple:'=?',
          editable:'@',
          attachments: '=',
          newFiles: '=',
          exists:'=',
          clickIndex:'=',
          viewer:"=?"
        },
        controller:['$scope', function ($scope) {
          var news = $scope.newAttachments = [];
          var exists = $scope.exists;

          var deleteAttachment = function (name) {
            var attas = $scope.attachments;
            for (var i in attas) {
              if (attas[i].name === name) {
                attas.splice(i, 1);
                break;
              }
            }
          }
          $scope.deleteNew = function (index) {
            deleteAttachment(news[index].name);
            delete $scope.newFiles[news[index].alias]
            news.splice(index, 1);
          }
          $scope.deleteExist = function (index) {
            exists[index].isDelete = true;
            deleteAttachment(exists[index].name);
          }
          $scope.undelete = function (index) {
            delete exists[index].isDelete;
            $scope.attachments.push(exists[index])
          }
          this.deleteNew=function(name){
            for(var i= 0;i<news.length;i++){
              if(news[i].name===name){
                $scope.deleteNew(i)
                return true;
              }
            }
            return false;
          }
          $scope.clickHandler= function (index) {
            $scope.clickIndex=index;
          }
        }],
        link: function (scope, elem, attrs) {
          var input=elem.find('input')
          scope.$watch('multiple', function (nv,ov) {
            if(nv){
              input.attr('multiple','')
            }else{
              input.removeAttr('multiple')
            }
          })
          if(attrs.connected===undefined) scope.isConnected=true;
          var acceptType = /txt|log|ini|pdf|jpg|jpeg|png|gif|bmp|avi|mp4|wmv|rm|rmvb|mpeg|mpg|doc|docx|ppt|pptx|xps|xls|xlsx|dcm|tif|till|rar|zip|7z|gz/;
          var getNewName = function (name) {
            //name=name.replace('&','').replace("'",'').replace('-','');
            //var random = (Math.random() * 1000).toFixed(0);
            //var i = name.lastIndexOf('.');
            //return i === -1 ? (name + '-' + random) : (name.substring(0, i) + '-' + random + name.substring(i));

            var newName= Math.random().toString(36).substring(2,12);
            var i = name.lastIndexOf('.');
            if(i>-1){
              newName+=name.substring(i).toLowerCase();
            }
            return newName;
          }
          var newFiles = scope.newFiles;
          var bindChange = function (file) {
            return file.bind('change', function () {
              if(this.files){
                for(var i=0;i<this.files.length;i++){
                  addFile(this.files[i].name.toLowerCase(),this,i)
                }
              }else{
                var alias = this.value.substring((this.value.lastIndexOf("\\") + 1) || (this.value.lastIndexOf("/") + 1)).toLowerCase();
                addFile(alias,this)
              }
              var clone=input=angular.element(this).clone().val("");
              bindChange(clone)
              this.parentNode.appendChild(clone[0]);
              this.parentNode.removeChild(this);
            });
          }
          var addFile= function (alias,input,idx) {
            if (newFiles[alias] === undefined && mUtils.getFileExtension(alias).match(acceptType)) {
              if (alias.length > 50) {
                var i = alias.lastIndexOf(".");
                var extension = alias.substring(i);
                alias = alias.substring(0, 50 - extension.length) + extension;
              }
              var name = getNewName(alias);
              var atta = {
                alias: alias,
                name: name
              }
              scope.newAttachments.push(atta);
              scope.attachments.push(atta);
              newFiles[alias] = {
                name: name,
                file: input,
                idx:idx
              }
              scope.$apply();
            }
          }
          bindChange(input);
        }
      }
    }])
    .directive('mTouch', function () {
      return {
        scope:{
          mTouch:'&'
        },
        link: function (scope,element,attrs) {
          if("ontouchend" in document || navigator.maxTouchPoints > 0){
            element.bind("touchstart", function (e) {
              scope.mTouch(e)
            })
          }
        }
      }
    })
    .directive('mFileViewer', ['$timeout','mConf', function ($timeout,mConf) {
      return {
        templateUrl: 'fileViewer.tmpl',
        scope: {
          ix: '=vIndex',
          files: '=vFiles',
          setFn: '&'
        },
        link: function (scope, element, attrs) {
          scope.pin=mConf.get("fileViewer_pin",true);
          var prefix = attrs["vPrefix"];
          var url = attrs["vUrl"];
          if (!!!url) {
            url = "url";
          }
          var title = attrs["vTitle"];
          if (!!!title) {
            title = "name";
          }
          var iframe = scope.iframe = document.createElement("iframe");
          $(iframe).attr('webkitallowfullscreen', 'true').attr('mozallowfullscreen', 'true').attr('allowfullscreen', 'true');
          $(iframe).css('width', '100%').css('height', '100%').css('border', 0).on('load', function () {
            $(this).focus()
            this.style.visibility='visible';
            if (!!!$(this).attr('src') || $(this).attr('src') === "about:blank") {
              if(this.datasrc){
                this.src=this.datasrc;
                this.datasrc=null;
              }
              return;
            }
            scope.loading = false;
            scope.$apply();
          })

          element.find(".modal-body").prepend(iframe);
          scope.$watch('ix', function (nv, ov) {
            if (nv === undefined) return;
            if (!scope.files || nv < 0 || nv > scope.files.length - 1) return;
            iframe.src = "about:blank";
            //$timeout(function () {
            $(iframe).css({ visibility: 'hidden',  left: 0 });
            scope.loading = true;
            scope.title = scope.files[nv][title];
            var attachmentUrl = scope.files[nv][url];
            if (prefix) {
              attachmentUrl = prefix + encodeURIComponent(attachmentUrl);
            }
            iframe.datasrc = attachmentUrl;//src等about:blank触发load后再设置，解决Safari不加载问题
            if (scope.prevNextAction) {
              scope.prevNextAction = false;
            } else {
              scope.showWaitHide();
            }
            hasNext();
            hasPrev();
            //})
          })
          scope.showWaitHide = function () {
            $timeout(function () {
              scope.cancelHide();
              scope.hideHeader = false;
              scope.hide();
            });

          }
          if (attrs["setFn"]) {
            scope.setFn({ theFn: scope.showWaitHide });
          }
          var hasNext = function () {
            scope.hasNext = scope.ix < scope.files.length - 1;
          }
          var hasPrev = function () {
            scope.hasPrev = scope.ix > 0;
          }
          var fit_modal_body = function () {
            var diag, body, bodypaddings, height, modalheight, diagMargins, header, headerheight, diagPaddings;
            var modal = $(element);
            if (!modal.data('bs.modal') || (!modal.data('bs.modal').isShown && !modal.data('bs.modal')._isShown)) return;
            diag = $(".modal-dialog", modal);
            body = $(".modal-body", modal);
            header = $(".modal-header", modal);
            headerheight = header.css("position") === "absolute" ? 0 : parseInt(header.css("height"));
            modalheight = parseInt(modal.css("height"));
            bodypaddings = parseInt(body.css("padding-top")) + parseInt(body.css("padding-bottom"));
            diagMargins = parseInt(diag.css("margin-top")) + parseInt(diag.css("margin-bottom"));
            diagPaddings = parseInt(diag.css("padding-top")) + parseInt(diag.css("padding-bottom"));
            height = modalheight - headerheight - bodypaddings - diagMargins - diagPaddings;
            body.css({ "height": height + "px" });
            var modalW = parseInt(body.css("width"));
            var ov = $(".header-overele", modal);
            var ml = parseInt(ov.css("margin-left"));
            var mr = parseInt(ov.css("margin-right"));
            ov.css({ "width": (modalW - ml - mr) + "px" });

          };
          $(window).resize(resize).bind("mouseup",mouseup);
          function resize() {
            fit_modal_body();
          };
          function mouseup() {
            iframe.contentWindow.postMessage(JSON.stringify({type:"mouseup"}),"*");
          };

          $(element).on('shown.bs.modal', function () {
            fit_modal_body();
            $(iframe).focus()
          }).bind("keydown", function (e) {
            switch (e.keyCode){
              case 33://PageUp
                scope.prev()
                return;
              case 34://PageDown
                scope.next()
                return;

            }
          })

          //element.find(".modal-content")
          var $FE=$(document).bind("fullscreenchange",fullscreenchange);
          function fullscreenchange (e) {
            console.debug("fullscreenchange"+$FE.fullScreen())
            iframe.contentWindow.postMessage(JSON.stringify({t:!!$FE.fullScreen()?"EnterFullScreen":"ExitFullScreen"}),"*");
            postMsg(!!$FE.fullScreen()?"EnterFullScreen":"ExitFullScreen")
          }
          window.FV_toggleFullScreen= function () {
            console.debug("FV_toggleFullScreen")
            $FE.toggleFullScreen();
          }

          scope.$on("$destroy", function () {
            $(window).unbind("resize",resize).unbind("mouseup",mouseup);
            $(document).unbind("fullscreenchange",fullscreenchange)
            $(element).unbind('shown.bs.modal').unbind("keydown")
          })

          function postMsg(msg){
            iframe.contentWindow.postMessage(JSON.stringify({t:msg}),"*");
          }
        },
        controller: ['$scope', function ($scope) {
          $scope.next = function () {
            if ($scope.moving||($scope.ix + 1) > $scope.files.length - 1) {
              return;
            }
            $scope.moving = true;
            var iframe = $($scope.iframe);
            var iframe_w = getIframeWidth();
            var prevLeft = iframe_w * -1 + "px";
            iframe.css({ visibility: 'visible', left: 0 }).animate({ left: prevLeft }, 'normal', function () {
              $scope.$apply(function () {
                $scope.moving = false;
                $scope.loading = true;
                $scope.prevNextAction = true;
                $scope.ix++;
              })
            });
          }
          $scope.prev = function () {
            if ($scope.moving||($scope.ix - 1) < 0) {
              return;
            }
            $scope.moving = true;
            var iframe = $($scope.iframe);
            var iframe_w = getIframeWidth();
            var nextLeft = iframe_w + "px";
            iframe.css({ visibility: 'visible', left: 0 }).animate({ left: nextLeft }, 'normal', function () {
              $scope.$apply(function () {
                $scope.moving = false;
                $scope.loading = true;
                $scope.prevNextAction = true;
                $scope.ix--;
              })
            });
          }
          $scope.togglePin= function (isPin) {
            if(isPin===undefined){
              isPin=!$scope.pin
            }
            $scope.pin=isPin;
            mConf.set("fileViewer_pin",isPin);
          }
          var ts;
          $scope.hide = function () {
            $($scope.iframe).focus()
            if($scope.pin){return}
            ts = $timeout(function () {
              $scope.hideHeader = true;
            }, 2000);
          }
          $scope.touchShow= function () {
            $scope.cancelHide()
            $timeout(function () {
              $scope.show()
              $scope.hide()
            },300)
          }
          $scope.show = function () {
            $scope.hideHeader = false;
          }
          $scope.cancelHide = function () {
            if (ts != null) {
              $timeout.cancel(ts);
            }
          }
          var getIframeWidth = function () {
            var iframe = $($scope.iframe);
            return parseInt(iframe.css("width"));
          }


          var msgTS=0;
          var onMessage = function(event){
            event= event.originalEvent;
            if(event.timeStamp-msgTS<1) {return;}
            msgTS=event.timeStamp;

            var msg=event.data;
            if(msg==="[RequestFullscreen]"||(msg&&msg.type==="RequestFullscreen")){
              $timeout(function(){
                $("#slideViewer .modal-body").css("height","100%");
                $("#slideViewer .modal-dialog").addClass("fullscreen");
                console.log(new Date()+"[RequestFullscreen]");
              },100);
            }else if(msg==="[ExistFullscreen]"||(msg&&msg.type==="ExistFullscreen")){
              $("#slideViewer .modal-dialog").removeClass("fullscreen");
              $("#slideViewer").trigger("shown.bs.modal");
              $scope.showWaitHide();
              console.log(new Date()+"[ExistFullscreen]");
            }else if(msg==="[NextPage]"){
              $scope.next()
            }else if(msg==="[PrePage]"){
              $scope.prev()
            }else{
              try{
                msg=JSON.parse(msg);
              }catch(e){

              }
              switch (msg.type){
                case "[Page]":
                  $scope.$apply(function () {
                    $scope.ix=msg.idx;
                  });
                  break;
                case "Focus":
                  $($scope.iframe).focus()
                  break;
              }

            }
          };
          (function () {
            $(window).on("message", onMessage);
            $scope.$on("$destroy", function () {
              $(window).off("message", onMessage);
            })
          })();
        }]
      }
    }]);
/**
 * Created by ChenJianfeng on 2014/8/7 0030.
 */
angular.module('m.kit.bootstrap', ['template/modal'])
    .service('mModalManager',['$http','$compile','$timeout',function($http,$compile,$timeout){
      var modals={};
      this.addModal= function (key,modal) {
        modals[key]=modal;
      }
      this.showModal= function (key,scope) {
        var modal=modals[key]
        if(modal){
          modal.modal('show');
          return;
        }
        initModal(key,scope)
      }

      function initModal(key,scope){
        $http.get('/tmpl/'+key+".html").then(function(template) {
          var modal=$compile(template.data)(scope);
          //modals[key]=modal
          $timeout(function () {
            modal.modal('show');
          })
        })
      }
    }])
    .directive('mModalShow',['mModalManager',function (mModalManager) {
      return {
        link:function(scope,elem,attrs){
          elem.bind('click',function(){
            if(attrs.scope){
              scope=scope.$eval(attrs.scope)
            }
            mModalManager.showModal(attrs.mModalShow,scope);
          })
        }
      };
    }])
    .directive('mModal', ['mModalManager',function (mModalManager) {
      return {
        templateUrl: 'template/modal.tmpl',
        transclude: true,
        replace: true,
        link:function(scope,elem,attrs){
          //elem.modal({show:false})
          if(attrs.size){
            elem.find(".modal-dialog").addClass("modal-"+attrs.size)
          }
          mModalManager.addModal(attrs.mModal,elem);
        }
      };
    }])
    .directive('mModalLite', [function () {
      return {
        templateUrl: 'template/modal-lite.tmpl',
        transclude: true,
        link:function(scope,elem,attrs){
          elem.addClass("modal fade")
        }
      };
    }])
    .directive('mModalHeader', [function () {
      return {
        templateUrl: 'template/modal/header.tmpl',
        restrict: 'AE',
        transclude: true,
        replace: true
      };
    }])
    .directive('mModalBody', [function () {
      return {
        templateUrl: 'template/modal/body.tmpl',
        restrict: 'AE',
        transclude: true,
        replace: true
      };
    }])
    .directive('mModalFooter', [function () {
      return {
        templateUrl: 'template/modal/footer.tmpl',
        restrict: 'AE',
        transclude: true,
        replace: true
      };
    }])
angular.module("template/modal", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("template/modal.tmpl",'<div class="modal fade"><div class="modal-dialog"><div class="modal-content" ng-transclude></div></div></div>');
  $templateCache.put("template/modal-lite.tmpl",'<div class="modal-dialog"><div class="modal-content" ng-transclude></div></div>');
  $templateCache.put("template/modal/header.tmpl",
      '<div class="modal-header">' +
      '   <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
      '   <h4 class="modal-title" ng-transclude></h4>' +
      '</div>');
  $templateCache.put("template/modal/body.tmpl", '<div class="modal-body" ng-transclude></div>');
  $templateCache.put("template/modal/footer.tmpl", '<div class="modal-footer" ng-transclude></div>');
}]);

/**
 * Created by ChenJianfeng on 2014/6/30 0030.
 */
angular.module('m.kit.dsm', ['ipCookie', 'angularFileUpload']).constant('proxyUrl', location.protocol+"//"+location.host+"/MoticKit/Utils/Proxy?url=")
    .service('mDSM', ['$rootScope','$http', '$q','FileUploader', 'ipCookie','$compile','proxyUrl',function ($rootScope,$http, $q,FileUploader, ipCookie,$compile,proxyUrl) {
      var self=this;
      var _version="";
      var _dsmInfo;
      var _user="";
      var _locale = '';
      var _gurl=location.protocol+"//"+location.host;
      var _wurl=(location.protocol=='http:'?'ws://':'wss://')+location.host;//"ws://med.motic.com:5210";
      var work=true;

      var _attachmentStorage = 6;
      var _slideStorage = 10;
      var _appId = 'MoticGallery';

      var tfIf = document.createElement('iframe');
      tfIf.id = '_tfIf';
      tfIf.name = tfIf.id;
      tfIf.style.display = 'none';
      document.body.appendChild(tfIf);
      //form
      var tfForm = document.createElement('form');
      tfForm.style.display = 'none';
      tfForm.target = tfIf.id;
      tfForm.method = "post";
      tfForm.enctype = 'multipart/form-data';
      document.body.appendChild(tfForm);

      //tgp
      var e_tgp = document.createElement('input');
      e_tgp.type = 'hidden';
      e_tgp.name = 'tgp';
      tfForm.appendChild(e_tgp);

      //filenamealias
      var e_alias = e_tgp.cloneNode(false);
      e_alias.name = 'filenamealias';
      tfForm.appendChild(e_alias);

      //callbackurl
      var e_cburl = e_tgp.cloneNode(false);
      e_cburl.name = 'callbackurl';
      tfForm.appendChild(e_cburl);

      //appid
      var e_appid = e_tgp.cloneNode(false);
      e_appid.name = 'appid';
      e_appid.value = _appId;
      tfForm.appendChild(e_appid);

      //tgservice
      var e_tgservice = e_tgp.cloneNode(false);
      e_tgservice.name = 'tgservice';
      e_tgservice.value = _attachmentStorage;
      tfForm.appendChild(e_tgservice);

      var e_gurl=e_tgp.cloneNode(false);
      e_gurl.name='gurl';
      tfForm.appendChild(e_gurl);

      var slideIf = document.createElement('iframe');
      this.slideIframe = function () {
        return slideIf;
      }

      this.version= function () {
        return _version;
      }

      this.checkSlide= function (paths) {
        if(!self.hasNewVersion(_version,'2.6.4.0')){
          var delay = $q.defer();
          delay.resolve([])
          return delay.promise;
        }
        var ps=[];
        for(var i=0;i<paths.length;i++){
          (function(){
            var delay = $q.defer();
            $http.get(_host + '/UploadService/API/Slide/BaseInfo', {params: {
                p:paths[i]
              }}).then(function (data) {
              delay.resolve(data.data);
            },function (data,status) {
              delay.reject(data.data);
            });
            ps.push(delay.promise);
          })()
        }
        return $q.all(ps);
      }

      this.locale = function (locale) {
        if (locale === undefined) {
          return _locale;
        } else {
          _locale = locale;
        }
      }

      this.user= function (user) {
        if (user === undefined) {
          return _user;
        } else {
          _user = user;
        }
      }

      this.ws_port= function (port) {
        if(isNaN(parseInt(port))) return;
        _wurl=(location.protocol=='http:'?'ws://':'wss://')+location.hostname+':'+port;
      }

      this.g_url= function (url) {
        if (url === undefined) {
          return _gurl;
        } else {
          _gurl = url;
        }
      }

      this.w_url= function (url) {
        if (url === undefined) {
          return _wurl;
        } else {
          _wurl = url;
        }
      }

      //var self = this;
      this.appId = function (appId) {
        if (appId == undefined) {
          return _appId;
        } else {
          _appId = appId;
          e_appid.value = appId;
        }
      };

      this.slideStorage = function (storageId) {
        if (storageId == undefined) {
          return _slideStorage;
        } else {
          _slideStorage = storageId;
        }
      };

      this.attachmentStorage = function (storageId) {
        if (storageId == undefined) {
          return _attachmentStorage;
        } else {
          _attachmentStorage = storageId;
          e_tgservice.value = storageId;
        }
      };

      var _host = cookie('dsmUrl') || location.protocol+"//localhost:8989";
      this.host = function () {
        return _host;
      };

      var _isConnected = false;
      this.isConnected = function () {
        return _isConnected;
      };
      var _pno=''
      this.update_pno= function (pno) {
        _pno=pno;
        updateUrl();
      }
      var _showDialog=true;
      this.showDialog= function (show) {
        if(show===undefined){
          return _showDialog
        }else{
          _showDialog=show;
        }
      }
      var _single=0
      this.update_single= function (val) {
        _single=val;
        updateUrl();
      }

      var _multiple=!!window['FormData'];
      var multiple= function () {
        _multiple= !!window['FormData']//&&self.hasNewVersion(_version,'2.7.0.0')!==false;
      }
      this.multiple= function () {
        return _multiple
      }

      var checkUpdate= function () {
        if(_dsmInfo!=undefined) return;
        $http.jsonp(proxyUrl+encodeURIComponent("https://med.motic.com/MoticGallery/Notice/DSM?cb=JSON_CALLBACK")).then(function (data) {
          data=data.data;
          _dsmInfo=data;
          if(self.hasNewVersion(data.ver,_version)&&cookie("dsmVer")!==data.ver){
            work=!self.hasNewVersion(data.minVer,_version);
            if(_version=="2.6.3.0") work=false;
            if(work&&window.sessionStorage.getItem("showDSMDialog")) {
              return;
            }
            window.sessionStorage.setItem("showDSMDialog", 1);
            var scope = $rootScope.$new(true);
            scope.dsm = _dsmInfo;
            scope.cookie = cookie;
            scope.isUpdate = true;
            scope.work=work;
            if(_showDialog){
              $compile('<div m-dsm-dialog></div>')(scope).appendTo("body");
            }
          }
        })
      }

      function cookie(key,val) {
        if(val==undefined){
          return ipCookie(key)
        }else{
          ipCookie(key, val, {path: '/', expires: 365})
        }
      }

      function updateUrl() {
        if(!_isConnected) return;
        var src=[_host,'/UploadService/Api/Page?f=slidelist.html&lang=',_locale,'&gurl='+encodeURIComponent(_gurl),'&wurl='+encodeURIComponent(_wurl),'&pno=',_pno,"&single=",_single]
        if(_user){
          src.push('&UserId=')
          src.push(_user)
        }
        slideIf.src = src.join('');
      }

      var connectDSM = function (host) {
        if (host === undefined) host = _host;
        var delay = $q.defer();
        $http.get(host + '/UploadService/API/Version', {timeout: 3000}).then(function (data) {
          _isConnected = true;
          data=data.data;
          try{
            data=JSON.parse(data)
          }catch(e){}
          _version=data;
          delay.resolve(data);
          if (_host != host) {
            _host = host;
            cookie('dsmUrl',host)
          }
          tfForm.action = _host + '/UploadService/API/File/Upload';
          updateUrl();
          checkUpdate()
          multiple()
        },function (data, status, headers, config) {
          var ver=cookie('dsmVer');
          if(ver===undefined||ver===""){
            if(!window.sessionStorage.getItem("showDSMDialog")) {
              window.sessionStorage.setItem("showDSMDialog", 1);

              var scope = $rootScope.$new(true);
              scope.dsm = _dsmInfo;
              scope.cookie = cookie;
              scope.work=true;
              if(_showDialog){
                $compile('<div m-dsm-dialog></div>')(scope).appendTo("body");
              }
            }
          }
          delay.reject(data)
        })
        return delay.promise;
      };
      var _success,_error;
      this.registerTestDSMCallback= function (success,error) {
        _success=success;
        _error=error;
      }
      this.testDSM= function (host) {
        connectDSM(host).then(_success,_error);
      }

      var _addSlideTask = function (slide) {
        var delay = $q.defer();
        $http.get(_host + '/UploadService/API/Slide/Upload2', {params: {
            slideId: slide.SlideGuid,
            p: slide.SlidePath,
            categoryid: slide.cId,
            tgservice: _slideStorage,
            appid: _appId,
            uid:_user,
            gurl:_gurl,
            wurl:_wurl,
            callbackurl:slide.callbackurl
          }}).then(function (data) {
          data=data&&data.data;
          if (data&&data.Success)
            delay.resolve(data);
          else
            delay.reject(data&&data.ErrorMsg);
        },function (data,status) {
          data=data&&data.data;
          if(data==undefined&&status==0){
            data="disconnected";
            connectDSM().then(_success,_error);
          }
          delay.reject(data);
        });
        return delay.promise;
      }
      this.addSlideTasks = function (slides) {
        var slidePromises = [];
        angular.forEach(slides, function (slide, key) {
          slidePromises.push(_addSlideTask(slide))
        });
        return $q.all(slidePromises);
      };

      this.deleteSlideTask = function (id) {
        var delay = $q.defer();
        $http.get(_host + '/UploadService/API/Slide/Delete', {params: {slideId: id, appid: _appId, tgservice: -1}}).then(function (data) {
          data=data.data;
          if (data.Success)
            delay.resolve('success');
          else
            delay.resolve(data.ErrorMsg);
        },function (data) {
          delay.resolve(data.data);
        });
        return delay.promise;
      };

      var atcmQueue = [];
      var atcmTimer;
      var uploader=new FileUploader({
        method :"PUT",
        autoUpload:true,
        disableMultipart:true,
        onBeforeUploadItem : function (item) {
          item.url=item._file._url;
        },
        onErrorItem: function (item, response, status, headers) {
          var msg=response.exception + " " +response.message;
          item._file._delay.reject(msg);
        },
        onSuccessItem : function (item, response, status, headers) {
          item._file._delay.resolve();
        }
      });
      var _addAttachmentTask = function () {
        if (atcmQueue.length === 0) return;
        if(_multiple){
          //_h5Upload()
          var appSig=initAppSig($rootScope.vm.token);
          var prefix="/MotiCloud/API/Storages/"+_attachmentStorage+"/"
          for(var i=0;i<atcmQueue.length;i++){
            var task=atcmQueue[i];
            var url=prefix+task.relPath+"/"+task.name;
            url=appSig("PUT",url);
            url=_gurl+url+"&createContainer=true"
            var file=task.file.files[task.idx];
            file._url=url;
            file._delay=task.delay;
            uploader.addToQueue(file)
          }
        }else if(atcmQueue[0].idx>0){
          atcmQueue.shift().delay.reject("NotSupportMultiple")
        }else{
          _formUpload()
        }
      }

      var _formUpload= function () {
        atcmTimer=setTimeout(function () {
          atcmQueue[0].delay.reject("Timeout");
        },20000)
        var childNodes = tfForm.childNodes;
        for (var i = 6; i < childNodes.length; i++) {
          tfForm.removeChild(childNodes[i]);
        }
        e_alias.value = atcmQueue[0].name;
        e_tgp.value = atcmQueue[0].relPath;
        e_cburl.value=atcmQueue[0].callbackurl||"";
        tfForm.appendChild(atcmQueue[0].file);
        tfForm.submit();
      }

      var bufferSize=5*1024*1024;
      var _h5Upload= function () {
        var url=_host + '/UploadService/API/File/Upload'
        var task=atcmQueue[0];
        var file=task.file.files[task.idx];
        var form =new FormData()
        form.append('appid',_appId);
        form.append('tgservice',_attachmentStorage);
        form.append('gurl',_gurl );
        form.append('tgp',task.relPath );
        form.append('filenamealias',task.name );
        form.append('callbackurl',task.callbackurl||"");
        form.append('file',file);

        $.ajax({
          url: url,
          type: 'POST',
          cache: false,
          data: form,
          processData: false,
          contentType: false,
          headers: { "X-Requested-With":"XMLHttpRequest"},
          complete: function ( xhr,textStatus ){
            var delay = atcmQueue.shift().delay;
            if(textStatus!=='success'){
              delay.reject(xhr.responseText)
            }
            var message=JSON.parse(xhr.responseText)
            if (message.Success) {
              delay.resolve()
              _addAttachmentTask()
            } else {
              delay.reject(message.ErrorMsg);
            }
          }
        })
        return;

        var param={
          appid:_appId,
          tgservice:_attachmentStorage,
          gurl:_gurl,
          tgp:task.relPath,
          filenamealias:task.name,
          callbackurl:task.callbackurl||""
        }
        var offset=0;
        var reader=new FileReader();
        reader.onloadend = function (event) {
          var target=event.target;
          if ( target.readyState !== FileReader.DONE ) {
            return;
          }
          offset+=event.loaded;
          upload(target.result,file.size==offset)
        }
        seek();
        function seek(){
          reader.readAsArrayBuffer(file.slice(offset,offset+bufferSize))
        }

        function upload(data,finish){
          param.data=data;
          param.finish=finish;
          $.ajax({
            url:url,
            type:'post',
            dataType: 'json',
            cache: false,
            data:param,
            complete: function ( xhr,textStatus ) {
              if(textStatus=='success'){
                if(finish){
                  atcmQueue.shift().delay.resolve()
                  _addAttachmentTask()
                }else{
                  seek();
                }
              } else {
                atcmQueue.shift().delay.reject(xhr.responseText);
              }
            }
          })
        }
      }

      this.addAttachmentTasks = function (atcms, relPath) {
        atcmQueue.length = 0;
        var promises = [];
        angular.forEach(atcms, function (attachment, key) {
          attachment.delay = $q.defer();
          attachment.relPath = relPath;
          promises.push(attachment.delay.promise);
          atcmQueue.push(attachment);
        });
        e_gurl.value=_gurl;
        _addAttachmentTask();
        return $q.all(promises);
      };

      var _slideCallback = [];
      this.addSlideCallback = function (callback) {
        _slideCallback.push(callback);
      }

      var barcodeParsers={};
      this.regBarcodeParser= function () {
        if(barcodeParsers._init_ext_){
          return;
        }
        barcodeParsers._init_ext_=true;
        $.ajax({
          type:"GET",
          url:location.protocol+"//"+location.host+"/MoticKit/libs/barcode_parser.json",
          dataType:"jsonp",
          //jsonp:"callback",
          jsonpCallback:"cb",
          success:function(data){
            $.extend(barcodeParsers,data);
          }
        });
        /* $http.jsonp(location.protocol+"//"+location.host+"/MoticKit/libs/barcode_parser.json?callback=cb").then(function (rsp) {
             $.extend(barcodeParsers,rsp.data);
             })*/
      }

      this.transferExt=function (slides){
        for(var j=0;j<slides.length;j++){
          var barcodes=slides[j].BarcodeMetadata;
          var map=slides[j].BarcodeMetadata={};
          if(!barcodes){return;}
          for(var i=0;i<barcodes.length;){
            var key=barcodes[i++],value=barcodes[i++];
            var parser=barcodeParsers[key]
            if(parser){
              if(parser.key){
                key=parser.key
              }
              if(typeof parser.parseValue=='function'){
                value=parser.parseValue(value)
              }
            }
            map[key]=value
          }
        }
      }

      var onMessage = function (event) {
        //鐩戝惉postMessage娑堟伅浜嬩欢
        var message;
        try {
          message = JSON.parse(event.data)
        } catch (e) {
          return;
        }

        if (message instanceof Array) {
          self.transferExt(message)
          for (var i in _slideCallback) {
            try {
              _slideCallback[i](message);
            } catch (e) {
              console.error(e.message)
            }
          }
        } else if (atcmQueue.length>0 && message instanceof Object) {
          clearTimeout(atcmTimer);
          //闄勪欢鍥炶皟
          var delay = atcmQueue.shift().delay;
          if (message.Success) {
            delay.resolve()
            _addAttachmentTask()
          } else {
            delay.reject(message.ErrorMsg);
          }
        }
      };

      this.hasNewVersion =function(nVer,oVer) {
        if(!nVer||!oVer) return false;
        if(nVer===oVer) return 0;
        var local=oVer.split(".");
        var server=nVer.split(".");
        for(var i= 0;i<server.length&&i<local.length;i++){
          var l=parseInt(local[i]);
          var s=parseInt(server[i]);
          if(s>l) return true;
          else if(s<l) return false;
        }
        if(server.length>local.length) return true;
        return false;
      };

      (function () {
        if (window.addEventListener) {
          window.addEventListener("message", onMessage, false);
        } else if (window.attachEvent) {
          window.attachEvent("onmessage", onMessage);
        }
      })()
    }])
    .directive('mDsmSlideList', ['mDSM',function (mDSM) {
      return {
        scope: {
          pno: '=pno',
          single:"="
        },
        link: function (scope, elem, attrs) {
          if (attrs.locale) {
            mDSM.locale(attrs.locale)
          }
          elem.append(mDSM.slideIframe());
          if (attrs['mDsmSlideList']) {
            mDSM.addSlideCallback(function (slides) {
              eval(attrs['mDsmSlideList']);
            })
          }
          scope.$watch('pno', function (newValue) {
            mDSM.update_pno(newValue)
          })
          scope.$watch('single', function (newValue) {
            mDSM.update_single(newValue)
          })
          mDSM.regBarcodeParser();
        }
      }
    }])
    .directive('mDsmHost', ['$document','$parse', 'mDSM', function ($document,$parse, mDSM) {
      return {
        templateUrl: '/MoticKit/libs/tmpl/dsm-host.html',
        scope: {
          isConnected: '=mDsmHost',
          multiple:'=?'
        },
        controller: ['$scope', function ($scope) {
          $document.bind('click', function () {
            if ($scope.isConnected&&$scope.editing) {
              $scope.editing = false;
              $scope.$apply();
            }
          });
          $scope.edit = function (evt) {
            $scope.editing = true;
            evt.stopPropagation()
          }
          $scope.connect = function () {
            var newHost = $scope.newHost;
            if (newHost.lastIndexOf("/") == newHost.length - 1) {
              newHost = newHost.substr(0, newHost.length - 1)
            }
            $scope.status = 1;
            /* mDSM.connectDSM('http://' + newHost).then(function () {
                     $scope.status = 0;
                     $scope.isConnected = true;
                     $scope.editing = false;
                     $scope.host = mDSM.host();
                     }, function () {
                     $scope.status = -1;
                     });*/

            mDSM.testDSM($scope.protocol+"//"+newHost);
          }
        }],
        link: function (scope, elem, attrs) {
          if (attrs.user) {
            mDSM.user(attrs.user)
          }
          if (attrs.wsPort) {
            mDSM.ws_port(attrs.wsPort)
          }else if(attrs.wUrl){
            mDSM.w_url(attrs.wUrl)
          }
          if(attrs.gUrl){
            mDSM.g_url(attrs.gUrl)
          }
          if (attrs.appid) {
            mDSM.appId(attrs.appid)
          }
          if (attrs.showDialog) {
            mDSM.showDialog($parse(attrs.showDialog)(scope.$parent))
          }
          var storage;
          if(!isNaN(storage=parseInt(attrs.attachmentStorage))){
            mDSM.attachmentStorage(storage);
          }
          if(!isNaN(storage=parseInt(attrs.slideStorage))){
            mDSM.slideStorage(storage);
          }
          scope.lang=mDSM.locale()
          /*elem.bind('click', function (event) {
                 event.stopPropagation();
                 })*/
          //DSM-Connection
          scope.host = mDSM.host();
          var index=scope.host.indexOf("//");
          scope.newHost = scope.host.substring(index+2);
          scope.ISSL=location.protocol=='https:'
          scope.protocol=scope.host.substring(0,index);
          if(scope.ISSL&&scope.protocol!="https:"){
            scope.protocol="https:"
            scope.host="https:"+scope.host.substring(index)
          }

          mDSM.registerTestDSMCallback(function () {
            scope.status = 0;
            scope.isConnected = true;
            scope.editing = false;
            scope.host = mDSM.host();
            scope.multiple=mDSM.multiple();
          }, function () {
            scope.status = -1;
            scope.editing = true;
            scope.isConnected = false;
          })
          mDSM.testDSM(scope.host);

          $document.bind('click', function () {
            scope.isOpen = false;
            scope.$apply();
          })
        }
      }
    }])
    .directive('mDsmDialog',['mDSM','proxyUrl',function (mDSM,proxyUrl) {
      return {
        templateUrl:proxyUrl+encodeURIComponent("https://med.motic.com/MoticGallery/tmpl/dsm-introduce.html?locale="+(mDSM.locale().startsWith("zh")?"zh_CN":"en")),
        controller: ["$scope",function ($scope) {
          var isShow=true;
          var oldVal=$scope.cookie('dsmVer');
          if(oldVal==undefined) oldVal=""
          $scope.noShow= function (a) {
            isShow=!isShow;
            if(isShow){
              $scope.cookie('dsmVer',oldVal)
            }else{
              $scope.cookie('dsmVer',($scope.dsm&&$scope.dsm.ver)||'0')
            }
          }
        }],
        link: function (scope, elem, attrs) {
          scope.hide= function () {
            elem.children().modal("hide")
          }
          var userAgent = window.navigator.userAgent.toLowerCase();
          var isWinPc=userAgent.indexOf("windows")!=-1&&userAgent.indexOf("phone")==-1;
          if(isWinPc){
            elem.children().modal({"show":true,"backdrop":scope.work?true:'static'})
          }

        }
      }
    }])
/**
 * Created by ChenJianfeng on 2014/6/30 0030.
 */
angular.module('m.kit.img', ['m.kit.utils'])
    .directive('mImgLazy', ['mUtils','$timeout', function (mUtils,$timeout) {
      return {
        restrict: 'A',
        replace: false,
        priority: 99,
        scope: {
          appear:"=?"
        },
        link: function (scope, elem, attrs) {
          elem.attr("data-original", attrs.mImgLazy);
          var param={
            //failurelimit : 10,
            //threshold : 100,
            container:(attrs['container']||window),
            event: "scrollstop",
            load: function () {
              if (attrs['mImgScale'] !== undefined) {
                mUtils.scaleImg(this);
              }
            },
            appear: function () {
              if(!scope.appear){
                $timeout(function () {
                  scope.appear=true;
                })
              }
            }
          }
          if(attrs.placeholder){
            param.placeholder=attrs.placeholder;
          }
          elem.lazyload(param)
          var container=$(param.container);
          if(container.length>0){
            clearTimeout(container[0].timer);
            container[0].timer=setTimeout(function () {
              container.trigger(param.event)
            },100)
          }
        }
      };
    }])
    .directive('mImgScale', ['mUtils', function (mUtils) {
      return {
        restrict: 'A',
        replace: false,
        priority: 100,
        link: function (scope, elem, attrs) {
          if (attrs['mImgLazy'] === undefined) {
            elem.bind("load", function () {
              mUtils.scaleImg(this);
            })
          }
        }
      };
    }]);
/**
 * Created by ChenJianfeng on 2014/6/30 0030.
 */
angular.module('m.kit.msg', [])
    .service('mMessenger', function () {
      var map={};
      this.post = function (option) {
        return cache(option, Messenger().post(option));
      }
      this.error = function (option) {
        if (typeof option === 'object') {
          option.hideAfter = 0;
        } else if (typeof option === 'string') {
          option = {
            hideAfter: 0,
            message: option
          }
        }
        return cache(option, Messenger().error(option));
      }
      this.info = function (option) {
        return cache(option, Messenger().info(option));
      }
      this.hideAll=function(){
        Messenger().hideAll();
      }

      this.hide= function (id) {
        if(map[id]){
          map[id].hide();
        }
      }
      function cache(option,msg){
        if(option.id){
          map[option.id]=msg;
        }
        return msg;
      }
    })
    //.constant('msgCer',{ })

    .service('mIm',['$resource','$http', function ($resource,$http) {
      var baseUrl="/Account/IM/Groups";
      var url=baseUrl+"/:name"
      var res= $resource(url, { name: '@name',id:'@id'},{
        query:{isArray:false},
        updateMember:{method:"PUT",url:url+"/Members"},
        sendMsg:{method:"POST",url:url+"/Messages"},
        deleteMsg:{method:"DELETE",url:url+"/Messages/:id"},
        getMsgStatus:{method:"GET",url:url+"/Messages/:id/Status",isArray:true},
        listContact:{method:"GET",url:baseUrl+"/Contacts",isArray:true},
        getToken:{method:"GET",url:""},
        listNews:{method:"GET",url:baseUrl+"/UnRead",isArray:true},
        listNewest:{method:"GET",url:baseUrl+"/Newest",isArray:true}
      })
      return res;
    }])
    .directive('mImList',['mIm',function (mIm) {
      return {
        restrict: 'A',
        transclude: true,
        scope:true,
        //replace:false,
        template:"<div ng-repeat='group in groups' ng-transclude></div><div ng-if='groups.length==0' class='{{emptyClass}}'>{{empty}}</div><div class='{{loadClass}}' ng-show='loading'></div>",
        controller: ["$scope",'$attrs', function (scope) {
          var loadAll=false;
          scope.loading=false;
          scope.loadCount=0;
          scope.totalCount=0;
          scope.search= function (search,contactId) {
            if(scope.param.search!=search){
              loadAll=false;
              scope.param.search=search;
              scope.loadCount=0;
              scope.param.nextMark=0;
            }
            if(scope.param.contactId!=contactId){
              loadAll=false;
              scope.param.contactId=contactId;
              scope.loadCount=0;
              scope.param.nextMark=0;
            }
            scope.load();
          }
          scope.$on('mIm:search', function (event, data) {
            scope.search(data.search,data.contactId)
          })
          scope.load= function () {
            //mIm.listNews(scope.param)
            if(loadAll||scope.loading) return;
            scope.loading=true;
            mIm.query(scope.param, function (data) {
              if(scope.loadCount==0){
                scope.groups=[];
              }

              scope.loading=false;
              scope.loadCount+=data.msgs.length;
              scope.totalCount=data.totalCount;
              scope.param.nextMark=data.nextMark;
              angular.forEach(data.msgs,function(val,key){
                scope.groups.push(val)
              })
              if(data.msgs.length<scope.param.maxResult){
                loadAll=true;
                scope.totalCount=scope.loadCount;
              }
            });
          }

          this.getUser= function () {
            return scope.user;
          }

        }],
        link: function (scope, element, attr, ctrl) {
          scope.user={
            id:attr.userId,
            name:attr.userName||"我",
            role:attr.role
          }
          var contactId=scope.$eval(attr.contactId);
          if(angular.isArray(contactId)){
            contactId=contactId.join(',')
          }
          scope.empty=attr.empty;
          scope.loadClass=attr.loadClass;
          scope.emptyClass=attr.emptyClass;
          scope.param={
            nextMark:0,
            maxResult:attr.maxResult||10,
            appId:attr.appId,
            userId:attr.userId,
            role:attr.role,
            contactId:contactId
          }
          //scope.load()
        }
      };
    }])
    .directive('mImGroup',['mMessenger',function (mMessenger) {
      return {
        restrict: 'A',
        require:"?^mImList",
        controller: ["$scope",'$attrs','mIm','$timeout', function (scope,attrs,mIm,$timeout) {
          scope.get= function () {
            scope.send.sending=true;
            scope.group=mIm.get({name:scope.groupName,userId:scope.user.id,role:scope.user.role,ext:attrs.ext,notNotify:scope.notNotify}, function () {
              scope.send.sending=false;
              scope.broadcast(scope.group.id)
            })
          }
          scope.broadcast= function (groupId) {
            $(window).trigger('im_del',[groupId,scope.user.id])
          }
          scope.send={
            ing:false,
            msg:"",
            enabled:false,
            voiceCountdown:0
          }
          scope.sendVoice= function (newMsg) {
            scope.sendMsg(newMsg, function () {
              scope.send.voiceCountdown=60;
              countdown();
            })
          }

          function countdown(){
            if(scope.send.voiceCountdown<=0){return;}
            scope.send.voiceCountdown--;
            $timeout(countdown,1000)
          }

          scope.sendMsg= function (newMsg,success) {
            scope.send.sending=true;
            var msg={
              userId:scope.user.id,
              userName:scope.user.name,
              content:newMsg||scope.send.msg
            }
            mIm.sendMsg({name:scope.group.name,userId:msg.userId,userName:msg.userName,role:scope.user.role},msg.content, function (data) {
              scope.send.sending=false;
              if(!newMsg)scope.send.msg="";
              if(!scope.group.messages){
                scope.group.messages=[]
              }
              msg.id=data.id;
              msg.sendTime=new Date().getTime();
              scope.group.messages.unshift(msg)
              if(success){
                success()
              }
            })
          }
          //13
          scope.deleteMsg= function (msg,txt) {
            //if(confirm(txt)){
            mIm.deleteMsg({name:scope.group.name,id:msg.id,role:scope.user.role,userId:scope.user.id}, function () {
              var msgs=scope.group.messages;
              for(var i=0;i<msgs.length;i++){
                if(msgs[i].id==msg.id){
                  scope.group.messages.splice(i,1);
                  //scope.$apply()
                  return;
                }
              }
            });
            //}
          }

          scope.getMsgStatus= function (msg) {
            msg.status=mIm.getMsgStatus({name:scope.group.name,id:(msg.id),role:scope.user.role,userId:scope.user.id}, function (ss) {
              var status='';
              var userName=null;
              for(var i=0;i<ss.length;i++){
                var s=ss[i]
                if(userName!= s.userName){
                  if(i>0){
                    status+="\n"
                  }
                  status+= s.userName+":"
                  userName= s.userName;
                }
                status+= s.channel+" "+ s.status+";"
              }
              scope.$broadcast("mPopover:refresh")
              // msg.status=status;
            })
          }

          scope.locale=attrs.locale||"zh_CN";
          var txt={
            zh_CN:{
              size:"[文件大小超过限制] ",
              ext:"[文件类型不允许] ",
              fail:"[上传失败] "
            },
            en:{
              size:"[Exceeds size limit] ",
              ext:"[File extension not permitted] ",
              fail:"[Upload failed] "
            }
          }
          txt=txt[scope.locale];
          scope.options= {
            //origin: "http://localhost",
            method:"PUT",
            multipart:false,
            responseType:"",
            onSuccess: function (uri,name) {
              //文件消息模板修改，后端发送通知、回调接口要同步修改
              var msg="<div m-msg-file>[file]<a href='"+uri+"'>"+name+"</a></div>"
              scope.sendMsg(msg)
            },
            //cors: true,

            onSizeError: function (filename, fileSize) {
              mMessenger.info( txt.size+filename)
            },
            onExtError: function (filename, extension) {
              mMessenger.info(txt.ext+filename)
            }///|jpg|jpeg|png|gif|bmp|avi|mp4|wmv|rm|rmvb|mpeg|mpg|doc|docx|ppt|pptx|xps|xls|xlsx|dcm|tif|till|rar|zip|7z|gz/
            ,onError:function( filename, errorType, status, statusText, response, btn, size ){
              mMessenger.error(txt.fail+filename+" "+response)
            }
          }

          this.sigFileUrl= function (method,uri) {
            var cert=scope.group.cert;
            var host,path=cert.filePrefix;
            if(path.startsWith("http")){
              var idx=path.indexOf("/",8);
              host=path.substring(0,idx);
              path=path.substring(idx);
            }else{
              host=location.protocol+"//"+location.host;
            }
            uri=path+uri;
            var random=Math.random().toString(36).substr(7);
            var sig= {
              appId:cert.appId,
              se:cert.se,
              random:random,
              sig:mAppSig(cert.token,method,uri,random)
            }
            return host+uri+"?"+ $.param(sig,true);
          }

          this.getFileUri= function (fileName) {
            return "/"+scope.group.id+"/"+encodeURIComponent(getFileName(fileName));
          }
          var random="abcdefghijklmnopqrstuvwxyz0123456789";
          function getFileName(o){
            var newName= Math.random().toString(36).substring(2,12);
            var i = o.lastIndexOf('.');
            if(i>-1){
              newName+=o.substring(i).toLowerCase();
            }
            return newName;

            o= o.toLowerCase();
            var  builder="";
            var index=o.lastIndexOf('.');
            if(index!=-1){
              builder+= o.substring(0,index);
            }else{
              builder+= o;
            }
            builder+="-";
            //builder+="-"+Math.random().toString(34).substring(2,8);
            for (var i = 0; i < 6; i++) {
              builder+=(random[getRandomInt(random.length)]);
            }
            if(index!=-1){
              builder+= o.substring(index)
            }
            return builder;

            function getRandomInt(max) {
              return Math.floor(Math.random() * Math.floor(max));
            }
          }
        }],
        link: function (scope, element, attr, ctrl) {
          if(ctrl){
            scope.user=ctrl.getUser();
            scope.isList=true;
            scope.broadcast(scope.group.id)
          }else{
            var unbind;
            scope.user={
              id:attr.userId,
              name:attr.userName||"我",
              role:attr.role
            }
            scope.voice=attr.voice;
            scope.send.enabled=true;
            scope.$watch(function () {
              return attr.mImGroup
            }, function () {
              scope.groupName=attr.mImGroup;
              scope.get();
              if(unbind) unbind()
              unbind=scope.$on(scope.groupName+":send", function (event, data) {
                scope.sendMsg(data)
              })
            })
          }
          scope.notNotify=attr.notNotify||0;
        }
      };
    }])
    .directive('mTransfer', [function () {
      return {
        require:"?^mImGroup",
        scope:{options:"=mTransfer",prefix:"=?"},
        link: function (scope, elem, attrs, ctrl) {
          var op=scope.options||{};
          var uri="/MoticGallery/Storage"
          var lastUrl;
          var op_tmp={
            debug:true,
            cors:true,
            queue:false,
            noParams:false,
            button:elem,
            method:"POST",
            url:(op.origin||"")+uri+"?module=MSG",
            name:"file",
            maxSize:5*1024,//KB
            responseType:"json",
            allowedExtensions:["txt","log","ini","pdf","jpg","jpeg","png","gif","bmp","avi","mp4","wmv","rm","rmvb","mpeg","mpg","doc","docx","ppt","pptx","xps","xls","xlsx","dcm","tif","till","rar","zip","7z","gz"],
            accept:["text/* ","image/*"," video/*","audio/*","application/pdf","application/zip",".rar",".7z",".gz",".dcm",".doc",".docx",".xls",".xlsx",".ppt",".pptx",".til",".till"]
            ,onSubmit: function ( filename, extension, uploadBtn, fileSize ) {
              if(ctrl){
                lastUrl=ctrl.getFileUri(filename)
                uploader.setOptions({url:ctrl.sigFileUrl("PUT",lastUrl)})
                //uploader.setData(ctrl.sig(op_tmp.method,lastUrl))
              }
            },
            onComplete: function (filename, response, uploadBtn, fileSize) {
              op_tmp.onSuccess(lastUrl,filename)
            },onSuccess: function (uri,name) {

            }
          }

          $.extend( op_tmp, op );
          var uploader=new ss.SimpleUpload(op_tmp)
          /*if(op_tmp.)
                 scope.$on("", function () {
                 uploader.submit()
                 })*/
        }
      }
    }])
    .directive('mMsgContent',['$compile', function ($compile) {
      return {
        require:"?^mImGroup",
        link: function (scope,elem,attrs,ctrl) {
          var content=scope.$eval(attrs.mMsgContent);
          if(content.indexOf("<div m-msg-file>")==0){
            if(angular.version.minor>2){
              content=$compile(content)(scope,undefined,{
                transcludeControllers: {
                  mImGroup:{
                    instance:ctrl
                  }
                }
              })
            }else{
              content=$compile(content)(scope,undefined,{
                mImGroup:ctrl
              })
            }
          }
          elem.append(content)
        }
      }
    }])
    .directive("mMsgFile", ['mFileViewer',function (viewer) {
      return{
        template:'<div class="attachment-min ng-scope" style="float: none;background:white">\
                    <a href="javascript:" ng-click="show()">\
                    <div class="attachment-icon-min {{file.ext}}"></div>\
                    </a>\
                    <div class="attachment-name-min">\
                    <div class="text-over ng-binding" style="font-weight:bold;">{{file.name}}</div>\
                    <em class="ng-binding">{{file.ext}}</em>\
                    </div>\
                    <a href="{{file.url}}&dl=1" target="_blank">\
                    <i class="icon-download-alt"></i>\
                    </a>\
                </div>',
        replace:true,
        transclude: true,
        require:"?^mImGroup",
        scope:{file:"=?mMsgFile"},
        link: function (scope, elem, attrs, ctrl, transclude) {
          if (!scope.file) {
            transclude(scope,function (clone) {
              var a = clone[1];
              scope.file = {
                name: a.innerText,
                url: ctrl.sigFileUrl('GET',a.pathname)
              }
            })
          }
          var file=scope.file, name = file.name;
          file.ext = name.substring(name.lastIndexOf(".") + 1).toLowerCase();
          file.url="//"+location.host+"/MoticKit/XViewer?t="+file.ext+"&url="+encodeURIComponent(file.url)
          scope.show= function () {
            viewer.init("msg_viewer")
            viewer.show("msg_viewer",0,[scope.file])
          }
        }
      }
    }])

    .directive('mPopover',['$compile','$timeout', function ($compile,$timeout) {
      return {
        compile: function compile(tElement, tAttrs, transclude) {
          // store your "transcluded" content of the directive in the variable
          var tmpl = tElement.html();
          // then remove it
          tElement.html(tAttrs.title);
          return function postLink(scope, elem, attrs) {

            var content=$compile(tmpl)(scope);

            elem.tooltipster({
              trigger: 'click',
              content:content,
              contentCloning:false,
              interactive: true,
              onlyOne:true,
              //position:'top-left',
              theme:'tooltipster-shadow',
              offsetY:0,
              updateAnimation:false
            })

            scope.$on("mPopover:refresh",function(){
              $timeout(function(){
                elem.tooltipster("content",content)
              })
            })
          }
        }
      }
    }])
/**
 * Created by ChenJianfeng on 2014/6/30 0030.
 */
angular.module('m.kit.slide', ['m.kit.config'])
//.value('thumbHosts',(typeof(_ThumbnailHosts)=='object'?_ThumbnailHosts:['motic3.blob.core.windows.net', 'blob.med.motic.com']))
    .service("mSlide",['config',function (config) {
      var cloudCP=(window.vm&&vm.cloudUrl)||"/MotiCloud";
      var galleryCP=(window.vm&&vm.galleryUrl)||"/MoticGallery"
      this.getThumbnailUrl = function (slideId) {
        if (typeof slideId !== 'string') return;
        return cloudCP+"/Open/Slides/"+slideId+"/Thumbnail";
      }
      //this.getFullUrl= function (url) {
      //    return hosts[0]+url;
      //}
      this.getSlideUrl= function (id) {
        return galleryCP+"/Slides/"+id;
      }

      this.sort= function (slides,key,idKey) {
        slides.sort( function (a,b) {
          if(!a||!b){return 0}
          var s1,s2;
          if(idKey){
            s1= (a[idKey]||''),s2= (b[idKey]||'');
            if(!s1||!s2){return s1.length>s2.length?-1:(s1.length<s2.length)?1:0}
          }

          s1= (a[key]||''),s2= (b[key]||'');
          if(!s1||!s2){return s1.length>s2.length?-1:(s1.length<s2.length)?1:0}

          var  thisMarker = 0, thisNumericChunk = 0;
          var  thatMarker = 0, thatNumericChunk = 0;
          while ((thisMarker < s1.length) || (thatMarker < s2.length))
          {
            if (thisMarker >= s1.length)
            {
              return -1;
            }
            else if (thatMarker >= s2.length)
            {
              return 1;
            }
            var  thisCh = s1[thisMarker];
            var  thatCh = s2[thatMarker];
            var  thisChunk = '';
            var  thatChunk = '';
            while ((thisMarker < s1.length) && (thisChunk.length==0 ||InChunk(thisCh, thisChunk[0])))
            {
              thisChunk+=thisCh;
              thisMarker++;
              if (thisMarker < s1.length)
              {
                thisCh = s1[thisMarker];
              }
            }
            while ((thatMarker < s2.length) && (thatChunk.length==0 ||InChunk(thatCh, thatChunk[0])))
            {
              thatChunk+=thatCh;
              thatMarker++;
              if (thatMarker < s2.length)
              {
                thatCh = s2[thatMarker];
              }
            }
            var result = 0;
            // If both chunks contain numeric characters, sort them numerically
            if (isDigit(thisChunk[0]) && isDigit(thatChunk[0]))
            {
              thisNumericChunk = parseInt(thisChunk);
              thatNumericChunk = parseInt(thatChunk);
              if (thisNumericChunk < thatNumericChunk)
              {
                result = -1;
              }
              if (thisNumericChunk > thatNumericChunk)
              {
                result = 1;
              }
            }
            else
            {
              result = thisChunk.localeCompare(thatChunk);
            }
            if (result != 0)
            {
              return result;
            }
          }
          return 0;
        })

        function InChunk(char ,otherCh){
          var i1=isDigit(char);
          var i2=isDigit(otherCh);
          return (i1&&i2)||(!i1&&!i2);
        }

        function isDigit(char){
          return "0123456789".indexOf(char)!=-1
        }
      }
    }])
    .filter('mThumbnailUrl', ['mSlide', function (mSlide) {
      return function (text) {
        return mSlide.getThumbnailUrl(text);
      }
    }])
    .filter('mSlideUrl', ['mSlide', function (mSlide) {
      return function (id) {
        return mSlide.getSlideUrl(id);
      }
    }])
    .service('_mTypeAheadAdapter',['config', function (config) {
      var _adapterFactory= function (remoteUrl) {
        var source=new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('desc_zh_CN'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          //prefetch: '../data/films/post_1960.json',
          remote:{
            url:remoteUrl,
            ajax:{
              dataType:'jsonp'
            },
            wildcard:"%QUERY"
            /*,
                     filter: function(list){
                     return $.map(list, function(val) { return { value: val }; });
                     }*/
          }
        });
        return source;
        //source.initialize();
        //return source.ttAdapter();
      }
      var _stain=_adapterFactory(config.galleryUrl+"Dictionaries/Stains?keyword=%QUERY");
      this.stain= function () {
        return _stain;
      }
      var _specimen=_adapterFactory(config.galleryUrl+"Dictionaries/Specimens?keyword=%QUERY");
      this.specimen= function () {
        return _specimen;
      }
    }])
    .directive('mSlideTypeahead',['_mTypeAheadAdapter',function (TypeAheadAdapter) {
      return {
        scope:{
          defaultVal:'=?default'
        },
        require:'?ngModel',
        link: function (scope,elem,attrs,ngCtrl) {
          if(ngCtrl&&!ngCtrl.$modelValue&&scope.defaultVal){
            ngCtrl.$setViewValue(scope.defaultVal)
            ngCtrl.$render()
          }
          var init= function () {
            elem.typeahead({
              highlight: true,
              hint: false
            },{
              name:attrs.mSlideTypeahead,
              displayKey: 'desc_zh_CN',
              source: TypeAheadAdapter[attrs.mSlideTypeahead]()
            }).focus().bind('blur', function () {
              if(this.desc_zh_CN!==''){
                scope.defaultVal=this.value;
                scope.$apply()
              }
            });
            if(ngCtrl){
              elem.bind("typeahead:selected", function (evt, item) {
                ngCtrl.$setViewValue(item.desc_zh_CN);
              })
              if(scope.defaultVal){
                //ngCtrl.$setViewValue(item.desc_zh_CN)
              }
            }
          }
          elem.one('focus',init);
        }
      }
    }])
    .service('mStain',["config",'$http',function (config,$http) {
      var stains={};
      var self=this;
      var conf={
        0:{
          listUrl:config.galleryUrl+"Dictionaries/Stains?category=",
          createUrl:config.galleryUrl+"Dictionaries/Stains/",
          groupOrigin:""
        },
        1:{
          listUrl:"/Account/Dict?category=",
          createUrl:"/Account/Dict/",
          groupOrigin:""
        }
      }
      var _categoryId;
      this.stains=stains;
      this.defaultVal=[];
      this.locale="zh_CN";
      this.init= function (categoryId,origin,groupOrigin){
        _categoryId=parseInt(categoryId);
        if(self.ihcSource){
          return;
        }
        var ver=1;
        if(isNaN(_categoryId)){
          ver=0;
          _categoryId=0
        }
        conf=conf[ver];
        if(ver==1){
          conf.listUrl=(origin||"")+ conf.listUrl;
          conf.createUrl=(origin||"")+ conf.createUrl;
          conf.groupOrigin=groupOrigin||"";
        }
        mLogin('account',null,false,origin)
        init(origin);
      }
      this.getWithSlideName= function (callback) {
        $http.get(conf.listUrl+_categoryId).success(function (data,status) {
          if(callback){
            callback(data);
          }
        }).error(function(data, status) {
          console.error("[GetStainError]-"+status+"-"+(data||"Request failed"))
        })
      }
      this.create= function (name,callback) {
        if(_categoryId){
          $http.post(conf.createUrl,{category:_categoryId,name:name}).success(function (data,status) {
            if(callback){
              callback(data);
            }
          }).error(function(data, status) {
            console.error("[CreateStainError]-"+status+"-"+(data||"Request failed"))
          })
        }else{
          $http.put(conf.createUrl+encodeURIComponent(name)).success(function (data,status) {
            if(callback){
              callback(data);
            }
          }).error(function(data, status) {
            console.error("[CreateStainError]-"+status+"-"+(data||"Request failed"))
          })
        }
      }

      var valKey="name"
      var searchKey="alias"
      function init(origin){
        self.ihcSource=new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace(searchKey),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          sorter: function (a,b) {
            return a[valKey].toUpperCase()>b[valKey].toUpperCase()?1:-1;
          },
          prefetch:{
            url:conf.listUrl+_categoryId,
            //cache:false,
            ttl:3600000,
            cacheKey:"stains_"+_categoryId,
            thumbprint:localStorage.getItem("_stains_hash_"+_categoryId),
            transform: function (rsp) {
              var key='name_'+self.locale;
              for(var i=0;i<rsp.length;i++){
                var item=rsp[i];
                if(item[valKey]){
                  break;
                }
                rsp[i]={name:item[key],alias:item['alias']}
              }
              return rsp;
            },
            transport: function (o, onSuccess, onError) {
              mLogin("account", function () {
                o.xhrFields={
                  withCredentials: true
                }
                $.ajax(o).fail(onError).done(onSuccess)
              },false,origin)
            }
          }
        });

      }

      var _groupSource;
      this.groupSource= function () {
        if(!_groupSource){
          _groupSource= new Bloodhound({
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace(searchKey),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            sorter: function (a,b) {
              var key=valKey+"_"+self.locale;
              return a[key]>b[key]?1:-1;
            },
            prefetch:{
              url:conf.groupOrigin+'/MoticLab/Dictionaries/IHC/Groups',
              //cache:false,
              cacheKey:"stain_groups",
              thumbprint:localStorage.getItem("stain_groups_hash")
            }
            /* remote:{
                     url:remoteUrl,
                     ajax:{
                     dataType:'jsonp'
                     },
                     wildcard:"%QUERY"
                     /!*,
                     filter: function(list){
                     return $.map(list, function(val) { return { value: val }; });
                     }*!/
                     }*/
          });
        }
        return _groupSource;
      };
      this.getSearchKey= function () {
        return searchKey;
      }
      var showGroup=localStorage.getItem("ihc_ShowGroup");
      this.showGroup= function (isShow) {
        if(isShow==undefined){
          return showGroup==null||showGroup
        }else{
          showGroup=!!isShow;
          localStorage.setItem("ihc_ShowGroup",isShow)
        }
      }
    }])
    .service('mDict',["config",'$http',function (config,$http) {
      var sources={};
      this.get= function (category,locale,origin) {
        var source=sources[category];
        if(!source){
          source=sources[category]=createSource(category,locale,origin)
        }
        return source;
      }

      this.updateFilter= function (category,filter) {
        var source=sources[category];
        if(source){
          source.filter(filter)
        }
      }

      var conf={
        searchKey:"alias",
        valKey:"name",
        listUrl:"/Account/Dict?category=",
        createUrl:"/Account/Dict/"
      }

      function createSource(category,locale,origin){
        var appKey="m_dict_"+category,appHash=appKey+"_hash";
        var valKey=conf.valKey+"_"+locale;
        var url=(origin||"")+conf.listUrl+category;
        var _filter=null;
        var source= new Bloodhound({
          initialize:false,
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace(conf.searchKey),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          /*sorter: function (a,b) {
                    return a[valKey].toUpperCase()>b[valKey].toUpperCase()?1:-1;
                },*/
          prefetch:{
            url:url,
            cache:false,
            ttl:3600000,
            cacheKey:appKey,
            thumbprint:appHash,
            transform: function (rsp) {
              /*var key='name_'+self.locale;
                         for(var i=0;i<rsp.length;i++){
                         var item=rsp[i];
                         if(item[valKey]){
                         break;
                         }
                         rsp[i]={name:item[key],alias:item['alias']}
                         }*/
              return rsp;
            },
            transport: function (o, onSuccess, onError) {
              mLogin("account", function () {
                o.xhrFields={
                  withCredentials: true
                }
                $.ajax(o).fail(onError).done(onSuccess)
              },false,origin)
            }
          }
        });
        source.filter= function (filter) {
          if(filter===_filter){return}
          _filter=filter;
          var prefetch=source.prefetch;
          prefetch.url=url;
          if(filter){
            prefetch.url+="&filter="+encodeURIComponent(filter)
          }
          source.initialize(true)
        }
        source.create= function (name,callback) {
          var url=(origin||"")+conf.createUrl;
          if(_filter){
            url+="?filter="+encodeURIComponent(_filter)
          }
          $http.post(url,{category:category,name:name,filter:_filter}).success(function (data,status) {
            if(callback){
              callback(data);
            }
          }).error(function(data, status) {
            console.error("[CreateDictError]-"+status+"-"+(data||"Request failed"))
          })
        }

        source.keys={
          app:appKey,
          hash:appHash,
          val:valKey,
          alias:conf.searchKey
        }

        return source
      }

    }])
    .directive('mDictInput',["mDict",function (mDict) {
      return{
        scope: {
          model: '=mDictInput',
          defaultVal:'=?default',
          filter:"=?"
        },
        link: function(scope, element, attrs) {
          element.val(scope.model||scope.defaultVal)
          scope.$watch('model', function (nv,ov) {
            if(nv!==element.val()||nv!==ov){
              element.typeahead('val',nv);
              element.val(nv);
            }
          })

          var category=attrs.category || "";
          var origin=attrs.origin || ""
          var locale = attrs.locale || "zh_CN",lang = {
            zh_CN: {
              add_tip: "新建项目",
              title:"项目"
            },
            en: {
              add_tip: "add item",
              title:"item"
            }
          };
          lang = lang[locale] || lang['zh_CN'];
          var source=mDict.get(category,locale,origin)
          scope.$watch("filter", function (nv,ov) {
            if(nv||(nv==undefined&&ov==undefined)){
              source.filter(nv||attrs.filter);
            }
          })

          element.one('focus',init)
          function init() {
            var maxChars = 50;
            var valKey=source.keys.val,alias=source.keys.alias;

            var btnAdd="<div class='btn-group add'><a class='btn btn-xs btn-primary' title='"+lang.add_tip+"'>✚</a> <a class='btn btn-xs btn-primary query disabled'></a></div>"
            btnAdd=$(btnAdd);
            var ihcHeader=$("<div class='tt-dataset-header'>"+lang.title+"</div>")
            btnAdd.find("a:first").bind("click", function () {
              var val=element.val()
              var item={}
              item[valKey]=val
              item[alias]=val
              source.add(item)
              source.create(val, function (id) {
                item.id=id;
                localStorage.setItem(source.keys.hash,new Date().getTime())
              })
              element.typeahead('val','');
              element.typeahead('val',val);
              element.typeahead('close');
            })

            element.typeahead({
              hint: false,
              highlight: true,
              minLength: 0
            },{
              name: source.keys.app,
              displayKey:valKey,
              async:false,
              limit:500,
              //source:source,
              source: function (q,sync,a_sync) {
                if(q===''){
                  var vals=[],datums=source.index.datums;
                  for(var key in datums){
                    if(vals.push(datums[key])>=this.limit){
                      break;
                    }
                  }
                  sync(source.sorter(vals))
                  return;
                }
                source.search(q,sync)
              },
              //source:mStain.ihcSource,
              templates:{
                notFound: function (obj) {
                  return getHeader(obj,true)
                },
                header: function (obj) {
                  return getHeader(obj)
                }
                //"<h4 class='tt-dataset-header'>项目<button class='btn btn-xs btn-primary'>+ CD100</button></h4>",
              }
            }).bind("input propertychange typeahead:select", function (){
              scope.model=this.value;
              scope.$apply()
            }).bind("blur", function () {
              if(this.value){
                scope.defaultVal=this.value;
              }
            }).focus()

            function getHeader(obj,showAddBtn){
              var query= normalizeInput(obj.query);
              var isEmpty= query==='';
              if(!obj.suggestions&&isEmpty){
                return "";
              }
              if(!showAddBtn&&!isEmpty){
                showAddBtn=true;
                var separate=' ';
                var sug=obj.suggestions;
                var query_up=query.toUpperCase();
                for(var i=0;i< sug.length;i++){
                  var sVal=sug[i][alias].toUpperCase();
                  if(sVal==query_up){
                    showAddBtn=false;
                    break;
                  }
                  var index=sVal.indexOf(query_up)
                  if(index>0&&sVal[0]!=separate){
                    continue;
                  }
                  var endIndex=index+query_up.length;
                  if(endIndex<sVal.length&&sVal[endIndex]!=separate){
                    continue
                  }
                  showAddBtn=false;
                  break;
                }
              }

              var nHeader=ihcHeader.clone();
              if(showAddBtn){
                btnAdd.clone(true).appendTo(nHeader).find(".query").text(query)
              }

              return nHeader;
            }
            function normalizeInput(val){
              val= $.trim(val);
              return val.length>maxChars?val.substring(0,maxChars):val;
            }
          }
        }
      }
    }])
    .directive("mStainInput",['$parse',"mStain",function ($parse,mStain) {
      return{
        scope: {
          model: '=mStainInput'
        },
        link: function(scope, element, attrs) {
          var maxChars=50,maxTags=attrs.max;
          var enableDefault=attrs.default==="true";
          var defGroup= ($parse(attrs.defaultGroup)(scope))||"default";
          var enableGroup=attrs.group==="true";
          var locale=attrs.locale||"zh_CN";
          var className=attrs.tagClass||"label label-primary";
          var i_open=attrs.opened||"arrow";
          var i_close=attrs.closed||"arrow";
          var placeholder=attrs.placeholder;
          var autoPlaceholder=!(attrs.autoPlaceholder==='false');
          var ihc=attrs.ihc?getIhc(attrs.ihc):false;
          var lang={
            zh_CN:{
              item:"项目",
              group:"套餐",
              add_tip:"新建项目"
            },
            en:{
              item:"Item",
              group:"Group",
              add_tip:"add item"
            }
          };
          lang=lang[locale]||lang['zh_CN'];

          mStain.locale=locale;
          mStain.init(attrs.category,attrs.origin,attrs.groupOrigin)
          var select = element;

          var btnAdd="<div class='btn-group add'><a class='btn btn-xs btn-primary' title='"+lang.add_tip+"'>✚</a> <a class='btn btn-xs btn-primary query disabled'></a></div>"
          btnAdd=$(btnAdd);
          btnAdd.find("a:first").bind("click", function () {
            localStorage.setItem("_stains_hash",new Date().getTime())
            var $input = select.tagsinput('input');
            var val=$input.typeahead('val');

            select.tagsinput('add', val);
            mStain.create(val);
            mStain.ihcSource.add({name:val,alias:val});
            $input.typeahead('val',"")
          })

          var sources=[{
            name: 'stains_ihc',
            displayKey:"name",
            async:false,
            limit:8,
            source: function (q,sync,a_sync) {
              if(q===''){
                if(ihc){
                  q=ihc
                }else{
                  var vals=[],source=mStain.ihcSource,datums=source.index.datums;
                  for(var key in datums){
                    if(vals.push(datums[key])>=this.limit){
                      break;
                    }
                  }
                  sync(source.sorter(vals))
                  return;
                }
              }
              mStain.ihcSource.search(q,sync)
            },
            //source:mStain.ihcSource,
            templates:{
              notFound: function (obj) {
                return getIhcHeader(obj,true)
              },
              header: function (obj) {
                return getIhcHeader(obj)
              }
              //"<h4 class='tt-dataset-header'>项目<button class='btn btn-xs btn-primary'>+ CD100</button></h4>",
            }
          }]
          if(enableGroup){
            var header=$("<div class='tt-dataset-header'><span>"+lang.group+"</span><i class='closed "+i_close+"'></i><i class='opened "+i_open+"'></i></div>").bind("click", function () {
              mStain.showGroup(!mStain.showGroup())
              scope.$apply()
            })
            sources.push({
              name: 'stains_group',
              displayKey: "name_"+locale,
              source: mStain.groupSource(),
              templates:{
                header: function () {
                  return header.clone(true);
                }
              }
            })
            scope.$watch(function () {
              return mStain.showGroup();
            }, function (nv,ov) {
              if(nv){
                select.tagsinput('input').parent().removeClass("unexpanded")
              }else{
                select.tagsinput('input').parent().addClass("unexpanded")
              }
            })
          }

          var isInner=false;

          //初始化
          select.tagsinput({
            tagClass:className,
            confirmKeys:[],
            maxTags:maxTags,
            maxChars: maxChars,
            delimiterRegex:/[,|，|、]/,
            allowDuplicates:true,
            itemValue: function (item) {
              return item;
            },
            typeaheadjs: [{
              minLength:0,//ihc? 0:1,
              highlight: true
            }, sources]
          });

          select.bind('beforeItemAdd', function (evt) {
            if(typeof evt.item!="string"){
              evt.cancel=true;
              if(evt.item.items){//套餐
                var items=evt.item.items.split(",");
                for(var i=0;i<items.length;i++){
                  select.tagsinput('add', items[i]);
                }
              }else if(evt.item.name){//单项
                select.tagsinput('add', evt.item.name);
              }
            }
          }).on('itemAdded', function(event) {
            if(event.options){
              return;
            }
            isInner=true
            scope.model.push(event.item);
            scope.$apply()
          }).on('itemRemoved', function(event) {
            isInner=true
            scope.model=select.tagsinput('items').slice()
            scope.$apply()
          }).tagsinput('input').bind("keyup", function (e) {
            if((e.keyCode!=13&&e.keyCode!=188&& e.keyCode!=220)||!this.value){
              return;
            }
            select.tagsinput('add', normalizeInput(this.value));
            this.value=""
            return false;
          }).bind('typeahead:idle', function () {
            var $input=$(this),val= $input.typeahead('val');
            if(!val)return;
            mStain.ihcSource.search(val, function (res) {
              val= $.trim(val).toUpperCase();
              for(var i=0;i<res.length;i++){
                if(val==res[i].name.toUpperCase()){
                  select.tagsinput('add', val);
                  $input.typeahead('val',"")
                  return;
                }
              }
              $input[0].style.textDecoration="line-through"
            })

          }).bind('typeahead:active', function () {
            this.style.textDecoration=""
          })

          if(element[0].disabled||attrs.unedit==='true'){
            select.tagsinput('input').typeahead('destroy').css("width",0)[0].disabled=true;
            select.siblings(".bootstrap-tagsinput").addClass("disabled")
            select.bind('beforeItemRemove', function (evt){
              evt.cancel=true;
            })
          }
          if(enableDefault){
            var timer
            if(!mStain.defaultVals){
              mStain.defaultVals={}
            }
            select.tagsinput('input').bind('typeahead:idle', function () {
              timer= setTimeout(function () {
                mStain.defaultVals[defGroup]=scope.model.slice()
                scope.$apply()
              },200)
            }).bind('typeahead:active', function () {
              clearTimeout(timer)
            })
            if(!angular.isArray(scope.model)){
              scope.model=[];
            }
            if(scope.model.length==0){
              if(mStain.defaultVals[defGroup]&&mStain.defaultVals[defGroup].length>0){
                scope.model=mStain.defaultVals[defGroup].slice()
              }else{
                var isInit=true;
                var cancel=scope.$watchCollection(function () {
                  return mStain.defaultVals[defGroup];
                }, function (nv,ov) {
                  if(isInit){
                    isInit=false;
                    return
                  }
                  cancel()
                  if(scope.model.length==0){
                    scope.model=nv.slice();
                  }
                })
              }
            }
          }
          scope.$watch("model", function(nv,ov) {
            var nl=len(nv)
            if(autoPlaceholder&&placeholder){
              var ol=len(ov);
              if((nl>1&&ol==0)||(nv===ov&&nl>0)){
                select.tagsinput('input').removeAttr("placeholder")
              }else if(ol>0&&nl==0){
                select.tagsinput('input').attr("placeholder",placeholder)
              }
            }

            //根据名称判断
            if(ihc&&nl>0){
              ihc=false;
              select.tagsinput('input').typeahead('val',"|").typeahead('val',"")
            }

            if(isInner){
              isInner=false;
              return;
            }

            if (angular.isArray(nv)){
              select.tagsinput('removeAll');
              for (var i = 0; i < nv.length; i++) {
                select.tagsinput('add', nv[i],true);
              }
            }else{
              isInner=true;
              scope.model=[];
            }
          }, true);

          function normalizeInput(val){
            val= $.trim(val);
            return val.length>maxChars?val.substring(0,maxChars):val;
          }

          function len(array){
            return angular.isArray(array)?array.length:0;
          }

          function getIhc(name){
            var space=name.match(/^(.*)[\s]([^\s]+)/)//空格
            if(space){
              name=space[space.length-1]
            }
            var bracket=name.match(/(?=[\(|（])(.+?)(?=[\)|）])/g);
            if(bracket){
              name=bracket[bracket.length-1].substring(1);
            }else if(!space){
              var minus=name.match(/^(.*)[-|_]([^-|^_]+)/)
              if(minus){
                name=minus[minus.length-1]
              }
            }
            return name;
          }

          var ihcHeader=$("<div class='tt-dataset-header'>"+lang.item+"</div>")
          function getIhcHeader(obj,showAddBtn){
            var query= normalizeInput(obj.query);
            var isEmpty= query==='';
            if(!obj.suggestions&&isEmpty){
              return "";
            }
            if(!showAddBtn&&!isEmpty){
              showAddBtn=true;
              var separate=' ';
              var sug=obj.suggestions;
              var query_up=query.toUpperCase();
              var searchKey=mStain.getSearchKey();
              for(var i=0;i< sug.length;i++){
                var sVal=sug[i][searchKey].toUpperCase();
                if(sVal==query_up){
                  showAddBtn=false;
                  break;
                }
                var index=sVal.indexOf(query_up)
                if(index>0&&sVal[0]!=separate){
                  continue;
                }
                var endIndex=index+query_up.length;
                if(endIndex<sVal.length&&sVal[endIndex]!=separate){
                  continue
                }
                showAddBtn=false;
                break;
              }
            }

            var nHeader=ihcHeader.clone();
            if(showAddBtn){
              btnAdd.clone(true).appendTo(nHeader).find(".query").text(query)
            }

            return nHeader;
          }
        }
      }
    }])
/**
 * Created by ChenJianfeng on 2014/6/30 0030.
 */
angular.module('m.kit.sso', [])

    .run(['$rootScope','mLogin', function ($rootScope,mLogin) {
      $rootScope.$watch('showLogin', function () {
        if($rootScope.showLogin===true){
          mLogin.show();
        }
      })
    }])

    .factory('SessionExpired',['$rootScope','$q',function ($rootScope,$q) {
      return {
        'request': function (config) {
          config.headers["X-Requested-With"]="XMLHttpRequest";
          return config;
        },
        responseError: function (rejection) {
          if(rejection.status==401){
            $rootScope.showLogin=true;
          }
          return $q.reject(rejection);
        }
      }
    }])

    .filter('mAvatar',['mUser', function (mUser) {
      return function (text) {
        return mUser.avatar(text);
      }
    }])

    .service('mUser',['$http','mLogin',function($http,mLogin) {
      //mLogin.origin("https://172.16.160.98")
      var adapters={};
      var self=this;
      function url(){
        return mLogin.origin()+'/Account/Search';
      }
      this.adapter= function () {
        var serviceUrl=url()
        return adapters[serviceUrl]||(adapters[serviceUrl]=adapterFactory(serviceUrl))
      }
      function adapterFactory (remoteUrl){
        return new Bloodhound({
          datumTokenizer: Bloodhound.tokenizers.obj.whitespace('Name'),
          queryTokenizer: Bloodhound.tokenizers.whitespace,
          //prefetch: '../data/films/post_1960.json',
          identify: function(obj) { return obj.Id; },
          remote: {
            url:remoteUrl+'?q=%QUERY',//'/Account/Search?q=%QUERY'//
            ajax:{
              dataType:'jsonp'
            },
            wildcard:"%QUERY"
          }
        });
      };
      this.get= function (ids,callback) {
        var adapter=self.adapter();
        var users=adapter.get(ids)
        if(users.length==ids.length){
          callback(users)
          return
        }

        var q=[],idm={},offset=0
        for(var i=0;i<ids.length;i++){
          var id=ids[i]
          idm[id]=i
          if(i+offset>users.length-1||id!=users[i+offset].Id){
            q.push(id)
            offset--;
          }
        }
        $http({method: 'GET', url: url(),params:{id:q}}).
        success(function(data, status) {
          var newUsers=[];
          for(var i=0;i<users.length;i++){
            var user=users[i];
            newUsers[idm[user.Id]]=user
          }
          for(var i=0;i<data.length;i++){
            var user=data[i]
            newUsers[idm[user.Id]]=user
            adapter.add(user)
          }
          callback(newUsers)
        })
      }
      this.avatar= function (id) {
        if(id&&id.length==36){
          return mLogin.origin()+'/Account/Users/'+id+"/Avatar"
        }else{
          return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAO4AAADuBAMAAADMwCYRAAAAJ1BMVEX////MzMzs7Oze3t7Pz8/V1dX09PTZ2dnS0tLk5OTv7+/o6Ojh4eFIhY8HAAAEiElEQVR42u3cOW8TQRQH8IchhgQKnj2ODaFYAuKQKIw4xNGwIEBCFFmuBgqDoDcSIAoKtqGiCBJQG0FBQQHiaoOQ+FykCH4k1u7seub914H59dHTzvHmzRFTEARBEASBRe3gkWWn9xHU52u8ovMkIpS3Kf/tVo8QZo7yGp1F0jed8gjziLRNxyzEFVIkYUfdIE0zCWfpkqLDnMkozqf3nKNJWqY51zNScp8FsKW3sMUO0lBP2aZPCt6xVZv8m4mZ0R8sn4v/4JgZ/sEymOFDOuFiPpJXG7mgS+TVJy6oozyqMOvhFBc2Rx694MKMQjOjG3ozl7CTvLnNJbSwSUNE3pYiLmUB2r2iodC90A4+zOX0FGYvcAZv5ZLOKAwrYObYxBZKO5bdXFIHO5yFSpaEFVlcWheancWCxq4XNYE3cmnboTWdaFQUd4dOusIkrA3rJ267orgthSoHFnf3fxZ3Q4g7qfO3uZ7z5Bjrwhy0fBaN9bzuj2xTQHVOnUtbgG4HRVenbgedcPzgsqDHDKJV0T50F/TsWcyqHF/hDrBSLmcRfwosJ8H4gdUEXGpYhhU0U/apmoPCHql1MOi+fRuLgosvfgYvkT9vHBYF0Ey6QD6l0CQp7rIoutWHFpVPSQBTh5GkAT10v0S+JfhRJQ8Lqngpk0I/V0zBP1eeQVXyEGojdjCLl9AnFGIm1d8FijvzUaGWPjvcMM/Pk6sPD2NmM/ySvfnljbyxPH+aHExfWxmow4uoo5mdG63J5J1TNK79UkT0/rRhxmQyw4zxhf+4TON5xeIySeDcsFMs2mMtTgdG3t1mNnVr2A/bYtci4F7mLPke82rPh99VX7NqXXZ/cNwZyJv6E8zi/C/Kbosb7sm4SaL289pKC1/9lvtu13x0Wm0lMYj5ZT1rAt/hutjaN3q1OOOPXIsLk5uB64l7YZty8cCWjMJdD7WUOZ7ZyImlCHGsLG7SapIvMkVetrvnBjTqq3VD7L7rNCMLzdYHfnamMee7+HpVzx5ji663ze75k9HKKD70mK12+ryINNeXJT6PAFL2bVHhnYi3I55N7F3T++Gcx914zP71HWaRi9ni3Yvu4B+swGC7VyyVOKiCzuApVtGwX8qpaGOHlcAuCmLRdrmtZMFWWinZDh3OYs72KEZJ2/b/PkoMdvEVvUqmkW0isZo+dFUQZ6DFhpiFTl8xB52+omnZCWppWV4uqKkmbeQnjoT1fIQWk6JbSbrKXflrrOgptNoQ26FpUsxC06RoVBR3FzQ9i2ZFcVvFTq7+mbgd7HIkCi5HIa6jqNjyG+Ku07hLFcXtgssre1z+W4gb4oa4Ie4Ex02YxT8TN7K8J9ASTVxd94kVGegljmhB7yRF0/K4WstO6NW+OFPROVJ/As/rFCeSgV6yi12ANyOWYQWs3GU1Ap9wmIruJRv45wzSzPiG7gBeQVlGM7LmMAMSwDXpUkXvrwbFXlz79tThV49dKw18S5vI4VetHcJ2qahaAg0r6kfZi/K/7f45ZXdj/Zb9noeuE+r6ycHY/3s0PgqCIAiCifcbvBne2drPRyIAAAAASUVORK5CYII='
        }
      }
    }])
    .directive('mUserSearch', ['mUser','mLogin',function(mUser,mLogin) {
      return {
        scope: {
          id: '=mUserSearch'
        },
        require:'?ngModel',
        link: function (scope, elem, attrs,ngCtrl) {
          var isNG=!!ngCtrl,isSelect=false,txt;
          if(attrs.origin!==undefined){
            mLogin.origin(attrs.origin);
          }
          elem.typeahead({
            highlight: true,
            hint: false
          }, {
            name: 'sso-search',
            displayKey: 'Name',
            source: mUser.adapter()
          }).bind("typeahead:selected", selectItem).typeahead('input').bind('typeahead:idle', function () {
            var $input=$(this),val=$input.typeahead('val');
            if(!val) return;
            setTimeout(function () {
              if(!isSelect){
                mUser.adapter().search(val, function (a) {
                }, function (res) {
                  if(res.length==1){
                    selectItem(null,res[0])
                    return
                  }
                  $input[0].style.textDecoration="line-through"
                })
              }
            },1)
          }).bind('typeahead:active', function () {
            this.style.textDecoration=""
          });

          function selectItem (evt, item) {
            if (attrs.mUserSearch) {
              scope.$apply(function () {
                scope.id = item.Id;
              })
            }
            if(isNG){
              scope.$apply(function () {
                ngCtrl.$setViewValue(item.Name);
              })
            }
            elem.attr("data-id", item.Id);
            txt=item.Name;
            elem.typeahead('input').typeahead('val',txt)
            isSelect=true;
          }

          if(isNG){
            ngCtrl.$viewChangeListeners.push(removeValue)
          }else{
            elem.bind('change',removeValue)
          }
          function removeValue(){
            if(isSelect&&txt!==this.value){
              isSelect=false;
              elem.removeAttr("data-id");
              if(scope.id!==undefined) scope.id=undefined;
            }
          }
        }
      }
    }])

    .directive('mAvatar',['mUser',function (mUser) {
      return{
        template:'<div class="avatar"><div><img ng-src="{{src}}" class="{{avatar_class}}"></div></div>',
        replace:true,
        link: function (scope,elem,attrs) {
          scope.avatar_class=attrs["avatarClass"]
          scope.src=mUser.avatar('default');
          angular.element("<img/>").bind("load", function () {
            scope.src=this.src;
            scope.$apply()
          }).attr("src",mUser.avatar(attrs.mAvatar))

          var size=parseInt(attrs.size);
          if(!isNaN(size)){
            elem.find(".avatar").css({width:attrs.size+'px',height:attrs.size+'px'})
                .find('img').css({'max-width':(size-2)+'px','max-height':(size-2)+'px'})
          }
        }
      }
    }])


    .service('mLogin',['$rootScope',function ($rootScope) {
      var dig=angular.element('<div class="modal fade" data-backdrop="static">\
                                <div class="modal-dialog">\
                                    <div class="modal-content">\
                                        <div class="modal-body">\
                                           <iframe style="width: 100%;min-height: 490px; border: 0;"></iframe>\
                                        </div>\
                                    </div>\
                                </div>\
                            </div>');
      document.body.appendChild(dig[0]);
      var iframe=dig.find('iframe').bind("load", function () {
        var isLogin=false;
        try{
          isLogin=this.contentWindow.location.href.indexOf('/SSO/')==-1//==location.origin;
        }catch(e){}

        if(isLogin){
          dig.modal('hide')
          $rootScope.showLogin=false;
        }
      });

      var url;
      this.setPath= function (path) {
        url=location.origin+path;
      };
      var _origin=location.protocol+"//"+location.host;//https://med.motic.com";
      this.origin= function (org) {
        if(org==undefined){
          return _origin;
        }else{
          _origin=org;
        }
      }
      this.show= function () {
        if(url!==undefined){
          dig.modal('show')
          var src=_origin+"/SSO/login?back="+encodeURIComponent(url)+"&_="+new Date().getTime();
          iframe.attr("src",src);
        }
      };
    }])

/**
 * Created by ChenJianfeng on 2014/6/26 0026.
 */
angular.module('m.kit.utils', ['m.kit.utils.service', 'm.kit.utils.directive', 'm.kit.utils.filter']);
angular.module('m.kit.utils.service', [])
    .service("mIP", ['$http', '$q', '$cacheFactory', function ($http, $q, $cacheFactory) {
      var supportLocalStorage = !!window.localStorage;
      var ramCache = $cacheFactory('ipCache');
      this.query = function (ip) {
        var ipInfo = ramCache.get(ip);
        //RamCache
        if (ipInfo) return ipInfo;

        var delay = $q.defer();
        ipInfo=delay.promise;
        ramCache.put(ip, ipInfo);

        var ipStr;
        //LocalStorageCache
        if (supportLocalStorage && (ipStr = localStorage.getItem(ip))) {
          var i=JSON.parse(ipStr);
          if(i.timestamp<new Date().getTime()+30*24*3600*1000){
            delay.resolve(i);
            return ipInfo;
          }else{
            delay.notify(i);
          }
        }

        $http.get('https://med.motic.com/MoticKit/Utils/IP?ip=' + ip).success(function (data) {
          if (supportLocalStorage) {
            data.timestamp=new Date().getTime();
            localStorage[ip] = JSON.stringify(data);
          }
          delay.resolve(data);
        }).error(function (data) {
          delay.reject('[Failed]' + data);
        });

        /* $http.jsonp('http://ip.blueera.net/api?callback=JSON_CALLBACK&ip=' + ip).success(function (data) {
                if (data.code === 0 && data.country) {
                    if (supportLocalStorage) {
                        data.timestamp=new Date().getTime();
                        localStorage[ip] = JSON.stringify(data);
                    }
                    delay.resolve(data);
                } else {
                    delay.reject(data);
                }
            }).error(function (data) {
                delay.reject('[Failed]' + data);
            });*/

        return ipInfo;
      }
    }])
    .service('mUtils', function () {
      this.objectToArray = function (obj) {
        var arr = [];
        for (var i in obj) {
          if (obj.hasOwnProperty(i)) {
            arr.push(obj[i]);
          }
        }
        return arr;
      };
      this.scaleImg = function (img, size, imgp) {
        if (!size) {
          size = img.parentNode.offsetWidth;
        }
        if (!imgp) {
          imgp = 0.7;
        }
        var nh = img.naturalHeight || img.height, nw = img.naturalWidth || img.width, w, h;
        img.parentNode.style.textAlign='center'
        var ratio;
        if (nw < size && nh < size) {
          //img.style.marginLeft = (size - nw) / 2 / size*100 + "%";
          img.style.marginTop = (size - nh) / 2 / size*100+ "%"
        } else if (nw < nh) {
          if ((ratio = nw / nh) < imgp) {
            h = size / imgp;
            w = h * ratio;
            img.style.width = w/size*100 + "%";
            var left=(size - w) / 2/size*100
            if(left<0){
              img.style.marginLeft = left + "%"
            }
          } else {
            h = size / ratio;
            w = h * ratio;
            img.style.width = w/size*100 + "%";
          }
          img.style.marginTop = (size - h) / 2 /size*100+ "%"
        } else {
          if ((ratio = nh / nw) < imgp) {
            w = size / imgp;
            h = w * ratio;
            img.style.width = w/size*100 + "%";
            img.style.marginTop = (size - h) / 2/size*100 + "%"
          } else {
            w = size / ratio;
            img.style.width =w/size*100+ "%";
          }
          var left=(size - w) / 2/size*100
          if(left<0){
            img.style.marginLeft = left + "%"
          }
        }
      }
      this.getFileExtension = function (fileName) {
        return fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase();
      }
    })
    .service('mUnitConverter', function () {
      var capacity = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
      var self = this;
      this.capacity = function (byteCount, fixedNum, index) {
        if(!byteCount){return 0}
        if (index === undefined) index = 0;
        if (fixedNum === undefined) fixedNum = 1;
        if (byteCount < 1024) {
          return byteCount.toFixed(fixedNum) + capacity[index];
        }
        return self.capacity(byteCount / 1024, fixedNum, ++index);
      }
      this.networkSpeed = function (byteCount, fixedNum, unit) {
        return self.capacity(byteCount, fixedNum) + '/s';
      }
      this.percent = function (percent, fixedNum) {
        if (percent === undefined) {
          return;
        }
        if (fixedNum === undefined) fixedNum = 1;
        return (percent * 100).toFixed(fixedNum) + '%';
      }
    })
    .service('mModalBackdrop', ['$compile', '$timeout', '$rootScope', '$document', function ($compile, $timeout, $rootScope, $document) {
      var modalOpen = 'modal-open';
      var scope = $rootScope.$new(true);
      var modalBack = $compile('<div modal-backdrop></div>')(scope);
      var _option, _self = this;
      $document.bind('keydown', function (evt) {
        if (evt.which === 27&&_option&&_option.close) {
          _self.hide();
          $rootScope.$apply();
        }
      })
      var body = $document.find('body').append(modalBack);

      this.show = function (option) {
        body.addClass(modalOpen);
        scope.animate = false;
        scope.show = true;
        $timeout(function () {
          scope.animate = true;
        })
        _option = option;
      }

      this.hide = function () {
        scope.show = false;
        body.removeClass(modalOpen);
        _option.close();
        _option = null;
      }
    }]).service('mFileViewer',['$compile','$rootScope','$timeout',function ($compile,$rootScope,$timeout) {
  var map={};
  this.init= function (name,option) {
    name=name||"public";
    if(map[name]) return;
    var scope=$rootScope.$new();
    scope.option={}
    angular.extend(scope.option,option)
    var elem=$compile('<div class="modal fade fileViewer" m-file-viewer v-files="files" v-index="index" v-url="{{opton.url}}" v-title="{{opton.name}}" set-fn1="dirShowHideTitle(theFn)" tabindex="-1" role="dialog" aria-hidden="true"></div>')(scope)
    scope.elem=elem.modal().appendTo("body");
    map[name]=scope;
  }
  this.show=function(name,index,files){
    var scope=map[name||"public"];
    if(files){
      scope.files=files;
      scope.index=undefined;
      $timeout(function () {
        scope.index=0
      })
    }
    if(index){
      $timeout(function () {
        scope.index=index
      },1)
    }
    scope.elem.modal('show')
  }
}]).service('mConf',[function () {
  this.get= function (key, def) {
    var val=localStorage.getItem(key);
    if(val==null){
      return def;
    }
    try{
      return JSON.parse(val)
    }catch(e){
      return val;
    }
  }
  this.set=function(key,val){
    if(typeof  val=='object'){
      val=JSON.stringify(val)
    }
    localStorage.setItem(key,val);
  }
}])
    .service('mQueryParam',[function () {
      var urlParam=new URLSearchParams(window.location.search)
      this.get= function (key, def) {
        var val=urlParam.get(key)
        if(val==null){
          return def;
        }
        return val;
      }
      this.forEach=function(callback){
        urlParam.forEach(callback);
      }
    }]);

angular.module('m.kit.utils.filter', ['m.kit.utils.service'])
    .filter('mLocalDate', function () {
      return function (text) {
        if (text === undefined) {
          return;
        }
        return new Date(text).toLocaleDateString();
      }
    })
    .filter('mLocalDateTime', function () {
      return function (text) {
        if (text === undefined) {
          return;
        }
        return new Date(text).toLocaleString();
      }
    })
    .filter('mCapacity', ['mUnitConverter', function (mUnitConverter) {
      return function (text) {
        if (text === undefined) {
          return;
        }
        return mUnitConverter.capacity(text);
      }
    }])
    .filter('mNetworkSpeed', ['mUnitConverter', function (mUnitConverter) {
      return function (text) {
        if (text === undefined) {
          return;
        }
        return mUnitConverter.networkSpeed(text);
      }
    }])
    .filter('mPercent', ['mUnitConverter', function (mUnitConverter) {
      return function (text) {
        if (text === undefined) {
          return;
        }
        return mUnitConverter.percent(text);
      }
    }])
    .filter('mSecToHour',[function(){
      var format= function (num) {
        return num<10?'0'+num:num;
      }
      return function (text) {
        if(text>0&&text!=Infinity){
          var date=new Date(text*1000);
          return [format(date.getHours()+date.getTimezoneOffset()/60),format(date.getMinutes()),format(date.getSeconds())].join(':');
        }
      }
    }])
    .filter('mFileExtension', ['mUtils', function (mUtils) {
      return function (fileName) {
        if(fileName===undefined) return;
        return mUtils.getFileExtension(fileName);
      }
    }])
    .filter('mEncodeUri', function () {
      return function (text) {
        return encodeURIComponent(text);
      }
    })
    .filter('mHtml', function($sce) {
      return function(val) {
        return $sce.trustAsHtml(val);
      }})
    .filter("mSig",[function(){
      return function(url,cer){
        var clone= $.extend({},cer);
        delete clone.token
        delete clone.url
        if(clone.addits){
          delete clone.addits;
          clone.addit=[];
          for(var key in cer.addits){
            clone[key]=cer.addits[key]
            clone.addit.push(key)
          }
        }
        //clone.random = (Math.random() * 1000).toFixed(0);
        clone.random=(new Date().getTime()/100).toFixed(0);
        var idx=url.indexOf("?");
        var uri=idx==-1?url:url.substring(0,idx);
        clone.sig = mAppSig(cer.token,"GET",uri,clone.random);
        url+=idx!==-1?"&":"?";
        url=(cer.url||"")+url+ $.param(clone,true)
        return url;

      }
    }]);

angular.module('m.kit.utils.directive',['template/modal/backdrop.tmpl'])
    .directive('mScrollTop', ['$document', function ($document) {
      return {
        restrict: 'A',
        replace: false,
        //priority: 100,
        link: function (scope, elem, attrs) {
          if (attrs['mScrollTop'] === 'true') {
            setTimeout(function () {
              var offset=parseInt(attrs.offset);
              offset=isNaN(offset)?-15:offset;
              var top = elem.offset().top-offset;
              if ($document.animate) {
                $document.find('html,body').animate({scrollTop: top}, 400);
              } else {
                window.scrollTo(0, top);
              }
            }, 100)
          }
        }
      };
    }])
    .directive('modalBackdrop', [function ($timeout) {
      return {
        replace: true,
        templateUrl: 'template/modal/backdrop.tmpl'
      };
    }])
    .directive('mPageScroll', ['$timeout','$parse', function (timeout,$parse) {
      return{
        link: function (scope, element, attr) {
          var loadFun=$parse(attr.mPageScroll,null,true)(scope)
          var reverse=attr.dir=='reverse'
          var lengthThreshold = parseInt(attr.threshold)||50;
          var timeThreshold = 400;
          var lastRemaining = 9999;
          var bottom=0
          var promise = timeout(function () {
            loadFun()
            promise = null;
          },50);
          var $container,container,isWin;
          scope.$watch(function () {
            return attr.pageScrollContainer;
          }, function (nv, ov) {
            $container&&$container.unbind("scroll");
            isWin=nv=="window";
            $container =isWin?angular.element(window):(nv?angular.element(nv):element.parent());
            $container.bind('scroll', function () {
              var scrollTop=isWin?(angular.element(window).scrollTop()):container.scrollTop;
              var remaining =container.scrollHeight - (clientHeight() + scrollTop);
              if(reverse){
                bottom=remaining;
                remaining=scrollTop;
              }
              //if we have reached the threshold and we scroll down
              if (remaining < lengthThreshold && (remaining - lastRemaining) < 0) {
                //if there is already a timer running which has no expired yet we have to cancel it and restart the timer
                if (promise !== null) {
                  timeout.cancel(promise);
                }
                promise = timeout(function () {
                  loadFun()
                  //scope.load()
                  promise = null;
                }, timeThreshold);
              }
              lastRemaining = remaining;
            })
            container=isWin?document.body:$container[0];
          })

          function clientHeight(){
            return isWin?window.innerHeight:container.clientHeight;
          }

          //container.style.overflowY='auto'
          var watchExp=attr.pageScrollCollection
          var isFull=true;
          var collection;
          scope.$watchCollection(watchExp, function (nv) {
            if(!nv||nv.length==0){
              bottom=0;
              isFull=false;
              return;
            }
            if(collection!==nv){
              if(isWin){
                angular.element(window).scrollTop(0)
              }else{
                container.scrollTop=0;
              }
              collection=nv;
            }
            if(reverse){
              timeout(function () {
                container.scrollTop=container.scrollHeight-clientHeight()-bottom
              })
            }

            if(!isFull){
              timeout(function () {
                if(container.scrollHeight > clientHeight()){
                  isFull=true;
                  return;
                }
                loadFun()
                //scope.load()
                //ctrl.pipe();
              })
            }
          })

          scope.$on("$destroy", function () {
            $container.unbind('scroll')
          })
        }
      };
    }])
    .directive('mSelect2', ['$parse','$timeout',function ($parse,$timeout) {
      return {
        //transclude:true,
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
          //var loadFun=$parse(attr.change,null,true)(scope)
          $timeout(function(){
            element.addClass("select2-single").select2({
              theme: "bootstrap",
              width:"auto",
              placeholder: attr.placeholder,
              dropdownAutoWidth:false,
              minimumResultsForSearch:-1,
              //maximumSelectionSize: 6,
              containerCssClass: ":all:"
            })
          },10)

          ngModel.$formatters.push(function (value) {
            $timeout(function(){
              element.trigger("change");
            })
            return value;
          })
        }
      };
    }]);

angular.module("template/modal/backdrop.tmpl", []).run(["$templateCache", function ($templateCache) {
  $templateCache.put("template/modal/backdrop.tmpl",
      "<div class=\"modal-backdrop fade \"\n" +
      "     ng-class=\"{in: animate}\" ng-show=\"show\"\n" +
      "     style=\"z-index:1039\"\n" +
      "></div>\n");
}]);
/**
 * Created by ChenJianfeng on 2014/6/26 0026.
 */
if (typeof Array.prototype.indexOf != "function") {
  Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
      if (this[i] == val) {
        return i;
      }
    }
    return -1;
  };
}
if (typeof Array.prototype.sum != "function") {
  Array.prototype.sum = function (field) {
    var sum=0;
    for (var i = 0,l=this.length; i < l; i++) {
      sum+=this[i][field];
    }
    return sum;
  };
}
if (!Function.prototype.bind)
  Function.prototype.bind = function (context) {
    var args = Array.prototype.slice.call(arguments, 1);
    var me = this; // the function being called
    return function () {
      return me.apply(context, new Array(args, arguments));
    }
  }
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(searchString, position) {
    position = position || 0;
    return this.indexOf(searchString, position) === position;
  };
}
if (!String.prototype.endWith) {
  String.prototype.endWith = function (str) {
    if (str == null || str == "" || this.length == 0 || str.length > this.length)  return false;
    return (this.substring(this.length - str.length) == str);
  }
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = String.prototype.endWith
}

angular.module('mKit', ['m.kit.utils', 'm.kit.dsm', 'm.kit.img', 'm.kit.msg', 'm.kit.slide', 'm.kit.attachment',
  'm.kit.sso', 'm.kit.auto-height','m.kit.bootstrap','infinite-scroll','DelegateEvents'])
    .run(function(){
      angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 250)
    });
angular.module('m.kit.config', [])
    .constant("config", {
      partner:'Motic',
      galleryUrl: "/MoticGallery/"
    })

angular.module('m.kit.auto-height', [])
    .service('_mAutoHeightService', ['$window', function ($window) {
      var items = [];
      angular.element($window).bind('resize', function () {
        for (var i in items) {
          items[i]();
        }
      })
      this.add = function (item) {
        items.push(item);
      }
    }])
    .directive('mAutoHeight', ['_mAutoHeightService', function (_mAutoHeightService) {
      return {
        require: '?ngModel',
        link: function (scope, elem, attrs, ngModel) {
          var isFocus = false;
          elem.css({overflow:'hidden',resize:'none'});
          var resize = function () {
            var element = elem[0];
            element.style.height = "1px";
            element.style.height = ((element.scrollHeight || 39) + (isFocus ? 20 : 2)) + "px";
          }

          elem.bind('focus', function () {
            isFocus = true;
            resize();
          })
          /*.bind('blur', function () {
                    isFocus = false;
                    resize();
                });*/
          if (ngModel == undefined) {
            elem.bind('keyup', resize)
          } else {
            ngModel.$formatters.push(function (value) {
              setTimeout(resize, 0);
              return value;
            })
            ngModel.$viewChangeListeners.push(function () {
              resize()
            })
          }
          _mAutoHeightService.add(resize);
        }
      }
    }]);

/* ng-infinite-scroll - v1.1.2 - 2014-07-16 */
var mod;

mod = angular.module('infinite-scroll', []);

mod.value('THROTTLE_MILLISECONDS', null);

mod.directive('infiniteScroll', [
  '$rootScope', '$window', '$timeout', 'THROTTLE_MILLISECONDS', function($rootScope, $window, $timeout, THROTTLE_MILLISECONDS) {
    return {
      scope: {
        infiniteScroll: '&',
        infiniteScrollContainer: '=',
        infiniteScrollDistance: '=',
        infiniteScrollDisabled: '=',
        infiniteScrollUseDocumentBottom: '='
      },
      link: function(scope, elem, attrs) {
        var changeContainer, checkWhenEnabled, container, handleInfiniteScrollContainer, handleInfiniteScrollDisabled, handleInfiniteScrollDistance, handleInfiniteScrollUseDocumentBottom, handler, immediateCheck, scrollDistance, scrollEnabled, throttle, useDocumentBottom;
        $window = angular.element($window);
        scrollDistance = null;
        scrollEnabled = null;
        checkWhenEnabled = null;
        container = null;
        immediateCheck = true;
        useDocumentBottom = false;
        handler = function() {
          var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
          if (container === $window) {
            containerBottom = $(container).height() + $(container).scrollTop();
            elementBottom = $(elem).offset().top + $(elem).height();
          } else {
            containerBottom = container.height();
            containerTopOffset = 0;
            if (container.offset() !== void 0) {
              containerTopOffset = container.offset().top;
            }
            elementBottom = elem.offset().top - containerTopOffset + elem.height();
          }
          if (useDocumentBottom) {
            elementBottom = $(document).height();
          }
          remaining = elementBottom - containerBottom;
          shouldScroll = remaining <= $(container).height() * scrollDistance + 1;
          if (shouldScroll) {
            checkWhenEnabled = true;
            if (scrollEnabled) {
              if (scope.$$phase || $rootScope.$$phase) {
                return scope.infiniteScroll();
              } else {
                return scope.$apply(scope.infiniteScroll);
              }
            }
          } else {
            return checkWhenEnabled = false;
          }
        };
        throttle = function(func, wait) {
          var later, previous, timeout;
          timeout = null;
          previous = 0;
          later = function() {
            var context;
            previous = new Date().getTime();
            $timeout.cancel(timeout);
            timeout = null;
            func.call();
            return context = null;
          };
          return function() {
            var now, remaining;
            now = new Date().getTime();
            remaining = wait - (now - previous);
            if (remaining <= 0) {
              clearTimeout(timeout);
              $timeout.cancel(timeout);
              timeout = null;
              previous = now;
              return func.call();
            } else {
              if (!timeout) {
                return timeout = $timeout(later, remaining);
              }
            }
          };
        };
        if (THROTTLE_MILLISECONDS != null) {
          handler = throttle(handler, THROTTLE_MILLISECONDS);
        }
        scope.$on('$destroy', function() {
          return container.off('scroll', handler);
        });
        handleInfiniteScrollDistance = function(v) {
          return scrollDistance = parseInt(v, 10) || 0;
        };
        scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);
        handleInfiniteScrollDistance(scope.infiniteScrollDistance);
        handleInfiniteScrollDisabled = function(v) {
          scrollEnabled = !v;
          if (scrollEnabled && checkWhenEnabled) {
            checkWhenEnabled = false;
            return handler();
          }
        };
        scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);
        handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);
        handleInfiniteScrollUseDocumentBottom = function(v) {
          return useDocumentBottom = v;
        };
        scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);
        handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);
        changeContainer = function(newContainer) {
          if (container != null) {
            container.off('scroll', handler);
          }
          container = typeof newContainer.last === 'function' && newContainer !== $window ? newContainer.last() : newContainer;
          if (newContainer != null) {
            return container.on('scroll', handler);
          }
        };
        changeContainer($window);
        handleInfiniteScrollContainer = function(newContainer) {
          if ((!(newContainer != null)) || newContainer.length === 0) {
            return;
          }
          newContainer = angular.element(newContainer);
          if (newContainer != null) {
            return changeContainer(newContainer);
          } else {
            throw new Exception("invalid infinite-scroll-container attribute.");
          }
        };
        scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);
        handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);
        if (attrs.infiniteScrollParent != null) {
          changeContainer(angular.element(elem.parent()));
        }
        if (attrs.infiniteScrollImmediateCheck != null) {
          immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
        }
        return $timeout((function() {
          if (immediateCheck) {
            return handler();
          }
        }), 0);
      }
    };
  }
]);
