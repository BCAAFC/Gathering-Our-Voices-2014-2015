(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        module.exports = global.document ? factory(global, true) : function(w) {
            if (!w.document) {
                throw new Error("jQuery requires a window with a document");
            }
            return factory(w);
        };
    } else {
        factory(global);
    }
})(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
    var deletedIds = [];
    var slice = deletedIds.slice;
    var concat = deletedIds.concat;
    var push = deletedIds.push;
    var indexOf = deletedIds.indexOf;
    var class2type = {};
    var toString = class2type.toString;
    var hasOwn = class2type.hasOwnProperty;
    var support = {};
    var version = "1.11.1", jQuery = function(selector, context) {
        return new jQuery.fn.init(selector, context);
    }, rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, rmsPrefix = /^-ms-/, rdashAlpha = /-([\da-z])/gi, fcamelCase = function(all, letter) {
        return letter.toUpperCase();
    };
    jQuery.fn = jQuery.prototype = {
        jquery: version,
        constructor: jQuery,
        selector: "",
        length: 0,
        toArray: function() {
            return slice.call(this);
        },
        get: function(num) {
            return num != null ? num < 0 ? this[num + this.length] : this[num] : slice.call(this);
        },
        pushStack: function(elems) {
            var ret = jQuery.merge(this.constructor(), elems);
            ret.prevObject = this;
            ret.context = this.context;
            return ret;
        },
        each: function(callback, args) {
            return jQuery.each(this, callback, args);
        },
        map: function(callback) {
            return this.pushStack(jQuery.map(this, function(elem, i) {
                return callback.call(elem, i, elem);
            }));
        },
        slice: function() {
            return this.pushStack(slice.apply(this, arguments));
        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(i) {
            var len = this.length, j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [ this[j] ] : []);
        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        push: push,
        sort: deletedIds.sort,
        splice: deletedIds.splice
    };
    jQuery.extend = jQuery.fn.extend = function() {
        var src, copyIsArray, copy, name, options, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;
        if (typeof target === "boolean") {
            deep = target;
            target = arguments[i] || {};
            i++;
        }
        if (typeof target !== "object" && !jQuery.isFunction(target)) {
            target = {};
        }
        if (i === length) {
            target = this;
            i--;
        }
        for (;i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (deep && copy && (jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && jQuery.isArray(src) ? src : [];
                        } else {
                            clone = src && jQuery.isPlainObject(src) ? src : {};
                        }
                        target[name] = jQuery.extend(deep, clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    };
    jQuery.extend({
        expando: "jQuery" + (version + Math.random()).replace(/\D/g, ""),
        isReady: true,
        error: function(msg) {
            throw new Error(msg);
        },
        noop: function() {},
        isFunction: function(obj) {
            return jQuery.type(obj) === "function";
        },
        isArray: Array.isArray || function(obj) {
            return jQuery.type(obj) === "array";
        },
        isWindow: function(obj) {
            return obj != null && obj == obj.window;
        },
        isNumeric: function(obj) {
            return !jQuery.isArray(obj) && obj - parseFloat(obj) >= 0;
        },
        isEmptyObject: function(obj) {
            var name;
            for (name in obj) {
                return false;
            }
            return true;
        },
        isPlainObject: function(obj) {
            var key;
            if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
                return false;
            }
            try {
                if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
                    return false;
                }
            } catch (e) {
                return false;
            }
            if (support.ownLast) {
                for (key in obj) {
                    return hasOwn.call(obj, key);
                }
            }
            for (key in obj) {}
            return key === undefined || hasOwn.call(obj, key);
        },
        type: function(obj) {
            if (obj == null) {
                return obj + "";
            }
            return typeof obj === "object" || typeof obj === "function" ? class2type[toString.call(obj)] || "object" : typeof obj;
        },
        globalEval: function(data) {
            if (data && jQuery.trim(data)) {
                (window.execScript || function(data) {
                    window["eval"].call(window, data);
                })(data);
            }
        },
        camelCase: function(string) {
            return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
        },
        nodeName: function(elem, name) {
            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
        },
        each: function(obj, callback, args) {
            var value, i = 0, length = obj.length, isArray = isArraylike(obj);
            if (args) {
                if (isArray) {
                    for (;i < length; i++) {
                        value = callback.apply(obj[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.apply(obj[i], args);
                        if (value === false) {
                            break;
                        }
                    }
                }
            } else {
                if (isArray) {
                    for (;i < length; i++) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                } else {
                    for (i in obj) {
                        value = callback.call(obj[i], i, obj[i]);
                        if (value === false) {
                            break;
                        }
                    }
                }
            }
            return obj;
        },
        trim: function(text) {
            return text == null ? "" : (text + "").replace(rtrim, "");
        },
        makeArray: function(arr, results) {
            var ret = results || [];
            if (arr != null) {
                if (isArraylike(Object(arr))) {
                    jQuery.merge(ret, typeof arr === "string" ? [ arr ] : arr);
                } else {
                    push.call(ret, arr);
                }
            }
            return ret;
        },
        inArray: function(elem, arr, i) {
            var len;
            if (arr) {
                if (indexOf) {
                    return indexOf.call(arr, elem, i);
                }
                len = arr.length;
                i = i ? i < 0 ? Math.max(0, len + i) : i : 0;
                for (;i < len; i++) {
                    if (i in arr && arr[i] === elem) {
                        return i;
                    }
                }
            }
            return -1;
        },
        merge: function(first, second) {
            var len = +second.length, j = 0, i = first.length;
            while (j < len) {
                first[i++] = second[j++];
            }
            if (len !== len) {
                while (second[j] !== undefined) {
                    first[i++] = second[j++];
                }
            }
            first.length = i;
            return first;
        },
        grep: function(elems, callback, invert) {
            var callbackInverse, matches = [], i = 0, length = elems.length, callbackExpect = !invert;
            for (;i < length; i++) {
                callbackInverse = !callback(elems[i], i);
                if (callbackInverse !== callbackExpect) {
                    matches.push(elems[i]);
                }
            }
            return matches;
        },
        map: function(elems, callback, arg) {
            var value, i = 0, length = elems.length, isArray = isArraylike(elems), ret = [];
            if (isArray) {
                for (;i < length; i++) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            } else {
                for (i in elems) {
                    value = callback(elems[i], i, arg);
                    if (value != null) {
                        ret.push(value);
                    }
                }
            }
            return concat.apply([], ret);
        },
        guid: 1,
        proxy: function(fn, context) {
            var args, proxy, tmp;
            if (typeof context === "string") {
                tmp = fn[context];
                context = fn;
                fn = tmp;
            }
            if (!jQuery.isFunction(fn)) {
                return undefined;
            }
            args = slice.call(arguments, 2);
            proxy = function() {
                return fn.apply(context || this, args.concat(slice.call(arguments)));
            };
            proxy.guid = fn.guid = fn.guid || jQuery.guid++;
            return proxy;
        },
        now: function() {
            return +new Date();
        },
        support: support
    });
    jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
        class2type["[object " + name + "]"] = name.toLowerCase();
    });
    function isArraylike(obj) {
        var length = obj.length, type = jQuery.type(obj);
        if (type === "function" || jQuery.isWindow(obj)) {
            return false;
        }
        if (obj.nodeType === 1 && length) {
            return true;
        }
        return type === "array" || length === 0 || typeof length === "number" && length > 0 && length - 1 in obj;
    }
    var Sizzle = function(window) {
        var i, support, Expr, getText, isXML, tokenize, compile, select, outermostContext, sortInput, hasDuplicate, setDocument, document, docElem, documentIsHTML, rbuggyQSA, rbuggyMatches, matches, contains, expando = "sizzle" + -new Date(), preferredDoc = window.document, dirruns = 0, done = 0, classCache = createCache(), tokenCache = createCache(), compilerCache = createCache(), sortOrder = function(a, b) {
            if (a === b) {
                hasDuplicate = true;
            }
            return 0;
        }, strundefined = typeof undefined, MAX_NEGATIVE = 1 << 31, hasOwn = {}.hasOwnProperty, arr = [], pop = arr.pop, push_native = arr.push, push = arr.push, slice = arr.slice, indexOf = arr.indexOf || function(elem) {
            var i = 0, len = this.length;
            for (;i < len; i++) {
                if (this[i] === elem) {
                    return i;
                }
            }
            return -1;
        }, booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped", whitespace = "[\\x20\\t\\r\\n\\f]", characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+", identifier = characterEncoding.replace("w", "w#"), attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace + "*([*^$|!~]?=)" + whitespace + "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace + "*\\]", pseudos = ":(" + characterEncoding + ")(?:\\((" + "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" + "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" + ".*" + ")\\)|)", rtrim = new RegExp("^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"), rcomma = new RegExp("^" + whitespace + "*," + whitespace + "*"), rcombinators = new RegExp("^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"), rattributeQuotes = new RegExp("=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"), rpseudo = new RegExp(pseudos), ridentifier = new RegExp("^" + identifier + "$"), matchExpr = {
            ID: new RegExp("^#(" + characterEncoding + ")"),
            CLASS: new RegExp("^\\.(" + characterEncoding + ")"),
            TAG: new RegExp("^(" + characterEncoding.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + attributes),
            PSEUDO: new RegExp("^" + pseudos),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + booleans + ")$", "i"),
            needsContext: new RegExp("^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i")
        }, rinputs = /^(?:input|select|textarea|button)$/i, rheader = /^h\d$/i, rnative = /^[^{]+\{\s*\[native \w/, rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/, rsibling = /[+~]/, rescape = /'|\\/g, runescape = new RegExp("\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"), funescape = function(_, escaped, escapedWhitespace) {
            var high = "0x" + escaped - 65536;
            return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
        };
        try {
            push.apply(arr = slice.call(preferredDoc.childNodes), preferredDoc.childNodes);
            arr[preferredDoc.childNodes.length].nodeType;
        } catch (e) {
            push = {
                apply: arr.length ? function(target, els) {
                    push_native.apply(target, slice.call(els));
                } : function(target, els) {
                    var j = target.length, i = 0;
                    while (target[j++] = els[i++]) {}
                    target.length = j - 1;
                }
            };
        }
        function Sizzle(selector, context, results, seed) {
            var match, elem, m, nodeType, i, groups, old, nid, newContext, newSelector;
            if ((context ? context.ownerDocument || context : preferredDoc) !== document) {
                setDocument(context);
            }
            context = context || document;
            results = results || [];
            if (!selector || typeof selector !== "string") {
                return results;
            }
            if ((nodeType = context.nodeType) !== 1 && nodeType !== 9) {
                return [];
            }
            if (documentIsHTML && !seed) {
                if (match = rquickExpr.exec(selector)) {
                    if (m = match[1]) {
                        if (nodeType === 9) {
                            elem = context.getElementById(m);
                            if (elem && elem.parentNode) {
                                if (elem.id === m) {
                                    results.push(elem);
                                    return results;
                                }
                            } else {
                                return results;
                            }
                        } else {
                            if (context.ownerDocument && (elem = context.ownerDocument.getElementById(m)) && contains(context, elem) && elem.id === m) {
                                results.push(elem);
                                return results;
                            }
                        }
                    } else if (match[2]) {
                        push.apply(results, context.getElementsByTagName(selector));
                        return results;
                    } else if ((m = match[3]) && support.getElementsByClassName && context.getElementsByClassName) {
                        push.apply(results, context.getElementsByClassName(m));
                        return results;
                    }
                }
                if (support.qsa && (!rbuggyQSA || !rbuggyQSA.test(selector))) {
                    nid = old = expando;
                    newContext = context;
                    newSelector = nodeType === 9 && selector;
                    if (nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
                        groups = tokenize(selector);
                        if (old = context.getAttribute("id")) {
                            nid = old.replace(rescape, "\\$&");
                        } else {
                            context.setAttribute("id", nid);
                        }
                        nid = "[id='" + nid + "'] ";
                        i = groups.length;
                        while (i--) {
                            groups[i] = nid + toSelector(groups[i]);
                        }
                        newContext = rsibling.test(selector) && testContext(context.parentNode) || context;
                        newSelector = groups.join(",");
                    }
                    if (newSelector) {
                        try {
                            push.apply(results, newContext.querySelectorAll(newSelector));
                            return results;
                        } catch (qsaError) {} finally {
                            if (!old) {
                                context.removeAttribute("id");
                            }
                        }
                    }
                }
            }
            return select(selector.replace(rtrim, "$1"), context, results, seed);
        }
        function createCache() {
            var keys = [];
            function cache(key, value) {
                if (keys.push(key + " ") > Expr.cacheLength) {
                    delete cache[keys.shift()];
                }
                return cache[key + " "] = value;
            }
            return cache;
        }
        function markFunction(fn) {
            fn[expando] = true;
            return fn;
        }
        function assert(fn) {
            var div = document.createElement("div");
            try {
                return !!fn(div);
            } catch (e) {
                return false;
            } finally {
                if (div.parentNode) {
                    div.parentNode.removeChild(div);
                }
                div = null;
            }
        }
        function addHandle(attrs, handler) {
            var arr = attrs.split("|"), i = attrs.length;
            while (i--) {
                Expr.attrHandle[arr[i]] = handler;
            }
        }
        function siblingCheck(a, b) {
            var cur = b && a, diff = cur && a.nodeType === 1 && b.nodeType === 1 && (~b.sourceIndex || MAX_NEGATIVE) - (~a.sourceIndex || MAX_NEGATIVE);
            if (diff) {
                return diff;
            }
            if (cur) {
                while (cur = cur.nextSibling) {
                    if (cur === b) {
                        return -1;
                    }
                }
            }
            return a ? 1 : -1;
        }
        function createInputPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return name === "input" && elem.type === type;
            };
        }
        function createButtonPseudo(type) {
            return function(elem) {
                var name = elem.nodeName.toLowerCase();
                return (name === "input" || name === "button") && elem.type === type;
            };
        }
        function createPositionalPseudo(fn) {
            return markFunction(function(argument) {
                argument = +argument;
                return markFunction(function(seed, matches) {
                    var j, matchIndexes = fn([], seed.length, argument), i = matchIndexes.length;
                    while (i--) {
                        if (seed[j = matchIndexes[i]]) {
                            seed[j] = !(matches[j] = seed[j]);
                        }
                    }
                });
            });
        }
        function testContext(context) {
            return context && typeof context.getElementsByTagName !== strundefined && context;
        }
        support = Sizzle.support = {};
        isXML = Sizzle.isXML = function(elem) {
            var documentElement = elem && (elem.ownerDocument || elem).documentElement;
            return documentElement ? documentElement.nodeName !== "HTML" : false;
        };
        setDocument = Sizzle.setDocument = function(node) {
            var hasCompare, doc = node ? node.ownerDocument || node : preferredDoc, parent = doc.defaultView;
            if (doc === document || doc.nodeType !== 9 || !doc.documentElement) {
                return document;
            }
            document = doc;
            docElem = doc.documentElement;
            documentIsHTML = !isXML(doc);
            if (parent && parent !== parent.top) {
                if (parent.addEventListener) {
                    parent.addEventListener("unload", function() {
                        setDocument();
                    }, false);
                } else if (parent.attachEvent) {
                    parent.attachEvent("onunload", function() {
                        setDocument();
                    });
                }
            }
            support.attributes = assert(function(div) {
                div.className = "i";
                return !div.getAttribute("className");
            });
            support.getElementsByTagName = assert(function(div) {
                div.appendChild(doc.createComment(""));
                return !div.getElementsByTagName("*").length;
            });
            support.getElementsByClassName = rnative.test(doc.getElementsByClassName) && assert(function(div) {
                div.innerHTML = "<div class='a'></div><div class='a i'></div>";
                div.firstChild.className = "i";
                return div.getElementsByClassName("i").length === 2;
            });
            support.getById = assert(function(div) {
                docElem.appendChild(div).id = expando;
                return !doc.getElementsByName || !doc.getElementsByName(expando).length;
            });
            if (support.getById) {
                Expr.find["ID"] = function(id, context) {
                    if (typeof context.getElementById !== strundefined && documentIsHTML) {
                        var m = context.getElementById(id);
                        return m && m.parentNode ? [ m ] : [];
                    }
                };
                Expr.filter["ID"] = function(id) {
                    var attrId = id.replace(runescape, funescape);
                    return function(elem) {
                        return elem.getAttribute("id") === attrId;
                    };
                };
            } else {
                delete Expr.find["ID"];
                Expr.filter["ID"] = function(id) {
                    var attrId = id.replace(runescape, funescape);
                    return function(elem) {
                        var node = typeof elem.getAttributeNode !== strundefined && elem.getAttributeNode("id");
                        return node && node.value === attrId;
                    };
                };
            }
            Expr.find["TAG"] = support.getElementsByTagName ? function(tag, context) {
                if (typeof context.getElementsByTagName !== strundefined) {
                    return context.getElementsByTagName(tag);
                }
            } : function(tag, context) {
                var elem, tmp = [], i = 0, results = context.getElementsByTagName(tag);
                if (tag === "*") {
                    while (elem = results[i++]) {
                        if (elem.nodeType === 1) {
                            tmp.push(elem);
                        }
                    }
                    return tmp;
                }
                return results;
            };
            Expr.find["CLASS"] = support.getElementsByClassName && function(className, context) {
                if (typeof context.getElementsByClassName !== strundefined && documentIsHTML) {
                    return context.getElementsByClassName(className);
                }
            };
            rbuggyMatches = [];
            rbuggyQSA = [];
            if (support.qsa = rnative.test(doc.querySelectorAll)) {
                assert(function(div) {
                    div.innerHTML = "<select msallowclip=''><option selected=''></option></select>";
                    if (div.querySelectorAll("[msallowclip^='']").length) {
                        rbuggyQSA.push("[*^$]=" + whitespace + "*(?:''|\"\")");
                    }
                    if (!div.querySelectorAll("[selected]").length) {
                        rbuggyQSA.push("\\[" + whitespace + "*(?:value|" + booleans + ")");
                    }
                    if (!div.querySelectorAll(":checked").length) {
                        rbuggyQSA.push(":checked");
                    }
                });
                assert(function(div) {
                    var input = doc.createElement("input");
                    input.setAttribute("type", "hidden");
                    div.appendChild(input).setAttribute("name", "D");
                    if (div.querySelectorAll("[name=d]").length) {
                        rbuggyQSA.push("name" + whitespace + "*[*^$|!~]?=");
                    }
                    if (!div.querySelectorAll(":enabled").length) {
                        rbuggyQSA.push(":enabled", ":disabled");
                    }
                    div.querySelectorAll("*,:x");
                    rbuggyQSA.push(",.*:");
                });
            }
            if (support.matchesSelector = rnative.test(matches = docElem.matches || docElem.webkitMatchesSelector || docElem.mozMatchesSelector || docElem.oMatchesSelector || docElem.msMatchesSelector)) {
                assert(function(div) {
                    support.disconnectedMatch = matches.call(div, "div");
                    matches.call(div, "[s!='']:x");
                    rbuggyMatches.push("!=", pseudos);
                });
            }
            rbuggyQSA = rbuggyQSA.length && new RegExp(rbuggyQSA.join("|"));
            rbuggyMatches = rbuggyMatches.length && new RegExp(rbuggyMatches.join("|"));
            hasCompare = rnative.test(docElem.compareDocumentPosition);
            contains = hasCompare || rnative.test(docElem.contains) ? function(a, b) {
                var adown = a.nodeType === 9 ? a.documentElement : a, bup = b && b.parentNode;
                return a === bup || !!(bup && bup.nodeType === 1 && (adown.contains ? adown.contains(bup) : a.compareDocumentPosition && a.compareDocumentPosition(bup) & 16));
            } : function(a, b) {
                if (b) {
                    while (b = b.parentNode) {
                        if (b === a) {
                            return true;
                        }
                    }
                }
                return false;
            };
            sortOrder = hasCompare ? function(a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }
                var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
                if (compare) {
                    return compare;
                }
                compare = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1;
                if (compare & 1 || !support.sortDetached && b.compareDocumentPosition(a) === compare) {
                    if (a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a)) {
                        return -1;
                    }
                    if (b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b)) {
                        return 1;
                    }
                    return sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                }
                return compare & 4 ? -1 : 1;
            } : function(a, b) {
                if (a === b) {
                    hasDuplicate = true;
                    return 0;
                }
                var cur, i = 0, aup = a.parentNode, bup = b.parentNode, ap = [ a ], bp = [ b ];
                if (!aup || !bup) {
                    return a === doc ? -1 : b === doc ? 1 : aup ? -1 : bup ? 1 : sortInput ? indexOf.call(sortInput, a) - indexOf.call(sortInput, b) : 0;
                } else if (aup === bup) {
                    return siblingCheck(a, b);
                }
                cur = a;
                while (cur = cur.parentNode) {
                    ap.unshift(cur);
                }
                cur = b;
                while (cur = cur.parentNode) {
                    bp.unshift(cur);
                }
                while (ap[i] === bp[i]) {
                    i++;
                }
                return i ? siblingCheck(ap[i], bp[i]) : ap[i] === preferredDoc ? -1 : bp[i] === preferredDoc ? 1 : 0;
            };
            return doc;
        };
        Sizzle.matches = function(expr, elements) {
            return Sizzle(expr, null, null, elements);
        };
        Sizzle.matchesSelector = function(elem, expr) {
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            expr = expr.replace(rattributeQuotes, "='$1']");
            if (support.matchesSelector && documentIsHTML && (!rbuggyMatches || !rbuggyMatches.test(expr)) && (!rbuggyQSA || !rbuggyQSA.test(expr))) {
                try {
                    var ret = matches.call(elem, expr);
                    if (ret || support.disconnectedMatch || elem.document && elem.document.nodeType !== 11) {
                        return ret;
                    }
                } catch (e) {}
            }
            return Sizzle(expr, document, null, [ elem ]).length > 0;
        };
        Sizzle.contains = function(context, elem) {
            if ((context.ownerDocument || context) !== document) {
                setDocument(context);
            }
            return contains(context, elem);
        };
        Sizzle.attr = function(elem, name) {
            if ((elem.ownerDocument || elem) !== document) {
                setDocument(elem);
            }
            var fn = Expr.attrHandle[name.toLowerCase()], val = fn && hasOwn.call(Expr.attrHandle, name.toLowerCase()) ? fn(elem, name, !documentIsHTML) : undefined;
            return val !== undefined ? val : support.attributes || !documentIsHTML ? elem.getAttribute(name) : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
        };
        Sizzle.error = function(msg) {
            throw new Error("Syntax error, unrecognized expression: " + msg);
        };
        Sizzle.uniqueSort = function(results) {
            var elem, duplicates = [], j = 0, i = 0;
            hasDuplicate = !support.detectDuplicates;
            sortInput = !support.sortStable && results.slice(0);
            results.sort(sortOrder);
            if (hasDuplicate) {
                while (elem = results[i++]) {
                    if (elem === results[i]) {
                        j = duplicates.push(i);
                    }
                }
                while (j--) {
                    results.splice(duplicates[j], 1);
                }
            }
            sortInput = null;
            return results;
        };
        getText = Sizzle.getText = function(elem) {
            var node, ret = "", i = 0, nodeType = elem.nodeType;
            if (!nodeType) {
                while (node = elem[i++]) {
                    ret += getText(node);
                }
            } else if (nodeType === 1 || nodeType === 9 || nodeType === 11) {
                if (typeof elem.textContent === "string") {
                    return elem.textContent;
                } else {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        ret += getText(elem);
                    }
                }
            } else if (nodeType === 3 || nodeType === 4) {
                return elem.nodeValue;
            }
            return ret;
        };
        Expr = Sizzle.selectors = {
            cacheLength: 50,
            createPseudo: markFunction,
            match: matchExpr,
            attrHandle: {},
            find: {},
            relative: {
                ">": {
                    dir: "parentNode",
                    first: true
                },
                " ": {
                    dir: "parentNode"
                },
                "+": {
                    dir: "previousSibling",
                    first: true
                },
                "~": {
                    dir: "previousSibling"
                }
            },
            preFilter: {
                ATTR: function(match) {
                    match[1] = match[1].replace(runescape, funescape);
                    match[3] = (match[3] || match[4] || match[5] || "").replace(runescape, funescape);
                    if (match[2] === "~=") {
                        match[3] = " " + match[3] + " ";
                    }
                    return match.slice(0, 4);
                },
                CHILD: function(match) {
                    match[1] = match[1].toLowerCase();
                    if (match[1].slice(0, 3) === "nth") {
                        if (!match[3]) {
                            Sizzle.error(match[0]);
                        }
                        match[4] = +(match[4] ? match[5] + (match[6] || 1) : 2 * (match[3] === "even" || match[3] === "odd"));
                        match[5] = +(match[7] + match[8] || match[3] === "odd");
                    } else if (match[3]) {
                        Sizzle.error(match[0]);
                    }
                    return match;
                },
                PSEUDO: function(match) {
                    var excess, unquoted = !match[6] && match[2];
                    if (matchExpr["CHILD"].test(match[0])) {
                        return null;
                    }
                    if (match[3]) {
                        match[2] = match[4] || match[5] || "";
                    } else if (unquoted && rpseudo.test(unquoted) && (excess = tokenize(unquoted, true)) && (excess = unquoted.indexOf(")", unquoted.length - excess) - unquoted.length)) {
                        match[0] = match[0].slice(0, excess);
                        match[2] = unquoted.slice(0, excess);
                    }
                    return match.slice(0, 3);
                }
            },
            filter: {
                TAG: function(nodeNameSelector) {
                    var nodeName = nodeNameSelector.replace(runescape, funescape).toLowerCase();
                    return nodeNameSelector === "*" ? function() {
                        return true;
                    } : function(elem) {
                        return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
                    };
                },
                CLASS: function(className) {
                    var pattern = classCache[className + " "];
                    return pattern || (pattern = new RegExp("(^|" + whitespace + ")" + className + "(" + whitespace + "|$)")) && classCache(className, function(elem) {
                        return pattern.test(typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== strundefined && elem.getAttribute("class") || "");
                    });
                },
                ATTR: function(name, operator, check) {
                    return function(elem) {
                        var result = Sizzle.attr(elem, name);
                        if (result == null) {
                            return operator === "!=";
                        }
                        if (!operator) {
                            return true;
                        }
                        result += "";
                        return operator === "=" ? result === check : operator === "!=" ? result !== check : operator === "^=" ? check && result.indexOf(check) === 0 : operator === "*=" ? check && result.indexOf(check) > -1 : operator === "$=" ? check && result.slice(-check.length) === check : operator === "~=" ? (" " + result + " ").indexOf(check) > -1 : operator === "|=" ? result === check || result.slice(0, check.length + 1) === check + "-" : false;
                    };
                },
                CHILD: function(type, what, argument, first, last) {
                    var simple = type.slice(0, 3) !== "nth", forward = type.slice(-4) !== "last", ofType = what === "of-type";
                    return first === 1 && last === 0 ? function(elem) {
                        return !!elem.parentNode;
                    } : function(elem, context, xml) {
                        var cache, outerCache, node, diff, nodeIndex, start, dir = simple !== forward ? "nextSibling" : "previousSibling", parent = elem.parentNode, name = ofType && elem.nodeName.toLowerCase(), useCache = !xml && !ofType;
                        if (parent) {
                            if (simple) {
                                while (dir) {
                                    node = elem;
                                    while (node = node[dir]) {
                                        if (ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) {
                                            return false;
                                        }
                                    }
                                    start = dir = type === "only" && !start && "nextSibling";
                                }
                                return true;
                            }
                            start = [ forward ? parent.firstChild : parent.lastChild ];
                            if (forward && useCache) {
                                outerCache = parent[expando] || (parent[expando] = {});
                                cache = outerCache[type] || [];
                                nodeIndex = cache[0] === dirruns && cache[1];
                                diff = cache[0] === dirruns && cache[2];
                                node = nodeIndex && parent.childNodes[nodeIndex];
                                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                                    if (node.nodeType === 1 && ++diff && node === elem) {
                                        outerCache[type] = [ dirruns, nodeIndex, diff ];
                                        break;
                                    }
                                }
                            } else if (useCache && (cache = (elem[expando] || (elem[expando] = {}))[type]) && cache[0] === dirruns) {
                                diff = cache[1];
                            } else {
                                while (node = ++nodeIndex && node && node[dir] || (diff = nodeIndex = 0) || start.pop()) {
                                    if ((ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1) && ++diff) {
                                        if (useCache) {
                                            (node[expando] || (node[expando] = {}))[type] = [ dirruns, diff ];
                                        }
                                        if (node === elem) {
                                            break;
                                        }
                                    }
                                }
                            }
                            diff -= last;
                            return diff === first || diff % first === 0 && diff / first >= 0;
                        }
                    };
                },
                PSEUDO: function(pseudo, argument) {
                    var args, fn = Expr.pseudos[pseudo] || Expr.setFilters[pseudo.toLowerCase()] || Sizzle.error("unsupported pseudo: " + pseudo);
                    if (fn[expando]) {
                        return fn(argument);
                    }
                    if (fn.length > 1) {
                        args = [ pseudo, pseudo, "", argument ];
                        return Expr.setFilters.hasOwnProperty(pseudo.toLowerCase()) ? markFunction(function(seed, matches) {
                            var idx, matched = fn(seed, argument), i = matched.length;
                            while (i--) {
                                idx = indexOf.call(seed, matched[i]);
                                seed[idx] = !(matches[idx] = matched[i]);
                            }
                        }) : function(elem) {
                            return fn(elem, 0, args);
                        };
                    }
                    return fn;
                }
            },
            pseudos: {
                not: markFunction(function(selector) {
                    var input = [], results = [], matcher = compile(selector.replace(rtrim, "$1"));
                    return matcher[expando] ? markFunction(function(seed, matches, context, xml) {
                        var elem, unmatched = matcher(seed, null, xml, []), i = seed.length;
                        while (i--) {
                            if (elem = unmatched[i]) {
                                seed[i] = !(matches[i] = elem);
                            }
                        }
                    }) : function(elem, context, xml) {
                        input[0] = elem;
                        matcher(input, null, xml, results);
                        return !results.pop();
                    };
                }),
                has: markFunction(function(selector) {
                    return function(elem) {
                        return Sizzle(selector, elem).length > 0;
                    };
                }),
                contains: markFunction(function(text) {
                    return function(elem) {
                        return (elem.textContent || elem.innerText || getText(elem)).indexOf(text) > -1;
                    };
                }),
                lang: markFunction(function(lang) {
                    if (!ridentifier.test(lang || "")) {
                        Sizzle.error("unsupported lang: " + lang);
                    }
                    lang = lang.replace(runescape, funescape).toLowerCase();
                    return function(elem) {
                        var elemLang;
                        do {
                            if (elemLang = documentIsHTML ? elem.lang : elem.getAttribute("xml:lang") || elem.getAttribute("lang")) {
                                elemLang = elemLang.toLowerCase();
                                return elemLang === lang || elemLang.indexOf(lang + "-") === 0;
                            }
                        } while ((elem = elem.parentNode) && elem.nodeType === 1);
                        return false;
                    };
                }),
                target: function(elem) {
                    var hash = window.location && window.location.hash;
                    return hash && hash.slice(1) === elem.id;
                },
                root: function(elem) {
                    return elem === docElem;
                },
                focus: function(elem) {
                    return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
                },
                enabled: function(elem) {
                    return elem.disabled === false;
                },
                disabled: function(elem) {
                    return elem.disabled === true;
                },
                checked: function(elem) {
                    var nodeName = elem.nodeName.toLowerCase();
                    return nodeName === "input" && !!elem.checked || nodeName === "option" && !!elem.selected;
                },
                selected: function(elem) {
                    if (elem.parentNode) {
                        elem.parentNode.selectedIndex;
                    }
                    return elem.selected === true;
                },
                empty: function(elem) {
                    for (elem = elem.firstChild; elem; elem = elem.nextSibling) {
                        if (elem.nodeType < 6) {
                            return false;
                        }
                    }
                    return true;
                },
                parent: function(elem) {
                    return !Expr.pseudos["empty"](elem);
                },
                header: function(elem) {
                    return rheader.test(elem.nodeName);
                },
                input: function(elem) {
                    return rinputs.test(elem.nodeName);
                },
                button: function(elem) {
                    var name = elem.nodeName.toLowerCase();
                    return name === "input" && elem.type === "button" || name === "button";
                },
                text: function(elem) {
                    var attr;
                    return elem.nodeName.toLowerCase() === "input" && elem.type === "text" && ((attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text");
                },
                first: createPositionalPseudo(function() {
                    return [ 0 ];
                }),
                last: createPositionalPseudo(function(matchIndexes, length) {
                    return [ length - 1 ];
                }),
                eq: createPositionalPseudo(function(matchIndexes, length, argument) {
                    return [ argument < 0 ? argument + length : argument ];
                }),
                even: createPositionalPseudo(function(matchIndexes, length) {
                    var i = 0;
                    for (;i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                odd: createPositionalPseudo(function(matchIndexes, length) {
                    var i = 1;
                    for (;i < length; i += 2) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                lt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (;--i >= 0; ) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                }),
                gt: createPositionalPseudo(function(matchIndexes, length, argument) {
                    var i = argument < 0 ? argument + length : argument;
                    for (;++i < length; ) {
                        matchIndexes.push(i);
                    }
                    return matchIndexes;
                })
            }
        };
        Expr.pseudos["nth"] = Expr.pseudos["eq"];
        for (i in {
            radio: true,
            checkbox: true,
            file: true,
            password: true,
            image: true
        }) {
            Expr.pseudos[i] = createInputPseudo(i);
        }
        for (i in {
            submit: true,
            reset: true
        }) {
            Expr.pseudos[i] = createButtonPseudo(i);
        }
        function setFilters() {}
        setFilters.prototype = Expr.filters = Expr.pseudos;
        Expr.setFilters = new setFilters();
        tokenize = Sizzle.tokenize = function(selector, parseOnly) {
            var matched, match, tokens, type, soFar, groups, preFilters, cached = tokenCache[selector + " "];
            if (cached) {
                return parseOnly ? 0 : cached.slice(0);
            }
            soFar = selector;
            groups = [];
            preFilters = Expr.preFilter;
            while (soFar) {
                if (!matched || (match = rcomma.exec(soFar))) {
                    if (match) {
                        soFar = soFar.slice(match[0].length) || soFar;
                    }
                    groups.push(tokens = []);
                }
                matched = false;
                if (match = rcombinators.exec(soFar)) {
                    matched = match.shift();
                    tokens.push({
                        value: matched,
                        type: match[0].replace(rtrim, " ")
                    });
                    soFar = soFar.slice(matched.length);
                }
                for (type in Expr.filter) {
                    if ((match = matchExpr[type].exec(soFar)) && (!preFilters[type] || (match = preFilters[type](match)))) {
                        matched = match.shift();
                        tokens.push({
                            value: matched,
                            type: type,
                            matches: match
                        });
                        soFar = soFar.slice(matched.length);
                    }
                }
                if (!matched) {
                    break;
                }
            }
            return parseOnly ? soFar.length : soFar ? Sizzle.error(selector) : tokenCache(selector, groups).slice(0);
        };
        function toSelector(tokens) {
            var i = 0, len = tokens.length, selector = "";
            for (;i < len; i++) {
                selector += tokens[i].value;
            }
            return selector;
        }
        function addCombinator(matcher, combinator, base) {
            var dir = combinator.dir, checkNonElements = base && dir === "parentNode", doneName = done++;
            return combinator.first ? function(elem, context, xml) {
                while (elem = elem[dir]) {
                    if (elem.nodeType === 1 || checkNonElements) {
                        return matcher(elem, context, xml);
                    }
                }
            } : function(elem, context, xml) {
                var oldCache, outerCache, newCache = [ dirruns, doneName ];
                if (xml) {
                    while (elem = elem[dir]) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            if (matcher(elem, context, xml)) {
                                return true;
                            }
                        }
                    }
                } else {
                    while (elem = elem[dir]) {
                        if (elem.nodeType === 1 || checkNonElements) {
                            outerCache = elem[expando] || (elem[expando] = {});
                            if ((oldCache = outerCache[dir]) && oldCache[0] === dirruns && oldCache[1] === doneName) {
                                return newCache[2] = oldCache[2];
                            } else {
                                outerCache[dir] = newCache;
                                if (newCache[2] = matcher(elem, context, xml)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            };
        }
        function elementMatcher(matchers) {
            return matchers.length > 1 ? function(elem, context, xml) {
                var i = matchers.length;
                while (i--) {
                    if (!matchers[i](elem, context, xml)) {
                        return false;
                    }
                }
                return true;
            } : matchers[0];
        }
        function multipleContexts(selector, contexts, results) {
            var i = 0, len = contexts.length;
            for (;i < len; i++) {
                Sizzle(selector, contexts[i], results);
            }
            return results;
        }
        function condense(unmatched, map, filter, context, xml) {
            var elem, newUnmatched = [], i = 0, len = unmatched.length, mapped = map != null;
            for (;i < len; i++) {
                if (elem = unmatched[i]) {
                    if (!filter || filter(elem, context, xml)) {
                        newUnmatched.push(elem);
                        if (mapped) {
                            map.push(i);
                        }
                    }
                }
            }
            return newUnmatched;
        }
        function setMatcher(preFilter, selector, matcher, postFilter, postFinder, postSelector) {
            if (postFilter && !postFilter[expando]) {
                postFilter = setMatcher(postFilter);
            }
            if (postFinder && !postFinder[expando]) {
                postFinder = setMatcher(postFinder, postSelector);
            }
            return markFunction(function(seed, results, context, xml) {
                var temp, i, elem, preMap = [], postMap = [], preexisting = results.length, elems = seed || multipleContexts(selector || "*", context.nodeType ? [ context ] : context, []), matcherIn = preFilter && (seed || !selector) ? condense(elems, preMap, preFilter, context, xml) : elems, matcherOut = matcher ? postFinder || (seed ? preFilter : preexisting || postFilter) ? [] : results : matcherIn;
                if (matcher) {
                    matcher(matcherIn, matcherOut, context, xml);
                }
                if (postFilter) {
                    temp = condense(matcherOut, postMap);
                    postFilter(temp, [], context, xml);
                    i = temp.length;
                    while (i--) {
                        if (elem = temp[i]) {
                            matcherOut[postMap[i]] = !(matcherIn[postMap[i]] = elem);
                        }
                    }
                }
                if (seed) {
                    if (postFinder || preFilter) {
                        if (postFinder) {
                            temp = [];
                            i = matcherOut.length;
                            while (i--) {
                                if (elem = matcherOut[i]) {
                                    temp.push(matcherIn[i] = elem);
                                }
                            }
                            postFinder(null, matcherOut = [], temp, xml);
                        }
                        i = matcherOut.length;
                        while (i--) {
                            if ((elem = matcherOut[i]) && (temp = postFinder ? indexOf.call(seed, elem) : preMap[i]) > -1) {
                                seed[temp] = !(results[temp] = elem);
                            }
                        }
                    }
                } else {
                    matcherOut = condense(matcherOut === results ? matcherOut.splice(preexisting, matcherOut.length) : matcherOut);
                    if (postFinder) {
                        postFinder(null, results, matcherOut, xml);
                    } else {
                        push.apply(results, matcherOut);
                    }
                }
            });
        }
        function matcherFromTokens(tokens) {
            var checkContext, matcher, j, len = tokens.length, leadingRelative = Expr.relative[tokens[0].type], implicitRelative = leadingRelative || Expr.relative[" "], i = leadingRelative ? 1 : 0, matchContext = addCombinator(function(elem) {
                return elem === checkContext;
            }, implicitRelative, true), matchAnyContext = addCombinator(function(elem) {
                return indexOf.call(checkContext, elem) > -1;
            }, implicitRelative, true), matchers = [ function(elem, context, xml) {
                return !leadingRelative && (xml || context !== outermostContext) || ((checkContext = context).nodeType ? matchContext(elem, context, xml) : matchAnyContext(elem, context, xml));
            } ];
            for (;i < len; i++) {
                if (matcher = Expr.relative[tokens[i].type]) {
                    matchers = [ addCombinator(elementMatcher(matchers), matcher) ];
                } else {
                    matcher = Expr.filter[tokens[i].type].apply(null, tokens[i].matches);
                    if (matcher[expando]) {
                        j = ++i;
                        for (;j < len; j++) {
                            if (Expr.relative[tokens[j].type]) {
                                break;
                            }
                        }
                        return setMatcher(i > 1 && elementMatcher(matchers), i > 1 && toSelector(tokens.slice(0, i - 1).concat({
                            value: tokens[i - 2].type === " " ? "*" : ""
                        })).replace(rtrim, "$1"), matcher, i < j && matcherFromTokens(tokens.slice(i, j)), j < len && matcherFromTokens(tokens = tokens.slice(j)), j < len && toSelector(tokens));
                    }
                    matchers.push(matcher);
                }
            }
            return elementMatcher(matchers);
        }
        function matcherFromGroupMatchers(elementMatchers, setMatchers) {
            var bySet = setMatchers.length > 0, byElement = elementMatchers.length > 0, superMatcher = function(seed, context, xml, results, outermost) {
                var elem, j, matcher, matchedCount = 0, i = "0", unmatched = seed && [], setMatched = [], contextBackup = outermostContext, elems = seed || byElement && Expr.find["TAG"]("*", outermost), dirrunsUnique = dirruns += contextBackup == null ? 1 : Math.random() || .1, len = elems.length;
                if (outermost) {
                    outermostContext = context !== document && context;
                }
                for (;i !== len && (elem = elems[i]) != null; i++) {
                    if (byElement && elem) {
                        j = 0;
                        while (matcher = elementMatchers[j++]) {
                            if (matcher(elem, context, xml)) {
                                results.push(elem);
                                break;
                            }
                        }
                        if (outermost) {
                            dirruns = dirrunsUnique;
                        }
                    }
                    if (bySet) {
                        if (elem = !matcher && elem) {
                            matchedCount--;
                        }
                        if (seed) {
                            unmatched.push(elem);
                        }
                    }
                }
                matchedCount += i;
                if (bySet && i !== matchedCount) {
                    j = 0;
                    while (matcher = setMatchers[j++]) {
                        matcher(unmatched, setMatched, context, xml);
                    }
                    if (seed) {
                        if (matchedCount > 0) {
                            while (i--) {
                                if (!(unmatched[i] || setMatched[i])) {
                                    setMatched[i] = pop.call(results);
                                }
                            }
                        }
                        setMatched = condense(setMatched);
                    }
                    push.apply(results, setMatched);
                    if (outermost && !seed && setMatched.length > 0 && matchedCount + setMatchers.length > 1) {
                        Sizzle.uniqueSort(results);
                    }
                }
                if (outermost) {
                    dirruns = dirrunsUnique;
                    outermostContext = contextBackup;
                }
                return unmatched;
            };
            return bySet ? markFunction(superMatcher) : superMatcher;
        }
        compile = Sizzle.compile = function(selector, match) {
            var i, setMatchers = [], elementMatchers = [], cached = compilerCache[selector + " "];
            if (!cached) {
                if (!match) {
                    match = tokenize(selector);
                }
                i = match.length;
                while (i--) {
                    cached = matcherFromTokens(match[i]);
                    if (cached[expando]) {
                        setMatchers.push(cached);
                    } else {
                        elementMatchers.push(cached);
                    }
                }
                cached = compilerCache(selector, matcherFromGroupMatchers(elementMatchers, setMatchers));
                cached.selector = selector;
            }
            return cached;
        };
        select = Sizzle.select = function(selector, context, results, seed) {
            var i, tokens, token, type, find, compiled = typeof selector === "function" && selector, match = !seed && tokenize(selector = compiled.selector || selector);
            results = results || [];
            if (match.length === 1) {
                tokens = match[0] = match[0].slice(0);
                if (tokens.length > 2 && (token = tokens[0]).type === "ID" && support.getById && context.nodeType === 9 && documentIsHTML && Expr.relative[tokens[1].type]) {
                    context = (Expr.find["ID"](token.matches[0].replace(runescape, funescape), context) || [])[0];
                    if (!context) {
                        return results;
                    } else if (compiled) {
                        context = context.parentNode;
                    }
                    selector = selector.slice(tokens.shift().value.length);
                }
                i = matchExpr["needsContext"].test(selector) ? 0 : tokens.length;
                while (i--) {
                    token = tokens[i];
                    if (Expr.relative[type = token.type]) {
                        break;
                    }
                    if (find = Expr.find[type]) {
                        if (seed = find(token.matches[0].replace(runescape, funescape), rsibling.test(tokens[0].type) && testContext(context.parentNode) || context)) {
                            tokens.splice(i, 1);
                            selector = seed.length && toSelector(tokens);
                            if (!selector) {
                                push.apply(results, seed);
                                return results;
                            }
                            break;
                        }
                    }
                }
            }
            (compiled || compile(selector, match))(seed, context, !documentIsHTML, results, rsibling.test(selector) && testContext(context.parentNode) || context);
            return results;
        };
        support.sortStable = expando.split("").sort(sortOrder).join("") === expando;
        support.detectDuplicates = !!hasDuplicate;
        setDocument();
        support.sortDetached = assert(function(div1) {
            return div1.compareDocumentPosition(document.createElement("div")) & 1;
        });
        if (!assert(function(div) {
            div.innerHTML = "<a href='#'></a>";
            return div.firstChild.getAttribute("href") === "#";
        })) {
            addHandle("type|href|height|width", function(elem, name, isXML) {
                if (!isXML) {
                    return elem.getAttribute(name, name.toLowerCase() === "type" ? 1 : 2);
                }
            });
        }
        if (!support.attributes || !assert(function(div) {
            div.innerHTML = "<input/>";
            div.firstChild.setAttribute("value", "");
            return div.firstChild.getAttribute("value") === "";
        })) {
            addHandle("value", function(elem, name, isXML) {
                if (!isXML && elem.nodeName.toLowerCase() === "input") {
                    return elem.defaultValue;
                }
            });
        }
        if (!assert(function(div) {
            return div.getAttribute("disabled") == null;
        })) {
            addHandle(booleans, function(elem, name, isXML) {
                var val;
                if (!isXML) {
                    return elem[name] === true ? name.toLowerCase() : (val = elem.getAttributeNode(name)) && val.specified ? val.value : null;
                }
            });
        }
        return Sizzle;
    }(window);
    jQuery.find = Sizzle;
    jQuery.expr = Sizzle.selectors;
    jQuery.expr[":"] = jQuery.expr.pseudos;
    jQuery.unique = Sizzle.uniqueSort;
    jQuery.text = Sizzle.getText;
    jQuery.isXMLDoc = Sizzle.isXML;
    jQuery.contains = Sizzle.contains;
    var rneedsContext = jQuery.expr.match.needsContext;
    var rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>|)$/;
    var risSimple = /^.[^:#\[\.,]*$/;
    function winnow(elements, qualifier, not) {
        if (jQuery.isFunction(qualifier)) {
            return jQuery.grep(elements, function(elem, i) {
                return !!qualifier.call(elem, i, elem) !== not;
            });
        }
        if (qualifier.nodeType) {
            return jQuery.grep(elements, function(elem) {
                return elem === qualifier !== not;
            });
        }
        if (typeof qualifier === "string") {
            if (risSimple.test(qualifier)) {
                return jQuery.filter(qualifier, elements, not);
            }
            qualifier = jQuery.filter(qualifier, elements);
        }
        return jQuery.grep(elements, function(elem) {
            return jQuery.inArray(elem, qualifier) >= 0 !== not;
        });
    }
    jQuery.filter = function(expr, elems, not) {
        var elem = elems[0];
        if (not) {
            expr = ":not(" + expr + ")";
        }
        return elems.length === 1 && elem.nodeType === 1 ? jQuery.find.matchesSelector(elem, expr) ? [ elem ] : [] : jQuery.find.matches(expr, jQuery.grep(elems, function(elem) {
            return elem.nodeType === 1;
        }));
    };
    jQuery.fn.extend({
        find: function(selector) {
            var i, ret = [], self = this, len = self.length;
            if (typeof selector !== "string") {
                return this.pushStack(jQuery(selector).filter(function() {
                    for (i = 0; i < len; i++) {
                        if (jQuery.contains(self[i], this)) {
                            return true;
                        }
                    }
                }));
            }
            for (i = 0; i < len; i++) {
                jQuery.find(selector, self[i], ret);
            }
            ret = this.pushStack(len > 1 ? jQuery.unique(ret) : ret);
            ret.selector = this.selector ? this.selector + " " + selector : selector;
            return ret;
        },
        filter: function(selector) {
            return this.pushStack(winnow(this, selector || [], false));
        },
        not: function(selector) {
            return this.pushStack(winnow(this, selector || [], true));
        },
        is: function(selector) {
            return !!winnow(this, typeof selector === "string" && rneedsContext.test(selector) ? jQuery(selector) : selector || [], false).length;
        }
    });
    var rootjQuery, document = window.document, rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/, init = jQuery.fn.init = function(selector, context) {
        var match, elem;
        if (!selector) {
            return this;
        }
        if (typeof selector === "string") {
            if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                match = [ null, selector, null ];
            } else {
                match = rquickExpr.exec(selector);
            }
            if (match && (match[1] || !context)) {
                if (match[1]) {
                    context = context instanceof jQuery ? context[0] : context;
                    jQuery.merge(this, jQuery.parseHTML(match[1], context && context.nodeType ? context.ownerDocument || context : document, true));
                    if (rsingleTag.test(match[1]) && jQuery.isPlainObject(context)) {
                        for (match in context) {
                            if (jQuery.isFunction(this[match])) {
                                this[match](context[match]);
                            } else {
                                this.attr(match, context[match]);
                            }
                        }
                    }
                    return this;
                } else {
                    elem = document.getElementById(match[2]);
                    if (elem && elem.parentNode) {
                        if (elem.id !== match[2]) {
                            return rootjQuery.find(selector);
                        }
                        this.length = 1;
                        this[0] = elem;
                    }
                    this.context = document;
                    this.selector = selector;
                    return this;
                }
            } else if (!context || context.jquery) {
                return (context || rootjQuery).find(selector);
            } else {
                return this.constructor(context).find(selector);
            }
        } else if (selector.nodeType) {
            this.context = this[0] = selector;
            this.length = 1;
            return this;
        } else if (jQuery.isFunction(selector)) {
            return typeof rootjQuery.ready !== "undefined" ? rootjQuery.ready(selector) : selector(jQuery);
        }
        if (selector.selector !== undefined) {
            this.selector = selector.selector;
            this.context = selector.context;
        }
        return jQuery.makeArray(selector, this);
    };
    init.prototype = jQuery.fn;
    rootjQuery = jQuery(document);
    var rparentsprev = /^(?:parents|prev(?:Until|All))/, guaranteedUnique = {
        children: true,
        contents: true,
        next: true,
        prev: true
    };
    jQuery.extend({
        dir: function(elem, dir, until) {
            var matched = [], cur = elem[dir];
            while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
                if (cur.nodeType === 1) {
                    matched.push(cur);
                }
                cur = cur[dir];
            }
            return matched;
        },
        sibling: function(n, elem) {
            var r = [];
            for (;n; n = n.nextSibling) {
                if (n.nodeType === 1 && n !== elem) {
                    r.push(n);
                }
            }
            return r;
        }
    });
    jQuery.fn.extend({
        has: function(target) {
            var i, targets = jQuery(target, this), len = targets.length;
            return this.filter(function() {
                for (i = 0; i < len; i++) {
                    if (jQuery.contains(this, targets[i])) {
                        return true;
                    }
                }
            });
        },
        closest: function(selectors, context) {
            var cur, i = 0, l = this.length, matched = [], pos = rneedsContext.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;
            for (;i < l; i++) {
                for (cur = this[i]; cur && cur !== context; cur = cur.parentNode) {
                    if (cur.nodeType < 11 && (pos ? pos.index(cur) > -1 : cur.nodeType === 1 && jQuery.find.matchesSelector(cur, selectors))) {
                        matched.push(cur);
                        break;
                    }
                }
            }
            return this.pushStack(matched.length > 1 ? jQuery.unique(matched) : matched);
        },
        index: function(elem) {
            if (!elem) {
                return this[0] && this[0].parentNode ? this.first().prevAll().length : -1;
            }
            if (typeof elem === "string") {
                return jQuery.inArray(this[0], jQuery(elem));
            }
            return jQuery.inArray(elem.jquery ? elem[0] : elem, this);
        },
        add: function(selector, context) {
            return this.pushStack(jQuery.unique(jQuery.merge(this.get(), jQuery(selector, context))));
        },
        addBack: function(selector) {
            return this.add(selector == null ? this.prevObject : this.prevObject.filter(selector));
        }
    });
    function sibling(cur, dir) {
        do {
            cur = cur[dir];
        } while (cur && cur.nodeType !== 1);
        return cur;
    }
    jQuery.each({
        parent: function(elem) {
            var parent = elem.parentNode;
            return parent && parent.nodeType !== 11 ? parent : null;
        },
        parents: function(elem) {
            return jQuery.dir(elem, "parentNode");
        },
        parentsUntil: function(elem, i, until) {
            return jQuery.dir(elem, "parentNode", until);
        },
        next: function(elem) {
            return sibling(elem, "nextSibling");
        },
        prev: function(elem) {
            return sibling(elem, "previousSibling");
        },
        nextAll: function(elem) {
            return jQuery.dir(elem, "nextSibling");
        },
        prevAll: function(elem) {
            return jQuery.dir(elem, "previousSibling");
        },
        nextUntil: function(elem, i, until) {
            return jQuery.dir(elem, "nextSibling", until);
        },
        prevUntil: function(elem, i, until) {
            return jQuery.dir(elem, "previousSibling", until);
        },
        siblings: function(elem) {
            return jQuery.sibling((elem.parentNode || {}).firstChild, elem);
        },
        children: function(elem) {
            return jQuery.sibling(elem.firstChild);
        },
        contents: function(elem) {
            return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.merge([], elem.childNodes);
        }
    }, function(name, fn) {
        jQuery.fn[name] = function(until, selector) {
            var ret = jQuery.map(this, fn, until);
            if (name.slice(-5) !== "Until") {
                selector = until;
            }
            if (selector && typeof selector === "string") {
                ret = jQuery.filter(selector, ret);
            }
            if (this.length > 1) {
                if (!guaranteedUnique[name]) {
                    ret = jQuery.unique(ret);
                }
                if (rparentsprev.test(name)) {
                    ret = ret.reverse();
                }
            }
            return this.pushStack(ret);
        };
    });
    var rnotwhite = /\S+/g;
    var optionsCache = {};
    function createOptions(options) {
        var object = optionsCache[options] = {};
        jQuery.each(options.match(rnotwhite) || [], function(_, flag) {
            object[flag] = true;
        });
        return object;
    }
    jQuery.Callbacks = function(options) {
        options = typeof options === "string" ? optionsCache[options] || createOptions(options) : jQuery.extend({}, options);
        var firing, memory, fired, firingLength, firingIndex, firingStart, list = [], stack = !options.once && [], fire = function(data) {
            memory = options.memory && data;
            fired = true;
            firingIndex = firingStart || 0;
            firingStart = 0;
            firingLength = list.length;
            firing = true;
            for (;list && firingIndex < firingLength; firingIndex++) {
                if (list[firingIndex].apply(data[0], data[1]) === false && options.stopOnFalse) {
                    memory = false;
                    break;
                }
            }
            firing = false;
            if (list) {
                if (stack) {
                    if (stack.length) {
                        fire(stack.shift());
                    }
                } else if (memory) {
                    list = [];
                } else {
                    self.disable();
                }
            }
        }, self = {
            add: function() {
                if (list) {
                    var start = list.length;
                    (function add(args) {
                        jQuery.each(args, function(_, arg) {
                            var type = jQuery.type(arg);
                            if (type === "function") {
                                if (!options.unique || !self.has(arg)) {
                                    list.push(arg);
                                }
                            } else if (arg && arg.length && type !== "string") {
                                add(arg);
                            }
                        });
                    })(arguments);
                    if (firing) {
                        firingLength = list.length;
                    } else if (memory) {
                        firingStart = start;
                        fire(memory);
                    }
                }
                return this;
            },
            remove: function() {
                if (list) {
                    jQuery.each(arguments, function(_, arg) {
                        var index;
                        while ((index = jQuery.inArray(arg, list, index)) > -1) {
                            list.splice(index, 1);
                            if (firing) {
                                if (index <= firingLength) {
                                    firingLength--;
                                }
                                if (index <= firingIndex) {
                                    firingIndex--;
                                }
                            }
                        }
                    });
                }
                return this;
            },
            has: function(fn) {
                return fn ? jQuery.inArray(fn, list) > -1 : !!(list && list.length);
            },
            empty: function() {
                list = [];
                firingLength = 0;
                return this;
            },
            disable: function() {
                list = stack = memory = undefined;
                return this;
            },
            disabled: function() {
                return !list;
            },
            lock: function() {
                stack = undefined;
                if (!memory) {
                    self.disable();
                }
                return this;
            },
            locked: function() {
                return !stack;
            },
            fireWith: function(context, args) {
                if (list && (!fired || stack)) {
                    args = args || [];
                    args = [ context, args.slice ? args.slice() : args ];
                    if (firing) {
                        stack.push(args);
                    } else {
                        fire(args);
                    }
                }
                return this;
            },
            fire: function() {
                self.fireWith(this, arguments);
                return this;
            },
            fired: function() {
                return !!fired;
            }
        };
        return self;
    };
    jQuery.extend({
        Deferred: function(func) {
            var tuples = [ [ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ], [ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ], [ "notify", "progress", jQuery.Callbacks("memory") ] ], state = "pending", promise = {
                state: function() {
                    return state;
                },
                always: function() {
                    deferred.done(arguments).fail(arguments);
                    return this;
                },
                then: function() {
                    var fns = arguments;
                    return jQuery.Deferred(function(newDefer) {
                        jQuery.each(tuples, function(i, tuple) {
                            var fn = jQuery.isFunction(fns[i]) && fns[i];
                            deferred[tuple[1]](function() {
                                var returned = fn && fn.apply(this, arguments);
                                if (returned && jQuery.isFunction(returned.promise)) {
                                    returned.promise().done(newDefer.resolve).fail(newDefer.reject).progress(newDefer.notify);
                                } else {
                                    newDefer[tuple[0] + "With"](this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments);
                                }
                            });
                        });
                        fns = null;
                    }).promise();
                },
                promise: function(obj) {
                    return obj != null ? jQuery.extend(obj, promise) : promise;
                }
            }, deferred = {};
            promise.pipe = promise.then;
            jQuery.each(tuples, function(i, tuple) {
                var list = tuple[2], stateString = tuple[3];
                promise[tuple[1]] = list.add;
                if (stateString) {
                    list.add(function() {
                        state = stateString;
                    }, tuples[i ^ 1][2].disable, tuples[2][2].lock);
                }
                deferred[tuple[0]] = function() {
                    deferred[tuple[0] + "With"](this === deferred ? promise : this, arguments);
                    return this;
                };
                deferred[tuple[0] + "With"] = list.fireWith;
            });
            promise.promise(deferred);
            if (func) {
                func.call(deferred, deferred);
            }
            return deferred;
        },
        when: function(subordinate) {
            var i = 0, resolveValues = slice.call(arguments), length = resolveValues.length, remaining = length !== 1 || subordinate && jQuery.isFunction(subordinate.promise) ? length : 0, deferred = remaining === 1 ? subordinate : jQuery.Deferred(), updateFunc = function(i, contexts, values) {
                return function(value) {
                    contexts[i] = this;
                    values[i] = arguments.length > 1 ? slice.call(arguments) : value;
                    if (values === progressValues) {
                        deferred.notifyWith(contexts, values);
                    } else if (!--remaining) {
                        deferred.resolveWith(contexts, values);
                    }
                };
            }, progressValues, progressContexts, resolveContexts;
            if (length > 1) {
                progressValues = new Array(length);
                progressContexts = new Array(length);
                resolveContexts = new Array(length);
                for (;i < length; i++) {
                    if (resolveValues[i] && jQuery.isFunction(resolveValues[i].promise)) {
                        resolveValues[i].promise().done(updateFunc(i, resolveContexts, resolveValues)).fail(deferred.reject).progress(updateFunc(i, progressContexts, progressValues));
                    } else {
                        --remaining;
                    }
                }
            }
            if (!remaining) {
                deferred.resolveWith(resolveContexts, resolveValues);
            }
            return deferred.promise();
        }
    });
    var readyList;
    jQuery.fn.ready = function(fn) {
        jQuery.ready.promise().done(fn);
        return this;
    };
    jQuery.extend({
        isReady: false,
        readyWait: 1,
        holdReady: function(hold) {
            if (hold) {
                jQuery.readyWait++;
            } else {
                jQuery.ready(true);
            }
        },
        ready: function(wait) {
            if (wait === true ? --jQuery.readyWait : jQuery.isReady) {
                return;
            }
            if (!document.body) {
                return setTimeout(jQuery.ready);
            }
            jQuery.isReady = true;
            if (wait !== true && --jQuery.readyWait > 0) {
                return;
            }
            readyList.resolveWith(document, [ jQuery ]);
            if (jQuery.fn.triggerHandler) {
                jQuery(document).triggerHandler("ready");
                jQuery(document).off("ready");
            }
        }
    });
    function detach() {
        if (document.addEventListener) {
            document.removeEventListener("DOMContentLoaded", completed, false);
            window.removeEventListener("load", completed, false);
        } else {
            document.detachEvent("onreadystatechange", completed);
            window.detachEvent("onload", completed);
        }
    }
    function completed() {
        if (document.addEventListener || event.type === "load" || document.readyState === "complete") {
            detach();
            jQuery.ready();
        }
    }
    jQuery.ready.promise = function(obj) {
        if (!readyList) {
            readyList = jQuery.Deferred();
            if (document.readyState === "complete") {
                setTimeout(jQuery.ready);
            } else if (document.addEventListener) {
                document.addEventListener("DOMContentLoaded", completed, false);
                window.addEventListener("load", completed, false);
            } else {
                document.attachEvent("onreadystatechange", completed);
                window.attachEvent("onload", completed);
                var top = false;
                try {
                    top = window.frameElement == null && document.documentElement;
                } catch (e) {}
                if (top && top.doScroll) {
                    (function doScrollCheck() {
                        if (!jQuery.isReady) {
                            try {
                                top.doScroll("left");
                            } catch (e) {
                                return setTimeout(doScrollCheck, 50);
                            }
                            detach();
                            jQuery.ready();
                        }
                    })();
                }
            }
        }
        return readyList.promise(obj);
    };
    var strundefined = typeof undefined;
    var i;
    for (i in jQuery(support)) {
        break;
    }
    support.ownLast = i !== "0";
    support.inlineBlockNeedsLayout = false;
    jQuery(function() {
        var val, div, body, container;
        body = document.getElementsByTagName("body")[0];
        if (!body || !body.style) {
            return;
        }
        div = document.createElement("div");
        container = document.createElement("div");
        container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
        body.appendChild(container).appendChild(div);
        if (typeof div.style.zoom !== strundefined) {
            div.style.cssText = "display:inline;margin:0;border:0;padding:1px;width:1px;zoom:1";
            support.inlineBlockNeedsLayout = val = div.offsetWidth === 3;
            if (val) {
                body.style.zoom = 1;
            }
        }
        body.removeChild(container);
    });
    (function() {
        var div = document.createElement("div");
        if (support.deleteExpando == null) {
            support.deleteExpando = true;
            try {
                delete div.test;
            } catch (e) {
                support.deleteExpando = false;
            }
        }
        div = null;
    })();
    jQuery.acceptData = function(elem) {
        var noData = jQuery.noData[(elem.nodeName + " ").toLowerCase()], nodeType = +elem.nodeType || 1;
        return nodeType !== 1 && nodeType !== 9 ? false : !noData || noData !== true && elem.getAttribute("classid") === noData;
    };
    var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/, rmultiDash = /([A-Z])/g;
    function dataAttr(elem, key, data) {
        if (data === undefined && elem.nodeType === 1) {
            var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();
            data = elem.getAttribute(name);
            if (typeof data === "string") {
                try {
                    data = data === "true" ? true : data === "false" ? false : data === "null" ? null : +data + "" === data ? +data : rbrace.test(data) ? jQuery.parseJSON(data) : data;
                } catch (e) {}
                jQuery.data(elem, key, data);
            } else {
                data = undefined;
            }
        }
        return data;
    }
    function isEmptyDataObject(obj) {
        var name;
        for (name in obj) {
            if (name === "data" && jQuery.isEmptyObject(obj[name])) {
                continue;
            }
            if (name !== "toJSON") {
                return false;
            }
        }
        return true;
    }
    function internalData(elem, name, data, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }
        var ret, thisCache, internalKey = jQuery.expando, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[internalKey] : elem[internalKey] && internalKey;
        if ((!id || !cache[id] || !pvt && !cache[id].data) && data === undefined && typeof name === "string") {
            return;
        }
        if (!id) {
            if (isNode) {
                id = elem[internalKey] = deletedIds.pop() || jQuery.guid++;
            } else {
                id = internalKey;
            }
        }
        if (!cache[id]) {
            cache[id] = isNode ? {} : {
                toJSON: jQuery.noop
            };
        }
        if (typeof name === "object" || typeof name === "function") {
            if (pvt) {
                cache[id] = jQuery.extend(cache[id], name);
            } else {
                cache[id].data = jQuery.extend(cache[id].data, name);
            }
        }
        thisCache = cache[id];
        if (!pvt) {
            if (!thisCache.data) {
                thisCache.data = {};
            }
            thisCache = thisCache.data;
        }
        if (data !== undefined) {
            thisCache[jQuery.camelCase(name)] = data;
        }
        if (typeof name === "string") {
            ret = thisCache[name];
            if (ret == null) {
                ret = thisCache[jQuery.camelCase(name)];
            }
        } else {
            ret = thisCache;
        }
        return ret;
    }
    function internalRemoveData(elem, name, pvt) {
        if (!jQuery.acceptData(elem)) {
            return;
        }
        var thisCache, i, isNode = elem.nodeType, cache = isNode ? jQuery.cache : elem, id = isNode ? elem[jQuery.expando] : jQuery.expando;
        if (!cache[id]) {
            return;
        }
        if (name) {
            thisCache = pvt ? cache[id] : cache[id].data;
            if (thisCache) {
                if (!jQuery.isArray(name)) {
                    if (name in thisCache) {
                        name = [ name ];
                    } else {
                        name = jQuery.camelCase(name);
                        if (name in thisCache) {
                            name = [ name ];
                        } else {
                            name = name.split(" ");
                        }
                    }
                } else {
                    name = name.concat(jQuery.map(name, jQuery.camelCase));
                }
                i = name.length;
                while (i--) {
                    delete thisCache[name[i]];
                }
                if (pvt ? !isEmptyDataObject(thisCache) : !jQuery.isEmptyObject(thisCache)) {
                    return;
                }
            }
        }
        if (!pvt) {
            delete cache[id].data;
            if (!isEmptyDataObject(cache[id])) {
                return;
            }
        }
        if (isNode) {
            jQuery.cleanData([ elem ], true);
        } else if (support.deleteExpando || cache != cache.window) {
            delete cache[id];
        } else {
            cache[id] = null;
        }
    }
    jQuery.extend({
        cache: {},
        noData: {
            "applet ": true,
            "embed ": true,
            "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
        },
        hasData: function(elem) {
            elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
            return !!elem && !isEmptyDataObject(elem);
        },
        data: function(elem, name, data) {
            return internalData(elem, name, data);
        },
        removeData: function(elem, name) {
            return internalRemoveData(elem, name);
        },
        _data: function(elem, name, data) {
            return internalData(elem, name, data, true);
        },
        _removeData: function(elem, name) {
            return internalRemoveData(elem, name, true);
        }
    });
    jQuery.fn.extend({
        data: function(key, value) {
            var i, name, data, elem = this[0], attrs = elem && elem.attributes;
            if (key === undefined) {
                if (this.length) {
                    data = jQuery.data(elem);
                    if (elem.nodeType === 1 && !jQuery._data(elem, "parsedAttrs")) {
                        i = attrs.length;
                        while (i--) {
                            if (attrs[i]) {
                                name = attrs[i].name;
                                if (name.indexOf("data-") === 0) {
                                    name = jQuery.camelCase(name.slice(5));
                                    dataAttr(elem, name, data[name]);
                                }
                            }
                        }
                        jQuery._data(elem, "parsedAttrs", true);
                    }
                }
                return data;
            }
            if (typeof key === "object") {
                return this.each(function() {
                    jQuery.data(this, key);
                });
            }
            return arguments.length > 1 ? this.each(function() {
                jQuery.data(this, key, value);
            }) : elem ? dataAttr(elem, key, jQuery.data(elem, key)) : undefined;
        },
        removeData: function(key) {
            return this.each(function() {
                jQuery.removeData(this, key);
            });
        }
    });
    jQuery.extend({
        queue: function(elem, type, data) {
            var queue;
            if (elem) {
                type = (type || "fx") + "queue";
                queue = jQuery._data(elem, type);
                if (data) {
                    if (!queue || jQuery.isArray(data)) {
                        queue = jQuery._data(elem, type, jQuery.makeArray(data));
                    } else {
                        queue.push(data);
                    }
                }
                return queue || [];
            }
        },
        dequeue: function(elem, type) {
            type = type || "fx";
            var queue = jQuery.queue(elem, type), startLength = queue.length, fn = queue.shift(), hooks = jQuery._queueHooks(elem, type), next = function() {
                jQuery.dequeue(elem, type);
            };
            if (fn === "inprogress") {
                fn = queue.shift();
                startLength--;
            }
            if (fn) {
                if (type === "fx") {
                    queue.unshift("inprogress");
                }
                delete hooks.stop;
                fn.call(elem, next, hooks);
            }
            if (!startLength && hooks) {
                hooks.empty.fire();
            }
        },
        _queueHooks: function(elem, type) {
            var key = type + "queueHooks";
            return jQuery._data(elem, key) || jQuery._data(elem, key, {
                empty: jQuery.Callbacks("once memory").add(function() {
                    jQuery._removeData(elem, type + "queue");
                    jQuery._removeData(elem, key);
                })
            });
        }
    });
    jQuery.fn.extend({
        queue: function(type, data) {
            var setter = 2;
            if (typeof type !== "string") {
                data = type;
                type = "fx";
                setter--;
            }
            if (arguments.length < setter) {
                return jQuery.queue(this[0], type);
            }
            return data === undefined ? this : this.each(function() {
                var queue = jQuery.queue(this, type, data);
                jQuery._queueHooks(this, type);
                if (type === "fx" && queue[0] !== "inprogress") {
                    jQuery.dequeue(this, type);
                }
            });
        },
        dequeue: function(type) {
            return this.each(function() {
                jQuery.dequeue(this, type);
            });
        },
        clearQueue: function(type) {
            return this.queue(type || "fx", []);
        },
        promise: function(type, obj) {
            var tmp, count = 1, defer = jQuery.Deferred(), elements = this, i = this.length, resolve = function() {
                if (!--count) {
                    defer.resolveWith(elements, [ elements ]);
                }
            };
            if (typeof type !== "string") {
                obj = type;
                type = undefined;
            }
            type = type || "fx";
            while (i--) {
                tmp = jQuery._data(elements[i], type + "queueHooks");
                if (tmp && tmp.empty) {
                    count++;
                    tmp.empty.add(resolve);
                }
            }
            resolve();
            return defer.promise(obj);
        }
    });
    var pnum = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source;
    var cssExpand = [ "Top", "Right", "Bottom", "Left" ];
    var isHidden = function(elem, el) {
        elem = el || elem;
        return jQuery.css(elem, "display") === "none" || !jQuery.contains(elem.ownerDocument, elem);
    };
    var access = jQuery.access = function(elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, length = elems.length, bulk = key == null;
        if (jQuery.type(key) === "object") {
            chainable = true;
            for (i in key) {
                jQuery.access(elems, fn, i, key[i], true, emptyGet, raw);
            }
        } else if (value !== undefined) {
            chainable = true;
            if (!jQuery.isFunction(value)) {
                raw = true;
            }
            if (bulk) {
                if (raw) {
                    fn.call(elems, value);
                    fn = null;
                } else {
                    bulk = fn;
                    fn = function(elem, key, value) {
                        return bulk.call(jQuery(elem), value);
                    };
                }
            }
            if (fn) {
                for (;i < length; i++) {
                    fn(elems[i], key, raw ? value : value.call(elems[i], i, fn(elems[i], key)));
                }
            }
        }
        return chainable ? elems : bulk ? fn.call(elems) : length ? fn(elems[0], key) : emptyGet;
    };
    var rcheckableType = /^(?:checkbox|radio)$/i;
    (function() {
        var input = document.createElement("input"), div = document.createElement("div"), fragment = document.createDocumentFragment();
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        support.leadingWhitespace = div.firstChild.nodeType === 3;
        support.tbody = !div.getElementsByTagName("tbody").length;
        support.htmlSerialize = !!div.getElementsByTagName("link").length;
        support.html5Clone = document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>";
        input.type = "checkbox";
        input.checked = true;
        fragment.appendChild(input);
        support.appendChecked = input.checked;
        div.innerHTML = "<textarea>x</textarea>";
        support.noCloneChecked = !!div.cloneNode(true).lastChild.defaultValue;
        fragment.appendChild(div);
        div.innerHTML = "<input type='radio' checked='checked' name='t'/>";
        support.checkClone = div.cloneNode(true).cloneNode(true).lastChild.checked;
        support.noCloneEvent = true;
        if (div.attachEvent) {
            div.attachEvent("onclick", function() {
                support.noCloneEvent = false;
            });
            div.cloneNode(true).click();
        }
        if (support.deleteExpando == null) {
            support.deleteExpando = true;
            try {
                delete div.test;
            } catch (e) {
                support.deleteExpando = false;
            }
        }
    })();
    (function() {
        var i, eventName, div = document.createElement("div");
        for (i in {
            submit: true,
            change: true,
            focusin: true
        }) {
            eventName = "on" + i;
            if (!(support[i + "Bubbles"] = eventName in window)) {
                div.setAttribute(eventName, "t");
                support[i + "Bubbles"] = div.attributes[eventName].expando === false;
            }
        }
        div = null;
    })();
    var rformElems = /^(?:input|select|textarea)$/i, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;
    function returnTrue() {
        return true;
    }
    function returnFalse() {
        return false;
    }
    function safeActiveElement() {
        try {
            return document.activeElement;
        } catch (err) {}
    }
    jQuery.event = {
        global: {},
        add: function(elem, types, handler, data, selector) {
            var tmp, events, t, handleObjIn, special, eventHandle, handleObj, handlers, type, namespaces, origType, elemData = jQuery._data(elem);
            if (!elemData) {
                return;
            }
            if (handler.handler) {
                handleObjIn = handler;
                handler = handleObjIn.handler;
                selector = handleObjIn.selector;
            }
            if (!handler.guid) {
                handler.guid = jQuery.guid++;
            }
            if (!(events = elemData.events)) {
                events = elemData.events = {};
            }
            if (!(eventHandle = elemData.handle)) {
                eventHandle = elemData.handle = function(e) {
                    return typeof jQuery !== strundefined && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
                };
                eventHandle.elem = elem;
            }
            types = (types || "").match(rnotwhite) || [ "" ];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();
                if (!type) {
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                special = jQuery.event.special[type] || {};
                handleObj = jQuery.extend({
                    type: type,
                    origType: origType,
                    data: data,
                    handler: handler,
                    guid: handler.guid,
                    selector: selector,
                    needsContext: selector && jQuery.expr.match.needsContext.test(selector),
                    namespace: namespaces.join(".")
                }, handleObjIn);
                if (!(handlers = events[type])) {
                    handlers = events[type] = [];
                    handlers.delegateCount = 0;
                    if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
                        if (elem.addEventListener) {
                            elem.addEventListener(type, eventHandle, false);
                        } else if (elem.attachEvent) {
                            elem.attachEvent("on" + type, eventHandle);
                        }
                    }
                }
                if (special.add) {
                    special.add.call(elem, handleObj);
                    if (!handleObj.handler.guid) {
                        handleObj.handler.guid = handler.guid;
                    }
                }
                if (selector) {
                    handlers.splice(handlers.delegateCount++, 0, handleObj);
                } else {
                    handlers.push(handleObj);
                }
                jQuery.event.global[type] = true;
            }
            elem = null;
        },
        remove: function(elem, types, handler, selector, mappedTypes) {
            var j, handleObj, tmp, origCount, t, events, special, handlers, type, namespaces, origType, elemData = jQuery.hasData(elem) && jQuery._data(elem);
            if (!elemData || !(events = elemData.events)) {
                return;
            }
            types = (types || "").match(rnotwhite) || [ "" ];
            t = types.length;
            while (t--) {
                tmp = rtypenamespace.exec(types[t]) || [];
                type = origType = tmp[1];
                namespaces = (tmp[2] || "").split(".").sort();
                if (!type) {
                    for (type in events) {
                        jQuery.event.remove(elem, type + types[t], handler, selector, true);
                    }
                    continue;
                }
                special = jQuery.event.special[type] || {};
                type = (selector ? special.delegateType : special.bindType) || type;
                handlers = events[type] || [];
                tmp = tmp[2] && new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)");
                origCount = j = handlers.length;
                while (j--) {
                    handleObj = handlers[j];
                    if ((mappedTypes || origType === handleObj.origType) && (!handler || handler.guid === handleObj.guid) && (!tmp || tmp.test(handleObj.namespace)) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector)) {
                        handlers.splice(j, 1);
                        if (handleObj.selector) {
                            handlers.delegateCount--;
                        }
                        if (special.remove) {
                            special.remove.call(elem, handleObj);
                        }
                    }
                }
                if (origCount && !handlers.length) {
                    if (!special.teardown || special.teardown.call(elem, namespaces, elemData.handle) === false) {
                        jQuery.removeEvent(elem, type, elemData.handle);
                    }
                    delete events[type];
                }
            }
            if (jQuery.isEmptyObject(events)) {
                delete elemData.handle;
                jQuery._removeData(elem, "events");
            }
        },
        trigger: function(event, data, elem, onlyHandlers) {
            var handle, ontype, cur, bubbleType, special, tmp, i, eventPath = [ elem || document ], type = hasOwn.call(event, "type") ? event.type : event, namespaces = hasOwn.call(event, "namespace") ? event.namespace.split(".") : [];
            cur = tmp = elem = elem || document;
            if (elem.nodeType === 3 || elem.nodeType === 8) {
                return;
            }
            if (rfocusMorph.test(type + jQuery.event.triggered)) {
                return;
            }
            if (type.indexOf(".") >= 0) {
                namespaces = type.split(".");
                type = namespaces.shift();
                namespaces.sort();
            }
            ontype = type.indexOf(":") < 0 && "on" + type;
            event = event[jQuery.expando] ? event : new jQuery.Event(type, typeof event === "object" && event);
            event.isTrigger = onlyHandlers ? 2 : 3;
            event.namespace = namespaces.join(".");
            event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            event.result = undefined;
            if (!event.target) {
                event.target = elem;
            }
            data = data == null ? [ event ] : jQuery.makeArray(data, [ event ]);
            special = jQuery.event.special[type] || {};
            if (!onlyHandlers && special.trigger && special.trigger.apply(elem, data) === false) {
                return;
            }
            if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {
                bubbleType = special.delegateType || type;
                if (!rfocusMorph.test(bubbleType + type)) {
                    cur = cur.parentNode;
                }
                for (;cur; cur = cur.parentNode) {
                    eventPath.push(cur);
                    tmp = cur;
                }
                if (tmp === (elem.ownerDocument || document)) {
                    eventPath.push(tmp.defaultView || tmp.parentWindow || window);
                }
            }
            i = 0;
            while ((cur = eventPath[i++]) && !event.isPropagationStopped()) {
                event.type = i > 1 ? bubbleType : special.bindType || type;
                handle = (jQuery._data(cur, "events") || {})[event.type] && jQuery._data(cur, "handle");
                if (handle) {
                    handle.apply(cur, data);
                }
                handle = ontype && cur[ontype];
                if (handle && handle.apply && jQuery.acceptData(cur)) {
                    event.result = handle.apply(cur, data);
                    if (event.result === false) {
                        event.preventDefault();
                    }
                }
            }
            event.type = type;
            if (!onlyHandlers && !event.isDefaultPrevented()) {
                if ((!special._default || special._default.apply(eventPath.pop(), data) === false) && jQuery.acceptData(elem)) {
                    if (ontype && elem[type] && !jQuery.isWindow(elem)) {
                        tmp = elem[ontype];
                        if (tmp) {
                            elem[ontype] = null;
                        }
                        jQuery.event.triggered = type;
                        try {
                            elem[type]();
                        } catch (e) {}
                        jQuery.event.triggered = undefined;
                        if (tmp) {
                            elem[ontype] = tmp;
                        }
                    }
                }
            }
            return event.result;
        },
        dispatch: function(event) {
            event = jQuery.event.fix(event);
            var i, ret, handleObj, matched, j, handlerQueue = [], args = slice.call(arguments), handlers = (jQuery._data(this, "events") || {})[event.type] || [], special = jQuery.event.special[event.type] || {};
            args[0] = event;
            event.delegateTarget = this;
            if (special.preDispatch && special.preDispatch.call(this, event) === false) {
                return;
            }
            handlerQueue = jQuery.event.handlers.call(this, event, handlers);
            i = 0;
            while ((matched = handlerQueue[i++]) && !event.isPropagationStopped()) {
                event.currentTarget = matched.elem;
                j = 0;
                while ((handleObj = matched.handlers[j++]) && !event.isImmediatePropagationStopped()) {
                    if (!event.namespace_re || event.namespace_re.test(handleObj.namespace)) {
                        event.handleObj = handleObj;
                        event.data = handleObj.data;
                        ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler).apply(matched.elem, args);
                        if (ret !== undefined) {
                            if ((event.result = ret) === false) {
                                event.preventDefault();
                                event.stopPropagation();
                            }
                        }
                    }
                }
            }
            if (special.postDispatch) {
                special.postDispatch.call(this, event);
            }
            return event.result;
        },
        handlers: function(event, handlers) {
            var sel, handleObj, matches, i, handlerQueue = [], delegateCount = handlers.delegateCount, cur = event.target;
            if (delegateCount && cur.nodeType && (!event.button || event.type !== "click")) {
                for (;cur != this; cur = cur.parentNode || this) {
                    if (cur.nodeType === 1 && (cur.disabled !== true || event.type !== "click")) {
                        matches = [];
                        for (i = 0; i < delegateCount; i++) {
                            handleObj = handlers[i];
                            sel = handleObj.selector + " ";
                            if (matches[sel] === undefined) {
                                matches[sel] = handleObj.needsContext ? jQuery(sel, this).index(cur) >= 0 : jQuery.find(sel, this, null, [ cur ]).length;
                            }
                            if (matches[sel]) {
                                matches.push(handleObj);
                            }
                        }
                        if (matches.length) {
                            handlerQueue.push({
                                elem: cur,
                                handlers: matches
                            });
                        }
                    }
                }
            }
            if (delegateCount < handlers.length) {
                handlerQueue.push({
                    elem: this,
                    handlers: handlers.slice(delegateCount)
                });
            }
            return handlerQueue;
        },
        fix: function(event) {
            if (event[jQuery.expando]) {
                return event;
            }
            var i, prop, copy, type = event.type, originalEvent = event, fixHook = this.fixHooks[type];
            if (!fixHook) {
                this.fixHooks[type] = fixHook = rmouseEvent.test(type) ? this.mouseHooks : rkeyEvent.test(type) ? this.keyHooks : {};
            }
            copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;
            event = new jQuery.Event(originalEvent);
            i = copy.length;
            while (i--) {
                prop = copy[i];
                event[prop] = originalEvent[prop];
            }
            if (!event.target) {
                event.target = originalEvent.srcElement || document;
            }
            if (event.target.nodeType === 3) {
                event.target = event.target.parentNode;
            }
            event.metaKey = !!event.metaKey;
            return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
        },
        props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
        fixHooks: {},
        keyHooks: {
            props: "char charCode key keyCode".split(" "),
            filter: function(event, original) {
                if (event.which == null) {
                    event.which = original.charCode != null ? original.charCode : original.keyCode;
                }
                return event;
            }
        },
        mouseHooks: {
            props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
            filter: function(event, original) {
                var body, eventDoc, doc, button = original.button, fromElement = original.fromElement;
                if (event.pageX == null && original.clientX != null) {
                    eventDoc = event.target.ownerDocument || document;
                    doc = eventDoc.documentElement;
                    body = eventDoc.body;
                    event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
                    event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
                }
                if (!event.relatedTarget && fromElement) {
                    event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
                }
                if (!event.which && button !== undefined) {
                    event.which = button & 1 ? 1 : button & 2 ? 3 : button & 4 ? 2 : 0;
                }
                return event;
            }
        },
        special: {
            load: {
                noBubble: true
            },
            focus: {
                trigger: function() {
                    if (this !== safeActiveElement() && this.focus) {
                        try {
                            this.focus();
                            return false;
                        } catch (e) {}
                    }
                },
                delegateType: "focusin"
            },
            blur: {
                trigger: function() {
                    if (this === safeActiveElement() && this.blur) {
                        this.blur();
                        return false;
                    }
                },
                delegateType: "focusout"
            },
            click: {
                trigger: function() {
                    if (jQuery.nodeName(this, "input") && this.type === "checkbox" && this.click) {
                        this.click();
                        return false;
                    }
                },
                _default: function(event) {
                    return jQuery.nodeName(event.target, "a");
                }
            },
            beforeunload: {
                postDispatch: function(event) {
                    if (event.result !== undefined && event.originalEvent) {
                        event.originalEvent.returnValue = event.result;
                    }
                }
            }
        },
        simulate: function(type, elem, event, bubble) {
            var e = jQuery.extend(new jQuery.Event(), event, {
                type: type,
                isSimulated: true,
                originalEvent: {}
            });
            if (bubble) {
                jQuery.event.trigger(e, null, elem);
            } else {
                jQuery.event.dispatch.call(elem, e);
            }
            if (e.isDefaultPrevented()) {
                event.preventDefault();
            }
        }
    };
    jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
        if (elem.removeEventListener) {
            elem.removeEventListener(type, handle, false);
        }
    } : function(elem, type, handle) {
        var name = "on" + type;
        if (elem.detachEvent) {
            if (typeof elem[name] === strundefined) {
                elem[name] = null;
            }
            elem.detachEvent(name, handle);
        }
    };
    jQuery.Event = function(src, props) {
        if (!(this instanceof jQuery.Event)) {
            return new jQuery.Event(src, props);
        }
        if (src && src.type) {
            this.originalEvent = src;
            this.type = src.type;
            this.isDefaultPrevented = src.defaultPrevented || src.defaultPrevented === undefined && src.returnValue === false ? returnTrue : returnFalse;
        } else {
            this.type = src;
        }
        if (props) {
            jQuery.extend(this, props);
        }
        this.timeStamp = src && src.timeStamp || jQuery.now();
        this[jQuery.expando] = true;
    };
    jQuery.Event.prototype = {
        isDefaultPrevented: returnFalse,
        isPropagationStopped: returnFalse,
        isImmediatePropagationStopped: returnFalse,
        preventDefault: function() {
            var e = this.originalEvent;
            this.isDefaultPrevented = returnTrue;
            if (!e) {
                return;
            }
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        stopPropagation: function() {
            var e = this.originalEvent;
            this.isPropagationStopped = returnTrue;
            if (!e) {
                return;
            }
            if (e.stopPropagation) {
                e.stopPropagation();
            }
            e.cancelBubble = true;
        },
        stopImmediatePropagation: function() {
            var e = this.originalEvent;
            this.isImmediatePropagationStopped = returnTrue;
            if (e && e.stopImmediatePropagation) {
                e.stopImmediatePropagation();
            }
            this.stopPropagation();
        }
    };
    jQuery.each({
        mouseenter: "mouseover",
        mouseleave: "mouseout",
        pointerenter: "pointerover",
        pointerleave: "pointerout"
    }, function(orig, fix) {
        jQuery.event.special[orig] = {
            delegateType: fix,
            bindType: fix,
            handle: function(event) {
                var ret, target = this, related = event.relatedTarget, handleObj = event.handleObj;
                if (!related || related !== target && !jQuery.contains(target, related)) {
                    event.type = handleObj.origType;
                    ret = handleObj.handler.apply(this, arguments);
                    event.type = fix;
                }
                return ret;
            }
        };
    });
    if (!support.submitBubbles) {
        jQuery.event.special.submit = {
            setup: function() {
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }
                jQuery.event.add(this, "click._submit keypress._submit", function(e) {
                    var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
                    if (form && !jQuery._data(form, "submitBubbles")) {
                        jQuery.event.add(form, "submit._submit", function(event) {
                            event._submit_bubble = true;
                        });
                        jQuery._data(form, "submitBubbles", true);
                    }
                });
            },
            postDispatch: function(event) {
                if (event._submit_bubble) {
                    delete event._submit_bubble;
                    if (this.parentNode && !event.isTrigger) {
                        jQuery.event.simulate("submit", this.parentNode, event, true);
                    }
                }
            },
            teardown: function() {
                if (jQuery.nodeName(this, "form")) {
                    return false;
                }
                jQuery.event.remove(this, "._submit");
            }
        };
    }
    if (!support.changeBubbles) {
        jQuery.event.special.change = {
            setup: function() {
                if (rformElems.test(this.nodeName)) {
                    if (this.type === "checkbox" || this.type === "radio") {
                        jQuery.event.add(this, "propertychange._change", function(event) {
                            if (event.originalEvent.propertyName === "checked") {
                                this._just_changed = true;
                            }
                        });
                        jQuery.event.add(this, "click._change", function(event) {
                            if (this._just_changed && !event.isTrigger) {
                                this._just_changed = false;
                            }
                            jQuery.event.simulate("change", this, event, true);
                        });
                    }
                    return false;
                }
                jQuery.event.add(this, "beforeactivate._change", function(e) {
                    var elem = e.target;
                    if (rformElems.test(elem.nodeName) && !jQuery._data(elem, "changeBubbles")) {
                        jQuery.event.add(elem, "change._change", function(event) {
                            if (this.parentNode && !event.isSimulated && !event.isTrigger) {
                                jQuery.event.simulate("change", this.parentNode, event, true);
                            }
                        });
                        jQuery._data(elem, "changeBubbles", true);
                    }
                });
            },
            handle: function(event) {
                var elem = event.target;
                if (this !== elem || event.isSimulated || event.isTrigger || elem.type !== "radio" && elem.type !== "checkbox") {
                    return event.handleObj.handler.apply(this, arguments);
                }
            },
            teardown: function() {
                jQuery.event.remove(this, "._change");
                return !rformElems.test(this.nodeName);
            }
        };
    }
    if (!support.focusinBubbles) {
        jQuery.each({
            focus: "focusin",
            blur: "focusout"
        }, function(orig, fix) {
            var handler = function(event) {
                jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
            };
            jQuery.event.special[fix] = {
                setup: function() {
                    var doc = this.ownerDocument || this, attaches = jQuery._data(doc, fix);
                    if (!attaches) {
                        doc.addEventListener(orig, handler, true);
                    }
                    jQuery._data(doc, fix, (attaches || 0) + 1);
                },
                teardown: function() {
                    var doc = this.ownerDocument || this, attaches = jQuery._data(doc, fix) - 1;
                    if (!attaches) {
                        doc.removeEventListener(orig, handler, true);
                        jQuery._removeData(doc, fix);
                    } else {
                        jQuery._data(doc, fix, attaches);
                    }
                }
            };
        });
    }
    jQuery.fn.extend({
        on: function(types, selector, data, fn, one) {
            var type, origFn;
            if (typeof types === "object") {
                if (typeof selector !== "string") {
                    data = data || selector;
                    selector = undefined;
                }
                for (type in types) {
                    this.on(type, selector, data, types[type], one);
                }
                return this;
            }
            if (data == null && fn == null) {
                fn = selector;
                data = selector = undefined;
            } else if (fn == null) {
                if (typeof selector === "string") {
                    fn = data;
                    data = undefined;
                } else {
                    fn = data;
                    data = selector;
                    selector = undefined;
                }
            }
            if (fn === false) {
                fn = returnFalse;
            } else if (!fn) {
                return this;
            }
            if (one === 1) {
                origFn = fn;
                fn = function(event) {
                    jQuery().off(event);
                    return origFn.apply(this, arguments);
                };
                fn.guid = origFn.guid || (origFn.guid = jQuery.guid++);
            }
            return this.each(function() {
                jQuery.event.add(this, types, fn, data, selector);
            });
        },
        one: function(types, selector, data, fn) {
            return this.on(types, selector, data, fn, 1);
        },
        off: function(types, selector, fn) {
            var handleObj, type;
            if (types && types.preventDefault && types.handleObj) {
                handleObj = types.handleObj;
                jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType, handleObj.selector, handleObj.handler);
                return this;
            }
            if (typeof types === "object") {
                for (type in types) {
                    this.off(type, selector, types[type]);
                }
                return this;
            }
            if (selector === false || typeof selector === "function") {
                fn = selector;
                selector = undefined;
            }
            if (fn === false) {
                fn = returnFalse;
            }
            return this.each(function() {
                jQuery.event.remove(this, types, fn, selector);
            });
        },
        trigger: function(type, data) {
            return this.each(function() {
                jQuery.event.trigger(type, data, this);
            });
        },
        triggerHandler: function(type, data) {
            var elem = this[0];
            if (elem) {
                return jQuery.event.trigger(type, data, elem, true);
            }
        }
    });
    function createSafeFragment(document) {
        var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();
        if (safeFrag.createElement) {
            while (list.length) {
                safeFrag.createElement(list.pop());
            }
        }
        return safeFrag;
    }
    var nodeNames = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:null|\d+)"/g, rnoshimcache = new RegExp("<(?:" + nodeNames + ")[\\s/>]", "i"), rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style|link)/i, rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /^$|\/(?:java|ecma)script/i, rscriptTypeMasked = /^true\/(.*)/, rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g, wrapMap = {
        option: [ 1, "<select multiple='multiple'>", "</select>" ],
        legend: [ 1, "<fieldset>", "</fieldset>" ],
        area: [ 1, "<map>", "</map>" ],
        param: [ 1, "<object>", "</object>" ],
        thead: [ 1, "<table>", "</table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
        _default: support.htmlSerialize ? [ 0, "", "" ] : [ 1, "X<div>", "</div>" ]
    }, safeFragment = createSafeFragment(document), fragmentDiv = safeFragment.appendChild(document.createElement("div"));
    wrapMap.optgroup = wrapMap.option;
    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    function getAll(context, tag) {
        var elems, elem, i = 0, found = typeof context.getElementsByTagName !== strundefined ? context.getElementsByTagName(tag || "*") : typeof context.querySelectorAll !== strundefined ? context.querySelectorAll(tag || "*") : undefined;
        if (!found) {
            for (found = [], elems = context.childNodes || context; (elem = elems[i]) != null; i++) {
                if (!tag || jQuery.nodeName(elem, tag)) {
                    found.push(elem);
                } else {
                    jQuery.merge(found, getAll(elem, tag));
                }
            }
        }
        return tag === undefined || tag && jQuery.nodeName(context, tag) ? jQuery.merge([ context ], found) : found;
    }
    function fixDefaultChecked(elem) {
        if (rcheckableType.test(elem.type)) {
            elem.defaultChecked = elem.checked;
        }
    }
    function manipulationTarget(elem, content) {
        return jQuery.nodeName(elem, "table") && jQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, "tr") ? elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody")) : elem;
    }
    function disableScript(elem) {
        elem.type = (jQuery.find.attr(elem, "type") !== null) + "/" + elem.type;
        return elem;
    }
    function restoreScript(elem) {
        var match = rscriptTypeMasked.exec(elem.type);
        if (match) {
            elem.type = match[1];
        } else {
            elem.removeAttribute("type");
        }
        return elem;
    }
    function setGlobalEval(elems, refElements) {
        var elem, i = 0;
        for (;(elem = elems[i]) != null; i++) {
            jQuery._data(elem, "globalEval", !refElements || jQuery._data(refElements[i], "globalEval"));
        }
    }
    function cloneCopyEvent(src, dest) {
        if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
            return;
        }
        var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;
        if (events) {
            delete curData.handle;
            curData.events = {};
            for (type in events) {
                for (i = 0, l = events[type].length; i < l; i++) {
                    jQuery.event.add(dest, type, events[type][i]);
                }
            }
        }
        if (curData.data) {
            curData.data = jQuery.extend({}, curData.data);
        }
    }
    function fixCloneNodeIssues(src, dest) {
        var nodeName, e, data;
        if (dest.nodeType !== 1) {
            return;
        }
        nodeName = dest.nodeName.toLowerCase();
        if (!support.noCloneEvent && dest[jQuery.expando]) {
            data = jQuery._data(dest);
            for (e in data.events) {
                jQuery.removeEvent(dest, e, data.handle);
            }
            dest.removeAttribute(jQuery.expando);
        }
        if (nodeName === "script" && dest.text !== src.text) {
            disableScript(dest).text = src.text;
            restoreScript(dest);
        } else if (nodeName === "object") {
            if (dest.parentNode) {
                dest.outerHTML = src.outerHTML;
            }
            if (support.html5Clone && (src.innerHTML && !jQuery.trim(dest.innerHTML))) {
                dest.innerHTML = src.innerHTML;
            }
        } else if (nodeName === "input" && rcheckableType.test(src.type)) {
            dest.defaultChecked = dest.checked = src.checked;
            if (dest.value !== src.value) {
                dest.value = src.value;
            }
        } else if (nodeName === "option") {
            dest.defaultSelected = dest.selected = src.defaultSelected;
        } else if (nodeName === "input" || nodeName === "textarea") {
            dest.defaultValue = src.defaultValue;
        }
    }
    jQuery.extend({
        clone: function(elem, dataAndEvents, deepDataAndEvents) {
            var destElements, node, clone, i, srcElements, inPage = jQuery.contains(elem.ownerDocument, elem);
            if (support.html5Clone || jQuery.isXMLDoc(elem) || !rnoshimcache.test("<" + elem.nodeName + ">")) {
                clone = elem.cloneNode(true);
            } else {
                fragmentDiv.innerHTML = elem.outerHTML;
                fragmentDiv.removeChild(clone = fragmentDiv.firstChild);
            }
            if ((!support.noCloneEvent || !support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
                destElements = getAll(clone);
                srcElements = getAll(elem);
                for (i = 0; (node = srcElements[i]) != null; ++i) {
                    if (destElements[i]) {
                        fixCloneNodeIssues(node, destElements[i]);
                    }
                }
            }
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);
                    for (i = 0; (node = srcElements[i]) != null; i++) {
                        cloneCopyEvent(node, destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }
            destElements = getAll(clone, "script");
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inPage && getAll(elem, "script"));
            }
            destElements = srcElements = node = null;
            return clone;
        },
        buildFragment: function(elems, context, scripts, selection) {
            var j, elem, contains, tmp, tag, tbody, wrap, l = elems.length, safe = createSafeFragment(context), nodes = [], i = 0;
            for (;i < l; i++) {
                elem = elems[i];
                if (elem || elem === 0) {
                    if (jQuery.type(elem) === "object") {
                        jQuery.merge(nodes, elem.nodeType ? [ elem ] : elem);
                    } else if (!rhtml.test(elem)) {
                        nodes.push(context.createTextNode(elem));
                    } else {
                        tmp = tmp || safe.appendChild(context.createElement("div"));
                        tag = (rtagName.exec(elem) || [ "", "" ])[1].toLowerCase();
                        wrap = wrapMap[tag] || wrapMap._default;
                        tmp.innerHTML = wrap[1] + elem.replace(rxhtmlTag, "<$1></$2>") + wrap[2];
                        j = wrap[0];
                        while (j--) {
                            tmp = tmp.lastChild;
                        }
                        if (!support.leadingWhitespace && rleadingWhitespace.test(elem)) {
                            nodes.push(context.createTextNode(rleadingWhitespace.exec(elem)[0]));
                        }
                        if (!support.tbody) {
                            elem = tag === "table" && !rtbody.test(elem) ? tmp.firstChild : wrap[1] === "<table>" && !rtbody.test(elem) ? tmp : 0;
                            j = elem && elem.childNodes.length;
                            while (j--) {
                                if (jQuery.nodeName(tbody = elem.childNodes[j], "tbody") && !tbody.childNodes.length) {
                                    elem.removeChild(tbody);
                                }
                            }
                        }
                        jQuery.merge(nodes, tmp.childNodes);
                        tmp.textContent = "";
                        while (tmp.firstChild) {
                            tmp.removeChild(tmp.firstChild);
                        }
                        tmp = safe.lastChild;
                    }
                }
            }
            if (tmp) {
                safe.removeChild(tmp);
            }
            if (!support.appendChecked) {
                jQuery.grep(getAll(nodes, "input"), fixDefaultChecked);
            }
            i = 0;
            while (elem = nodes[i++]) {
                if (selection && jQuery.inArray(elem, selection) !== -1) {
                    continue;
                }
                contains = jQuery.contains(elem.ownerDocument, elem);
                tmp = getAll(safe.appendChild(elem), "script");
                if (contains) {
                    setGlobalEval(tmp);
                }
                if (scripts) {
                    j = 0;
                    while (elem = tmp[j++]) {
                        if (rscriptType.test(elem.type || "")) {
                            scripts.push(elem);
                        }
                    }
                }
            }
            tmp = null;
            return safe;
        },
        cleanData: function(elems, acceptData) {
            var elem, type, id, data, i = 0, internalKey = jQuery.expando, cache = jQuery.cache, deleteExpando = support.deleteExpando, special = jQuery.event.special;
            for (;(elem = elems[i]) != null; i++) {
                if (acceptData || jQuery.acceptData(elem)) {
                    id = elem[internalKey];
                    data = id && cache[id];
                    if (data) {
                        if (data.events) {
                            for (type in data.events) {
                                if (special[type]) {
                                    jQuery.event.remove(elem, type);
                                } else {
                                    jQuery.removeEvent(elem, type, data.handle);
                                }
                            }
                        }
                        if (cache[id]) {
                            delete cache[id];
                            if (deleteExpando) {
                                delete elem[internalKey];
                            } else if (typeof elem.removeAttribute !== strundefined) {
                                elem.removeAttribute(internalKey);
                            } else {
                                elem[internalKey] = null;
                            }
                            deletedIds.push(id);
                        }
                    }
                }
            }
        }
    });
    jQuery.fn.extend({
        text: function(value) {
            return access(this, function(value) {
                return value === undefined ? jQuery.text(this) : this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(value));
            }, null, value, arguments.length);
        },
        append: function() {
            return this.domManip(arguments, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            });
        },
        prepend: function() {
            return this.domManip(arguments, function(elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.insertBefore(elem, target.firstChild);
                }
            });
        },
        before: function() {
            return this.domManip(arguments, function(elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this);
                }
            });
        },
        after: function() {
            return this.domManip(arguments, function(elem) {
                if (this.parentNode) {
                    this.parentNode.insertBefore(elem, this.nextSibling);
                }
            });
        },
        remove: function(selector, keepData) {
            var elem, elems = selector ? jQuery.filter(selector, this) : this, i = 0;
            for (;(elem = elems[i]) != null; i++) {
                if (!keepData && elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem));
                }
                if (elem.parentNode) {
                    if (keepData && jQuery.contains(elem.ownerDocument, elem)) {
                        setGlobalEval(getAll(elem, "script"));
                    }
                    elem.parentNode.removeChild(elem);
                }
            }
            return this;
        },
        empty: function() {
            var elem, i = 0;
            for (;(elem = this[i]) != null; i++) {
                if (elem.nodeType === 1) {
                    jQuery.cleanData(getAll(elem, false));
                }
                while (elem.firstChild) {
                    elem.removeChild(elem.firstChild);
                }
                if (elem.options && jQuery.nodeName(elem, "select")) {
                    elem.options.length = 0;
                }
            }
            return this;
        },
        clone: function(dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map(function() {
                return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
            });
        },
        html: function(value) {
            return access(this, function(value) {
                var elem = this[0] || {}, i = 0, l = this.length;
                if (value === undefined) {
                    return elem.nodeType === 1 ? elem.innerHTML.replace(rinlinejQuery, "") : undefined;
                }
                if (typeof value === "string" && !rnoInnerhtml.test(value) && (support.htmlSerialize || !rnoshimcache.test(value)) && (support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[(rtagName.exec(value) || [ "", "" ])[1].toLowerCase()]) {
                    value = value.replace(rxhtmlTag, "<$1></$2>");
                    try {
                        for (;i < l; i++) {
                            elem = this[i] || {};
                            if (elem.nodeType === 1) {
                                jQuery.cleanData(getAll(elem, false));
                                elem.innerHTML = value;
                            }
                        }
                        elem = 0;
                    } catch (e) {}
                }
                if (elem) {
                    this.empty().append(value);
                }
            }, null, value, arguments.length);
        },
        replaceWith: function() {
            var arg = arguments[0];
            this.domManip(arguments, function(elem) {
                arg = this.parentNode;
                jQuery.cleanData(getAll(this));
                if (arg) {
                    arg.replaceChild(elem, this);
                }
            });
            return arg && (arg.length || arg.nodeType) ? this : this.remove();
        },
        detach: function(selector) {
            return this.remove(selector, true);
        },
        domManip: function(args, callback) {
            args = concat.apply([], args);
            var first, node, hasScripts, scripts, doc, fragment, i = 0, l = this.length, set = this, iNoClone = l - 1, value = args[0], isFunction = jQuery.isFunction(value);
            if (isFunction || l > 1 && typeof value === "string" && !support.checkClone && rchecked.test(value)) {
                return this.each(function(index) {
                    var self = set.eq(index);
                    if (isFunction) {
                        args[0] = value.call(this, index, self.html());
                    }
                    self.domManip(args, callback);
                });
            }
            if (l) {
                fragment = jQuery.buildFragment(args, this[0].ownerDocument, false, this);
                first = fragment.firstChild;
                if (fragment.childNodes.length === 1) {
                    fragment = first;
                }
                if (first) {
                    scripts = jQuery.map(getAll(fragment, "script"), disableScript);
                    hasScripts = scripts.length;
                    for (;i < l; i++) {
                        node = fragment;
                        if (i !== iNoClone) {
                            node = jQuery.clone(node, true, true);
                            if (hasScripts) {
                                jQuery.merge(scripts, getAll(node, "script"));
                            }
                        }
                        callback.call(this[i], node, i);
                    }
                    if (hasScripts) {
                        doc = scripts[scripts.length - 1].ownerDocument;
                        jQuery.map(scripts, restoreScript);
                        for (i = 0; i < hasScripts; i++) {
                            node = scripts[i];
                            if (rscriptType.test(node.type || "") && !jQuery._data(node, "globalEval") && jQuery.contains(doc, node)) {
                                if (node.src) {
                                    if (jQuery._evalUrl) {
                                        jQuery._evalUrl(node.src);
                                    }
                                } else {
                                    jQuery.globalEval((node.text || node.textContent || node.innerHTML || "").replace(rcleanScript, ""));
                                }
                            }
                        }
                    }
                    fragment = first = null;
                }
            }
            return this;
        }
    });
    jQuery.each({
        appendTo: "append",
        prependTo: "prepend",
        insertBefore: "before",
        insertAfter: "after",
        replaceAll: "replaceWith"
    }, function(name, original) {
        jQuery.fn[name] = function(selector) {
            var elems, i = 0, ret = [], insert = jQuery(selector), last = insert.length - 1;
            for (;i <= last; i++) {
                elems = i === last ? this : this.clone(true);
                jQuery(insert[i])[original](elems);
                push.apply(ret, elems.get());
            }
            return this.pushStack(ret);
        };
    });
    var iframe, elemdisplay = {};
    function actualDisplay(name, doc) {
        var style, elem = jQuery(doc.createElement(name)).appendTo(doc.body), display = window.getDefaultComputedStyle && (style = window.getDefaultComputedStyle(elem[0])) ? style.display : jQuery.css(elem[0], "display");
        elem.detach();
        return display;
    }
    function defaultDisplay(nodeName) {
        var doc = document, display = elemdisplay[nodeName];
        if (!display) {
            display = actualDisplay(nodeName, doc);
            if (display === "none" || !display) {
                iframe = (iframe || jQuery("<iframe frameborder='0' width='0' height='0'/>")).appendTo(doc.documentElement);
                doc = (iframe[0].contentWindow || iframe[0].contentDocument).document;
                doc.write();
                doc.close();
                display = actualDisplay(nodeName, doc);
                iframe.detach();
            }
            elemdisplay[nodeName] = display;
        }
        return display;
    }
    (function() {
        var shrinkWrapBlocksVal;
        support.shrinkWrapBlocks = function() {
            if (shrinkWrapBlocksVal != null) {
                return shrinkWrapBlocksVal;
            }
            shrinkWrapBlocksVal = false;
            var div, body, container;
            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                return;
            }
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);
            if (typeof div.style.zoom !== strundefined) {
                div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;" + "padding:1px;width:1px;zoom:1";
                div.appendChild(document.createElement("div")).style.width = "5px";
                shrinkWrapBlocksVal = div.offsetWidth !== 3;
            }
            body.removeChild(container);
            return shrinkWrapBlocksVal;
        };
    })();
    var rmargin = /^margin/;
    var rnumnonpx = new RegExp("^(" + pnum + ")(?!px)[a-z%]+$", "i");
    var getStyles, curCSS, rposition = /^(top|right|bottom|left)$/;
    if (window.getComputedStyle) {
        getStyles = function(elem) {
            return elem.ownerDocument.defaultView.getComputedStyle(elem, null);
        };
        curCSS = function(elem, name, computed) {
            var width, minWidth, maxWidth, ret, style = elem.style;
            computed = computed || getStyles(elem);
            ret = computed ? computed.getPropertyValue(name) || computed[name] : undefined;
            if (computed) {
                if (ret === "" && !jQuery.contains(elem.ownerDocument, elem)) {
                    ret = jQuery.style(elem, name);
                }
                if (rnumnonpx.test(ret) && rmargin.test(name)) {
                    width = style.width;
                    minWidth = style.minWidth;
                    maxWidth = style.maxWidth;
                    style.minWidth = style.maxWidth = style.width = ret;
                    ret = computed.width;
                    style.width = width;
                    style.minWidth = minWidth;
                    style.maxWidth = maxWidth;
                }
            }
            return ret === undefined ? ret : ret + "";
        };
    } else if (document.documentElement.currentStyle) {
        getStyles = function(elem) {
            return elem.currentStyle;
        };
        curCSS = function(elem, name, computed) {
            var left, rs, rsLeft, ret, style = elem.style;
            computed = computed || getStyles(elem);
            ret = computed ? computed[name] : undefined;
            if (ret == null && style && style[name]) {
                ret = style[name];
            }
            if (rnumnonpx.test(ret) && !rposition.test(name)) {
                left = style.left;
                rs = elem.runtimeStyle;
                rsLeft = rs && rs.left;
                if (rsLeft) {
                    rs.left = elem.currentStyle.left;
                }
                style.left = name === "fontSize" ? "1em" : ret;
                ret = style.pixelLeft + "px";
                style.left = left;
                if (rsLeft) {
                    rs.left = rsLeft;
                }
            }
            return ret === undefined ? ret : ret + "" || "auto";
        };
    }
    function addGetHookIf(conditionFn, hookFn) {
        return {
            get: function() {
                var condition = conditionFn();
                if (condition == null) {
                    return;
                }
                if (condition) {
                    delete this.get;
                    return;
                }
                return (this.get = hookFn).apply(this, arguments);
            }
        };
    }
    (function() {
        var div, style, a, pixelPositionVal, boxSizingReliableVal, reliableHiddenOffsetsVal, reliableMarginRightVal;
        div = document.createElement("div");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        a = div.getElementsByTagName("a")[0];
        style = a && a.style;
        if (!style) {
            return;
        }
        style.cssText = "float:left;opacity:.5";
        support.opacity = style.opacity === "0.5";
        support.cssFloat = !!style.cssFloat;
        div.style.backgroundClip = "content-box";
        div.cloneNode(true).style.backgroundClip = "";
        support.clearCloneStyle = div.style.backgroundClip === "content-box";
        support.boxSizing = style.boxSizing === "" || style.MozBoxSizing === "" || style.WebkitBoxSizing === "";
        jQuery.extend(support, {
            reliableHiddenOffsets: function() {
                if (reliableHiddenOffsetsVal == null) {
                    computeStyleTests();
                }
                return reliableHiddenOffsetsVal;
            },
            boxSizingReliable: function() {
                if (boxSizingReliableVal == null) {
                    computeStyleTests();
                }
                return boxSizingReliableVal;
            },
            pixelPosition: function() {
                if (pixelPositionVal == null) {
                    computeStyleTests();
                }
                return pixelPositionVal;
            },
            reliableMarginRight: function() {
                if (reliableMarginRightVal == null) {
                    computeStyleTests();
                }
                return reliableMarginRightVal;
            }
        });
        function computeStyleTests() {
            var div, body, container, contents;
            body = document.getElementsByTagName("body")[0];
            if (!body || !body.style) {
                return;
            }
            div = document.createElement("div");
            container = document.createElement("div");
            container.style.cssText = "position:absolute;border:0;width:0;height:0;top:0;left:-9999px";
            body.appendChild(container).appendChild(div);
            div.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" + "box-sizing:border-box;display:block;margin-top:1%;top:1%;" + "border:1px;padding:1px;width:4px;position:absolute";
            pixelPositionVal = boxSizingReliableVal = false;
            reliableMarginRightVal = true;
            if (window.getComputedStyle) {
                pixelPositionVal = (window.getComputedStyle(div, null) || {}).top !== "1%";
                boxSizingReliableVal = (window.getComputedStyle(div, null) || {
                    width: "4px"
                }).width === "4px";
                contents = div.appendChild(document.createElement("div"));
                contents.style.cssText = div.style.cssText = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" + "box-sizing:content-box;display:block;margin:0;border:0;padding:0";
                contents.style.marginRight = contents.style.width = "0";
                div.style.width = "1px";
                reliableMarginRightVal = !parseFloat((window.getComputedStyle(contents, null) || {}).marginRight);
            }
            div.innerHTML = "<table><tr><td></td><td>t</td></tr></table>";
            contents = div.getElementsByTagName("td");
            contents[0].style.cssText = "margin:0;border:0;padding:0;display:none";
            reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            if (reliableHiddenOffsetsVal) {
                contents[0].style.display = "";
                contents[1].style.display = "none";
                reliableHiddenOffsetsVal = contents[0].offsetHeight === 0;
            }
            body.removeChild(container);
        }
    })();
    jQuery.swap = function(elem, options, callback, args) {
        var ret, name, old = {};
        for (name in options) {
            old[name] = elem.style[name];
            elem.style[name] = options[name];
        }
        ret = callback.apply(elem, args || []);
        for (name in options) {
            elem.style[name] = old[name];
        }
        return ret;
    };
    var ralpha = /alpha\([^)]*\)/i, ropacity = /opacity\s*=\s*([^)]*)/, rdisplayswap = /^(none|table(?!-c[ea]).+)/, rnumsplit = new RegExp("^(" + pnum + ")(.*)$", "i"), rrelNum = new RegExp("^([+-])=(" + pnum + ")", "i"), cssShow = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    }, cssNormalTransform = {
        letterSpacing: "0",
        fontWeight: "400"
    }, cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];
    function vendorPropName(style, name) {
        if (name in style) {
            return name;
        }
        var capName = name.charAt(0).toUpperCase() + name.slice(1), origName = name, i = cssPrefixes.length;
        while (i--) {
            name = cssPrefixes[i] + capName;
            if (name in style) {
                return name;
            }
        }
        return origName;
    }
    function showHide(elements, show) {
        var display, elem, hidden, values = [], index = 0, length = elements.length;
        for (;index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            values[index] = jQuery._data(elem, "olddisplay");
            display = elem.style.display;
            if (show) {
                if (!values[index] && display === "none") {
                    elem.style.display = "";
                }
                if (elem.style.display === "" && isHidden(elem)) {
                    values[index] = jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
                }
            } else {
                hidden = isHidden(elem);
                if (display && display !== "none" || !hidden) {
                    jQuery._data(elem, "olddisplay", hidden ? display : jQuery.css(elem, "display"));
                }
            }
        }
        for (index = 0; index < length; index++) {
            elem = elements[index];
            if (!elem.style) {
                continue;
            }
            if (!show || elem.style.display === "none" || elem.style.display === "") {
                elem.style.display = show ? values[index] || "" : "none";
            }
        }
        return elements;
    }
    function setPositiveNumber(elem, value, subtract) {
        var matches = rnumsplit.exec(value);
        return matches ? Math.max(0, matches[1] - (subtract || 0)) + (matches[2] || "px") : value;
    }
    function augmentWidthOrHeight(elem, name, extra, isBorderBox, styles) {
        var i = extra === (isBorderBox ? "border" : "content") ? 4 : name === "width" ? 1 : 0, val = 0;
        for (;i < 4; i += 2) {
            if (extra === "margin") {
                val += jQuery.css(elem, extra + cssExpand[i], true, styles);
            }
            if (isBorderBox) {
                if (extra === "content") {
                    val -= jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                }
                if (extra !== "margin") {
                    val -= jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            } else {
                val += jQuery.css(elem, "padding" + cssExpand[i], true, styles);
                if (extra !== "padding") {
                    val += jQuery.css(elem, "border" + cssExpand[i] + "Width", true, styles);
                }
            }
        }
        return val;
    }
    function getWidthOrHeight(elem, name, extra) {
        var valueIsBorderBox = true, val = name === "width" ? elem.offsetWidth : elem.offsetHeight, styles = getStyles(elem), isBorderBox = support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box";
        if (val <= 0 || val == null) {
            val = curCSS(elem, name, styles);
            if (val < 0 || val == null) {
                val = elem.style[name];
            }
            if (rnumnonpx.test(val)) {
                return val;
            }
            valueIsBorderBox = isBorderBox && (support.boxSizingReliable() || val === elem.style[name]);
            val = parseFloat(val) || 0;
        }
        return val + augmentWidthOrHeight(elem, name, extra || (isBorderBox ? "border" : "content"), valueIsBorderBox, styles) + "px";
    }
    jQuery.extend({
        cssHooks: {
            opacity: {
                get: function(elem, computed) {
                    if (computed) {
                        var ret = curCSS(elem, "opacity");
                        return ret === "" ? "1" : ret;
                    }
                }
            }
        },
        cssNumber: {
            columnCount: true,
            fillOpacity: true,
            flexGrow: true,
            flexShrink: true,
            fontWeight: true,
            lineHeight: true,
            opacity: true,
            order: true,
            orphans: true,
            widows: true,
            zIndex: true,
            zoom: true
        },
        cssProps: {
            "float": support.cssFloat ? "cssFloat" : "styleFloat"
        },
        style: function(elem, name, value, extra) {
            if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
                return;
            }
            var ret, type, hooks, origName = jQuery.camelCase(name), style = elem.style;
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (value !== undefined) {
                type = typeof value;
                if (type === "string" && (ret = rrelNum.exec(value))) {
                    value = (ret[1] + 1) * ret[2] + parseFloat(jQuery.css(elem, name));
                    type = "number";
                }
                if (value == null || value !== value) {
                    return;
                }
                if (type === "number" && !jQuery.cssNumber[origName]) {
                    value += "px";
                }
                if (!support.clearCloneStyle && value === "" && name.indexOf("background") === 0) {
                    style[name] = "inherit";
                }
                if (!hooks || !("set" in hooks) || (value = hooks.set(elem, value, extra)) !== undefined) {
                    try {
                        style[name] = value;
                    } catch (e) {}
                }
            } else {
                if (hooks && "get" in hooks && (ret = hooks.get(elem, false, extra)) !== undefined) {
                    return ret;
                }
                return style[name];
            }
        },
        css: function(elem, name, extra, styles) {
            var num, val, hooks, origName = jQuery.camelCase(name);
            name = jQuery.cssProps[origName] || (jQuery.cssProps[origName] = vendorPropName(elem.style, origName));
            hooks = jQuery.cssHooks[name] || jQuery.cssHooks[origName];
            if (hooks && "get" in hooks) {
                val = hooks.get(elem, true, extra);
            }
            if (val === undefined) {
                val = curCSS(elem, name, styles);
            }
            if (val === "normal" && name in cssNormalTransform) {
                val = cssNormalTransform[name];
            }
            if (extra === "" || extra) {
                num = parseFloat(val);
                return extra === true || jQuery.isNumeric(num) ? num || 0 : val;
            }
            return val;
        }
    });
    jQuery.each([ "height", "width" ], function(i, name) {
        jQuery.cssHooks[name] = {
            get: function(elem, computed, extra) {
                if (computed) {
                    return rdisplayswap.test(jQuery.css(elem, "display")) && elem.offsetWidth === 0 ? jQuery.swap(elem, cssShow, function() {
                        return getWidthOrHeight(elem, name, extra);
                    }) : getWidthOrHeight(elem, name, extra);
                }
            },
            set: function(elem, value, extra) {
                var styles = extra && getStyles(elem);
                return setPositiveNumber(elem, value, extra ? augmentWidthOrHeight(elem, name, extra, support.boxSizing && jQuery.css(elem, "boxSizing", false, styles) === "border-box", styles) : 0);
            }
        };
    });
    if (!support.opacity) {
        jQuery.cssHooks.opacity = {
            get: function(elem, computed) {
                return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : computed ? "1" : "";
            },
            set: function(elem, value) {
                var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";
                style.zoom = 1;
                if ((value >= 1 || value === "") && jQuery.trim(filter.replace(ralpha, "")) === "" && style.removeAttribute) {
                    style.removeAttribute("filter");
                    if (value === "" || currentStyle && !currentStyle.filter) {
                        return;
                    }
                }
                style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
            }
        };
    }
    jQuery.cssHooks.marginRight = addGetHookIf(support.reliableMarginRight, function(elem, computed) {
        if (computed) {
            return jQuery.swap(elem, {
                display: "inline-block"
            }, curCSS, [ elem, "marginRight" ]);
        }
    });
    jQuery.each({
        margin: "",
        padding: "",
        border: "Width"
    }, function(prefix, suffix) {
        jQuery.cssHooks[prefix + suffix] = {
            expand: function(value) {
                var i = 0, expanded = {}, parts = typeof value === "string" ? value.split(" ") : [ value ];
                for (;i < 4; i++) {
                    expanded[prefix + cssExpand[i] + suffix] = parts[i] || parts[i - 2] || parts[0];
                }
                return expanded;
            }
        };
        if (!rmargin.test(prefix)) {
            jQuery.cssHooks[prefix + suffix].set = setPositiveNumber;
        }
    });
    jQuery.fn.extend({
        css: function(name, value) {
            return access(this, function(elem, name, value) {
                var styles, len, map = {}, i = 0;
                if (jQuery.isArray(name)) {
                    styles = getStyles(elem);
                    len = name.length;
                    for (;i < len; i++) {
                        map[name[i]] = jQuery.css(elem, name[i], false, styles);
                    }
                    return map;
                }
                return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
            }, name, value, arguments.length > 1);
        },
        show: function() {
            return showHide(this, true);
        },
        hide: function() {
            return showHide(this);
        },
        toggle: function(state) {
            if (typeof state === "boolean") {
                return state ? this.show() : this.hide();
            }
            return this.each(function() {
                if (isHidden(this)) {
                    jQuery(this).show();
                } else {
                    jQuery(this).hide();
                }
            });
        }
    });
    function Tween(elem, options, prop, end, easing) {
        return new Tween.prototype.init(elem, options, prop, end, easing);
    }
    jQuery.Tween = Tween;
    Tween.prototype = {
        constructor: Tween,
        init: function(elem, options, prop, end, easing, unit) {
            this.elem = elem;
            this.prop = prop;
            this.easing = easing || "swing";
            this.options = options;
            this.start = this.now = this.cur();
            this.end = end;
            this.unit = unit || (jQuery.cssNumber[prop] ? "" : "px");
        },
        cur: function() {
            var hooks = Tween.propHooks[this.prop];
            return hooks && hooks.get ? hooks.get(this) : Tween.propHooks._default.get(this);
        },
        run: function(percent) {
            var eased, hooks = Tween.propHooks[this.prop];
            if (this.options.duration) {
                this.pos = eased = jQuery.easing[this.easing](percent, this.options.duration * percent, 0, 1, this.options.duration);
            } else {
                this.pos = eased = percent;
            }
            this.now = (this.end - this.start) * eased + this.start;
            if (this.options.step) {
                this.options.step.call(this.elem, this.now, this);
            }
            if (hooks && hooks.set) {
                hooks.set(this);
            } else {
                Tween.propHooks._default.set(this);
            }
            return this;
        }
    };
    Tween.prototype.init.prototype = Tween.prototype;
    Tween.propHooks = {
        _default: {
            get: function(tween) {
                var result;
                if (tween.elem[tween.prop] != null && (!tween.elem.style || tween.elem.style[tween.prop] == null)) {
                    return tween.elem[tween.prop];
                }
                result = jQuery.css(tween.elem, tween.prop, "");
                return !result || result === "auto" ? 0 : result;
            },
            set: function(tween) {
                if (jQuery.fx.step[tween.prop]) {
                    jQuery.fx.step[tween.prop](tween);
                } else if (tween.elem.style && (tween.elem.style[jQuery.cssProps[tween.prop]] != null || jQuery.cssHooks[tween.prop])) {
                    jQuery.style(tween.elem, tween.prop, tween.now + tween.unit);
                } else {
                    tween.elem[tween.prop] = tween.now;
                }
            }
        }
    };
    Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
        set: function(tween) {
            if (tween.elem.nodeType && tween.elem.parentNode) {
                tween.elem[tween.prop] = tween.now;
            }
        }
    };
    jQuery.easing = {
        linear: function(p) {
            return p;
        },
        swing: function(p) {
            return .5 - Math.cos(p * Math.PI) / 2;
        }
    };
    jQuery.fx = Tween.prototype.init;
    jQuery.fx.step = {};
    var fxNow, timerId, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = new RegExp("^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i"), rrun = /queueHooks$/, animationPrefilters = [ defaultPrefilter ], tweeners = {
        "*": [ function(prop, value) {
            var tween = this.createTween(prop, value), target = tween.cur(), parts = rfxnum.exec(value), unit = parts && parts[3] || (jQuery.cssNumber[prop] ? "" : "px"), start = (jQuery.cssNumber[prop] || unit !== "px" && +target) && rfxnum.exec(jQuery.css(tween.elem, prop)), scale = 1, maxIterations = 20;
            if (start && start[3] !== unit) {
                unit = unit || start[3];
                parts = parts || [];
                start = +target || 1;
                do {
                    scale = scale || ".5";
                    start = start / scale;
                    jQuery.style(tween.elem, prop, start + unit);
                } while (scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations);
            }
            if (parts) {
                start = tween.start = +start || +target || 0;
                tween.unit = unit;
                tween.end = parts[1] ? start + (parts[1] + 1) * parts[2] : +parts[2];
            }
            return tween;
        } ]
    };
    function createFxNow() {
        setTimeout(function() {
            fxNow = undefined;
        });
        return fxNow = jQuery.now();
    }
    function genFx(type, includeWidth) {
        var which, attrs = {
            height: type
        }, i = 0;
        includeWidth = includeWidth ? 1 : 0;
        for (;i < 4; i += 2 - includeWidth) {
            which = cssExpand[i];
            attrs["margin" + which] = attrs["padding" + which] = type;
        }
        if (includeWidth) {
            attrs.opacity = attrs.width = type;
        }
        return attrs;
    }
    function createTween(value, prop, animation) {
        var tween, collection = (tweeners[prop] || []).concat(tweeners["*"]), index = 0, length = collection.length;
        for (;index < length; index++) {
            if (tween = collection[index].call(animation, prop, value)) {
                return tween;
            }
        }
    }
    function defaultPrefilter(elem, props, opts) {
        var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, anim = this, orig = {}, style = elem.style, hidden = elem.nodeType && isHidden(elem), dataShow = jQuery._data(elem, "fxshow");
        if (!opts.queue) {
            hooks = jQuery._queueHooks(elem, "fx");
            if (hooks.unqueued == null) {
                hooks.unqueued = 0;
                oldfire = hooks.empty.fire;
                hooks.empty.fire = function() {
                    if (!hooks.unqueued) {
                        oldfire();
                    }
                };
            }
            hooks.unqueued++;
            anim.always(function() {
                anim.always(function() {
                    hooks.unqueued--;
                    if (!jQuery.queue(elem, "fx").length) {
                        hooks.empty.fire();
                    }
                });
            });
        }
        if (elem.nodeType === 1 && ("height" in props || "width" in props)) {
            opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];
            display = jQuery.css(elem, "display");
            checkDisplay = display === "none" ? jQuery._data(elem, "olddisplay") || defaultDisplay(elem.nodeName) : display;
            if (checkDisplay === "inline" && jQuery.css(elem, "float") === "none") {
                if (!support.inlineBlockNeedsLayout || defaultDisplay(elem.nodeName) === "inline") {
                    style.display = "inline-block";
                } else {
                    style.zoom = 1;
                }
            }
        }
        if (opts.overflow) {
            style.overflow = "hidden";
            if (!support.shrinkWrapBlocks()) {
                anim.always(function() {
                    style.overflow = opts.overflow[0];
                    style.overflowX = opts.overflow[1];
                    style.overflowY = opts.overflow[2];
                });
            }
        }
        for (prop in props) {
            value = props[prop];
            if (rfxtypes.exec(value)) {
                delete props[prop];
                toggle = toggle || value === "toggle";
                if (value === (hidden ? "hide" : "show")) {
                    if (value === "show" && dataShow && dataShow[prop] !== undefined) {
                        hidden = true;
                    } else {
                        continue;
                    }
                }
                orig[prop] = dataShow && dataShow[prop] || jQuery.style(elem, prop);
            } else {
                display = undefined;
            }
        }
        if (!jQuery.isEmptyObject(orig)) {
            if (dataShow) {
                if ("hidden" in dataShow) {
                    hidden = dataShow.hidden;
                }
            } else {
                dataShow = jQuery._data(elem, "fxshow", {});
            }
            if (toggle) {
                dataShow.hidden = !hidden;
            }
            if (hidden) {
                jQuery(elem).show();
            } else {
                anim.done(function() {
                    jQuery(elem).hide();
                });
            }
            anim.done(function() {
                var prop;
                jQuery._removeData(elem, "fxshow");
                for (prop in orig) {
                    jQuery.style(elem, prop, orig[prop]);
                }
            });
            for (prop in orig) {
                tween = createTween(hidden ? dataShow[prop] : 0, prop, anim);
                if (!(prop in dataShow)) {
                    dataShow[prop] = tween.start;
                    if (hidden) {
                        tween.end = tween.start;
                        tween.start = prop === "width" || prop === "height" ? 1 : 0;
                    }
                }
            }
        } else if ((display === "none" ? defaultDisplay(elem.nodeName) : display) === "inline") {
            style.display = display;
        }
    }
    function propFilter(props, specialEasing) {
        var index, name, easing, value, hooks;
        for (index in props) {
            name = jQuery.camelCase(index);
            easing = specialEasing[name];
            value = props[index];
            if (jQuery.isArray(value)) {
                easing = value[1];
                value = props[index] = value[0];
            }
            if (index !== name) {
                props[name] = value;
                delete props[index];
            }
            hooks = jQuery.cssHooks[name];
            if (hooks && "expand" in hooks) {
                value = hooks.expand(value);
                delete props[name];
                for (index in value) {
                    if (!(index in props)) {
                        props[index] = value[index];
                        specialEasing[index] = easing;
                    }
                }
            } else {
                specialEasing[name] = easing;
            }
        }
    }
    function Animation(elem, properties, options) {
        var result, stopped, index = 0, length = animationPrefilters.length, deferred = jQuery.Deferred().always(function() {
            delete tick.elem;
        }), tick = function() {
            if (stopped) {
                return false;
            }
            var currentTime = fxNow || createFxNow(), remaining = Math.max(0, animation.startTime + animation.duration - currentTime), temp = remaining / animation.duration || 0, percent = 1 - temp, index = 0, length = animation.tweens.length;
            for (;index < length; index++) {
                animation.tweens[index].run(percent);
            }
            deferred.notifyWith(elem, [ animation, percent, remaining ]);
            if (percent < 1 && length) {
                return remaining;
            } else {
                deferred.resolveWith(elem, [ animation ]);
                return false;
            }
        }, animation = deferred.promise({
            elem: elem,
            props: jQuery.extend({}, properties),
            opts: jQuery.extend(true, {
                specialEasing: {}
            }, options),
            originalProperties: properties,
            originalOptions: options,
            startTime: fxNow || createFxNow(),
            duration: options.duration,
            tweens: [],
            createTween: function(prop, end) {
                var tween = jQuery.Tween(elem, animation.opts, prop, end, animation.opts.specialEasing[prop] || animation.opts.easing);
                animation.tweens.push(tween);
                return tween;
            },
            stop: function(gotoEnd) {
                var index = 0, length = gotoEnd ? animation.tweens.length : 0;
                if (stopped) {
                    return this;
                }
                stopped = true;
                for (;index < length; index++) {
                    animation.tweens[index].run(1);
                }
                if (gotoEnd) {
                    deferred.resolveWith(elem, [ animation, gotoEnd ]);
                } else {
                    deferred.rejectWith(elem, [ animation, gotoEnd ]);
                }
                return this;
            }
        }), props = animation.props;
        propFilter(props, animation.opts.specialEasing);
        for (;index < length; index++) {
            result = animationPrefilters[index].call(animation, elem, props, animation.opts);
            if (result) {
                return result;
            }
        }
        jQuery.map(props, createTween, animation);
        if (jQuery.isFunction(animation.opts.start)) {
            animation.opts.start.call(elem, animation);
        }
        jQuery.fx.timer(jQuery.extend(tick, {
            elem: elem,
            anim: animation,
            queue: animation.opts.queue
        }));
        return animation.progress(animation.opts.progress).done(animation.opts.done, animation.opts.complete).fail(animation.opts.fail).always(animation.opts.always);
    }
    jQuery.Animation = jQuery.extend(Animation, {
        tweener: function(props, callback) {
            if (jQuery.isFunction(props)) {
                callback = props;
                props = [ "*" ];
            } else {
                props = props.split(" ");
            }
            var prop, index = 0, length = props.length;
            for (;index < length; index++) {
                prop = props[index];
                tweeners[prop] = tweeners[prop] || [];
                tweeners[prop].unshift(callback);
            }
        },
        prefilter: function(callback, prepend) {
            if (prepend) {
                animationPrefilters.unshift(callback);
            } else {
                animationPrefilters.push(callback);
            }
        }
    });
    jQuery.speed = function(speed, easing, fn) {
        var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
            complete: fn || !fn && easing || jQuery.isFunction(speed) && speed,
            duration: speed,
            easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
        };
        opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;
        if (opt.queue == null || opt.queue === true) {
            opt.queue = "fx";
        }
        opt.old = opt.complete;
        opt.complete = function() {
            if (jQuery.isFunction(opt.old)) {
                opt.old.call(this);
            }
            if (opt.queue) {
                jQuery.dequeue(this, opt.queue);
            }
        };
        return opt;
    };
    jQuery.fn.extend({
        fadeTo: function(speed, to, easing, callback) {
            return this.filter(isHidden).css("opacity", 0).show().end().animate({
                opacity: to
            }, speed, easing, callback);
        },
        animate: function(prop, speed, easing, callback) {
            var empty = jQuery.isEmptyObject(prop), optall = jQuery.speed(speed, easing, callback), doAnimation = function() {
                var anim = Animation(this, jQuery.extend({}, prop), optall);
                if (empty || jQuery._data(this, "finish")) {
                    anim.stop(true);
                }
            };
            doAnimation.finish = doAnimation;
            return empty || optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
        },
        stop: function(type, clearQueue, gotoEnd) {
            var stopQueue = function(hooks) {
                var stop = hooks.stop;
                delete hooks.stop;
                stop(gotoEnd);
            };
            if (typeof type !== "string") {
                gotoEnd = clearQueue;
                clearQueue = type;
                type = undefined;
            }
            if (clearQueue && type !== false) {
                this.queue(type || "fx", []);
            }
            return this.each(function() {
                var dequeue = true, index = type != null && type + "queueHooks", timers = jQuery.timers, data = jQuery._data(this);
                if (index) {
                    if (data[index] && data[index].stop) {
                        stopQueue(data[index]);
                    }
                } else {
                    for (index in data) {
                        if (data[index] && data[index].stop && rrun.test(index)) {
                            stopQueue(data[index]);
                        }
                    }
                }
                for (index = timers.length; index--; ) {
                    if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
                        timers[index].anim.stop(gotoEnd);
                        dequeue = false;
                        timers.splice(index, 1);
                    }
                }
                if (dequeue || !gotoEnd) {
                    jQuery.dequeue(this, type);
                }
            });
        },
        finish: function(type) {
            if (type !== false) {
                type = type || "fx";
            }
            return this.each(function() {
                var index, data = jQuery._data(this), queue = data[type + "queue"], hooks = data[type + "queueHooks"], timers = jQuery.timers, length = queue ? queue.length : 0;
                data.finish = true;
                jQuery.queue(this, type, []);
                if (hooks && hooks.stop) {
                    hooks.stop.call(this, true);
                }
                for (index = timers.length; index--; ) {
                    if (timers[index].elem === this && timers[index].queue === type) {
                        timers[index].anim.stop(true);
                        timers.splice(index, 1);
                    }
                }
                for (index = 0; index < length; index++) {
                    if (queue[index] && queue[index].finish) {
                        queue[index].finish.call(this);
                    }
                }
                delete data.finish;
            });
        }
    });
    jQuery.each([ "toggle", "show", "hide" ], function(i, name) {
        var cssFn = jQuery.fn[name];
        jQuery.fn[name] = function(speed, easing, callback) {
            return speed == null || typeof speed === "boolean" ? cssFn.apply(this, arguments) : this.animate(genFx(name, true), speed, easing, callback);
        };
    });
    jQuery.each({
        slideDown: genFx("show"),
        slideUp: genFx("hide"),
        slideToggle: genFx("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(name, props) {
        jQuery.fn[name] = function(speed, easing, callback) {
            return this.animate(props, speed, easing, callback);
        };
    });
    jQuery.timers = [];
    jQuery.fx.tick = function() {
        var timer, timers = jQuery.timers, i = 0;
        fxNow = jQuery.now();
        for (;i < timers.length; i++) {
            timer = timers[i];
            if (!timer() && timers[i] === timer) {
                timers.splice(i--, 1);
            }
        }
        if (!timers.length) {
            jQuery.fx.stop();
        }
        fxNow = undefined;
    };
    jQuery.fx.timer = function(timer) {
        jQuery.timers.push(timer);
        if (timer()) {
            jQuery.fx.start();
        } else {
            jQuery.timers.pop();
        }
    };
    jQuery.fx.interval = 13;
    jQuery.fx.start = function() {
        if (!timerId) {
            timerId = setInterval(jQuery.fx.tick, jQuery.fx.interval);
        }
    };
    jQuery.fx.stop = function() {
        clearInterval(timerId);
        timerId = null;
    };
    jQuery.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    };
    jQuery.fn.delay = function(time, type) {
        time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
        type = type || "fx";
        return this.queue(type, function(next, hooks) {
            var timeout = setTimeout(next, time);
            hooks.stop = function() {
                clearTimeout(timeout);
            };
        });
    };
    (function() {
        var input, div, select, a, opt;
        div = document.createElement("div");
        div.setAttribute("className", "t");
        div.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>";
        a = div.getElementsByTagName("a")[0];
        select = document.createElement("select");
        opt = select.appendChild(document.createElement("option"));
        input = div.getElementsByTagName("input")[0];
        a.style.cssText = "top:1px";
        support.getSetAttribute = div.className !== "t";
        support.style = /top/.test(a.getAttribute("style"));
        support.hrefNormalized = a.getAttribute("href") === "/a";
        support.checkOn = !!input.value;
        support.optSelected = opt.selected;
        support.enctype = !!document.createElement("form").enctype;
        select.disabled = true;
        support.optDisabled = !opt.disabled;
        input = document.createElement("input");
        input.setAttribute("value", "");
        support.input = input.getAttribute("value") === "";
        input.value = "t";
        input.setAttribute("type", "radio");
        support.radioValue = input.value === "t";
    })();
    var rreturn = /\r/g;
    jQuery.fn.extend({
        val: function(value) {
            var hooks, ret, isFunction, elem = this[0];
            if (!arguments.length) {
                if (elem) {
                    hooks = jQuery.valHooks[elem.type] || jQuery.valHooks[elem.nodeName.toLowerCase()];
                    if (hooks && "get" in hooks && (ret = hooks.get(elem, "value")) !== undefined) {
                        return ret;
                    }
                    ret = elem.value;
                    return typeof ret === "string" ? ret.replace(rreturn, "") : ret == null ? "" : ret;
                }
                return;
            }
            isFunction = jQuery.isFunction(value);
            return this.each(function(i) {
                var val;
                if (this.nodeType !== 1) {
                    return;
                }
                if (isFunction) {
                    val = value.call(this, i, jQuery(this).val());
                } else {
                    val = value;
                }
                if (val == null) {
                    val = "";
                } else if (typeof val === "number") {
                    val += "";
                } else if (jQuery.isArray(val)) {
                    val = jQuery.map(val, function(value) {
                        return value == null ? "" : value + "";
                    });
                }
                hooks = jQuery.valHooks[this.type] || jQuery.valHooks[this.nodeName.toLowerCase()];
                if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
                    this.value = val;
                }
            });
        }
    });
    jQuery.extend({
        valHooks: {
            option: {
                get: function(elem) {
                    var val = jQuery.find.attr(elem, "value");
                    return val != null ? val : jQuery.trim(jQuery.text(elem));
                }
            },
            select: {
                get: function(elem) {
                    var value, option, options = elem.options, index = elem.selectedIndex, one = elem.type === "select-one" || index < 0, values = one ? null : [], max = one ? index + 1 : options.length, i = index < 0 ? max : one ? index : 0;
                    for (;i < max; i++) {
                        option = options[i];
                        if ((option.selected || i === index) && (support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {
                            value = jQuery(option).val();
                            if (one) {
                                return value;
                            }
                            values.push(value);
                        }
                    }
                    return values;
                },
                set: function(elem, value) {
                    var optionSet, option, options = elem.options, values = jQuery.makeArray(value), i = options.length;
                    while (i--) {
                        option = options[i];
                        if (jQuery.inArray(jQuery.valHooks.option.get(option), values) >= 0) {
                            try {
                                option.selected = optionSet = true;
                            } catch (_) {
                                option.scrollHeight;
                            }
                        } else {
                            option.selected = false;
                        }
                    }
                    if (!optionSet) {
                        elem.selectedIndex = -1;
                    }
                    return options;
                }
            }
        }
    });
    jQuery.each([ "radio", "checkbox" ], function() {
        jQuery.valHooks[this] = {
            set: function(elem, value) {
                if (jQuery.isArray(value)) {
                    return elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0;
                }
            }
        };
        if (!support.checkOn) {
            jQuery.valHooks[this].get = function(elem) {
                return elem.getAttribute("value") === null ? "on" : elem.value;
            };
        }
    });
    var nodeHook, boolHook, attrHandle = jQuery.expr.attrHandle, ruseDefault = /^(?:checked|selected)$/i, getSetAttribute = support.getSetAttribute, getSetInput = support.input;
    jQuery.fn.extend({
        attr: function(name, value) {
            return access(this, jQuery.attr, name, value, arguments.length > 1);
        },
        removeAttr: function(name) {
            return this.each(function() {
                jQuery.removeAttr(this, name);
            });
        }
    });
    jQuery.extend({
        attr: function(elem, name, value) {
            var hooks, ret, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            if (typeof elem.getAttribute === strundefined) {
                return jQuery.prop(elem, name, value);
            }
            if (nType !== 1 || !jQuery.isXMLDoc(elem)) {
                name = name.toLowerCase();
                hooks = jQuery.attrHooks[name] || (jQuery.expr.match.bool.test(name) ? boolHook : nodeHook);
            }
            if (value !== undefined) {
                if (value === null) {
                    jQuery.removeAttr(elem, name);
                } else if (hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined) {
                    return ret;
                } else {
                    elem.setAttribute(name, value + "");
                    return value;
                }
            } else if (hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null) {
                return ret;
            } else {
                ret = jQuery.find.attr(elem, name);
                return ret == null ? undefined : ret;
            }
        },
        removeAttr: function(elem, value) {
            var name, propName, i = 0, attrNames = value && value.match(rnotwhite);
            if (attrNames && elem.nodeType === 1) {
                while (name = attrNames[i++]) {
                    propName = jQuery.propFix[name] || name;
                    if (jQuery.expr.match.bool.test(name)) {
                        if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                            elem[propName] = false;
                        } else {
                            elem[jQuery.camelCase("default-" + name)] = elem[propName] = false;
                        }
                    } else {
                        jQuery.attr(elem, name, "");
                    }
                    elem.removeAttribute(getSetAttribute ? name : propName);
                }
            }
        },
        attrHooks: {
            type: {
                set: function(elem, value) {
                    if (!support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
                        var val = elem.value;
                        elem.setAttribute("type", value);
                        if (val) {
                            elem.value = val;
                        }
                        return value;
                    }
                }
            }
        }
    });
    boolHook = {
        set: function(elem, value, name) {
            if (value === false) {
                jQuery.removeAttr(elem, name);
            } else if (getSetInput && getSetAttribute || !ruseDefault.test(name)) {
                elem.setAttribute(!getSetAttribute && jQuery.propFix[name] || name, name);
            } else {
                elem[jQuery.camelCase("default-" + name)] = elem[name] = true;
            }
            return name;
        }
    };
    jQuery.each(jQuery.expr.match.bool.source.match(/\w+/g), function(i, name) {
        var getter = attrHandle[name] || jQuery.find.attr;
        attrHandle[name] = getSetInput && getSetAttribute || !ruseDefault.test(name) ? function(elem, name, isXML) {
            var ret, handle;
            if (!isXML) {
                handle = attrHandle[name];
                attrHandle[name] = ret;
                ret = getter(elem, name, isXML) != null ? name.toLowerCase() : null;
                attrHandle[name] = handle;
            }
            return ret;
        } : function(elem, name, isXML) {
            if (!isXML) {
                return elem[jQuery.camelCase("default-" + name)] ? name.toLowerCase() : null;
            }
        };
    });
    if (!getSetInput || !getSetAttribute) {
        jQuery.attrHooks.value = {
            set: function(elem, value, name) {
                if (jQuery.nodeName(elem, "input")) {
                    elem.defaultValue = value;
                } else {
                    return nodeHook && nodeHook.set(elem, value, name);
                }
            }
        };
    }
    if (!getSetAttribute) {
        nodeHook = {
            set: function(elem, value, name) {
                var ret = elem.getAttributeNode(name);
                if (!ret) {
                    elem.setAttributeNode(ret = elem.ownerDocument.createAttribute(name));
                }
                ret.value = value += "";
                if (name === "value" || value === elem.getAttribute(name)) {
                    return value;
                }
            }
        };
        attrHandle.id = attrHandle.name = attrHandle.coords = function(elem, name, isXML) {
            var ret;
            if (!isXML) {
                return (ret = elem.getAttributeNode(name)) && ret.value !== "" ? ret.value : null;
            }
        };
        jQuery.valHooks.button = {
            get: function(elem, name) {
                var ret = elem.getAttributeNode(name);
                if (ret && ret.specified) {
                    return ret.value;
                }
            },
            set: nodeHook.set
        };
        jQuery.attrHooks.contenteditable = {
            set: function(elem, value, name) {
                nodeHook.set(elem, value === "" ? false : value, name);
            }
        };
        jQuery.each([ "width", "height" ], function(i, name) {
            jQuery.attrHooks[name] = {
                set: function(elem, value) {
                    if (value === "") {
                        elem.setAttribute(name, "auto");
                        return value;
                    }
                }
            };
        });
    }
    if (!support.style) {
        jQuery.attrHooks.style = {
            get: function(elem) {
                return elem.style.cssText || undefined;
            },
            set: function(elem, value) {
                return elem.style.cssText = value + "";
            }
        };
    }
    var rfocusable = /^(?:input|select|textarea|button|object)$/i, rclickable = /^(?:a|area)$/i;
    jQuery.fn.extend({
        prop: function(name, value) {
            return access(this, jQuery.prop, name, value, arguments.length > 1);
        },
        removeProp: function(name) {
            name = jQuery.propFix[name] || name;
            return this.each(function() {
                try {
                    this[name] = undefined;
                    delete this[name];
                } catch (e) {}
            });
        }
    });
    jQuery.extend({
        propFix: {
            "for": "htmlFor",
            "class": "className"
        },
        prop: function(elem, name, value) {
            var ret, hooks, notxml, nType = elem.nodeType;
            if (!elem || nType === 3 || nType === 8 || nType === 2) {
                return;
            }
            notxml = nType !== 1 || !jQuery.isXMLDoc(elem);
            if (notxml) {
                name = jQuery.propFix[name] || name;
                hooks = jQuery.propHooks[name];
            }
            if (value !== undefined) {
                return hooks && "set" in hooks && (ret = hooks.set(elem, value, name)) !== undefined ? ret : elem[name] = value;
            } else {
                return hooks && "get" in hooks && (ret = hooks.get(elem, name)) !== null ? ret : elem[name];
            }
        },
        propHooks: {
            tabIndex: {
                get: function(elem) {
                    var tabindex = jQuery.find.attr(elem, "tabindex");
                    return tabindex ? parseInt(tabindex, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : -1;
                }
            }
        }
    });
    if (!support.hrefNormalized) {
        jQuery.each([ "href", "src" ], function(i, name) {
            jQuery.propHooks[name] = {
                get: function(elem) {
                    return elem.getAttribute(name, 4);
                }
            };
        });
    }
    if (!support.optSelected) {
        jQuery.propHooks.selected = {
            get: function(elem) {
                var parent = elem.parentNode;
                if (parent) {
                    parent.selectedIndex;
                    if (parent.parentNode) {
                        parent.parentNode.selectedIndex;
                    }
                }
                return null;
            }
        };
    }
    jQuery.each([ "tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable" ], function() {
        jQuery.propFix[this.toLowerCase()] = this;
    });
    if (!support.enctype) {
        jQuery.propFix.enctype = "encoding";
    }
    var rclass = /[\t\r\n\f]/g;
    jQuery.fn.extend({
        addClass: function(value) {
            var classes, elem, cur, clazz, j, finalValue, i = 0, len = this.length, proceed = typeof value === "string" && value;
            if (jQuery.isFunction(value)) {
                return this.each(function(j) {
                    jQuery(this).addClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || "").match(rnotwhite) || [];
                for (;i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : " ");
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            if (cur.indexOf(" " + clazz + " ") < 0) {
                                cur += clazz + " ";
                            }
                        }
                        finalValue = jQuery.trim(cur);
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }
            return this;
        },
        removeClass: function(value) {
            var classes, elem, cur, clazz, j, finalValue, i = 0, len = this.length, proceed = arguments.length === 0 || typeof value === "string" && value;
            if (jQuery.isFunction(value)) {
                return this.each(function(j) {
                    jQuery(this).removeClass(value.call(this, j, this.className));
                });
            }
            if (proceed) {
                classes = (value || "").match(rnotwhite) || [];
                for (;i < len; i++) {
                    elem = this[i];
                    cur = elem.nodeType === 1 && (elem.className ? (" " + elem.className + " ").replace(rclass, " ") : "");
                    if (cur) {
                        j = 0;
                        while (clazz = classes[j++]) {
                            while (cur.indexOf(" " + clazz + " ") >= 0) {
                                cur = cur.replace(" " + clazz + " ", " ");
                            }
                        }
                        finalValue = value ? jQuery.trim(cur) : "";
                        if (elem.className !== finalValue) {
                            elem.className = finalValue;
                        }
                    }
                }
            }
            return this;
        },
        toggleClass: function(value, stateVal) {
            var type = typeof value;
            if (typeof stateVal === "boolean" && type === "string") {
                return stateVal ? this.addClass(value) : this.removeClass(value);
            }
            if (jQuery.isFunction(value)) {
                return this.each(function(i) {
                    jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
                });
            }
            return this.each(function() {
                if (type === "string") {
                    var className, i = 0, self = jQuery(this), classNames = value.match(rnotwhite) || [];
                    while (className = classNames[i++]) {
                        if (self.hasClass(className)) {
                            self.removeClass(className);
                        } else {
                            self.addClass(className);
                        }
                    }
                } else if (type === strundefined || type === "boolean") {
                    if (this.className) {
                        jQuery._data(this, "__className__", this.className);
                    }
                    this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
                }
            });
        },
        hasClass: function(selector) {
            var className = " " + selector + " ", i = 0, l = this.length;
            for (;i < l; i++) {
                if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) >= 0) {
                    return true;
                }
            }
            return false;
        }
    });
    jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {
        jQuery.fn[name] = function(data, fn) {
            return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
        };
    });
    jQuery.fn.extend({
        hover: function(fnOver, fnOut) {
            return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
        },
        bind: function(types, data, fn) {
            return this.on(types, null, data, fn);
        },
        unbind: function(types, fn) {
            return this.off(types, null, fn);
        },
        delegate: function(selector, types, data, fn) {
            return this.on(types, selector, data, fn);
        },
        undelegate: function(selector, types, fn) {
            return arguments.length === 1 ? this.off(selector, "**") : this.off(types, selector || "**", fn);
        }
    });
    var nonce = jQuery.now();
    var rquery = /\?/;
    var rvalidtokens = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
    jQuery.parseJSON = function(data) {
        if (window.JSON && window.JSON.parse) {
            return window.JSON.parse(data + "");
        }
        var requireNonComma, depth = null, str = jQuery.trim(data + "");
        return str && !jQuery.trim(str.replace(rvalidtokens, function(token, comma, open, close) {
            if (requireNonComma && comma) {
                depth = 0;
            }
            if (depth === 0) {
                return token;
            }
            requireNonComma = open || comma;
            depth += !close - !open;
            return "";
        })) ? Function("return " + str)() : jQuery.error("Invalid JSON: " + data);
    };
    jQuery.parseXML = function(data) {
        var xml, tmp;
        if (!data || typeof data !== "string") {
            return null;
        }
        try {
            if (window.DOMParser) {
                tmp = new DOMParser();
                xml = tmp.parseFromString(data, "text/xml");
            } else {
                xml = new ActiveXObject("Microsoft.XMLDOM");
                xml.async = "false";
                xml.loadXML(data);
            }
        } catch (e) {
            xml = undefined;
        }
        if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
            jQuery.error("Invalid XML: " + data);
        }
        return xml;
    };
    var ajaxLocParts, ajaxLocation, rhash = /#.*$/, rts = /([?&])_=[^&]*/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm, rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/, prefilters = {}, transports = {}, allTypes = "*/".concat("*");
    try {
        ajaxLocation = location.href;
    } catch (e) {
        ajaxLocation = document.createElement("a");
        ajaxLocation.href = "";
        ajaxLocation = ajaxLocation.href;
    }
    ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];
    function addToPrefiltersOrTransports(structure) {
        return function(dataTypeExpression, func) {
            if (typeof dataTypeExpression !== "string") {
                func = dataTypeExpression;
                dataTypeExpression = "*";
            }
            var dataType, i = 0, dataTypes = dataTypeExpression.toLowerCase().match(rnotwhite) || [];
            if (jQuery.isFunction(func)) {
                while (dataType = dataTypes[i++]) {
                    if (dataType.charAt(0) === "+") {
                        dataType = dataType.slice(1) || "*";
                        (structure[dataType] = structure[dataType] || []).unshift(func);
                    } else {
                        (structure[dataType] = structure[dataType] || []).push(func);
                    }
                }
            }
        };
    }
    function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR) {
        var inspected = {}, seekingTransport = structure === transports;
        function inspect(dataType) {
            var selected;
            inspected[dataType] = true;
            jQuery.each(structure[dataType] || [], function(_, prefilterOrFactory) {
                var dataTypeOrTransport = prefilterOrFactory(options, originalOptions, jqXHR);
                if (typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[dataTypeOrTransport]) {
                    options.dataTypes.unshift(dataTypeOrTransport);
                    inspect(dataTypeOrTransport);
                    return false;
                } else if (seekingTransport) {
                    return !(selected = dataTypeOrTransport);
                }
            });
            return selected;
        }
        return inspect(options.dataTypes[0]) || !inspected["*"] && inspect("*");
    }
    function ajaxExtend(target, src) {
        var deep, key, flatOptions = jQuery.ajaxSettings.flatOptions || {};
        for (key in src) {
            if (src[key] !== undefined) {
                (flatOptions[key] ? target : deep || (deep = {}))[key] = src[key];
            }
        }
        if (deep) {
            jQuery.extend(true, target, deep);
        }
        return target;
    }
    function ajaxHandleResponses(s, jqXHR, responses) {
        var firstDataType, ct, finalDataType, type, contents = s.contents, dataTypes = s.dataTypes;
        while (dataTypes[0] === "*") {
            dataTypes.shift();
            if (ct === undefined) {
                ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
            }
        }
        if (ct) {
            for (type in contents) {
                if (contents[type] && contents[type].test(ct)) {
                    dataTypes.unshift(type);
                    break;
                }
            }
        }
        if (dataTypes[0] in responses) {
            finalDataType = dataTypes[0];
        } else {
            for (type in responses) {
                if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
                    finalDataType = type;
                    break;
                }
                if (!firstDataType) {
                    firstDataType = type;
                }
            }
            finalDataType = finalDataType || firstDataType;
        }
        if (finalDataType) {
            if (finalDataType !== dataTypes[0]) {
                dataTypes.unshift(finalDataType);
            }
            return responses[finalDataType];
        }
    }
    function ajaxConvert(s, response, jqXHR, isSuccess) {
        var conv2, current, conv, tmp, prev, converters = {}, dataTypes = s.dataTypes.slice();
        if (dataTypes[1]) {
            for (conv in s.converters) {
                converters[conv.toLowerCase()] = s.converters[conv];
            }
        }
        current = dataTypes.shift();
        while (current) {
            if (s.responseFields[current]) {
                jqXHR[s.responseFields[current]] = response;
            }
            if (!prev && isSuccess && s.dataFilter) {
                response = s.dataFilter(response, s.dataType);
            }
            prev = current;
            current = dataTypes.shift();
            if (current) {
                if (current === "*") {
                    current = prev;
                } else if (prev !== "*" && prev !== current) {
                    conv = converters[prev + " " + current] || converters["* " + current];
                    if (!conv) {
                        for (conv2 in converters) {
                            tmp = conv2.split(" ");
                            if (tmp[1] === current) {
                                conv = converters[prev + " " + tmp[0]] || converters["* " + tmp[0]];
                                if (conv) {
                                    if (conv === true) {
                                        conv = converters[conv2];
                                    } else if (converters[conv2] !== true) {
                                        current = tmp[0];
                                        dataTypes.unshift(tmp[1]);
                                    }
                                    break;
                                }
                            }
                        }
                    }
                    if (conv !== true) {
                        if (conv && s["throws"]) {
                            response = conv(response);
                        } else {
                            try {
                                response = conv(response);
                            } catch (e) {
                                return {
                                    state: "parsererror",
                                    error: conv ? e : "No conversion from " + prev + " to " + current
                                };
                            }
                        }
                    }
                }
            }
        }
        return {
            state: "success",
            data: response
        };
    }
    jQuery.extend({
        active: 0,
        lastModified: {},
        etag: {},
        ajaxSettings: {
            url: ajaxLocation,
            type: "GET",
            isLocal: rlocalProtocol.test(ajaxLocParts[1]),
            global: true,
            processData: true,
            async: true,
            contentType: "application/x-www-form-urlencoded; charset=UTF-8",
            accepts: {
                "*": allTypes,
                text: "text/plain",
                html: "text/html",
                xml: "application/xml, text/xml",
                json: "application/json, text/javascript"
            },
            contents: {
                xml: /xml/,
                html: /html/,
                json: /json/
            },
            responseFields: {
                xml: "responseXML",
                text: "responseText",
                json: "responseJSON"
            },
            converters: {
                "* text": String,
                "text html": true,
                "text json": jQuery.parseJSON,
                "text xml": jQuery.parseXML
            },
            flatOptions: {
                url: true,
                context: true
            }
        },
        ajaxSetup: function(target, settings) {
            return settings ? ajaxExtend(ajaxExtend(target, jQuery.ajaxSettings), settings) : ajaxExtend(jQuery.ajaxSettings, target);
        },
        ajaxPrefilter: addToPrefiltersOrTransports(prefilters),
        ajaxTransport: addToPrefiltersOrTransports(transports),
        ajax: function(url, options) {
            if (typeof url === "object") {
                options = url;
                url = undefined;
            }
            options = options || {};
            var parts, i, cacheURL, responseHeadersString, timeoutTimer, fireGlobals, transport, responseHeaders, s = jQuery.ajaxSetup({}, options), callbackContext = s.context || s, globalEventContext = s.context && (callbackContext.nodeType || callbackContext.jquery) ? jQuery(callbackContext) : jQuery.event, deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"), statusCode = s.statusCode || {}, requestHeaders = {}, requestHeadersNames = {}, state = 0, strAbort = "canceled", jqXHR = {
                readyState: 0,
                getResponseHeader: function(key) {
                    var match;
                    if (state === 2) {
                        if (!responseHeaders) {
                            responseHeaders = {};
                            while (match = rheaders.exec(responseHeadersString)) {
                                responseHeaders[match[1].toLowerCase()] = match[2];
                            }
                        }
                        match = responseHeaders[key.toLowerCase()];
                    }
                    return match == null ? null : match;
                },
                getAllResponseHeaders: function() {
                    return state === 2 ? responseHeadersString : null;
                },
                setRequestHeader: function(name, value) {
                    var lname = name.toLowerCase();
                    if (!state) {
                        name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
                        requestHeaders[name] = value;
                    }
                    return this;
                },
                overrideMimeType: function(type) {
                    if (!state) {
                        s.mimeType = type;
                    }
                    return this;
                },
                statusCode: function(map) {
                    var code;
                    if (map) {
                        if (state < 2) {
                            for (code in map) {
                                statusCode[code] = [ statusCode[code], map[code] ];
                            }
                        } else {
                            jqXHR.always(map[jqXHR.status]);
                        }
                    }
                    return this;
                },
                abort: function(statusText) {
                    var finalText = statusText || strAbort;
                    if (transport) {
                        transport.abort(finalText);
                    }
                    done(0, finalText);
                    return this;
                }
            };
            deferred.promise(jqXHR).complete = completeDeferred.add;
            jqXHR.success = jqXHR.done;
            jqXHR.error = jqXHR.fail;
            s.url = ((url || s.url || ajaxLocation) + "").replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");
            s.type = options.method || options.type || s.method || s.type;
            s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().match(rnotwhite) || [ "" ];
            if (s.crossDomain == null) {
                parts = rurl.exec(s.url.toLowerCase());
                s.crossDomain = !!(parts && (parts[1] !== ajaxLocParts[1] || parts[2] !== ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? "80" : "443")) !== (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? "80" : "443"))));
            }
            if (s.data && s.processData && typeof s.data !== "string") {
                s.data = jQuery.param(s.data, s.traditional);
            }
            inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);
            if (state === 2) {
                return jqXHR;
            }
            fireGlobals = s.global;
            if (fireGlobals && jQuery.active++ === 0) {
                jQuery.event.trigger("ajaxStart");
            }
            s.type = s.type.toUpperCase();
            s.hasContent = !rnoContent.test(s.type);
            cacheURL = s.url;
            if (!s.hasContent) {
                if (s.data) {
                    cacheURL = s.url += (rquery.test(cacheURL) ? "&" : "?") + s.data;
                    delete s.data;
                }
                if (s.cache === false) {
                    s.url = rts.test(cacheURL) ? cacheURL.replace(rts, "$1_=" + nonce++) : cacheURL + (rquery.test(cacheURL) ? "&" : "?") + "_=" + nonce++;
                }
            }
            if (s.ifModified) {
                if (jQuery.lastModified[cacheURL]) {
                    jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[cacheURL]);
                }
                if (jQuery.etag[cacheURL]) {
                    jqXHR.setRequestHeader("If-None-Match", jQuery.etag[cacheURL]);
                }
            }
            if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
                jqXHR.setRequestHeader("Content-Type", s.contentType);
            }
            jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "") : s.accepts["*"]);
            for (i in s.headers) {
                jqXHR.setRequestHeader(i, s.headers[i]);
            }
            if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2)) {
                return jqXHR.abort();
            }
            strAbort = "abort";
            for (i in {
                success: 1,
                error: 1,
                complete: 1
            }) {
                jqXHR[i](s[i]);
            }
            transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);
            if (!transport) {
                done(-1, "No Transport");
            } else {
                jqXHR.readyState = 1;
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxSend", [ jqXHR, s ]);
                }
                if (s.async && s.timeout > 0) {
                    timeoutTimer = setTimeout(function() {
                        jqXHR.abort("timeout");
                    }, s.timeout);
                }
                try {
                    state = 1;
                    transport.send(requestHeaders, done);
                } catch (e) {
                    if (state < 2) {
                        done(-1, e);
                    } else {
                        throw e;
                    }
                }
            }
            function done(status, nativeStatusText, responses, headers) {
                var isSuccess, success, error, response, modified, statusText = nativeStatusText;
                if (state === 2) {
                    return;
                }
                state = 2;
                if (timeoutTimer) {
                    clearTimeout(timeoutTimer);
                }
                transport = undefined;
                responseHeadersString = headers || "";
                jqXHR.readyState = status > 0 ? 4 : 0;
                isSuccess = status >= 200 && status < 300 || status === 304;
                if (responses) {
                    response = ajaxHandleResponses(s, jqXHR, responses);
                }
                response = ajaxConvert(s, response, jqXHR, isSuccess);
                if (isSuccess) {
                    if (s.ifModified) {
                        modified = jqXHR.getResponseHeader("Last-Modified");
                        if (modified) {
                            jQuery.lastModified[cacheURL] = modified;
                        }
                        modified = jqXHR.getResponseHeader("etag");
                        if (modified) {
                            jQuery.etag[cacheURL] = modified;
                        }
                    }
                    if (status === 204 || s.type === "HEAD") {
                        statusText = "nocontent";
                    } else if (status === 304) {
                        statusText = "notmodified";
                    } else {
                        statusText = response.state;
                        success = response.data;
                        error = response.error;
                        isSuccess = !error;
                    }
                } else {
                    error = statusText;
                    if (status || !statusText) {
                        statusText = "error";
                        if (status < 0) {
                            status = 0;
                        }
                    }
                }
                jqXHR.status = status;
                jqXHR.statusText = (nativeStatusText || statusText) + "";
                if (isSuccess) {
                    deferred.resolveWith(callbackContext, [ success, statusText, jqXHR ]);
                } else {
                    deferred.rejectWith(callbackContext, [ jqXHR, statusText, error ]);
                }
                jqXHR.statusCode(statusCode);
                statusCode = undefined;
                if (fireGlobals) {
                    globalEventContext.trigger(isSuccess ? "ajaxSuccess" : "ajaxError", [ jqXHR, s, isSuccess ? success : error ]);
                }
                completeDeferred.fireWith(callbackContext, [ jqXHR, statusText ]);
                if (fireGlobals) {
                    globalEventContext.trigger("ajaxComplete", [ jqXHR, s ]);
                    if (!--jQuery.active) {
                        jQuery.event.trigger("ajaxStop");
                    }
                }
            }
            return jqXHR;
        },
        getJSON: function(url, data, callback) {
            return jQuery.get(url, data, callback, "json");
        },
        getScript: function(url, callback) {
            return jQuery.get(url, undefined, callback, "script");
        }
    });
    jQuery.each([ "get", "post" ], function(i, method) {
        jQuery[method] = function(url, data, callback, type) {
            if (jQuery.isFunction(data)) {
                type = type || callback;
                callback = data;
                data = undefined;
            }
            return jQuery.ajax({
                url: url,
                type: method,
                dataType: type,
                data: data,
                success: callback
            });
        };
    });
    jQuery.each([ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function(i, type) {
        jQuery.fn[type] = function(fn) {
            return this.on(type, fn);
        };
    });
    jQuery._evalUrl = function(url) {
        return jQuery.ajax({
            url: url,
            type: "GET",
            dataType: "script",
            async: false,
            global: false,
            "throws": true
        });
    };
    jQuery.fn.extend({
        wrapAll: function(html) {
            if (jQuery.isFunction(html)) {
                return this.each(function(i) {
                    jQuery(this).wrapAll(html.call(this, i));
                });
            }
            if (this[0]) {
                var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);
                if (this[0].parentNode) {
                    wrap.insertBefore(this[0]);
                }
                wrap.map(function() {
                    var elem = this;
                    while (elem.firstChild && elem.firstChild.nodeType === 1) {
                        elem = elem.firstChild;
                    }
                    return elem;
                }).append(this);
            }
            return this;
        },
        wrapInner: function(html) {
            if (jQuery.isFunction(html)) {
                return this.each(function(i) {
                    jQuery(this).wrapInner(html.call(this, i));
                });
            }
            return this.each(function() {
                var self = jQuery(this), contents = self.contents();
                if (contents.length) {
                    contents.wrapAll(html);
                } else {
                    self.append(html);
                }
            });
        },
        wrap: function(html) {
            var isFunction = jQuery.isFunction(html);
            return this.each(function(i) {
                jQuery(this).wrapAll(isFunction ? html.call(this, i) : html);
            });
        },
        unwrap: function() {
            return this.parent().each(function() {
                if (!jQuery.nodeName(this, "body")) {
                    jQuery(this).replaceWith(this.childNodes);
                }
            }).end();
        }
    });
    jQuery.expr.filters.hidden = function(elem) {
        return elem.offsetWidth <= 0 && elem.offsetHeight <= 0 || !support.reliableHiddenOffsets() && (elem.style && elem.style.display || jQuery.css(elem, "display")) === "none";
    };
    jQuery.expr.filters.visible = function(elem) {
        return !jQuery.expr.filters.hidden(elem);
    };
    var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i, rsubmittable = /^(?:input|select|textarea|keygen)/i;
    function buildParams(prefix, obj, traditional, add) {
        var name;
        if (jQuery.isArray(obj)) {
            jQuery.each(obj, function(i, v) {
                if (traditional || rbracket.test(prefix)) {
                    add(prefix, v);
                } else {
                    buildParams(prefix + "[" + (typeof v === "object" ? i : "") + "]", v, traditional, add);
                }
            });
        } else if (!traditional && jQuery.type(obj) === "object") {
            for (name in obj) {
                buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
            }
        } else {
            add(prefix, obj);
        }
    }
    jQuery.param = function(a, traditional) {
        var prefix, s = [], add = function(key, value) {
            value = jQuery.isFunction(value) ? value() : value == null ? "" : value;
            s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
        };
        if (traditional === undefined) {
            traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
        }
        if (jQuery.isArray(a) || a.jquery && !jQuery.isPlainObject(a)) {
            jQuery.each(a, function() {
                add(this.name, this.value);
            });
        } else {
            for (prefix in a) {
                buildParams(prefix, a[prefix], traditional, add);
            }
        }
        return s.join("&").replace(r20, "+");
    };
    jQuery.fn.extend({
        serialize: function() {
            return jQuery.param(this.serializeArray());
        },
        serializeArray: function() {
            return this.map(function() {
                var elements = jQuery.prop(this, "elements");
                return elements ? jQuery.makeArray(elements) : this;
            }).filter(function() {
                var type = this.type;
                return this.name && !jQuery(this).is(":disabled") && rsubmittable.test(this.nodeName) && !rsubmitterTypes.test(type) && (this.checked || !rcheckableType.test(type));
            }).map(function(i, elem) {
                var val = jQuery(this).val();
                return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val) {
                    return {
                        name: elem.name,
                        value: val.replace(rCRLF, "\r\n")
                    };
                }) : {
                    name: elem.name,
                    value: val.replace(rCRLF, "\r\n")
                };
            }).get();
        }
    });
    jQuery.ajaxSettings.xhr = window.ActiveXObject !== undefined ? function() {
        return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && createStandardXHR() || createActiveXHR();
    } : createStandardXHR;
    var xhrId = 0, xhrCallbacks = {}, xhrSupported = jQuery.ajaxSettings.xhr();
    if (window.ActiveXObject) {
        jQuery(window).on("unload", function() {
            for (var key in xhrCallbacks) {
                xhrCallbacks[key](undefined, true);
            }
        });
    }
    support.cors = !!xhrSupported && "withCredentials" in xhrSupported;
    xhrSupported = support.ajax = !!xhrSupported;
    if (xhrSupported) {
        jQuery.ajaxTransport(function(options) {
            if (!options.crossDomain || support.cors) {
                var callback;
                return {
                    send: function(headers, complete) {
                        var i, xhr = options.xhr(), id = ++xhrId;
                        xhr.open(options.type, options.url, options.async, options.username, options.password);
                        if (options.xhrFields) {
                            for (i in options.xhrFields) {
                                xhr[i] = options.xhrFields[i];
                            }
                        }
                        if (options.mimeType && xhr.overrideMimeType) {
                            xhr.overrideMimeType(options.mimeType);
                        }
                        if (!options.crossDomain && !headers["X-Requested-With"]) {
                            headers["X-Requested-With"] = "XMLHttpRequest";
                        }
                        for (i in headers) {
                            if (headers[i] !== undefined) {
                                xhr.setRequestHeader(i, headers[i] + "");
                            }
                        }
                        xhr.send(options.hasContent && options.data || null);
                        callback = function(_, isAbort) {
                            var status, statusText, responses;
                            if (callback && (isAbort || xhr.readyState === 4)) {
                                delete xhrCallbacks[id];
                                callback = undefined;
                                xhr.onreadystatechange = jQuery.noop;
                                if (isAbort) {
                                    if (xhr.readyState !== 4) {
                                        xhr.abort();
                                    }
                                } else {
                                    responses = {};
                                    status = xhr.status;
                                    if (typeof xhr.responseText === "string") {
                                        responses.text = xhr.responseText;
                                    }
                                    try {
                                        statusText = xhr.statusText;
                                    } catch (e) {
                                        statusText = "";
                                    }
                                    if (!status && options.isLocal && !options.crossDomain) {
                                        status = responses.text ? 200 : 404;
                                    } else if (status === 1223) {
                                        status = 204;
                                    }
                                }
                            }
                            if (responses) {
                                complete(status, statusText, responses, xhr.getAllResponseHeaders());
                            }
                        };
                        if (!options.async) {
                            callback();
                        } else if (xhr.readyState === 4) {
                            setTimeout(callback);
                        } else {
                            xhr.onreadystatechange = xhrCallbacks[id] = callback;
                        }
                    },
                    abort: function() {
                        if (callback) {
                            callback(undefined, true);
                        }
                    }
                };
            }
        });
    }
    function createStandardXHR() {
        try {
            return new window.XMLHttpRequest();
        } catch (e) {}
    }
    function createActiveXHR() {
        try {
            return new window.ActiveXObject("Microsoft.XMLHTTP");
        } catch (e) {}
    }
    jQuery.ajaxSetup({
        accepts: {
            script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
        },
        contents: {
            script: /(?:java|ecma)script/
        },
        converters: {
            "text script": function(text) {
                jQuery.globalEval(text);
                return text;
            }
        }
    });
    jQuery.ajaxPrefilter("script", function(s) {
        if (s.cache === undefined) {
            s.cache = false;
        }
        if (s.crossDomain) {
            s.type = "GET";
            s.global = false;
        }
    });
    jQuery.ajaxTransport("script", function(s) {
        if (s.crossDomain) {
            var script, head = document.head || jQuery("head")[0] || document.documentElement;
            return {
                send: function(_, callback) {
                    script = document.createElement("script");
                    script.async = true;
                    if (s.scriptCharset) {
                        script.charset = s.scriptCharset;
                    }
                    script.src = s.url;
                    script.onload = script.onreadystatechange = function(_, isAbort) {
                        if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {
                            script.onload = script.onreadystatechange = null;
                            if (script.parentNode) {
                                script.parentNode.removeChild(script);
                            }
                            script = null;
                            if (!isAbort) {
                                callback(200, "success");
                            }
                        }
                    };
                    head.insertBefore(script, head.firstChild);
                },
                abort: function() {
                    if (script) {
                        script.onload(undefined, true);
                    }
                }
            };
        }
    });
    var oldCallbacks = [], rjsonp = /(=)\?(?=&|$)|\?\?/;
    jQuery.ajaxSetup({
        jsonp: "callback",
        jsonpCallback: function() {
            var callback = oldCallbacks.pop() || jQuery.expando + "_" + nonce++;
            this[callback] = true;
            return callback;
        }
    });
    jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {
        var callbackName, overwritten, responseContainer, jsonProp = s.jsonp !== false && (rjsonp.test(s.url) ? "url" : typeof s.data === "string" && !(s.contentType || "").indexOf("application/x-www-form-urlencoded") && rjsonp.test(s.data) && "data");
        if (jsonProp || s.dataTypes[0] === "jsonp") {
            callbackName = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback;
            if (jsonProp) {
                s[jsonProp] = s[jsonProp].replace(rjsonp, "$1" + callbackName);
            } else if (s.jsonp !== false) {
                s.url += (rquery.test(s.url) ? "&" : "?") + s.jsonp + "=" + callbackName;
            }
            s.converters["script json"] = function() {
                if (!responseContainer) {
                    jQuery.error(callbackName + " was not called");
                }
                return responseContainer[0];
            };
            s.dataTypes[0] = "json";
            overwritten = window[callbackName];
            window[callbackName] = function() {
                responseContainer = arguments;
            };
            jqXHR.always(function() {
                window[callbackName] = overwritten;
                if (s[callbackName]) {
                    s.jsonpCallback = originalSettings.jsonpCallback;
                    oldCallbacks.push(callbackName);
                }
                if (responseContainer && jQuery.isFunction(overwritten)) {
                    overwritten(responseContainer[0]);
                }
                responseContainer = overwritten = undefined;
            });
            return "script";
        }
    });
    jQuery.parseHTML = function(data, context, keepScripts) {
        if (!data || typeof data !== "string") {
            return null;
        }
        if (typeof context === "boolean") {
            keepScripts = context;
            context = false;
        }
        context = context || document;
        var parsed = rsingleTag.exec(data), scripts = !keepScripts && [];
        if (parsed) {
            return [ context.createElement(parsed[1]) ];
        }
        parsed = jQuery.buildFragment([ data ], context, scripts);
        if (scripts && scripts.length) {
            jQuery(scripts).remove();
        }
        return jQuery.merge([], parsed.childNodes);
    };
    var _load = jQuery.fn.load;
    jQuery.fn.load = function(url, params, callback) {
        if (typeof url !== "string" && _load) {
            return _load.apply(this, arguments);
        }
        var selector, response, type, self = this, off = url.indexOf(" ");
        if (off >= 0) {
            selector = jQuery.trim(url.slice(off, url.length));
            url = url.slice(0, off);
        }
        if (jQuery.isFunction(params)) {
            callback = params;
            params = undefined;
        } else if (params && typeof params === "object") {
            type = "POST";
        }
        if (self.length > 0) {
            jQuery.ajax({
                url: url,
                type: type,
                dataType: "html",
                data: params
            }).done(function(responseText) {
                response = arguments;
                self.html(selector ? jQuery("<div>").append(jQuery.parseHTML(responseText)).find(selector) : responseText);
            }).complete(callback && function(jqXHR, status) {
                self.each(callback, response || [ jqXHR.responseText, status, jqXHR ]);
            });
        }
        return this;
    };
    jQuery.expr.filters.animated = function(elem) {
        return jQuery.grep(jQuery.timers, function(fn) {
            return elem === fn.elem;
        }).length;
    };
    var docElem = window.document.documentElement;
    function getWindow(elem) {
        return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
    }
    jQuery.offset = {
        setOffset: function(elem, options, i) {
            var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition, position = jQuery.css(elem, "position"), curElem = jQuery(elem), props = {};
            if (position === "static") {
                elem.style.position = "relative";
            }
            curOffset = curElem.offset();
            curCSSTop = jQuery.css(elem, "top");
            curCSSLeft = jQuery.css(elem, "left");
            calculatePosition = (position === "absolute" || position === "fixed") && jQuery.inArray("auto", [ curCSSTop, curCSSLeft ]) > -1;
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }
            if (jQuery.isFunction(options)) {
                options = options.call(elem, i, curOffset);
            }
            if (options.top != null) {
                props.top = options.top - curOffset.top + curTop;
            }
            if (options.left != null) {
                props.left = options.left - curOffset.left + curLeft;
            }
            if ("using" in options) {
                options.using.call(elem, props);
            } else {
                curElem.css(props);
            }
        }
    };
    jQuery.fn.extend({
        offset: function(options) {
            if (arguments.length) {
                return options === undefined ? this : this.each(function(i) {
                    jQuery.offset.setOffset(this, options, i);
                });
            }
            var docElem, win, box = {
                top: 0,
                left: 0
            }, elem = this[0], doc = elem && elem.ownerDocument;
            if (!doc) {
                return;
            }
            docElem = doc.documentElement;
            if (!jQuery.contains(docElem, elem)) {
                return box;
            }
            if (typeof elem.getBoundingClientRect !== strundefined) {
                box = elem.getBoundingClientRect();
            }
            win = getWindow(doc);
            return {
                top: box.top + (win.pageYOffset || docElem.scrollTop) - (docElem.clientTop || 0),
                left: box.left + (win.pageXOffset || docElem.scrollLeft) - (docElem.clientLeft || 0)
            };
        },
        position: function() {
            if (!this[0]) {
                return;
            }
            var offsetParent, offset, parentOffset = {
                top: 0,
                left: 0
            }, elem = this[0];
            if (jQuery.css(elem, "position") === "fixed") {
                offset = elem.getBoundingClientRect();
            } else {
                offsetParent = this.offsetParent();
                offset = this.offset();
                if (!jQuery.nodeName(offsetParent[0], "html")) {
                    parentOffset = offsetParent.offset();
                }
                parentOffset.top += jQuery.css(offsetParent[0], "borderTopWidth", true);
                parentOffset.left += jQuery.css(offsetParent[0], "borderLeftWidth", true);
            }
            return {
                top: offset.top - parentOffset.top - jQuery.css(elem, "marginTop", true),
                left: offset.left - parentOffset.left - jQuery.css(elem, "marginLeft", true)
            };
        },
        offsetParent: function() {
            return this.map(function() {
                var offsetParent = this.offsetParent || docElem;
                while (offsetParent && (!jQuery.nodeName(offsetParent, "html") && jQuery.css(offsetParent, "position") === "static")) {
                    offsetParent = offsetParent.offsetParent;
                }
                return offsetParent || docElem;
            });
        }
    });
    jQuery.each({
        scrollLeft: "pageXOffset",
        scrollTop: "pageYOffset"
    }, function(method, prop) {
        var top = /Y/.test(prop);
        jQuery.fn[method] = function(val) {
            return access(this, function(elem, method, val) {
                var win = getWindow(elem);
                if (val === undefined) {
                    return win ? prop in win ? win[prop] : win.document.documentElement[method] : elem[method];
                }
                if (win) {
                    win.scrollTo(!top ? val : jQuery(win).scrollLeft(), top ? val : jQuery(win).scrollTop());
                } else {
                    elem[method] = val;
                }
            }, method, val, arguments.length, null);
        };
    });
    jQuery.each([ "top", "left" ], function(i, prop) {
        jQuery.cssHooks[prop] = addGetHookIf(support.pixelPosition, function(elem, computed) {
            if (computed) {
                computed = curCSS(elem, prop);
                return rnumnonpx.test(computed) ? jQuery(elem).position()[prop] + "px" : computed;
            }
        });
    });
    jQuery.each({
        Height: "height",
        Width: "width"
    }, function(name, type) {
        jQuery.each({
            padding: "inner" + name,
            content: type,
            "": "outer" + name
        }, function(defaultExtra, funcName) {
            jQuery.fn[funcName] = function(margin, value) {
                var chainable = arguments.length && (defaultExtra || typeof margin !== "boolean"), extra = defaultExtra || (margin === true || value === true ? "margin" : "border");
                return access(this, function(elem, type, value) {
                    var doc;
                    if (jQuery.isWindow(elem)) {
                        return elem.document.documentElement["client" + name];
                    }
                    if (elem.nodeType === 9) {
                        doc = elem.documentElement;
                        return Math.max(elem.body["scroll" + name], doc["scroll" + name], elem.body["offset" + name], doc["offset" + name], doc["client" + name]);
                    }
                    return value === undefined ? jQuery.css(elem, type, extra) : jQuery.style(elem, type, value, extra);
                }, type, chainable ? margin : undefined, chainable, null);
            };
        });
    });
    jQuery.fn.size = function() {
        return this.length;
    };
    jQuery.fn.andSelf = jQuery.fn.addBack;
    if (typeof define === "function" && define.amd) {
        define("jquery", [], function() {
            return jQuery;
        });
    }
    var _jQuery = window.jQuery, _$ = window.$;
    jQuery.noConflict = function(deep) {
        if (window.$ === jQuery) {
            window.$ = _$;
        }
        if (deep && window.jQuery === jQuery) {
            window.jQuery = _jQuery;
        }
        return jQuery;
    };
    if (typeof noGlobal === strundefined) {
        window.jQuery = window.$ = jQuery;
    }
    return jQuery;
});

+function($) {
    "use strict";
    function transitionEnd() {
        var el = document.createElement("bootstrap");
        var transEndEventNames = {
            WebkitTransition: "webkitTransitionEnd",
            MozTransition: "transitionend",
            OTransition: "oTransitionEnd otransitionend",
            transition: "transitionend"
        };
        for (var name in transEndEventNames) {
            if (el.style[name] !== undefined) {
                return {
                    end: transEndEventNames[name]
                };
            }
        }
        return false;
    }
    $.fn.emulateTransitionEnd = function(duration) {
        var called = false;
        var $el = this;
        $(this).one("bsTransitionEnd", function() {
            called = true;
        });
        var callback = function() {
            if (!called) $($el).trigger($.support.transition.end);
        };
        setTimeout(callback, duration);
        return this;
    };
    $(function() {
        $.support.transition = transitionEnd();
        if (!$.support.transition) return;
        $.event.special.bsTransitionEnd = {
            bindType: $.support.transition.end,
            delegateType: $.support.transition.end,
            handle: function(e) {
                if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments);
            }
        };
    });
}(jQuery);

+function($) {
    "use strict";
    var dismiss = '[data-dismiss="alert"]';
    var Alert = function(el) {
        $(el).on("click", dismiss, this.close);
    };
    Alert.VERSION = "3.2.0";
    Alert.prototype.close = function(e) {
        var $this = $(this);
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        var $parent = $(selector);
        if (e) e.preventDefault();
        if (!$parent.length) {
            $parent = $this.hasClass("alert") ? $this : $this.parent();
        }
        $parent.trigger(e = $.Event("close.bs.alert"));
        if (e.isDefaultPrevented()) return;
        $parent.removeClass("in");
        function removeElement() {
            $parent.detach().trigger("closed.bs.alert").remove();
        }
        $.support.transition && $parent.hasClass("fade") ? $parent.one("bsTransitionEnd", removeElement).emulateTransitionEnd(150) : removeElement();
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.alert");
            if (!data) $this.data("bs.alert", data = new Alert(this));
            if (typeof option == "string") data[option].call($this);
        });
    }
    var old = $.fn.alert;
    $.fn.alert = Plugin;
    $.fn.alert.Constructor = Alert;
    $.fn.alert.noConflict = function() {
        $.fn.alert = old;
        return this;
    };
    $(document).on("click.bs.alert.data-api", dismiss, Alert.prototype.close);
}(jQuery);

+function($) {
    "use strict";
    var Affix = function(element, options) {
        this.options = $.extend({}, Affix.DEFAULTS, options);
        this.$target = $(this.options.target).on("scroll.bs.affix.data-api", $.proxy(this.checkPosition, this)).on("click.bs.affix.data-api", $.proxy(this.checkPositionWithEventLoop, this));
        this.$element = $(element);
        this.affixed = this.unpin = this.pinnedOffset = null;
        this.checkPosition();
    };
    Affix.VERSION = "3.2.0";
    Affix.RESET = "affix affix-top affix-bottom";
    Affix.DEFAULTS = {
        offset: 0,
        target: window
    };
    Affix.prototype.getPinnedOffset = function() {
        if (this.pinnedOffset) return this.pinnedOffset;
        this.$element.removeClass(Affix.RESET).addClass("affix");
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        return this.pinnedOffset = position.top - scrollTop;
    };
    Affix.prototype.checkPositionWithEventLoop = function() {
        setTimeout($.proxy(this.checkPosition, this), 1);
    };
    Affix.prototype.checkPosition = function() {
        if (!this.$element.is(":visible")) return;
        var scrollHeight = $(document).height();
        var scrollTop = this.$target.scrollTop();
        var position = this.$element.offset();
        var offset = this.options.offset;
        var offsetTop = offset.top;
        var offsetBottom = offset.bottom;
        if (typeof offset != "object") offsetBottom = offsetTop = offset;
        if (typeof offsetTop == "function") offsetTop = offset.top(this.$element);
        if (typeof offsetBottom == "function") offsetBottom = offset.bottom(this.$element);
        var affix = this.unpin != null && scrollTop + this.unpin <= position.top ? false : offsetBottom != null && position.top + this.$element.height() >= scrollHeight - offsetBottom ? "bottom" : offsetTop != null && scrollTop <= offsetTop ? "top" : false;
        if (this.affixed === affix) return;
        if (this.unpin != null) this.$element.css("top", "");
        var affixType = "affix" + (affix ? "-" + affix : "");
        var e = $.Event(affixType + ".bs.affix");
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        this.affixed = affix;
        this.unpin = affix == "bottom" ? this.getPinnedOffset() : null;
        this.$element.removeClass(Affix.RESET).addClass(affixType).trigger($.Event(affixType.replace("affix", "affixed")));
        if (affix == "bottom") {
            this.$element.offset({
                top: scrollHeight - this.$element.height() - offsetBottom
            });
        }
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.affix");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.affix", data = new Affix(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.affix;
    $.fn.affix = Plugin;
    $.fn.affix.Constructor = Affix;
    $.fn.affix.noConflict = function() {
        $.fn.affix = old;
        return this;
    };
    $(window).on("load", function() {
        $('[data-spy="affix"]').each(function() {
            var $spy = $(this);
            var data = $spy.data();
            data.offset = data.offset || {};
            if (data.offsetBottom) data.offset.bottom = data.offsetBottom;
            if (data.offsetTop) data.offset.top = data.offsetTop;
            Plugin.call($spy, data);
        });
    });
}(jQuery);

+function($) {
    "use strict";
    var Button = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Button.DEFAULTS, options);
        this.isLoading = false;
    };
    Button.VERSION = "3.2.0";
    Button.DEFAULTS = {
        loadingText: "loading..."
    };
    Button.prototype.setState = function(state) {
        var d = "disabled";
        var $el = this.$element;
        var val = $el.is("input") ? "val" : "html";
        var data = $el.data();
        state = state + "Text";
        if (data.resetText == null) $el.data("resetText", $el[val]());
        $el[val](data[state] == null ? this.options[state] : data[state]);
        setTimeout($.proxy(function() {
            if (state == "loadingText") {
                this.isLoading = true;
                $el.addClass(d).attr(d, d);
            } else if (this.isLoading) {
                this.isLoading = false;
                $el.removeClass(d).removeAttr(d);
            }
        }, this), 0);
    };
    Button.prototype.toggle = function() {
        var changed = true;
        var $parent = this.$element.closest('[data-toggle="buttons"]');
        if ($parent.length) {
            var $input = this.$element.find("input");
            if ($input.prop("type") == "radio") {
                if ($input.prop("checked") && this.$element.hasClass("active")) changed = false; else $parent.find(".active").removeClass("active");
            }
            if (changed) $input.prop("checked", !this.$element.hasClass("active")).trigger("change");
        }
        if (changed) this.$element.toggleClass("active");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.button");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.button", data = new Button(this, options));
            if (option == "toggle") data.toggle(); else if (option) data.setState(option);
        });
    }
    var old = $.fn.button;
    $.fn.button = Plugin;
    $.fn.button.Constructor = Button;
    $.fn.button.noConflict = function() {
        $.fn.button = old;
        return this;
    };
    $(document).on("click.bs.button.data-api", '[data-toggle^="button"]', function(e) {
        var $btn = $(e.target);
        if (!$btn.hasClass("btn")) $btn = $btn.closest(".btn");
        Plugin.call($btn, "toggle");
        e.preventDefault();
    });
}(jQuery);

+function($) {
    "use strict";
    var Carousel = function(element, options) {
        this.$element = $(element).on("keydown.bs.carousel", $.proxy(this.keydown, this));
        this.$indicators = this.$element.find(".carousel-indicators");
        this.options = options;
        this.paused = this.sliding = this.interval = this.$active = this.$items = null;
        this.options.pause == "hover" && this.$element.on("mouseenter.bs.carousel", $.proxy(this.pause, this)).on("mouseleave.bs.carousel", $.proxy(this.cycle, this));
    };
    Carousel.VERSION = "3.2.0";
    Carousel.DEFAULTS = {
        interval: 5e3,
        pause: "hover",
        wrap: true
    };
    Carousel.prototype.keydown = function(e) {
        switch (e.which) {
          case 37:
            this.prev();
            break;

          case 39:
            this.next();
            break;

          default:
            return;
        }
        e.preventDefault();
    };
    Carousel.prototype.cycle = function(e) {
        e || (this.paused = false);
        this.interval && clearInterval(this.interval);
        this.options.interval && !this.paused && (this.interval = setInterval($.proxy(this.next, this), this.options.interval));
        return this;
    };
    Carousel.prototype.getItemIndex = function(item) {
        this.$items = item.parent().children(".item");
        return this.$items.index(item || this.$active);
    };
    Carousel.prototype.to = function(pos) {
        var that = this;
        var activeIndex = this.getItemIndex(this.$active = this.$element.find(".item.active"));
        if (pos > this.$items.length - 1 || pos < 0) return;
        if (this.sliding) return this.$element.one("slid.bs.carousel", function() {
            that.to(pos);
        });
        if (activeIndex == pos) return this.pause().cycle();
        return this.slide(pos > activeIndex ? "next" : "prev", $(this.$items[pos]));
    };
    Carousel.prototype.pause = function(e) {
        e || (this.paused = true);
        if (this.$element.find(".next, .prev").length && $.support.transition) {
            this.$element.trigger($.support.transition.end);
            this.cycle(true);
        }
        this.interval = clearInterval(this.interval);
        return this;
    };
    Carousel.prototype.next = function() {
        if (this.sliding) return;
        return this.slide("next");
    };
    Carousel.prototype.prev = function() {
        if (this.sliding) return;
        return this.slide("prev");
    };
    Carousel.prototype.slide = function(type, next) {
        var $active = this.$element.find(".item.active");
        var $next = next || $active[type]();
        var isCycling = this.interval;
        var direction = type == "next" ? "left" : "right";
        var fallback = type == "next" ? "first" : "last";
        var that = this;
        if (!$next.length) {
            if (!this.options.wrap) return;
            $next = this.$element.find(".item")[fallback]();
        }
        if ($next.hasClass("active")) return this.sliding = false;
        var relatedTarget = $next[0];
        var slideEvent = $.Event("slide.bs.carousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        this.$element.trigger(slideEvent);
        if (slideEvent.isDefaultPrevented()) return;
        this.sliding = true;
        isCycling && this.pause();
        if (this.$indicators.length) {
            this.$indicators.find(".active").removeClass("active");
            var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)]);
            $nextIndicator && $nextIndicator.addClass("active");
        }
        var slidEvent = $.Event("slid.bs.carousel", {
            relatedTarget: relatedTarget,
            direction: direction
        });
        if ($.support.transition && this.$element.hasClass("slide")) {
            $next.addClass(type);
            $next[0].offsetWidth;
            $active.addClass(direction);
            $next.addClass(direction);
            $active.one("bsTransitionEnd", function() {
                $next.removeClass([ type, direction ].join(" ")).addClass("active");
                $active.removeClass([ "active", direction ].join(" "));
                that.sliding = false;
                setTimeout(function() {
                    that.$element.trigger(slidEvent);
                }, 0);
            }).emulateTransitionEnd($active.css("transition-duration").slice(0, -1) * 1e3);
        } else {
            $active.removeClass("active");
            $next.addClass("active");
            this.sliding = false;
            this.$element.trigger(slidEvent);
        }
        isCycling && this.cycle();
        return this;
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.carousel");
            var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == "object" && option);
            var action = typeof option == "string" ? option : options.slide;
            if (!data) $this.data("bs.carousel", data = new Carousel(this, options));
            if (typeof option == "number") data.to(option); else if (action) data[action](); else if (options.interval) data.pause().cycle();
        });
    }
    var old = $.fn.carousel;
    $.fn.carousel = Plugin;
    $.fn.carousel.Constructor = Carousel;
    $.fn.carousel.noConflict = function() {
        $.fn.carousel = old;
        return this;
    };
    $(document).on("click.bs.carousel.data-api", "[data-slide], [data-slide-to]", function(e) {
        var href;
        var $this = $(this);
        var $target = $($this.attr("data-target") || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, ""));
        if (!$target.hasClass("carousel")) return;
        var options = $.extend({}, $target.data(), $this.data());
        var slideIndex = $this.attr("data-slide-to");
        if (slideIndex) options.interval = false;
        Plugin.call($target, options);
        if (slideIndex) {
            $target.data("bs.carousel").to(slideIndex);
        }
        e.preventDefault();
    });
    $(window).on("load", function() {
        $('[data-ride="carousel"]').each(function() {
            var $carousel = $(this);
            Plugin.call($carousel, $carousel.data());
        });
    });
}(jQuery);

+function($) {
    "use strict";
    var Collapse = function(element, options) {
        this.$element = $(element);
        this.options = $.extend({}, Collapse.DEFAULTS, options);
        this.transitioning = null;
        if (this.options.parent) this.$parent = $(this.options.parent);
        if (this.options.toggle) this.toggle();
    };
    Collapse.VERSION = "3.2.0";
    Collapse.DEFAULTS = {
        toggle: true
    };
    Collapse.prototype.dimension = function() {
        var hasWidth = this.$element.hasClass("width");
        return hasWidth ? "width" : "height";
    };
    Collapse.prototype.show = function() {
        if (this.transitioning || this.$element.hasClass("in")) return;
        var startEvent = $.Event("show.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        var actives = this.$parent && this.$parent.find("> .panel > .in");
        if (actives && actives.length) {
            var hasData = actives.data("bs.collapse");
            if (hasData && hasData.transitioning) return;
            Plugin.call(actives, "hide");
            hasData || actives.data("bs.collapse", null);
        }
        var dimension = this.dimension();
        this.$element.removeClass("collapse").addClass("collapsing")[dimension](0);
        this.transitioning = 1;
        var complete = function() {
            this.$element.removeClass("collapsing").addClass("collapse in")[dimension]("");
            this.transitioning = 0;
            this.$element.trigger("shown.bs.collapse");
        };
        if (!$.support.transition) return complete.call(this);
        var scrollSize = $.camelCase([ "scroll", dimension ].join("-"));
        this.$element.one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize]);
    };
    Collapse.prototype.hide = function() {
        if (this.transitioning || !this.$element.hasClass("in")) return;
        var startEvent = $.Event("hide.bs.collapse");
        this.$element.trigger(startEvent);
        if (startEvent.isDefaultPrevented()) return;
        var dimension = this.dimension();
        this.$element[dimension](this.$element[dimension]())[0].offsetHeight;
        this.$element.addClass("collapsing").removeClass("collapse").removeClass("in");
        this.transitioning = 1;
        var complete = function() {
            this.transitioning = 0;
            this.$element.trigger("hidden.bs.collapse").removeClass("collapsing").addClass("collapse");
        };
        if (!$.support.transition) return complete.call(this);
        this.$element[dimension](0).one("bsTransitionEnd", $.proxy(complete, this)).emulateTransitionEnd(350);
    };
    Collapse.prototype.toggle = function() {
        this[this.$element.hasClass("in") ? "hide" : "show"]();
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.collapse");
            var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data && options.toggle && option == "show") option = !option;
            if (!data) $this.data("bs.collapse", data = new Collapse(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.collapse;
    $.fn.collapse = Plugin;
    $.fn.collapse.Constructor = Collapse;
    $.fn.collapse.noConflict = function() {
        $.fn.collapse = old;
        return this;
    };
    $(document).on("click.bs.collapse.data-api", '[data-toggle="collapse"]', function(e) {
        var href;
        var $this = $(this);
        var target = $this.attr("data-target") || e.preventDefault() || (href = $this.attr("href")) && href.replace(/.*(?=#[^\s]+$)/, "");
        var $target = $(target);
        var data = $target.data("bs.collapse");
        var option = data ? "toggle" : $this.data();
        var parent = $this.attr("data-parent");
        var $parent = parent && $(parent);
        if (!data || !data.transitioning) {
            if ($parent) $parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass("collapsed");
            $this[$target.hasClass("in") ? "addClass" : "removeClass"]("collapsed");
        }
        Plugin.call($target, option);
    });
}(jQuery);

+function($) {
    "use strict";
    var backdrop = ".dropdown-backdrop";
    var toggle = '[data-toggle="dropdown"]';
    var Dropdown = function(element) {
        $(element).on("click.bs.dropdown", this.toggle);
    };
    Dropdown.VERSION = "3.2.0";
    Dropdown.prototype.toggle = function(e) {
        var $this = $(this);
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        clearMenus();
        if (!isActive) {
            if ("ontouchstart" in document.documentElement && !$parent.closest(".navbar-nav").length) {
                $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on("click", clearMenus);
            }
            var relatedTarget = {
                relatedTarget: this
            };
            $parent.trigger(e = $.Event("show.bs.dropdown", relatedTarget));
            if (e.isDefaultPrevented()) return;
            $this.trigger("focus");
            $parent.toggleClass("open").trigger("shown.bs.dropdown", relatedTarget);
        }
        return false;
    };
    Dropdown.prototype.keydown = function(e) {
        if (!/(38|40|27)/.test(e.keyCode)) return;
        var $this = $(this);
        e.preventDefault();
        e.stopPropagation();
        if ($this.is(".disabled, :disabled")) return;
        var $parent = getParent($this);
        var isActive = $parent.hasClass("open");
        if (!isActive || isActive && e.keyCode == 27) {
            if (e.which == 27) $parent.find(toggle).trigger("focus");
            return $this.trigger("click");
        }
        var desc = " li:not(.divider):visible a";
        var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc);
        if (!$items.length) return;
        var index = $items.index($items.filter(":focus"));
        if (e.keyCode == 38 && index > 0) index--;
        if (e.keyCode == 40 && index < $items.length - 1) index++;
        if (!~index) index = 0;
        $items.eq(index).trigger("focus");
    };
    function clearMenus(e) {
        if (e && e.which === 3) return;
        $(backdrop).remove();
        $(toggle).each(function() {
            var $parent = getParent($(this));
            var relatedTarget = {
                relatedTarget: this
            };
            if (!$parent.hasClass("open")) return;
            $parent.trigger(e = $.Event("hide.bs.dropdown", relatedTarget));
            if (e.isDefaultPrevented()) return;
            $parent.removeClass("open").trigger("hidden.bs.dropdown", relatedTarget);
        });
    }
    function getParent($this) {
        var selector = $this.attr("data-target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        var $parent = selector && $(selector);
        return $parent && $parent.length ? $parent : $this.parent();
    }
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.dropdown");
            if (!data) $this.data("bs.dropdown", data = new Dropdown(this));
            if (typeof option == "string") data[option].call($this);
        });
    }
    var old = $.fn.dropdown;
    $.fn.dropdown = Plugin;
    $.fn.dropdown.Constructor = Dropdown;
    $.fn.dropdown.noConflict = function() {
        $.fn.dropdown = old;
        return this;
    };
    $(document).on("click.bs.dropdown.data-api", clearMenus).on("click.bs.dropdown.data-api", ".dropdown form", function(e) {
        e.stopPropagation();
    }).on("click.bs.dropdown.data-api", toggle, Dropdown.prototype.toggle).on("keydown.bs.dropdown.data-api", toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown);
}(jQuery);

+function($) {
    "use strict";
    var Modal = function(element, options) {
        this.options = options;
        this.$body = $(document.body);
        this.$element = $(element);
        this.$backdrop = this.isShown = null;
        this.scrollbarWidth = 0;
        if (this.options.remote) {
            this.$element.find(".modal-content").load(this.options.remote, $.proxy(function() {
                this.$element.trigger("loaded.bs.modal");
            }, this));
        }
    };
    Modal.VERSION = "3.2.0";
    Modal.DEFAULTS = {
        backdrop: true,
        keyboard: true,
        show: true
    };
    Modal.prototype.toggle = function(_relatedTarget) {
        return this.isShown ? this.hide() : this.show(_relatedTarget);
    };
    Modal.prototype.show = function(_relatedTarget) {
        var that = this;
        var e = $.Event("show.bs.modal", {
            relatedTarget: _relatedTarget
        });
        this.$element.trigger(e);
        if (this.isShown || e.isDefaultPrevented()) return;
        this.isShown = true;
        this.checkScrollbar();
        this.$body.addClass("modal-open");
        this.setScrollbar();
        this.escape();
        this.$element.on("click.dismiss.bs.modal", '[data-dismiss="modal"]', $.proxy(this.hide, this));
        this.backdrop(function() {
            var transition = $.support.transition && that.$element.hasClass("fade");
            if (!that.$element.parent().length) {
                that.$element.appendTo(that.$body);
            }
            that.$element.show().scrollTop(0);
            if (transition) {
                that.$element[0].offsetWidth;
            }
            that.$element.addClass("in").attr("aria-hidden", false);
            that.enforceFocus();
            var e = $.Event("shown.bs.modal", {
                relatedTarget: _relatedTarget
            });
            transition ? that.$element.find(".modal-dialog").one("bsTransitionEnd", function() {
                that.$element.trigger("focus").trigger(e);
            }).emulateTransitionEnd(300) : that.$element.trigger("focus").trigger(e);
        });
    };
    Modal.prototype.hide = function(e) {
        if (e) e.preventDefault();
        e = $.Event("hide.bs.modal");
        this.$element.trigger(e);
        if (!this.isShown || e.isDefaultPrevented()) return;
        this.isShown = false;
        this.$body.removeClass("modal-open");
        this.resetScrollbar();
        this.escape();
        $(document).off("focusin.bs.modal");
        this.$element.removeClass("in").attr("aria-hidden", true).off("click.dismiss.bs.modal");
        $.support.transition && this.$element.hasClass("fade") ? this.$element.one("bsTransitionEnd", $.proxy(this.hideModal, this)).emulateTransitionEnd(300) : this.hideModal();
    };
    Modal.prototype.enforceFocus = function() {
        $(document).off("focusin.bs.modal").on("focusin.bs.modal", $.proxy(function(e) {
            if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
                this.$element.trigger("focus");
            }
        }, this));
    };
    Modal.prototype.escape = function() {
        if (this.isShown && this.options.keyboard) {
            this.$element.on("keyup.dismiss.bs.modal", $.proxy(function(e) {
                e.which == 27 && this.hide();
            }, this));
        } else if (!this.isShown) {
            this.$element.off("keyup.dismiss.bs.modal");
        }
    };
    Modal.prototype.hideModal = function() {
        var that = this;
        this.$element.hide();
        this.backdrop(function() {
            that.$element.trigger("hidden.bs.modal");
        });
    };
    Modal.prototype.removeBackdrop = function() {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    };
    Modal.prototype.backdrop = function(callback) {
        var that = this;
        var animate = this.$element.hasClass("fade") ? "fade" : "";
        if (this.isShown && this.options.backdrop) {
            var doAnimate = $.support.transition && animate;
            this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />').appendTo(this.$body);
            this.$element.on("click.dismiss.bs.modal", $.proxy(function(e) {
                if (e.target !== e.currentTarget) return;
                this.options.backdrop == "static" ? this.$element[0].focus.call(this.$element[0]) : this.hide.call(this);
            }, this));
            if (doAnimate) this.$backdrop[0].offsetWidth;
            this.$backdrop.addClass("in");
            if (!callback) return;
            doAnimate ? this.$backdrop.one("bsTransitionEnd", callback).emulateTransitionEnd(150) : callback();
        } else if (!this.isShown && this.$backdrop) {
            this.$backdrop.removeClass("in");
            var callbackRemove = function() {
                that.removeBackdrop();
                callback && callback();
            };
            $.support.transition && this.$element.hasClass("fade") ? this.$backdrop.one("bsTransitionEnd", callbackRemove).emulateTransitionEnd(150) : callbackRemove();
        } else if (callback) {
            callback();
        }
    };
    Modal.prototype.checkScrollbar = function() {
        if (document.body.clientWidth >= window.innerWidth) return;
        this.scrollbarWidth = this.scrollbarWidth || this.measureScrollbar();
    };
    Modal.prototype.setScrollbar = function() {
        var bodyPad = parseInt(this.$body.css("padding-right") || 0, 10);
        if (this.scrollbarWidth) this.$body.css("padding-right", bodyPad + this.scrollbarWidth);
    };
    Modal.prototype.resetScrollbar = function() {
        this.$body.css("padding-right", "");
    };
    Modal.prototype.measureScrollbar = function() {
        var scrollDiv = document.createElement("div");
        scrollDiv.className = "modal-scrollbar-measure";
        this.$body.append(scrollDiv);
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        this.$body[0].removeChild(scrollDiv);
        return scrollbarWidth;
    };
    function Plugin(option, _relatedTarget) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.modal");
            var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == "object" && option);
            if (!data) $this.data("bs.modal", data = new Modal(this, options));
            if (typeof option == "string") data[option](_relatedTarget); else if (options.show) data.show(_relatedTarget);
        });
    }
    var old = $.fn.modal;
    $.fn.modal = Plugin;
    $.fn.modal.Constructor = Modal;
    $.fn.modal.noConflict = function() {
        $.fn.modal = old;
        return this;
    };
    $(document).on("click.bs.modal.data-api", '[data-toggle="modal"]', function(e) {
        var $this = $(this);
        var href = $this.attr("href");
        var $target = $($this.attr("data-target") || href && href.replace(/.*(?=#[^\s]+$)/, ""));
        var option = $target.data("bs.modal") ? "toggle" : $.extend({
            remote: !/#/.test(href) && href
        }, $target.data(), $this.data());
        if ($this.is("a")) e.preventDefault();
        $target.one("show.bs.modal", function(showEvent) {
            if (showEvent.isDefaultPrevented()) return;
            $target.one("hidden.bs.modal", function() {
                $this.is(":visible") && $this.trigger("focus");
            });
        });
        Plugin.call($target, option, this);
    });
}(jQuery);

+function($) {
    "use strict";
    var Tooltip = function(element, options) {
        this.type = this.options = this.enabled = this.timeout = this.hoverState = this.$element = null;
        this.init("tooltip", element, options);
    };
    Tooltip.VERSION = "3.2.0";
    Tooltip.DEFAULTS = {
        animation: true,
        placement: "top",
        selector: false,
        template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
        trigger: "hover focus",
        title: "",
        delay: 0,
        html: false,
        container: false,
        viewport: {
            selector: "body",
            padding: 0
        }
    };
    Tooltip.prototype.init = function(type, element, options) {
        this.enabled = true;
        this.type = type;
        this.$element = $(element);
        this.options = this.getOptions(options);
        this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport);
        var triggers = this.options.trigger.split(" ");
        for (var i = triggers.length; i--; ) {
            var trigger = triggers[i];
            if (trigger == "click") {
                this.$element.on("click." + this.type, this.options.selector, $.proxy(this.toggle, this));
            } else if (trigger != "manual") {
                var eventIn = trigger == "hover" ? "mouseenter" : "focusin";
                var eventOut = trigger == "hover" ? "mouseleave" : "focusout";
                this.$element.on(eventIn + "." + this.type, this.options.selector, $.proxy(this.enter, this));
                this.$element.on(eventOut + "." + this.type, this.options.selector, $.proxy(this.leave, this));
            }
        }
        this.options.selector ? this._options = $.extend({}, this.options, {
            trigger: "manual",
            selector: ""
        }) : this.fixTitle();
    };
    Tooltip.prototype.getDefaults = function() {
        return Tooltip.DEFAULTS;
    };
    Tooltip.prototype.getOptions = function(options) {
        options = $.extend({}, this.getDefaults(), this.$element.data(), options);
        if (options.delay && typeof options.delay == "number") {
            options.delay = {
                show: options.delay,
                hide: options.delay
            };
        }
        return options;
    };
    Tooltip.prototype.getDelegateOptions = function() {
        var options = {};
        var defaults = this.getDefaults();
        this._options && $.each(this._options, function(key, value) {
            if (defaults[key] != value) options[key] = value;
        });
        return options;
    };
    Tooltip.prototype.enter = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data("bs." + this.type, self);
        }
        clearTimeout(self.timeout);
        self.hoverState = "in";
        if (!self.options.delay || !self.options.delay.show) return self.show();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "in") self.show();
        }, self.options.delay.show);
    };
    Tooltip.prototype.leave = function(obj) {
        var self = obj instanceof this.constructor ? obj : $(obj.currentTarget).data("bs." + this.type);
        if (!self) {
            self = new this.constructor(obj.currentTarget, this.getDelegateOptions());
            $(obj.currentTarget).data("bs." + this.type, self);
        }
        clearTimeout(self.timeout);
        self.hoverState = "out";
        if (!self.options.delay || !self.options.delay.hide) return self.hide();
        self.timeout = setTimeout(function() {
            if (self.hoverState == "out") self.hide();
        }, self.options.delay.hide);
    };
    Tooltip.prototype.show = function() {
        var e = $.Event("show.bs." + this.type);
        if (this.hasContent() && this.enabled) {
            this.$element.trigger(e);
            var inDom = $.contains(document.documentElement, this.$element[0]);
            if (e.isDefaultPrevented() || !inDom) return;
            var that = this;
            var $tip = this.tip();
            var tipId = this.getUID(this.type);
            this.setContent();
            $tip.attr("id", tipId);
            this.$element.attr("aria-describedby", tipId);
            if (this.options.animation) $tip.addClass("fade");
            var placement = typeof this.options.placement == "function" ? this.options.placement.call(this, $tip[0], this.$element[0]) : this.options.placement;
            var autoToken = /\s?auto?\s?/i;
            var autoPlace = autoToken.test(placement);
            if (autoPlace) placement = placement.replace(autoToken, "") || "top";
            $tip.detach().css({
                top: 0,
                left: 0,
                display: "block"
            }).addClass(placement).data("bs." + this.type, this);
            this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element);
            var pos = this.getPosition();
            var actualWidth = $tip[0].offsetWidth;
            var actualHeight = $tip[0].offsetHeight;
            if (autoPlace) {
                var orgPlacement = placement;
                var $parent = this.$element.parent();
                var parentDim = this.getPosition($parent);
                placement = placement == "bottom" && pos.top + pos.height + actualHeight - parentDim.scroll > parentDim.height ? "top" : placement == "top" && pos.top - parentDim.scroll - actualHeight < 0 ? "bottom" : placement == "right" && pos.right + actualWidth > parentDim.width ? "left" : placement == "left" && pos.left - actualWidth < parentDim.left ? "right" : placement;
                $tip.removeClass(orgPlacement).addClass(placement);
            }
            var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight);
            this.applyPlacement(calculatedOffset, placement);
            var complete = function() {
                that.$element.trigger("shown.bs." + that.type);
                that.hoverState = null;
            };
            $.support.transition && this.$tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(150) : complete();
        }
    };
    Tooltip.prototype.applyPlacement = function(offset, placement) {
        var $tip = this.tip();
        var width = $tip[0].offsetWidth;
        var height = $tip[0].offsetHeight;
        var marginTop = parseInt($tip.css("margin-top"), 10);
        var marginLeft = parseInt($tip.css("margin-left"), 10);
        if (isNaN(marginTop)) marginTop = 0;
        if (isNaN(marginLeft)) marginLeft = 0;
        offset.top = offset.top + marginTop;
        offset.left = offset.left + marginLeft;
        $.offset.setOffset($tip[0], $.extend({
            using: function(props) {
                $tip.css({
                    top: Math.round(props.top),
                    left: Math.round(props.left)
                });
            }
        }, offset), 0);
        $tip.addClass("in");
        var actualWidth = $tip[0].offsetWidth;
        var actualHeight = $tip[0].offsetHeight;
        if (placement == "top" && actualHeight != height) {
            offset.top = offset.top + height - actualHeight;
        }
        var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight);
        if (delta.left) offset.left += delta.left; else offset.top += delta.top;
        var arrowDelta = delta.left ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight;
        var arrowPosition = delta.left ? "left" : "top";
        var arrowOffsetPosition = delta.left ? "offsetWidth" : "offsetHeight";
        $tip.offset(offset);
        this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], arrowPosition);
    };
    Tooltip.prototype.replaceArrow = function(delta, dimension, position) {
        this.arrow().css(position, delta ? 50 * (1 - delta / dimension) + "%" : "");
    };
    Tooltip.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        $tip.find(".tooltip-inner")[this.options.html ? "html" : "text"](title);
        $tip.removeClass("fade in top bottom left right");
    };
    Tooltip.prototype.hide = function() {
        var that = this;
        var $tip = this.tip();
        var e = $.Event("hide.bs." + this.type);
        this.$element.removeAttr("aria-describedby");
        function complete() {
            if (that.hoverState != "in") $tip.detach();
            that.$element.trigger("hidden.bs." + that.type);
        }
        this.$element.trigger(e);
        if (e.isDefaultPrevented()) return;
        $tip.removeClass("in");
        $.support.transition && this.$tip.hasClass("fade") ? $tip.one("bsTransitionEnd", complete).emulateTransitionEnd(150) : complete();
        this.hoverState = null;
        return this;
    };
    Tooltip.prototype.fixTitle = function() {
        var $e = this.$element;
        if ($e.attr("title") || typeof $e.attr("data-original-title") != "string") {
            $e.attr("data-original-title", $e.attr("title") || "").attr("title", "");
        }
    };
    Tooltip.prototype.hasContent = function() {
        return this.getTitle();
    };
    Tooltip.prototype.getPosition = function($element) {
        $element = $element || this.$element;
        var el = $element[0];
        var isBody = el.tagName == "BODY";
        return $.extend({}, typeof el.getBoundingClientRect == "function" ? el.getBoundingClientRect() : null, {
            scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop(),
            width: isBody ? $(window).width() : $element.outerWidth(),
            height: isBody ? $(window).height() : $element.outerHeight()
        }, isBody ? {
            top: 0,
            left: 0
        } : $element.offset());
    };
    Tooltip.prototype.getCalculatedOffset = function(placement, pos, actualWidth, actualHeight) {
        return placement == "bottom" ? {
            top: pos.top + pos.height,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "top" ? {
            top: pos.top - actualHeight,
            left: pos.left + pos.width / 2 - actualWidth / 2
        } : placement == "left" ? {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left - actualWidth
        } : {
            top: pos.top + pos.height / 2 - actualHeight / 2,
            left: pos.left + pos.width
        };
    };
    Tooltip.prototype.getViewportAdjustedDelta = function(placement, pos, actualWidth, actualHeight) {
        var delta = {
            top: 0,
            left: 0
        };
        if (!this.$viewport) return delta;
        var viewportPadding = this.options.viewport && this.options.viewport.padding || 0;
        var viewportDimensions = this.getPosition(this.$viewport);
        if (/right|left/.test(placement)) {
            var topEdgeOffset = pos.top - viewportPadding - viewportDimensions.scroll;
            var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight;
            if (topEdgeOffset < viewportDimensions.top) {
                delta.top = viewportDimensions.top - topEdgeOffset;
            } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) {
                delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset;
            }
        } else {
            var leftEdgeOffset = pos.left - viewportPadding;
            var rightEdgeOffset = pos.left + viewportPadding + actualWidth;
            if (leftEdgeOffset < viewportDimensions.left) {
                delta.left = viewportDimensions.left - leftEdgeOffset;
            } else if (rightEdgeOffset > viewportDimensions.width) {
                delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset;
            }
        }
        return delta;
    };
    Tooltip.prototype.getTitle = function() {
        var title;
        var $e = this.$element;
        var o = this.options;
        title = $e.attr("data-original-title") || (typeof o.title == "function" ? o.title.call($e[0]) : o.title);
        return title;
    };
    Tooltip.prototype.getUID = function(prefix) {
        do prefix += ~~(Math.random() * 1e6); while (document.getElementById(prefix));
        return prefix;
    };
    Tooltip.prototype.tip = function() {
        return this.$tip = this.$tip || $(this.options.template);
    };
    Tooltip.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".tooltip-arrow");
    };
    Tooltip.prototype.validate = function() {
        if (!this.$element[0].parentNode) {
            this.hide();
            this.$element = null;
            this.options = null;
        }
    };
    Tooltip.prototype.enable = function() {
        this.enabled = true;
    };
    Tooltip.prototype.disable = function() {
        this.enabled = false;
    };
    Tooltip.prototype.toggleEnabled = function() {
        this.enabled = !this.enabled;
    };
    Tooltip.prototype.toggle = function(e) {
        var self = this;
        if (e) {
            self = $(e.currentTarget).data("bs." + this.type);
            if (!self) {
                self = new this.constructor(e.currentTarget, this.getDelegateOptions());
                $(e.currentTarget).data("bs." + this.type, self);
            }
        }
        self.tip().hasClass("in") ? self.leave(self) : self.enter(self);
    };
    Tooltip.prototype.destroy = function() {
        clearTimeout(this.timeout);
        this.hide().$element.off("." + this.type).removeData("bs." + this.type);
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tooltip");
            var options = typeof option == "object" && option;
            if (!data && option == "destroy") return;
            if (!data) $this.data("bs.tooltip", data = new Tooltip(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.tooltip;
    $.fn.tooltip = Plugin;
    $.fn.tooltip.Constructor = Tooltip;
    $.fn.tooltip.noConflict = function() {
        $.fn.tooltip = old;
        return this;
    };
}(jQuery);

+function($) {
    "use strict";
    var Popover = function(element, options) {
        this.init("popover", element, options);
    };
    if (!$.fn.tooltip) throw new Error("Popover requires tooltip.js");
    Popover.VERSION = "3.2.0";
    Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
        placement: "right",
        trigger: "click",
        content: "",
        template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
    });
    Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype);
    Popover.prototype.constructor = Popover;
    Popover.prototype.getDefaults = function() {
        return Popover.DEFAULTS;
    };
    Popover.prototype.setContent = function() {
        var $tip = this.tip();
        var title = this.getTitle();
        var content = this.getContent();
        $tip.find(".popover-title")[this.options.html ? "html" : "text"](title);
        $tip.find(".popover-content").empty()[this.options.html ? typeof content == "string" ? "html" : "append" : "text"](content);
        $tip.removeClass("fade top bottom left right in");
        if (!$tip.find(".popover-title").html()) $tip.find(".popover-title").hide();
    };
    Popover.prototype.hasContent = function() {
        return this.getTitle() || this.getContent();
    };
    Popover.prototype.getContent = function() {
        var $e = this.$element;
        var o = this.options;
        return $e.attr("data-content") || (typeof o.content == "function" ? o.content.call($e[0]) : o.content);
    };
    Popover.prototype.arrow = function() {
        return this.$arrow = this.$arrow || this.tip().find(".arrow");
    };
    Popover.prototype.tip = function() {
        if (!this.$tip) this.$tip = $(this.options.template);
        return this.$tip;
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.popover");
            var options = typeof option == "object" && option;
            if (!data && option == "destroy") return;
            if (!data) $this.data("bs.popover", data = new Popover(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.popover;
    $.fn.popover = Plugin;
    $.fn.popover.Constructor = Popover;
    $.fn.popover.noConflict = function() {
        $.fn.popover = old;
        return this;
    };
}(jQuery);

+function($) {
    "use strict";
    function ScrollSpy(element, options) {
        var process = $.proxy(this.process, this);
        this.$body = $("body");
        this.$scrollElement = $(element).is("body") ? $(window) : $(element);
        this.options = $.extend({}, ScrollSpy.DEFAULTS, options);
        this.selector = (this.options.target || "") + " .nav li > a";
        this.offsets = [];
        this.targets = [];
        this.activeTarget = null;
        this.scrollHeight = 0;
        this.$scrollElement.on("scroll.bs.scrollspy", process);
        this.refresh();
        this.process();
    }
    ScrollSpy.VERSION = "3.2.0";
    ScrollSpy.DEFAULTS = {
        offset: 10
    };
    ScrollSpy.prototype.getScrollHeight = function() {
        return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight);
    };
    ScrollSpy.prototype.refresh = function() {
        var offsetMethod = "offset";
        var offsetBase = 0;
        if (!$.isWindow(this.$scrollElement[0])) {
            offsetMethod = "position";
            offsetBase = this.$scrollElement.scrollTop();
        }
        this.offsets = [];
        this.targets = [];
        this.scrollHeight = this.getScrollHeight();
        var self = this;
        this.$body.find(this.selector).map(function() {
            var $el = $(this);
            var href = $el.data("target") || $el.attr("href");
            var $href = /^#./.test(href) && $(href);
            return $href && $href.length && $href.is(":visible") && [ [ $href[offsetMethod]().top + offsetBase, href ] ] || null;
        }).sort(function(a, b) {
            return a[0] - b[0];
        }).each(function() {
            self.offsets.push(this[0]);
            self.targets.push(this[1]);
        });
    };
    ScrollSpy.prototype.process = function() {
        var scrollTop = this.$scrollElement.scrollTop() + this.options.offset;
        var scrollHeight = this.getScrollHeight();
        var maxScroll = this.options.offset + scrollHeight - this.$scrollElement.height();
        var offsets = this.offsets;
        var targets = this.targets;
        var activeTarget = this.activeTarget;
        var i;
        if (this.scrollHeight != scrollHeight) {
            this.refresh();
        }
        if (scrollTop >= maxScroll) {
            return activeTarget != (i = targets[targets.length - 1]) && this.activate(i);
        }
        if (activeTarget && scrollTop <= offsets[0]) {
            return activeTarget != (i = targets[0]) && this.activate(i);
        }
        for (i = offsets.length; i--; ) {
            activeTarget != targets[i] && scrollTop >= offsets[i] && (!offsets[i + 1] || scrollTop <= offsets[i + 1]) && this.activate(targets[i]);
        }
    };
    ScrollSpy.prototype.activate = function(target) {
        this.activeTarget = target;
        $(this.selector).parentsUntil(this.options.target, ".active").removeClass("active");
        var selector = this.selector + '[data-target="' + target + '"],' + this.selector + '[href="' + target + '"]';
        var active = $(selector).parents("li").addClass("active");
        if (active.parent(".dropdown-menu").length) {
            active = active.closest("li.dropdown").addClass("active");
        }
        active.trigger("activate.bs.scrollspy");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.scrollspy");
            var options = typeof option == "object" && option;
            if (!data) $this.data("bs.scrollspy", data = new ScrollSpy(this, options));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.scrollspy;
    $.fn.scrollspy = Plugin;
    $.fn.scrollspy.Constructor = ScrollSpy;
    $.fn.scrollspy.noConflict = function() {
        $.fn.scrollspy = old;
        return this;
    };
    $(window).on("load.bs.scrollspy.data-api", function() {
        $('[data-spy="scroll"]').each(function() {
            var $spy = $(this);
            Plugin.call($spy, $spy.data());
        });
    });
}(jQuery);

+function($) {
    "use strict";
    var Tab = function(element) {
        this.element = $(element);
    };
    Tab.VERSION = "3.2.0";
    Tab.prototype.show = function() {
        var $this = this.element;
        var $ul = $this.closest("ul:not(.dropdown-menu)");
        var selector = $this.data("target");
        if (!selector) {
            selector = $this.attr("href");
            selector = selector && selector.replace(/.*(?=#[^\s]*$)/, "");
        }
        if ($this.parent("li").hasClass("active")) return;
        var previous = $ul.find(".active:last a")[0];
        var e = $.Event("show.bs.tab", {
            relatedTarget: previous
        });
        $this.trigger(e);
        if (e.isDefaultPrevented()) return;
        var $target = $(selector);
        this.activate($this.closest("li"), $ul);
        this.activate($target, $target.parent(), function() {
            $this.trigger({
                type: "shown.bs.tab",
                relatedTarget: previous
            });
        });
    };
    Tab.prototype.activate = function(element, container, callback) {
        var $active = container.find("> .active");
        var transition = callback && $.support.transition && $active.hasClass("fade");
        function next() {
            $active.removeClass("active").find("> .dropdown-menu > .active").removeClass("active");
            element.addClass("active");
            if (transition) {
                element[0].offsetWidth;
                element.addClass("in");
            } else {
                element.removeClass("fade");
            }
            if (element.parent(".dropdown-menu")) {
                element.closest("li.dropdown").addClass("active");
            }
            callback && callback();
        }
        transition ? $active.one("bsTransitionEnd", next).emulateTransitionEnd(150) : next();
        $active.removeClass("in");
    };
    function Plugin(option) {
        return this.each(function() {
            var $this = $(this);
            var data = $this.data("bs.tab");
            if (!data) $this.data("bs.tab", data = new Tab(this));
            if (typeof option == "string") data[option]();
        });
    }
    var old = $.fn.tab;
    $.fn.tab = Plugin;
    $.fn.tab.Constructor = Tab;
    $.fn.tab.noConflict = function() {
        $.fn.tab = old;
        return this;
    };
    $(document).on("click.bs.tab.data-api", '[data-toggle="tab"], [data-toggle="pill"]', function(e) {
        e.preventDefault();
        Plugin.call($(this), "show");
    });
}(jQuery);

(function($) {
    "use strict";
    var defaultOptions = {
        tagClass: function(item) {
            return "label label-info";
        },
        itemValue: function(item) {
            return item ? item.toString() : item;
        },
        itemText: function(item) {
            return this.itemValue(item);
        },
        freeInput: true,
        addOnBlur: true,
        maxTags: undefined,
        maxChars: undefined,
        confirmKeys: [ 13, 44 ],
        onTagExists: function(item, $tag) {
            $tag.hide().fadeIn();
        },
        trimValue: false,
        allowDuplicates: false
    };
    function TagsInput(element, options) {
        this.itemsArray = [];
        this.$element = $(element);
        this.$element.hide();
        this.isSelect = element.tagName === "SELECT";
        this.multiple = this.isSelect && element.hasAttribute("multiple");
        this.objectItems = options && options.itemValue;
        this.placeholderText = element.hasAttribute("placeholder") ? this.$element.attr("placeholder") : "";
        this.inputSize = Math.max(1, this.placeholderText.length);
        this.$container = $('<div class="bootstrap-tagsinput"></div>');
        this.$input = $('<input type="text" placeholder="' + this.placeholderText + '"/>').appendTo(this.$container);
        this.$element.after(this.$container);
        var inputWidth = (this.inputSize < 3 ? 3 : this.inputSize) + "em";
        this.$input.get(0).style.cssText = "width: " + inputWidth + " !important;";
        this.build(options);
    }
    TagsInput.prototype = {
        constructor: TagsInput,
        add: function(item, dontPushVal) {
            var self = this;
            if (self.options.maxTags && self.itemsArray.length >= self.options.maxTags) return;
            if (item !== false && !item) return;
            if (typeof item === "string" && self.options.trimValue) {
                item = $.trim(item);
            }
            if (typeof item === "object" && !self.objectItems) throw "Can't add objects when itemValue option is not set";
            if (item.toString().match(/^\s*$/)) return;
            if (self.isSelect && !self.multiple && self.itemsArray.length > 0) self.remove(self.itemsArray[0]);
            if (typeof item === "string" && this.$element[0].tagName === "INPUT") {
                var items = item.split(",");
                if (items.length > 1) {
                    for (var i = 0; i < items.length; i++) {
                        this.add(items[i], true);
                    }
                    if (!dontPushVal) self.pushVal();
                    return;
                }
            }
            var beforeItemAddEvent = $.Event("beforeItemAdd", {
                item: item,
                cancel: false
            });
            self.$element.trigger(beforeItemAddEvent);
            if (beforeItemAddEvent.cancel) return;
            item = beforeItemAddEvent.item;
            var itemValue = self.options.itemValue(item), itemText = self.options.itemText(item), tagClass = self.options.tagClass(item);
            var existing = $.grep(self.itemsArray, function(item) {
                return self.options.itemValue(item) === itemValue;
            })[0];
            if (existing && !self.options.allowDuplicates) {
                if (self.options.onTagExists) {
                    var $existingTag = $(".tag", self.$container).filter(function() {
                        return $(this).data("item") === existing;
                    });
                    self.options.onTagExists(item, $existingTag);
                }
                return;
            }
            if (self.items().toString().length + item.length + 1 > self.options.maxInputLength) return;
            self.itemsArray.push(item);
            var $tag = $('<span class="tag ' + htmlEncode(tagClass) + '">' + htmlEncode(itemText) + '<span data-role="remove"></span></span>');
            $tag.data("item", item);
            self.findInputWrapper().before($tag);
            $tag.after(" ");
            if (self.isSelect && !$('option[value="' + encodeURIComponent(itemValue) + '"]', self.$element)[0]) {
                var $option = $("<option selected>" + htmlEncode(itemText) + "</option>");
                $option.data("item", item);
                $option.attr("value", itemValue);
                self.$element.append($option);
            }
            if (!dontPushVal) self.pushVal();
            if (self.options.maxTags === self.itemsArray.length || self.items().toString().length === self.options.maxInputLength) self.$container.addClass("bootstrap-tagsinput-max");
            self.$element.trigger($.Event("itemAdded", {
                item: item
            }));
        },
        remove: function(item, dontPushVal) {
            var self = this;
            if (self.objectItems) {
                if (typeof item === "object") item = $.grep(self.itemsArray, function(other) {
                    return self.options.itemValue(other) == self.options.itemValue(item);
                }); else item = $.grep(self.itemsArray, function(other) {
                    return self.options.itemValue(other) == item;
                });
                item = item[item.length - 1];
            }
            if (item) {
                var beforeItemRemoveEvent = $.Event("beforeItemRemove", {
                    item: item,
                    cancel: false
                });
                self.$element.trigger(beforeItemRemoveEvent);
                if (beforeItemRemoveEvent.cancel) return;
                $(".tag", self.$container).filter(function() {
                    return $(this).data("item") === item;
                }).remove();
                $("option", self.$element).filter(function() {
                    return $(this).data("item") === item;
                }).remove();
                if ($.inArray(item, self.itemsArray) !== -1) self.itemsArray.splice($.inArray(item, self.itemsArray), 1);
            }
            if (!dontPushVal) self.pushVal();
            if (self.options.maxTags > self.itemsArray.length) self.$container.removeClass("bootstrap-tagsinput-max");
            self.$element.trigger($.Event("itemRemoved", {
                item: item
            }));
        },
        removeAll: function() {
            var self = this;
            $(".tag", self.$container).remove();
            $("option", self.$element).remove();
            while (self.itemsArray.length > 0) self.itemsArray.pop();
            self.pushVal();
        },
        refresh: function() {
            var self = this;
            $(".tag", self.$container).each(function() {
                var $tag = $(this), item = $tag.data("item"), itemValue = self.options.itemValue(item), itemText = self.options.itemText(item), tagClass = self.options.tagClass(item);
                $tag.attr("class", null);
                $tag.addClass("tag " + htmlEncode(tagClass));
                $tag.contents().filter(function() {
                    return this.nodeType == 3;
                })[0].nodeValue = htmlEncode(itemText);
                if (self.isSelect) {
                    var option = $("option", self.$element).filter(function() {
                        return $(this).data("item") === item;
                    });
                    option.attr("value", itemValue);
                }
            });
        },
        items: function() {
            return this.itemsArray;
        },
        pushVal: function() {
            var self = this, val = $.map(self.items(), function(item) {
                return self.options.itemValue(item).toString();
            });
            self.$element.val(val, true).trigger("change");
        },
        build: function(options) {
            var self = this;
            self.options = $.extend({}, defaultOptions, options);
            if (self.objectItems) self.options.freeInput = false;
            makeOptionItemFunction(self.options, "itemValue");
            makeOptionItemFunction(self.options, "itemText");
            makeOptionFunction(self.options, "tagClass");
            if (self.options.typeahead) {
                var typeahead = self.options.typeahead || {};
                makeOptionFunction(typeahead, "source");
                self.$input.typeahead($.extend({}, typeahead, {
                    source: function(query, process) {
                        function processItems(items) {
                            var texts = [];
                            for (var i = 0; i < items.length; i++) {
                                var text = self.options.itemText(items[i]);
                                map[text] = items[i];
                                texts.push(text);
                            }
                            process(texts);
                        }
                        this.map = {};
                        var map = this.map, data = typeahead.source(query);
                        if ($.isFunction(data.success)) {
                            data.success(processItems);
                        } else if ($.isFunction(data.then)) {
                            data.then(processItems);
                        } else {
                            $.when(data).then(processItems);
                        }
                    },
                    updater: function(text) {
                        self.add(this.map[text]);
                    },
                    matcher: function(text) {
                        return text.toLowerCase().indexOf(this.query.trim().toLowerCase()) !== -1;
                    },
                    sorter: function(texts) {
                        return texts.sort();
                    },
                    highlighter: function(text) {
                        var regex = new RegExp("(" + this.query + ")", "gi");
                        return text.replace(regex, "<strong>$1</strong>");
                    }
                }));
            }
            if (self.options.typeaheadjs) {
                var typeaheadjs = self.options.typeaheadjs || {};
                self.$input.typeahead(null, typeaheadjs).on("typeahead:selected", $.proxy(function(obj, datum) {
                    if (typeaheadjs.valueKey) self.add(datum[typeaheadjs.valueKey]); else self.add(datum);
                    self.$input.typeahead("val", "");
                }, self));
            }
            self.$container.on("click", $.proxy(function(event) {
                if (!self.$element.attr("disabled")) {
                    self.$input.removeAttr("disabled");
                }
                self.$input.focus();
            }, self));
            if (self.options.addOnBlur && self.options.freeInput) {
                self.$input.on("focusout", $.proxy(function(event) {
                    if ($(".typeahead, .twitter-typeahead", self.$container).length === 0) {
                        self.add(self.$input.val());
                        self.$input.val("");
                    }
                }, self));
            }
            self.$container.on("keydown", "input", $.proxy(function(event) {
                var $input = $(event.target), $inputWrapper = self.findInputWrapper();
                if (self.$element.attr("disabled")) {
                    self.$input.attr("disabled", "disabled");
                    return;
                }
                switch (event.which) {
                  case 8:
                    if (doGetCaretPosition($input[0]) === 0) {
                        var prev = $inputWrapper.prev();
                        if (prev) {
                            self.remove(prev.data("item"));
                        }
                    }
                    break;

                  case 46:
                    if (doGetCaretPosition($input[0]) === 0) {
                        var next = $inputWrapper.next();
                        if (next) {
                            self.remove(next.data("item"));
                        }
                    }
                    break;

                  case 37:
                    var $prevTag = $inputWrapper.prev();
                    if ($input.val().length === 0 && $prevTag[0]) {
                        $prevTag.before($inputWrapper);
                        $input.focus();
                    }
                    break;

                  case 39:
                    var $nextTag = $inputWrapper.next();
                    if ($input.val().length === 0 && $nextTag[0]) {
                        $nextTag.after($inputWrapper);
                        $input.focus();
                    }
                    break;

                  default:                }
                var textLength = $input.val().length, wordSpace = Math.ceil(textLength / 5), size = textLength + wordSpace + 1;
                $input.attr("size", Math.max(this.inputSize, $input.val().length));
            }, self));
            self.$container.on("keypress", "input", $.proxy(function(event) {
                var $input = $(event.target);
                if (self.$element.attr("disabled")) {
                    self.$input.attr("disabled", "disabled");
                    return;
                }
                var text = $input.val(), maxLengthReached = self.options.maxChars && text.length >= self.options.maxChars;
                if (self.options.freeInput && (keyCombinationInList(event, self.options.confirmKeys) || maxLengthReached)) {
                    self.add(maxLengthReached ? text.substr(0, self.options.maxChars) : text);
                    $input.val("");
                    event.preventDefault();
                }
                var textLength = $input.val().length, wordSpace = Math.ceil(textLength / 5), size = textLength + wordSpace + 1;
                $input.attr("size", Math.max(this.inputSize, $input.val().length));
            }, self));
            self.$container.on("click", "[data-role=remove]", $.proxy(function(event) {
                if (self.$element.attr("disabled")) {
                    return;
                }
                self.remove($(event.target).closest(".tag").data("item"));
            }, self));
            if (self.options.itemValue === defaultOptions.itemValue) {
                if (self.$element[0].tagName === "INPUT") {
                    self.add(self.$element.val());
                } else {
                    $("option", self.$element).each(function() {
                        self.add($(this).attr("value"), true);
                    });
                }
            }
        },
        destroy: function() {
            var self = this;
            self.$container.off("keypress", "input");
            self.$container.off("click", "[role=remove]");
            self.$container.remove();
            self.$element.removeData("tagsinput");
            self.$element.show();
        },
        focus: function() {
            this.$input.focus();
        },
        input: function() {
            return this.$input;
        },
        findInputWrapper: function() {
            var elt = this.$input[0], container = this.$container[0];
            while (elt && elt.parentNode !== container) elt = elt.parentNode;
            return $(elt);
        }
    };
    $.fn.tagsinput = function(arg1, arg2) {
        var results = [];
        this.each(function() {
            var tagsinput = $(this).data("tagsinput");
            if (!tagsinput) {
                tagsinput = new TagsInput(this, arg1);
                $(this).data("tagsinput", tagsinput);
                results.push(tagsinput);
                if (this.tagName === "SELECT") {
                    $("option", $(this)).attr("selected", "selected");
                }
                $(this).val($(this).val());
            } else if (!arg1 && !arg2) {
                results.push(tagsinput);
            } else if (tagsinput[arg1] !== undefined) {
                var retVal = tagsinput[arg1](arg2);
                if (retVal !== undefined) results.push(retVal);
            }
        });
        if (typeof arg1 == "string") {
            return results.length > 1 ? results : results[0];
        } else {
            return results;
        }
    };
    $.fn.tagsinput.Constructor = TagsInput;
    function makeOptionItemFunction(options, key) {
        if (typeof options[key] !== "function") {
            var propertyName = options[key];
            options[key] = function(item) {
                return item[propertyName];
            };
        }
    }
    function makeOptionFunction(options, key) {
        if (typeof options[key] !== "function") {
            var value = options[key];
            options[key] = function() {
                return value;
            };
        }
    }
    var htmlEncodeContainer = $("<div />");
    function htmlEncode(value) {
        if (value) {
            return htmlEncodeContainer.text(value).html();
        } else {
            return "";
        }
    }
    function doGetCaretPosition(oField) {
        var iCaretPos = 0;
        if (document.selection) {
            oField.focus();
            var oSel = document.selection.createRange();
            oSel.moveStart("character", -oField.value.length);
            iCaretPos = oSel.text.length;
        } else if (oField.selectionStart || oField.selectionStart == "0") {
            iCaretPos = oField.selectionStart;
        }
        return iCaretPos;
    }
    function keyCombinationInList(keyPressEvent, lookupList) {
        var found = false;
        $.each(lookupList, function(index, keyCombination) {
            if (typeof keyCombination === "number" && keyPressEvent.which === keyCombination) {
                found = true;
                return false;
            }
            if (keyPressEvent.which === keyCombination.which) {
                var alt = !keyCombination.hasOwnProperty("altKey") || keyPressEvent.altKey === keyCombination.altKey, shift = !keyCombination.hasOwnProperty("shiftKey") || keyPressEvent.shiftKey === keyCombination.shiftKey, ctrl = !keyCombination.hasOwnProperty("ctrlKey") || keyPressEvent.ctrlKey === keyCombination.ctrlKey;
                if (alt && shift && ctrl) {
                    found = true;
                    return false;
                }
            }
        });
        return found;
    }
    $(function() {
        $("input[data-role=tagsinput], select[multiple][data-role=tagsinput]").tagsinput();
    });
})(window.jQuery);

(function(window, document, undefined) {
    (function(factory) {
        "use strict";
        if (typeof define === "function" && define.amd) {
            define("datatables", [ "jquery" ], factory);
        } else if (typeof exports === "object") {
            factory(require("jquery"));
        } else if (jQuery && !jQuery.fn.dataTable) {
            factory(jQuery);
        }
    })(function($) {
        "use strict";
        var DataTable;
        var _ext;
        var _Api;
        var _api_register;
        var _api_registerPlural;
        var _re_dic = {};
        var _re_new_lines = /[\r\n]/g;
        var _re_html = /<.*?>/g;
        var _re_date_start = /^[\w\+\-]/;
        var _re_date_end = /[\w\+\-]$/;
        var _re_escape_regex = new RegExp("(\\" + [ "/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\", "$", "^", "-" ].join("|\\") + ")", "g");
        var _re_formatted_numeric = /[',$£€¥%\u2009\u202F]/g;
        var _empty = function(d) {
            return !d || d === true || d === "-" ? true : false;
        };
        var _intVal = function(s) {
            var integer = parseInt(s, 10);
            return !isNaN(integer) && isFinite(s) ? integer : null;
        };
        var _numToDecimal = function(num, decimalPoint) {
            if (!_re_dic[decimalPoint]) {
                _re_dic[decimalPoint] = new RegExp(_fnEscapeRegex(decimalPoint), "g");
            }
            return typeof num === "string" && decimalPoint !== "." ? num.replace(/\./g, "").replace(_re_dic[decimalPoint], ".") : num;
        };
        var _isNumber = function(d, decimalPoint, formatted) {
            var strType = typeof d === "string";
            if (decimalPoint && strType) {
                d = _numToDecimal(d, decimalPoint);
            }
            if (formatted && strType) {
                d = d.replace(_re_formatted_numeric, "");
            }
            return _empty(d) || !isNaN(parseFloat(d)) && isFinite(d);
        };
        var _isHtml = function(d) {
            return _empty(d) || typeof d === "string";
        };
        var _htmlNumeric = function(d, decimalPoint, formatted) {
            if (_empty(d)) {
                return true;
            }
            var html = _isHtml(d);
            return !html ? null : _isNumber(_stripHtml(d), decimalPoint, formatted) ? true : null;
        };
        var _pluck = function(a, prop, prop2) {
            var out = [];
            var i = 0, ien = a.length;
            if (prop2 !== undefined) {
                for (;i < ien; i++) {
                    if (a[i] && a[i][prop]) {
                        out.push(a[i][prop][prop2]);
                    }
                }
            } else {
                for (;i < ien; i++) {
                    if (a[i]) {
                        out.push(a[i][prop]);
                    }
                }
            }
            return out;
        };
        var _pluck_order = function(a, order, prop, prop2) {
            var out = [];
            var i = 0, ien = order.length;
            if (prop2 !== undefined) {
                for (;i < ien; i++) {
                    if (a[order[i]][prop]) {
                        out.push(a[order[i]][prop][prop2]);
                    }
                }
            } else {
                for (;i < ien; i++) {
                    out.push(a[order[i]][prop]);
                }
            }
            return out;
        };
        var _range = function(len, start) {
            var out = [];
            var end;
            if (start === undefined) {
                start = 0;
                end = len;
            } else {
                end = start;
                start = len;
            }
            for (var i = start; i < end; i++) {
                out.push(i);
            }
            return out;
        };
        var _removeEmpty = function(a) {
            var out = [];
            for (var i = 0, ien = a.length; i < ien; i++) {
                if (a[i]) {
                    out.push(a[i]);
                }
            }
            return out;
        };
        var _stripHtml = function(d) {
            return d.replace(_re_html, "");
        };
        var _unique = function(src) {
            var out = [], val, i, ien = src.length, j, k = 0;
            again: for (i = 0; i < ien; i++) {
                val = src[i];
                for (j = 0; j < k; j++) {
                    if (out[j] === val) {
                        continue again;
                    }
                }
                out.push(val);
                k++;
            }
            return out;
        };
        function _fnHungarianMap(o) {
            var hungarian = "a aa ai ao as b fn i m o s ", match, newKey, map = {};
            $.each(o, function(key, val) {
                match = key.match(/^([^A-Z]+?)([A-Z])/);
                if (match && hungarian.indexOf(match[1] + " ") !== -1) {
                    newKey = key.replace(match[0], match[2].toLowerCase());
                    map[newKey] = key;
                    if (match[1] === "o") {
                        _fnHungarianMap(o[key]);
                    }
                }
            });
            o._hungarianMap = map;
        }
        function _fnCamelToHungarian(src, user, force) {
            if (!src._hungarianMap) {
                _fnHungarianMap(src);
            }
            var hungarianKey;
            $.each(user, function(key, val) {
                hungarianKey = src._hungarianMap[key];
                if (hungarianKey !== undefined && (force || user[hungarianKey] === undefined)) {
                    if (hungarianKey.charAt(0) === "o") {
                        if (!user[hungarianKey]) {
                            user[hungarianKey] = {};
                        }
                        $.extend(true, user[hungarianKey], user[key]);
                        _fnCamelToHungarian(src[hungarianKey], user[hungarianKey], force);
                    } else {
                        user[hungarianKey] = user[key];
                    }
                }
            });
        }
        function _fnLanguageCompat(lang) {
            var defaults = DataTable.defaults.oLanguage;
            var zeroRecords = lang.sZeroRecords;
            if (!lang.sEmptyTable && zeroRecords && defaults.sEmptyTable === "No data available in table") {
                _fnMap(lang, lang, "sZeroRecords", "sEmptyTable");
            }
            if (!lang.sLoadingRecords && zeroRecords && defaults.sLoadingRecords === "Loading...") {
                _fnMap(lang, lang, "sZeroRecords", "sLoadingRecords");
            }
            if (lang.sInfoThousands) {
                lang.sThousands = lang.sInfoThousands;
            }
            var decimal = lang.sDecimal;
            if (decimal) {
                _addNumericSort(decimal);
            }
        }
        var _fnCompatMap = function(o, knew, old) {
            if (o[knew] !== undefined) {
                o[old] = o[knew];
            }
        };
        function _fnCompatOpts(init) {
            _fnCompatMap(init, "ordering", "bSort");
            _fnCompatMap(init, "orderMulti", "bSortMulti");
            _fnCompatMap(init, "orderClasses", "bSortClasses");
            _fnCompatMap(init, "orderCellsTop", "bSortCellsTop");
            _fnCompatMap(init, "order", "aaSorting");
            _fnCompatMap(init, "orderFixed", "aaSortingFixed");
            _fnCompatMap(init, "paging", "bPaginate");
            _fnCompatMap(init, "pagingType", "sPaginationType");
            _fnCompatMap(init, "pageLength", "iDisplayLength");
            _fnCompatMap(init, "searching", "bFilter");
            var searchCols = init.aoSearchCols;
            if (searchCols) {
                for (var i = 0, ien = searchCols.length; i < ien; i++) {
                    if (searchCols[i]) {
                        _fnCamelToHungarian(DataTable.models.oSearch, searchCols[i]);
                    }
                }
            }
        }
        function _fnCompatCols(init) {
            _fnCompatMap(init, "orderable", "bSortable");
            _fnCompatMap(init, "orderData", "aDataSort");
            _fnCompatMap(init, "orderSequence", "asSorting");
            _fnCompatMap(init, "orderDataType", "sortDataType");
        }
        function _fnBrowserDetect(settings) {
            var browser = settings.oBrowser;
            var n = $("<div/>").css({
                position: "absolute",
                top: 0,
                left: 0,
                height: 1,
                width: 1,
                overflow: "hidden"
            }).append($("<div/>").css({
                position: "absolute",
                top: 1,
                left: 1,
                width: 100,
                overflow: "scroll"
            }).append($('<div class="test"/>').css({
                width: "100%",
                height: 10
            }))).appendTo("body");
            var test = n.find(".test");
            browser.bScrollOversize = test[0].offsetWidth === 100;
            browser.bScrollbarLeft = test.offset().left !== 1;
            n.remove();
        }
        function _fnReduce(that, fn, init, start, end, inc) {
            var i = start, value, isSet = false;
            if (init !== undefined) {
                value = init;
                isSet = true;
            }
            while (i !== end) {
                if (!that.hasOwnProperty(i)) {
                    continue;
                }
                value = isSet ? fn(value, that[i], i, that) : that[i];
                isSet = true;
                i += inc;
            }
            return value;
        }
        function _fnAddColumn(oSettings, nTh) {
            var oDefaults = DataTable.defaults.column;
            var iCol = oSettings.aoColumns.length;
            var oCol = $.extend({}, DataTable.models.oColumn, oDefaults, {
                nTh: nTh ? nTh : document.createElement("th"),
                sTitle: oDefaults.sTitle ? oDefaults.sTitle : nTh ? nTh.innerHTML : "",
                aDataSort: oDefaults.aDataSort ? oDefaults.aDataSort : [ iCol ],
                mData: oDefaults.mData ? oDefaults.mData : iCol,
                idx: iCol
            });
            oSettings.aoColumns.push(oCol);
            var searchCols = oSettings.aoPreSearchCols;
            searchCols[iCol] = $.extend({}, DataTable.models.oSearch, searchCols[iCol]);
            _fnColumnOptions(oSettings, iCol, null);
        }
        function _fnColumnOptions(oSettings, iCol, oOptions) {
            var oCol = oSettings.aoColumns[iCol];
            var oClasses = oSettings.oClasses;
            var th = $(oCol.nTh);
            if (!oCol.sWidthOrig) {
                oCol.sWidthOrig = th.attr("width") || null;
                var t = (th.attr("style") || "").match(/width:\s*(\d+[pxem%]+)/);
                if (t) {
                    oCol.sWidthOrig = t[1];
                }
            }
            if (oOptions !== undefined && oOptions !== null) {
                _fnCompatCols(oOptions);
                _fnCamelToHungarian(DataTable.defaults.column, oOptions);
                if (oOptions.mDataProp !== undefined && !oOptions.mData) {
                    oOptions.mData = oOptions.mDataProp;
                }
                if (oOptions.sType) {
                    oCol._sManualType = oOptions.sType;
                }
                if (oOptions.className && !oOptions.sClass) {
                    oOptions.sClass = oOptions.className;
                }
                $.extend(oCol, oOptions);
                _fnMap(oCol, oOptions, "sWidth", "sWidthOrig");
                if (typeof oOptions.iDataSort === "number") {
                    oCol.aDataSort = [ oOptions.iDataSort ];
                }
                _fnMap(oCol, oOptions, "aDataSort");
            }
            var mDataSrc = oCol.mData;
            var mData = _fnGetObjectDataFn(mDataSrc);
            var mRender = oCol.mRender ? _fnGetObjectDataFn(oCol.mRender) : null;
            var attrTest = function(src) {
                return typeof src === "string" && src.indexOf("@") !== -1;
            };
            oCol._bAttrSrc = $.isPlainObject(mDataSrc) && (attrTest(mDataSrc.sort) || attrTest(mDataSrc.type) || attrTest(mDataSrc.filter));
            oCol.fnGetData = function(rowData, type, meta) {
                var innerData = mData(rowData, type, undefined, meta);
                return mRender && type ? mRender(innerData, type, rowData, meta) : innerData;
            };
            oCol.fnSetData = function(rowData, val, meta) {
                return _fnSetObjectDataFn(mDataSrc)(rowData, val, meta);
            };
            if (typeof mDataSrc !== "number") {
                oSettings._rowReadObject = true;
            }
            if (!oSettings.oFeatures.bSort) {
                oCol.bSortable = false;
                th.addClass(oClasses.sSortableNone);
            }
            var bAsc = $.inArray("asc", oCol.asSorting) !== -1;
            var bDesc = $.inArray("desc", oCol.asSorting) !== -1;
            if (!oCol.bSortable || !bAsc && !bDesc) {
                oCol.sSortingClass = oClasses.sSortableNone;
                oCol.sSortingClassJUI = "";
            } else if (bAsc && !bDesc) {
                oCol.sSortingClass = oClasses.sSortableAsc;
                oCol.sSortingClassJUI = oClasses.sSortJUIAscAllowed;
            } else if (!bAsc && bDesc) {
                oCol.sSortingClass = oClasses.sSortableDesc;
                oCol.sSortingClassJUI = oClasses.sSortJUIDescAllowed;
            } else {
                oCol.sSortingClass = oClasses.sSortable;
                oCol.sSortingClassJUI = oClasses.sSortJUI;
            }
        }
        function _fnAdjustColumnSizing(settings) {
            if (settings.oFeatures.bAutoWidth !== false) {
                var columns = settings.aoColumns;
                _fnCalculateColumnWidths(settings);
                for (var i = 0, iLen = columns.length; i < iLen; i++) {
                    columns[i].nTh.style.width = columns[i].sWidth;
                }
            }
            var scroll = settings.oScroll;
            if (scroll.sY !== "" || scroll.sX !== "") {
                _fnScrollDraw(settings);
            }
            _fnCallbackFire(settings, null, "column-sizing", [ settings ]);
        }
        function _fnVisibleToColumnIndex(oSettings, iMatch) {
            var aiVis = _fnGetColumns(oSettings, "bVisible");
            return typeof aiVis[iMatch] === "number" ? aiVis[iMatch] : null;
        }
        function _fnColumnIndexToVisible(oSettings, iMatch) {
            var aiVis = _fnGetColumns(oSettings, "bVisible");
            var iPos = $.inArray(iMatch, aiVis);
            return iPos !== -1 ? iPos : null;
        }
        function _fnVisbleColumns(oSettings) {
            return _fnGetColumns(oSettings, "bVisible").length;
        }
        function _fnGetColumns(oSettings, sParam) {
            var a = [];
            $.map(oSettings.aoColumns, function(val, i) {
                if (val[sParam]) {
                    a.push(i);
                }
            });
            return a;
        }
        function _fnColumnTypes(settings) {
            var columns = settings.aoColumns;
            var data = settings.aoData;
            var types = DataTable.ext.type.detect;
            var i, ien, j, jen, k, ken;
            var col, cell, detectedType, cache;
            for (i = 0, ien = columns.length; i < ien; i++) {
                col = columns[i];
                cache = [];
                if (!col.sType && col._sManualType) {
                    col.sType = col._sManualType;
                } else if (!col.sType) {
                    for (j = 0, jen = types.length; j < jen; j++) {
                        for (k = 0, ken = data.length; k < ken; k++) {
                            if (cache[k] === undefined) {
                                cache[k] = _fnGetCellData(settings, k, i, "type");
                            }
                            detectedType = types[j](cache[k], settings);
                            if (!detectedType && j !== types.length - 1) {
                                break;
                            }
                            if (detectedType === "html") {
                                break;
                            }
                        }
                        if (detectedType) {
                            col.sType = detectedType;
                            break;
                        }
                    }
                    if (!col.sType) {
                        col.sType = "string";
                    }
                }
            }
        }
        function _fnApplyColumnDefs(oSettings, aoColDefs, aoCols, fn) {
            var i, iLen, j, jLen, k, kLen, def;
            var columns = oSettings.aoColumns;
            if (aoColDefs) {
                for (i = aoColDefs.length - 1; i >= 0; i--) {
                    def = aoColDefs[i];
                    var aTargets = def.targets !== undefined ? def.targets : def.aTargets;
                    if (!$.isArray(aTargets)) {
                        aTargets = [ aTargets ];
                    }
                    for (j = 0, jLen = aTargets.length; j < jLen; j++) {
                        if (typeof aTargets[j] === "number" && aTargets[j] >= 0) {
                            while (columns.length <= aTargets[j]) {
                                _fnAddColumn(oSettings);
                            }
                            fn(aTargets[j], def);
                        } else if (typeof aTargets[j] === "number" && aTargets[j] < 0) {
                            fn(columns.length + aTargets[j], def);
                        } else if (typeof aTargets[j] === "string") {
                            for (k = 0, kLen = columns.length; k < kLen; k++) {
                                if (aTargets[j] == "_all" || $(columns[k].nTh).hasClass(aTargets[j])) {
                                    fn(k, def);
                                }
                            }
                        }
                    }
                }
            }
            if (aoCols) {
                for (i = 0, iLen = aoCols.length; i < iLen; i++) {
                    fn(i, aoCols[i]);
                }
            }
        }
        function _fnAddData(oSettings, aDataIn, nTr, anTds) {
            var iRow = oSettings.aoData.length;
            var oData = $.extend(true, {}, DataTable.models.oRow, {
                src: nTr ? "dom" : "data"
            });
            oData._aData = aDataIn;
            oSettings.aoData.push(oData);
            var nTd, sThisType;
            var columns = oSettings.aoColumns;
            for (var i = 0, iLen = columns.length; i < iLen; i++) {
                if (nTr) {
                    _fnSetCellData(oSettings, iRow, i, _fnGetCellData(oSettings, iRow, i));
                }
                columns[i].sType = null;
            }
            oSettings.aiDisplayMaster.push(iRow);
            if (nTr || !oSettings.oFeatures.bDeferRender) {
                _fnCreateTr(oSettings, iRow, nTr, anTds);
            }
            return iRow;
        }
        function _fnAddTr(settings, trs) {
            var row;
            if (!(trs instanceof $)) {
                trs = $(trs);
            }
            return trs.map(function(i, el) {
                row = _fnGetRowElements(settings, el);
                return _fnAddData(settings, row.data, el, row.cells);
            });
        }
        function _fnNodeToDataIndex(oSettings, n) {
            return n._DT_RowIndex !== undefined ? n._DT_RowIndex : null;
        }
        function _fnNodeToColumnIndex(oSettings, iRow, n) {
            return $.inArray(n, oSettings.aoData[iRow].anCells);
        }
        function _fnGetCellData(settings, rowIdx, colIdx, type) {
            var draw = settings.iDraw;
            var col = settings.aoColumns[colIdx];
            var rowData = settings.aoData[rowIdx]._aData;
            var defaultContent = col.sDefaultContent;
            var cellData = col.fnGetData(rowData, type, {
                settings: settings,
                row: rowIdx,
                col: colIdx
            });
            if (cellData === undefined) {
                if (settings.iDrawError != draw && defaultContent === null) {
                    _fnLog(settings, 0, "Requested unknown parameter " + (typeof col.mData == "function" ? "{function}" : "'" + col.mData + "'") + " for row " + rowIdx, 4);
                    settings.iDrawError = draw;
                }
                return defaultContent;
            }
            if ((cellData === rowData || cellData === null) && defaultContent !== null) {
                cellData = defaultContent;
            } else if (typeof cellData === "function") {
                return cellData.call(rowData);
            }
            if (cellData === null && type == "display") {
                return "";
            }
            return cellData;
        }
        function _fnSetCellData(settings, rowIdx, colIdx, val) {
            var col = settings.aoColumns[colIdx];
            var rowData = settings.aoData[rowIdx]._aData;
            col.fnSetData(rowData, val, {
                settings: settings,
                row: rowIdx,
                col: colIdx
            });
        }
        var __reArray = /\[.*?\]$/;
        var __reFn = /\(\)$/;
        function _fnSplitObjNotation(str) {
            return $.map(str.match(/(\\.|[^\.])+/g), function(s) {
                return s.replace(/\\./g, ".");
            });
        }
        function _fnGetObjectDataFn(mSource) {
            if ($.isPlainObject(mSource)) {
                var o = {};
                $.each(mSource, function(key, val) {
                    if (val) {
                        o[key] = _fnGetObjectDataFn(val);
                    }
                });
                return function(data, type, row, meta) {
                    var t = o[type] || o._;
                    return t !== undefined ? t(data, type, row, meta) : data;
                };
            } else if (mSource === null) {
                return function(data) {
                    return data;
                };
            } else if (typeof mSource === "function") {
                return function(data, type, row, meta) {
                    return mSource(data, type, row, meta);
                };
            } else if (typeof mSource === "string" && (mSource.indexOf(".") !== -1 || mSource.indexOf("[") !== -1 || mSource.indexOf("(") !== -1)) {
                var fetchData = function(data, type, src) {
                    var arrayNotation, funcNotation, out, innerSrc;
                    if (src !== "") {
                        var a = _fnSplitObjNotation(src);
                        for (var i = 0, iLen = a.length; i < iLen; i++) {
                            arrayNotation = a[i].match(__reArray);
                            funcNotation = a[i].match(__reFn);
                            if (arrayNotation) {
                                a[i] = a[i].replace(__reArray, "");
                                if (a[i] !== "") {
                                    data = data[a[i]];
                                }
                                out = [];
                                a.splice(0, i + 1);
                                innerSrc = a.join(".");
                                for (var j = 0, jLen = data.length; j < jLen; j++) {
                                    out.push(fetchData(data[j], type, innerSrc));
                                }
                                var join = arrayNotation[0].substring(1, arrayNotation[0].length - 1);
                                data = join === "" ? out : out.join(join);
                                break;
                            } else if (funcNotation) {
                                a[i] = a[i].replace(__reFn, "");
                                data = data[a[i]]();
                                continue;
                            }
                            if (data === null || data[a[i]] === undefined) {
                                return undefined;
                            }
                            data = data[a[i]];
                        }
                    }
                    return data;
                };
                return function(data, type) {
                    return fetchData(data, type, mSource);
                };
            } else {
                return function(data, type) {
                    return data[mSource];
                };
            }
        }
        function _fnSetObjectDataFn(mSource) {
            if ($.isPlainObject(mSource)) {
                return _fnSetObjectDataFn(mSource._);
            } else if (mSource === null) {
                return function() {};
            } else if (typeof mSource === "function") {
                return function(data, val, meta) {
                    mSource(data, "set", val, meta);
                };
            } else if (typeof mSource === "string" && (mSource.indexOf(".") !== -1 || mSource.indexOf("[") !== -1 || mSource.indexOf("(") !== -1)) {
                var setData = function(data, val, src) {
                    var a = _fnSplitObjNotation(src), b;
                    var aLast = a[a.length - 1];
                    var arrayNotation, funcNotation, o, innerSrc;
                    for (var i = 0, iLen = a.length - 1; i < iLen; i++) {
                        arrayNotation = a[i].match(__reArray);
                        funcNotation = a[i].match(__reFn);
                        if (arrayNotation) {
                            a[i] = a[i].replace(__reArray, "");
                            data[a[i]] = [];
                            b = a.slice();
                            b.splice(0, i + 1);
                            innerSrc = b.join(".");
                            for (var j = 0, jLen = val.length; j < jLen; j++) {
                                o = {};
                                setData(o, val[j], innerSrc);
                                data[a[i]].push(o);
                            }
                            return;
                        } else if (funcNotation) {
                            a[i] = a[i].replace(__reFn, "");
                            data = data[a[i]](val);
                        }
                        if (data[a[i]] === null || data[a[i]] === undefined) {
                            data[a[i]] = {};
                        }
                        data = data[a[i]];
                    }
                    if (aLast.match(__reFn)) {
                        data = data[aLast.replace(__reFn, "")](val);
                    } else {
                        data[aLast.replace(__reArray, "")] = val;
                    }
                };
                return function(data, val) {
                    return setData(data, val, mSource);
                };
            } else {
                return function(data, val) {
                    data[mSource] = val;
                };
            }
        }
        function _fnGetDataMaster(settings) {
            return _pluck(settings.aoData, "_aData");
        }
        function _fnClearTable(settings) {
            settings.aoData.length = 0;
            settings.aiDisplayMaster.length = 0;
            settings.aiDisplay.length = 0;
        }
        function _fnDeleteIndex(a, iTarget, splice) {
            var iTargetIndex = -1;
            for (var i = 0, iLen = a.length; i < iLen; i++) {
                if (a[i] == iTarget) {
                    iTargetIndex = i;
                } else if (a[i] > iTarget) {
                    a[i]--;
                }
            }
            if (iTargetIndex != -1 && splice === undefined) {
                a.splice(iTargetIndex, 1);
            }
        }
        function _fnInvalidate(settings, rowIdx, src, colIdx) {
            var row = settings.aoData[rowIdx];
            var i, ien;
            var cellWrite = function(cell, col) {
                while (cell.childNodes.length) {
                    cell.removeChild(cell.firstChild);
                }
                cell.innerHTML = _fnGetCellData(settings, rowIdx, col, "display");
            };
            if (src === "dom" || (!src || src === "auto") && row.src === "dom") {
                row._aData = _fnGetRowElements(settings, row, colIdx, colIdx === undefined ? undefined : row._aData).data;
            } else {
                var cells = row.anCells;
                if (cells) {
                    if (colIdx !== undefined) {
                        cellWrite(cells[colIdx], colIdx);
                    } else {
                        for (i = 0, ien = cells.length; i < ien; i++) {
                            cellWrite(cells[i], i);
                        }
                    }
                }
            }
            row._aSortData = null;
            row._aFilterData = null;
            var cols = settings.aoColumns;
            if (colIdx !== undefined) {
                cols[colIdx].sType = null;
            } else {
                for (i = 0, ien = cols.length; i < ien; i++) {
                    cols[i].sType = null;
                }
                _fnRowAttributes(row);
            }
        }
        function _fnGetRowElements(settings, row, colIdx, d) {
            var tds = [], td = row.firstChild, name, col, o, i = 0, contents, columns = settings.aoColumns, objectRead = settings._rowReadObject;
            d = d || objectRead ? {} : [];
            var attr = function(str, td) {
                if (typeof str === "string") {
                    var idx = str.indexOf("@");
                    if (idx !== -1) {
                        var attr = str.substring(idx + 1);
                        var setter = _fnSetObjectDataFn(str);
                        setter(d, td.getAttribute(attr));
                    }
                }
            };
            var cellProcess = function(cell) {
                if (colIdx === undefined || colIdx === i) {
                    col = columns[i];
                    contents = $.trim(cell.innerHTML);
                    if (col && col._bAttrSrc) {
                        var setter = _fnSetObjectDataFn(col.mData._);
                        setter(d, contents);
                        attr(col.mData.sort, cell);
                        attr(col.mData.type, cell);
                        attr(col.mData.filter, cell);
                    } else {
                        if (objectRead) {
                            if (!col._setter) {
                                col._setter = _fnSetObjectDataFn(col.mData);
                            }
                            col._setter(d, contents);
                        } else {
                            d[i] = contents;
                        }
                    }
                }
                i++;
            };
            if (td) {
                while (td) {
                    name = td.nodeName.toUpperCase();
                    if (name == "TD" || name == "TH") {
                        cellProcess(td);
                        tds.push(td);
                    }
                    td = td.nextSibling;
                }
            } else {
                tds = row.anCells;
                for (var j = 0, jen = tds.length; j < jen; j++) {
                    cellProcess(tds[j]);
                }
            }
            return {
                data: d,
                cells: tds
            };
        }
        function _fnCreateTr(oSettings, iRow, nTrIn, anTds) {
            var row = oSettings.aoData[iRow], rowData = row._aData, cells = [], nTr, nTd, oCol, i, iLen;
            if (row.nTr === null) {
                nTr = nTrIn || document.createElement("tr");
                row.nTr = nTr;
                row.anCells = cells;
                nTr._DT_RowIndex = iRow;
                _fnRowAttributes(row);
                for (i = 0, iLen = oSettings.aoColumns.length; i < iLen; i++) {
                    oCol = oSettings.aoColumns[i];
                    nTd = nTrIn ? anTds[i] : document.createElement(oCol.sCellType);
                    cells.push(nTd);
                    if (!nTrIn || oCol.mRender || oCol.mData !== i) {
                        nTd.innerHTML = _fnGetCellData(oSettings, iRow, i, "display");
                    }
                    if (oCol.sClass) {
                        nTd.className += " " + oCol.sClass;
                    }
                    if (oCol.bVisible && !nTrIn) {
                        nTr.appendChild(nTd);
                    } else if (!oCol.bVisible && nTrIn) {
                        nTd.parentNode.removeChild(nTd);
                    }
                    if (oCol.fnCreatedCell) {
                        oCol.fnCreatedCell.call(oSettings.oInstance, nTd, _fnGetCellData(oSettings, iRow, i), rowData, iRow, i);
                    }
                }
                _fnCallbackFire(oSettings, "aoRowCreatedCallback", null, [ nTr, rowData, iRow ]);
            }
            row.nTr.setAttribute("role", "row");
        }
        function _fnRowAttributes(row) {
            var tr = row.nTr;
            var data = row._aData;
            if (tr) {
                if (data.DT_RowId) {
                    tr.id = data.DT_RowId;
                }
                if (data.DT_RowClass) {
                    var a = data.DT_RowClass.split(" ");
                    row.__rowc = row.__rowc ? _unique(row.__rowc.concat(a)) : a;
                    $(tr).removeClass(row.__rowc.join(" ")).addClass(data.DT_RowClass);
                }
                if (data.DT_RowData) {
                    $(tr).data(data.DT_RowData);
                }
            }
        }
        function _fnBuildHead(oSettings) {
            var i, ien, cell, row, column;
            var thead = oSettings.nTHead;
            var tfoot = oSettings.nTFoot;
            var createHeader = $("th, td", thead).length === 0;
            var classes = oSettings.oClasses;
            var columns = oSettings.aoColumns;
            if (createHeader) {
                row = $("<tr/>").appendTo(thead);
            }
            for (i = 0, ien = columns.length; i < ien; i++) {
                column = columns[i];
                cell = $(column.nTh).addClass(column.sClass);
                if (createHeader) {
                    cell.appendTo(row);
                }
                if (oSettings.oFeatures.bSort) {
                    cell.addClass(column.sSortingClass);
                    if (column.bSortable !== false) {
                        cell.attr("tabindex", oSettings.iTabIndex).attr("aria-controls", oSettings.sTableId);
                        _fnSortAttachListener(oSettings, column.nTh, i);
                    }
                }
                if (column.sTitle != cell.html()) {
                    cell.html(column.sTitle);
                }
                _fnRenderer(oSettings, "header")(oSettings, cell, column, classes);
            }
            if (createHeader) {
                _fnDetectHeader(oSettings.aoHeader, thead);
            }
            $(thead).find(">tr").attr("role", "row");
            $(thead).find(">tr>th, >tr>td").addClass(classes.sHeaderTH);
            $(tfoot).find(">tr>th, >tr>td").addClass(classes.sFooterTH);
            if (tfoot !== null) {
                var cells = oSettings.aoFooter[0];
                for (i = 0, ien = cells.length; i < ien; i++) {
                    column = columns[i];
                    column.nTf = cells[i].cell;
                    if (column.sClass) {
                        $(column.nTf).addClass(column.sClass);
                    }
                }
            }
        }
        function _fnDrawHead(oSettings, aoSource, bIncludeHidden) {
            var i, iLen, j, jLen, k, kLen, n, nLocalTr;
            var aoLocal = [];
            var aApplied = [];
            var iColumns = oSettings.aoColumns.length;
            var iRowspan, iColspan;
            if (!aoSource) {
                return;
            }
            if (bIncludeHidden === undefined) {
                bIncludeHidden = false;
            }
            for (i = 0, iLen = aoSource.length; i < iLen; i++) {
                aoLocal[i] = aoSource[i].slice();
                aoLocal[i].nTr = aoSource[i].nTr;
                for (j = iColumns - 1; j >= 0; j--) {
                    if (!oSettings.aoColumns[j].bVisible && !bIncludeHidden) {
                        aoLocal[i].splice(j, 1);
                    }
                }
                aApplied.push([]);
            }
            for (i = 0, iLen = aoLocal.length; i < iLen; i++) {
                nLocalTr = aoLocal[i].nTr;
                if (nLocalTr) {
                    while (n = nLocalTr.firstChild) {
                        nLocalTr.removeChild(n);
                    }
                }
                for (j = 0, jLen = aoLocal[i].length; j < jLen; j++) {
                    iRowspan = 1;
                    iColspan = 1;
                    if (aApplied[i][j] === undefined) {
                        nLocalTr.appendChild(aoLocal[i][j].cell);
                        aApplied[i][j] = 1;
                        while (aoLocal[i + iRowspan] !== undefined && aoLocal[i][j].cell == aoLocal[i + iRowspan][j].cell) {
                            aApplied[i + iRowspan][j] = 1;
                            iRowspan++;
                        }
                        while (aoLocal[i][j + iColspan] !== undefined && aoLocal[i][j].cell == aoLocal[i][j + iColspan].cell) {
                            for (k = 0; k < iRowspan; k++) {
                                aApplied[i + k][j + iColspan] = 1;
                            }
                            iColspan++;
                        }
                        $(aoLocal[i][j].cell).attr("rowspan", iRowspan).attr("colspan", iColspan);
                    }
                }
            }
        }
        function _fnDraw(oSettings) {
            var aPreDraw = _fnCallbackFire(oSettings, "aoPreDrawCallback", "preDraw", [ oSettings ]);
            if ($.inArray(false, aPreDraw) !== -1) {
                _fnProcessingDisplay(oSettings, false);
                return;
            }
            var i, iLen, n;
            var anRows = [];
            var iRowCount = 0;
            var asStripeClasses = oSettings.asStripeClasses;
            var iStripes = asStripeClasses.length;
            var iOpenRows = oSettings.aoOpenRows.length;
            var oLang = oSettings.oLanguage;
            var iInitDisplayStart = oSettings.iInitDisplayStart;
            var bServerSide = _fnDataSource(oSettings) == "ssp";
            var aiDisplay = oSettings.aiDisplay;
            oSettings.bDrawing = true;
            if (iInitDisplayStart !== undefined && iInitDisplayStart !== -1) {
                oSettings._iDisplayStart = bServerSide ? iInitDisplayStart : iInitDisplayStart >= oSettings.fnRecordsDisplay() ? 0 : iInitDisplayStart;
                oSettings.iInitDisplayStart = -1;
            }
            var iDisplayStart = oSettings._iDisplayStart;
            var iDisplayEnd = oSettings.fnDisplayEnd();
            if (oSettings.bDeferLoading) {
                oSettings.bDeferLoading = false;
                oSettings.iDraw++;
                _fnProcessingDisplay(oSettings, false);
            } else if (!bServerSide) {
                oSettings.iDraw++;
            } else if (!oSettings.bDestroying && !_fnAjaxUpdate(oSettings)) {
                return;
            }
            if (aiDisplay.length !== 0) {
                var iStart = bServerSide ? 0 : iDisplayStart;
                var iEnd = bServerSide ? oSettings.aoData.length : iDisplayEnd;
                for (var j = iStart; j < iEnd; j++) {
                    var iDataIndex = aiDisplay[j];
                    var aoData = oSettings.aoData[iDataIndex];
                    if (aoData.nTr === null) {
                        _fnCreateTr(oSettings, iDataIndex);
                    }
                    var nRow = aoData.nTr;
                    if (iStripes !== 0) {
                        var sStripe = asStripeClasses[iRowCount % iStripes];
                        if (aoData._sRowStripe != sStripe) {
                            $(nRow).removeClass(aoData._sRowStripe).addClass(sStripe);
                            aoData._sRowStripe = sStripe;
                        }
                    }
                    _fnCallbackFire(oSettings, "aoRowCallback", null, [ nRow, aoData._aData, iRowCount, j ]);
                    anRows.push(nRow);
                    iRowCount++;
                }
            } else {
                var sZero = oLang.sZeroRecords;
                if (oSettings.iDraw == 1 && _fnDataSource(oSettings) == "ajax") {
                    sZero = oLang.sLoadingRecords;
                } else if (oLang.sEmptyTable && oSettings.fnRecordsTotal() === 0) {
                    sZero = oLang.sEmptyTable;
                }
                anRows[0] = $("<tr/>", {
                    "class": iStripes ? asStripeClasses[0] : ""
                }).append($("<td />", {
                    valign: "top",
                    colSpan: _fnVisbleColumns(oSettings),
                    "class": oSettings.oClasses.sRowEmpty
                }).html(sZero))[0];
            }
            _fnCallbackFire(oSettings, "aoHeaderCallback", "header", [ $(oSettings.nTHead).children("tr")[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay ]);
            _fnCallbackFire(oSettings, "aoFooterCallback", "footer", [ $(oSettings.nTFoot).children("tr")[0], _fnGetDataMaster(oSettings), iDisplayStart, iDisplayEnd, aiDisplay ]);
            var body = $(oSettings.nTBody);
            body.children().detach();
            body.append($(anRows));
            _fnCallbackFire(oSettings, "aoDrawCallback", "draw", [ oSettings ]);
            oSettings.bSorted = false;
            oSettings.bFiltered = false;
            oSettings.bDrawing = false;
        }
        function _fnReDraw(settings, holdPosition) {
            var features = settings.oFeatures, sort = features.bSort, filter = features.bFilter;
            if (sort) {
                _fnSort(settings);
            }
            if (filter) {
                _fnFilterComplete(settings, settings.oPreviousSearch);
            } else {
                settings.aiDisplay = settings.aiDisplayMaster.slice();
            }
            if (holdPosition !== true) {
                settings._iDisplayStart = 0;
            }
            settings._drawHold = holdPosition;
            _fnDraw(settings);
            settings._drawHold = false;
        }
        function _fnAddOptionsHtml(oSettings) {
            var classes = oSettings.oClasses;
            var table = $(oSettings.nTable);
            var holding = $("<div/>").insertBefore(table);
            var features = oSettings.oFeatures;
            var insert = $("<div/>", {
                id: oSettings.sTableId + "_wrapper",
                "class": classes.sWrapper + (oSettings.nTFoot ? "" : " " + classes.sNoFooter)
            });
            oSettings.nHolding = holding[0];
            oSettings.nTableWrapper = insert[0];
            oSettings.nTableReinsertBefore = oSettings.nTable.nextSibling;
            var aDom = oSettings.sDom.split("");
            var featureNode, cOption, nNewNode, cNext, sAttr, j;
            for (var i = 0; i < aDom.length; i++) {
                featureNode = null;
                cOption = aDom[i];
                if (cOption == "<") {
                    nNewNode = $("<div/>")[0];
                    cNext = aDom[i + 1];
                    if (cNext == "'" || cNext == '"') {
                        sAttr = "";
                        j = 2;
                        while (aDom[i + j] != cNext) {
                            sAttr += aDom[i + j];
                            j++;
                        }
                        if (sAttr == "H") {
                            sAttr = classes.sJUIHeader;
                        } else if (sAttr == "F") {
                            sAttr = classes.sJUIFooter;
                        }
                        if (sAttr.indexOf(".") != -1) {
                            var aSplit = sAttr.split(".");
                            nNewNode.id = aSplit[0].substr(1, aSplit[0].length - 1);
                            nNewNode.className = aSplit[1];
                        } else if (sAttr.charAt(0) == "#") {
                            nNewNode.id = sAttr.substr(1, sAttr.length - 1);
                        } else {
                            nNewNode.className = sAttr;
                        }
                        i += j;
                    }
                    insert.append(nNewNode);
                    insert = $(nNewNode);
                } else if (cOption == ">") {
                    insert = insert.parent();
                } else if (cOption == "l" && features.bPaginate && features.bLengthChange) {
                    featureNode = _fnFeatureHtmlLength(oSettings);
                } else if (cOption == "f" && features.bFilter) {
                    featureNode = _fnFeatureHtmlFilter(oSettings);
                } else if (cOption == "r" && features.bProcessing) {
                    featureNode = _fnFeatureHtmlProcessing(oSettings);
                } else if (cOption == "t") {
                    featureNode = _fnFeatureHtmlTable(oSettings);
                } else if (cOption == "i" && features.bInfo) {
                    featureNode = _fnFeatureHtmlInfo(oSettings);
                } else if (cOption == "p" && features.bPaginate) {
                    featureNode = _fnFeatureHtmlPaginate(oSettings);
                } else if (DataTable.ext.feature.length !== 0) {
                    var aoFeatures = DataTable.ext.feature;
                    for (var k = 0, kLen = aoFeatures.length; k < kLen; k++) {
                        if (cOption == aoFeatures[k].cFeature) {
                            featureNode = aoFeatures[k].fnInit(oSettings);
                            break;
                        }
                    }
                }
                if (featureNode) {
                    var aanFeatures = oSettings.aanFeatures;
                    if (!aanFeatures[cOption]) {
                        aanFeatures[cOption] = [];
                    }
                    aanFeatures[cOption].push(featureNode);
                    insert.append(featureNode);
                }
            }
            holding.replaceWith(insert);
        }
        function _fnDetectHeader(aLayout, nThead) {
            var nTrs = $(nThead).children("tr");
            var nTr, nCell;
            var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
            var bUnique;
            var fnShiftCol = function(a, i, j) {
                var k = a[i];
                while (k[j]) {
                    j++;
                }
                return j;
            };
            aLayout.splice(0, aLayout.length);
            for (i = 0, iLen = nTrs.length; i < iLen; i++) {
                aLayout.push([]);
            }
            for (i = 0, iLen = nTrs.length; i < iLen; i++) {
                nTr = nTrs[i];
                iColumn = 0;
                nCell = nTr.firstChild;
                while (nCell) {
                    if (nCell.nodeName.toUpperCase() == "TD" || nCell.nodeName.toUpperCase() == "TH") {
                        iColspan = nCell.getAttribute("colspan") * 1;
                        iRowspan = nCell.getAttribute("rowspan") * 1;
                        iColspan = !iColspan || iColspan === 0 || iColspan === 1 ? 1 : iColspan;
                        iRowspan = !iRowspan || iRowspan === 0 || iRowspan === 1 ? 1 : iRowspan;
                        iColShifted = fnShiftCol(aLayout, i, iColumn);
                        bUnique = iColspan === 1 ? true : false;
                        for (l = 0; l < iColspan; l++) {
                            for (k = 0; k < iRowspan; k++) {
                                aLayout[i + k][iColShifted + l] = {
                                    cell: nCell,
                                    unique: bUnique
                                };
                                aLayout[i + k].nTr = nTr;
                            }
                        }
                    }
                    nCell = nCell.nextSibling;
                }
            }
        }
        function _fnGetUniqueThs(oSettings, nHeader, aLayout) {
            var aReturn = [];
            if (!aLayout) {
                aLayout = oSettings.aoHeader;
                if (nHeader) {
                    aLayout = [];
                    _fnDetectHeader(aLayout, nHeader);
                }
            }
            for (var i = 0, iLen = aLayout.length; i < iLen; i++) {
                for (var j = 0, jLen = aLayout[i].length; j < jLen; j++) {
                    if (aLayout[i][j].unique && (!aReturn[j] || !oSettings.bSortCellsTop)) {
                        aReturn[j] = aLayout[i][j].cell;
                    }
                }
            }
            return aReturn;
        }
        function _fnBuildAjax(oSettings, data, fn) {
            _fnCallbackFire(oSettings, "aoServerParams", "serverParams", [ data ]);
            if (data && $.isArray(data)) {
                var tmp = {};
                var rbracket = /(.*?)\[\]$/;
                $.each(data, function(key, val) {
                    var match = val.name.match(rbracket);
                    if (match) {
                        var name = match[0];
                        if (!tmp[name]) {
                            tmp[name] = [];
                        }
                        tmp[name].push(val.value);
                    } else {
                        tmp[val.name] = val.value;
                    }
                });
                data = tmp;
            }
            var ajaxData;
            var ajax = oSettings.ajax;
            var instance = oSettings.oInstance;
            if ($.isPlainObject(ajax) && ajax.data) {
                ajaxData = ajax.data;
                var newData = $.isFunction(ajaxData) ? ajaxData(data) : ajaxData;
                data = $.isFunction(ajaxData) && newData ? newData : $.extend(true, data, newData);
                delete ajax.data;
            }
            var baseAjax = {
                data: data,
                success: function(json) {
                    var error = json.error || json.sError;
                    if (error) {
                        oSettings.oApi._fnLog(oSettings, 0, error);
                    }
                    oSettings.json = json;
                    _fnCallbackFire(oSettings, null, "xhr", [ oSettings, json ]);
                    fn(json);
                },
                dataType: "json",
                cache: false,
                type: oSettings.sServerMethod,
                error: function(xhr, error, thrown) {
                    var log = oSettings.oApi._fnLog;
                    if (error == "parsererror") {
                        log(oSettings, 0, "Invalid JSON response", 1);
                    } else if (xhr.readyState === 4) {
                        log(oSettings, 0, "Ajax error", 7);
                    }
                    _fnProcessingDisplay(oSettings, false);
                }
            };
            oSettings.oAjaxData = data;
            _fnCallbackFire(oSettings, null, "preXhr", [ oSettings, data ]);
            if (oSettings.fnServerData) {
                oSettings.fnServerData.call(instance, oSettings.sAjaxSource, $.map(data, function(val, key) {
                    return {
                        name: key,
                        value: val
                    };
                }), fn, oSettings);
            } else if (oSettings.sAjaxSource || typeof ajax === "string") {
                oSettings.jqXHR = $.ajax($.extend(baseAjax, {
                    url: ajax || oSettings.sAjaxSource
                }));
            } else if ($.isFunction(ajax)) {
                oSettings.jqXHR = ajax.call(instance, data, fn, oSettings);
            } else {
                oSettings.jqXHR = $.ajax($.extend(baseAjax, ajax));
                ajax.data = ajaxData;
            }
        }
        function _fnAjaxUpdate(settings) {
            if (settings.bAjaxDataGet) {
                settings.iDraw++;
                _fnProcessingDisplay(settings, true);
                _fnBuildAjax(settings, _fnAjaxParameters(settings), function(json) {
                    _fnAjaxUpdateDraw(settings, json);
                });
                return false;
            }
            return true;
        }
        function _fnAjaxParameters(settings) {
            var columns = settings.aoColumns, columnCount = columns.length, features = settings.oFeatures, preSearch = settings.oPreviousSearch, preColSearch = settings.aoPreSearchCols, i, data = [], dataProp, column, columnSearch, sort = _fnSortFlatten(settings), displayStart = settings._iDisplayStart, displayLength = features.bPaginate !== false ? settings._iDisplayLength : -1;
            var param = function(name, value) {
                data.push({
                    name: name,
                    value: value
                });
            };
            param("sEcho", settings.iDraw);
            param("iColumns", columnCount);
            param("sColumns", _pluck(columns, "sName").join(","));
            param("iDisplayStart", displayStart);
            param("iDisplayLength", displayLength);
            var d = {
                draw: settings.iDraw,
                columns: [],
                order: [],
                start: displayStart,
                length: displayLength,
                search: {
                    value: preSearch.sSearch,
                    regex: preSearch.bRegex
                }
            };
            for (i = 0; i < columnCount; i++) {
                column = columns[i];
                columnSearch = preColSearch[i];
                dataProp = typeof column.mData == "function" ? "function" : column.mData;
                d.columns.push({
                    data: dataProp,
                    name: column.sName,
                    searchable: column.bSearchable,
                    orderable: column.bSortable,
                    search: {
                        value: columnSearch.sSearch,
                        regex: columnSearch.bRegex
                    }
                });
                param("mDataProp_" + i, dataProp);
                if (features.bFilter) {
                    param("sSearch_" + i, columnSearch.sSearch);
                    param("bRegex_" + i, columnSearch.bRegex);
                    param("bSearchable_" + i, column.bSearchable);
                }
                if (features.bSort) {
                    param("bSortable_" + i, column.bSortable);
                }
            }
            if (features.bFilter) {
                param("sSearch", preSearch.sSearch);
                param("bRegex", preSearch.bRegex);
            }
            if (features.bSort) {
                $.each(sort, function(i, val) {
                    d.order.push({
                        column: val.col,
                        dir: val.dir
                    });
                    param("iSortCol_" + i, val.col);
                    param("sSortDir_" + i, val.dir);
                });
                param("iSortingCols", sort.length);
            }
            var legacy = DataTable.ext.legacy.ajax;
            if (legacy === null) {
                return settings.sAjaxSource ? data : d;
            }
            return legacy ? data : d;
        }
        function _fnAjaxUpdateDraw(settings, json) {
            var compat = function(old, modern) {
                return json[old] !== undefined ? json[old] : json[modern];
            };
            var draw = compat("sEcho", "draw");
            var recordsTotal = compat("iTotalRecords", "recordsTotal");
            var recordsFiltered = compat("iTotalDisplayRecords", "recordsFiltered");
            if (draw) {
                if (draw * 1 < settings.iDraw) {
                    return;
                }
                settings.iDraw = draw * 1;
            }
            _fnClearTable(settings);
            settings._iRecordsTotal = parseInt(recordsTotal, 10);
            settings._iRecordsDisplay = parseInt(recordsFiltered, 10);
            var data = _fnAjaxDataSrc(settings, json);
            for (var i = 0, ien = data.length; i < ien; i++) {
                _fnAddData(settings, data[i]);
            }
            settings.aiDisplay = settings.aiDisplayMaster.slice();
            settings.bAjaxDataGet = false;
            _fnDraw(settings);
            if (!settings._bInitComplete) {
                _fnInitComplete(settings, json);
            }
            settings.bAjaxDataGet = true;
            _fnProcessingDisplay(settings, false);
        }
        function _fnAjaxDataSrc(oSettings, json) {
            var dataSrc = $.isPlainObject(oSettings.ajax) && oSettings.ajax.dataSrc !== undefined ? oSettings.ajax.dataSrc : oSettings.sAjaxDataProp;
            if (dataSrc === "data") {
                return json.aaData || json[dataSrc];
            }
            return dataSrc !== "" ? _fnGetObjectDataFn(dataSrc)(json) : json;
        }
        function _fnFeatureHtmlFilter(settings) {
            var classes = settings.oClasses;
            var tableId = settings.sTableId;
            var language = settings.oLanguage;
            var previousSearch = settings.oPreviousSearch;
            var features = settings.aanFeatures;
            var input = '<input type="search" class="' + classes.sFilterInput + '"/>';
            var str = language.sSearch;
            str = str.match(/_INPUT_/) ? str.replace("_INPUT_", input) : str + input;
            var filter = $("<div/>", {
                id: !features.f ? tableId + "_filter" : null,
                "class": classes.sFilter
            }).append($("<label/>").append(str));
            var searchFn = function() {
                var n = features.f;
                var val = !this.value ? "" : this.value;
                if (val != previousSearch.sSearch) {
                    _fnFilterComplete(settings, {
                        sSearch: val,
                        bRegex: previousSearch.bRegex,
                        bSmart: previousSearch.bSmart,
                        bCaseInsensitive: previousSearch.bCaseInsensitive
                    });
                    settings._iDisplayStart = 0;
                    _fnDraw(settings);
                }
            };
            var searchDelay = settings.searchDelay !== null ? settings.searchDelay : _fnDataSource(settings) === "ssp" ? 400 : 0;
            var jqFilter = $("input", filter).val(previousSearch.sSearch).attr("placeholder", language.sSearchPlaceholder).bind("keyup.DT search.DT input.DT paste.DT cut.DT", searchDelay ? _fnThrottle(searchFn, searchDelay) : searchFn).bind("keypress.DT", function(e) {
                if (e.keyCode == 13) {
                    return false;
                }
            }).attr("aria-controls", tableId);
            $(settings.nTable).on("search.dt.DT", function(ev, s) {
                if (settings === s) {
                    try {
                        if (jqFilter[0] !== document.activeElement) {
                            jqFilter.val(previousSearch.sSearch);
                        }
                    } catch (e) {}
                }
            });
            return filter[0];
        }
        function _fnFilterComplete(oSettings, oInput, iForce) {
            var oPrevSearch = oSettings.oPreviousSearch;
            var aoPrevSearch = oSettings.aoPreSearchCols;
            var fnSaveFilter = function(oFilter) {
                oPrevSearch.sSearch = oFilter.sSearch;
                oPrevSearch.bRegex = oFilter.bRegex;
                oPrevSearch.bSmart = oFilter.bSmart;
                oPrevSearch.bCaseInsensitive = oFilter.bCaseInsensitive;
            };
            var fnRegex = function(o) {
                return o.bEscapeRegex !== undefined ? !o.bEscapeRegex : o.bRegex;
            };
            _fnColumnTypes(oSettings);
            if (_fnDataSource(oSettings) != "ssp") {
                _fnFilter(oSettings, oInput.sSearch, iForce, fnRegex(oInput), oInput.bSmart, oInput.bCaseInsensitive);
                fnSaveFilter(oInput);
                for (var i = 0; i < aoPrevSearch.length; i++) {
                    _fnFilterColumn(oSettings, aoPrevSearch[i].sSearch, i, fnRegex(aoPrevSearch[i]), aoPrevSearch[i].bSmart, aoPrevSearch[i].bCaseInsensitive);
                }
                _fnFilterCustom(oSettings);
            } else {
                fnSaveFilter(oInput);
            }
            oSettings.bFiltered = true;
            _fnCallbackFire(oSettings, null, "search", [ oSettings ]);
        }
        function _fnFilterCustom(settings) {
            var filters = DataTable.ext.search;
            var displayRows = settings.aiDisplay;
            var row, rowIdx;
            for (var i = 0, ien = filters.length; i < ien; i++) {
                var rows = [];
                for (var j = 0, jen = displayRows.length; j < jen; j++) {
                    rowIdx = displayRows[j];
                    row = settings.aoData[rowIdx];
                    if (filters[i](settings, row._aFilterData, rowIdx, row._aData, j)) {
                        rows.push(rowIdx);
                    }
                }
                displayRows.length = 0;
                displayRows.push.apply(displayRows, rows);
            }
        }
        function _fnFilterColumn(settings, searchStr, colIdx, regex, smart, caseInsensitive) {
            if (searchStr === "") {
                return;
            }
            var data;
            var display = settings.aiDisplay;
            var rpSearch = _fnFilterCreateSearch(searchStr, regex, smart, caseInsensitive);
            for (var i = display.length - 1; i >= 0; i--) {
                data = settings.aoData[display[i]]._aFilterData[colIdx];
                if (!rpSearch.test(data)) {
                    display.splice(i, 1);
                }
            }
        }
        function _fnFilter(settings, input, force, regex, smart, caseInsensitive) {
            var rpSearch = _fnFilterCreateSearch(input, regex, smart, caseInsensitive);
            var prevSearch = settings.oPreviousSearch.sSearch;
            var displayMaster = settings.aiDisplayMaster;
            var display, invalidated, i;
            if (DataTable.ext.search.length !== 0) {
                force = true;
            }
            invalidated = _fnFilterData(settings);
            if (input.length <= 0) {
                settings.aiDisplay = displayMaster.slice();
            } else {
                if (invalidated || force || prevSearch.length > input.length || input.indexOf(prevSearch) !== 0 || settings.bSorted) {
                    settings.aiDisplay = displayMaster.slice();
                }
                display = settings.aiDisplay;
                for (i = display.length - 1; i >= 0; i--) {
                    if (!rpSearch.test(settings.aoData[display[i]]._sFilterRow)) {
                        display.splice(i, 1);
                    }
                }
            }
        }
        function _fnFilterCreateSearch(search, regex, smart, caseInsensitive) {
            search = regex ? search : _fnEscapeRegex(search);
            if (smart) {
                var a = $.map(search.match(/"[^"]+"|[^ ]+/g) || "", function(word) {
                    if (word.charAt(0) === '"') {
                        var m = word.match(/^"(.*)"$/);
                        word = m ? m[1] : word;
                    }
                    return word.replace('"', "");
                });
                search = "^(?=.*?" + a.join(")(?=.*?") + ").*$";
            }
            return new RegExp(search, caseInsensitive ? "i" : "");
        }
        function _fnEscapeRegex(sVal) {
            return sVal.replace(_re_escape_regex, "\\$1");
        }
        var __filter_div = $("<div>")[0];
        var __filter_div_textContent = __filter_div.textContent !== undefined;
        function _fnFilterData(settings) {
            var columns = settings.aoColumns;
            var column;
            var i, j, ien, jen, filterData, cellData, row;
            var fomatters = DataTable.ext.type.search;
            var wasInvalidated = false;
            for (i = 0, ien = settings.aoData.length; i < ien; i++) {
                row = settings.aoData[i];
                if (!row._aFilterData) {
                    filterData = [];
                    for (j = 0, jen = columns.length; j < jen; j++) {
                        column = columns[j];
                        if (column.bSearchable) {
                            cellData = _fnGetCellData(settings, i, j, "filter");
                            if (fomatters[column.sType]) {
                                cellData = fomatters[column.sType](cellData);
                            }
                            if (cellData === null) {
                                cellData = "";
                            }
                            if (typeof cellData !== "string" && cellData.toString) {
                                cellData = cellData.toString();
                            }
                        } else {
                            cellData = "";
                        }
                        if (cellData.indexOf && cellData.indexOf("&") !== -1) {
                            __filter_div.innerHTML = cellData;
                            cellData = __filter_div_textContent ? __filter_div.textContent : __filter_div.innerText;
                        }
                        if (cellData.replace) {
                            cellData = cellData.replace(/[\r\n]/g, "");
                        }
                        filterData.push(cellData);
                    }
                    row._aFilterData = filterData;
                    row._sFilterRow = filterData.join("  ");
                    wasInvalidated = true;
                }
            }
            return wasInvalidated;
        }
        function _fnSearchToCamel(obj) {
            return {
                search: obj.sSearch,
                smart: obj.bSmart,
                regex: obj.bRegex,
                caseInsensitive: obj.bCaseInsensitive
            };
        }
        function _fnSearchToHung(obj) {
            return {
                sSearch: obj.search,
                bSmart: obj.smart,
                bRegex: obj.regex,
                bCaseInsensitive: obj.caseInsensitive
            };
        }
        function _fnFeatureHtmlInfo(settings) {
            var tid = settings.sTableId, nodes = settings.aanFeatures.i, n = $("<div/>", {
                "class": settings.oClasses.sInfo,
                id: !nodes ? tid + "_info" : null
            });
            if (!nodes) {
                settings.aoDrawCallback.push({
                    fn: _fnUpdateInfo,
                    sName: "information"
                });
                n.attr("role", "status").attr("aria-live", "polite");
                $(settings.nTable).attr("aria-describedby", tid + "_info");
            }
            return n[0];
        }
        function _fnUpdateInfo(settings) {
            var nodes = settings.aanFeatures.i;
            if (nodes.length === 0) {
                return;
            }
            var lang = settings.oLanguage, start = settings._iDisplayStart + 1, end = settings.fnDisplayEnd(), max = settings.fnRecordsTotal(), total = settings.fnRecordsDisplay(), out = total ? lang.sInfo : lang.sInfoEmpty;
            if (total !== max) {
                out += " " + lang.sInfoFiltered;
            }
            out += lang.sInfoPostFix;
            out = _fnInfoMacros(settings, out);
            var callback = lang.fnInfoCallback;
            if (callback !== null) {
                out = callback.call(settings.oInstance, settings, start, end, max, total, out);
            }
            $(nodes).html(out);
        }
        function _fnInfoMacros(settings, str) {
            var formatter = settings.fnFormatNumber, start = settings._iDisplayStart + 1, len = settings._iDisplayLength, vis = settings.fnRecordsDisplay(), all = len === -1;
            return str.replace(/_START_/g, formatter.call(settings, start)).replace(/_END_/g, formatter.call(settings, settings.fnDisplayEnd())).replace(/_MAX_/g, formatter.call(settings, settings.fnRecordsTotal())).replace(/_TOTAL_/g, formatter.call(settings, vis)).replace(/_PAGE_/g, formatter.call(settings, all ? 1 : Math.ceil(start / len))).replace(/_PAGES_/g, formatter.call(settings, all ? 1 : Math.ceil(vis / len)));
        }
        function _fnInitialise(settings) {
            var i, iLen, iAjaxStart = settings.iInitDisplayStart;
            var columns = settings.aoColumns, column;
            var features = settings.oFeatures;
            if (!settings.bInitialised) {
                setTimeout(function() {
                    _fnInitialise(settings);
                }, 200);
                return;
            }
            _fnAddOptionsHtml(settings);
            _fnBuildHead(settings);
            _fnDrawHead(settings, settings.aoHeader);
            _fnDrawHead(settings, settings.aoFooter);
            _fnProcessingDisplay(settings, true);
            if (features.bAutoWidth) {
                _fnCalculateColumnWidths(settings);
            }
            for (i = 0, iLen = columns.length; i < iLen; i++) {
                column = columns[i];
                if (column.sWidth) {
                    column.nTh.style.width = _fnStringToCss(column.sWidth);
                }
            }
            _fnReDraw(settings);
            var dataSrc = _fnDataSource(settings);
            if (dataSrc != "ssp") {
                if (dataSrc == "ajax") {
                    _fnBuildAjax(settings, [], function(json) {
                        var aData = _fnAjaxDataSrc(settings, json);
                        for (i = 0; i < aData.length; i++) {
                            _fnAddData(settings, aData[i]);
                        }
                        settings.iInitDisplayStart = iAjaxStart;
                        _fnReDraw(settings);
                        _fnProcessingDisplay(settings, false);
                        _fnInitComplete(settings, json);
                    }, settings);
                } else {
                    _fnProcessingDisplay(settings, false);
                    _fnInitComplete(settings);
                }
            }
        }
        function _fnInitComplete(settings, json) {
            settings._bInitComplete = true;
            if (json) {
                _fnAdjustColumnSizing(settings);
            }
            _fnCallbackFire(settings, "aoInitComplete", "init", [ settings, json ]);
        }
        function _fnLengthChange(settings, val) {
            var len = parseInt(val, 10);
            settings._iDisplayLength = len;
            _fnLengthOverflow(settings);
            _fnCallbackFire(settings, null, "length", [ settings, len ]);
        }
        function _fnFeatureHtmlLength(settings) {
            var classes = settings.oClasses, tableId = settings.sTableId, menu = settings.aLengthMenu, d2 = $.isArray(menu[0]), lengths = d2 ? menu[0] : menu, language = d2 ? menu[1] : menu;
            var select = $("<select/>", {
                name: tableId + "_length",
                "aria-controls": tableId,
                "class": classes.sLengthSelect
            });
            for (var i = 0, ien = lengths.length; i < ien; i++) {
                select[0][i] = new Option(language[i], lengths[i]);
            }
            var div = $("<div><label/></div>").addClass(classes.sLength);
            if (!settings.aanFeatures.l) {
                div[0].id = tableId + "_length";
            }
            div.children().append(settings.oLanguage.sLengthMenu.replace("_MENU_", select[0].outerHTML));
            $("select", div).val(settings._iDisplayLength).bind("change.DT", function(e) {
                _fnLengthChange(settings, $(this).val());
                _fnDraw(settings);
            });
            $(settings.nTable).bind("length.dt.DT", function(e, s, len) {
                if (settings === s) {
                    $("select", div).val(len);
                }
            });
            return div[0];
        }
        function _fnFeatureHtmlPaginate(settings) {
            var type = settings.sPaginationType, plugin = DataTable.ext.pager[type], modern = typeof plugin === "function", redraw = function(settings) {
                _fnDraw(settings);
            }, node = $("<div/>").addClass(settings.oClasses.sPaging + type)[0], features = settings.aanFeatures;
            if (!modern) {
                plugin.fnInit(settings, node, redraw);
            }
            if (!features.p) {
                node.id = settings.sTableId + "_paginate";
                settings.aoDrawCallback.push({
                    fn: function(settings) {
                        if (modern) {
                            var start = settings._iDisplayStart, len = settings._iDisplayLength, visRecords = settings.fnRecordsDisplay(), all = len === -1, page = all ? 0 : Math.ceil(start / len), pages = all ? 1 : Math.ceil(visRecords / len), buttons = plugin(page, pages), i, ien;
                            for (i = 0, ien = features.p.length; i < ien; i++) {
                                _fnRenderer(settings, "pageButton")(settings, features.p[i], i, buttons, page, pages);
                            }
                        } else {
                            plugin.fnUpdate(settings, redraw);
                        }
                    },
                    sName: "pagination"
                });
            }
            return node;
        }
        function _fnPageChange(settings, action, redraw) {
            var start = settings._iDisplayStart, len = settings._iDisplayLength, records = settings.fnRecordsDisplay();
            if (records === 0 || len === -1) {
                start = 0;
            } else if (typeof action === "number") {
                start = action * len;
                if (start > records) {
                    start = 0;
                }
            } else if (action == "first") {
                start = 0;
            } else if (action == "previous") {
                start = len >= 0 ? start - len : 0;
                if (start < 0) {
                    start = 0;
                }
            } else if (action == "next") {
                if (start + len < records) {
                    start += len;
                }
            } else if (action == "last") {
                start = Math.floor((records - 1) / len) * len;
            } else {
                _fnLog(settings, 0, "Unknown paging action: " + action, 5);
            }
            var changed = settings._iDisplayStart !== start;
            settings._iDisplayStart = start;
            if (changed) {
                _fnCallbackFire(settings, null, "page", [ settings ]);
                if (redraw) {
                    _fnDraw(settings);
                }
            }
            return changed;
        }
        function _fnFeatureHtmlProcessing(settings) {
            return $("<div/>", {
                id: !settings.aanFeatures.r ? settings.sTableId + "_processing" : null,
                "class": settings.oClasses.sProcessing
            }).html(settings.oLanguage.sProcessing).insertBefore(settings.nTable)[0];
        }
        function _fnProcessingDisplay(settings, show) {
            if (settings.oFeatures.bProcessing) {
                $(settings.aanFeatures.r).css("display", show ? "block" : "none");
            }
            _fnCallbackFire(settings, null, "processing", [ settings, show ]);
        }
        function _fnFeatureHtmlTable(settings) {
            var table = $(settings.nTable);
            table.attr("role", "grid");
            var scroll = settings.oScroll;
            if (scroll.sX === "" && scroll.sY === "") {
                return settings.nTable;
            }
            var scrollX = scroll.sX;
            var scrollY = scroll.sY;
            var classes = settings.oClasses;
            var caption = table.children("caption");
            var captionSide = caption.length ? caption[0]._captionSide : null;
            var headerClone = $(table[0].cloneNode(false));
            var footerClone = $(table[0].cloneNode(false));
            var footer = table.children("tfoot");
            var _div = "<div/>";
            var size = function(s) {
                return !s ? null : _fnStringToCss(s);
            };
            if (scroll.sX && table.attr("width") === "100%") {
                table.removeAttr("width");
            }
            if (!footer.length) {
                footer = null;
            }
            var scroller = $(_div, {
                "class": classes.sScrollWrapper
            }).append($(_div, {
                "class": classes.sScrollHead
            }).css({
                overflow: "hidden",
                position: "relative",
                border: 0,
                width: scrollX ? size(scrollX) : "100%"
            }).append($(_div, {
                "class": classes.sScrollHeadInner
            }).css({
                "box-sizing": "content-box",
                width: scroll.sXInner || "100%"
            }).append(headerClone.removeAttr("id").css("margin-left", 0).append(captionSide === "top" ? caption : null).append(table.children("thead"))))).append($(_div, {
                "class": classes.sScrollBody
            }).css({
                overflow: "auto",
                height: size(scrollY),
                width: size(scrollX)
            }).append(table));
            if (footer) {
                scroller.append($(_div, {
                    "class": classes.sScrollFoot
                }).css({
                    overflow: "hidden",
                    border: 0,
                    width: scrollX ? size(scrollX) : "100%"
                }).append($(_div, {
                    "class": classes.sScrollFootInner
                }).append(footerClone.removeAttr("id").css("margin-left", 0).append(captionSide === "bottom" ? caption : null).append(table.children("tfoot")))));
            }
            var children = scroller.children();
            var scrollHead = children[0];
            var scrollBody = children[1];
            var scrollFoot = footer ? children[2] : null;
            if (scrollX) {
                $(scrollBody).scroll(function(e) {
                    var scrollLeft = this.scrollLeft;
                    scrollHead.scrollLeft = scrollLeft;
                    if (footer) {
                        scrollFoot.scrollLeft = scrollLeft;
                    }
                });
            }
            settings.nScrollHead = scrollHead;
            settings.nScrollBody = scrollBody;
            settings.nScrollFoot = scrollFoot;
            settings.aoDrawCallback.push({
                fn: _fnScrollDraw,
                sName: "scrolling"
            });
            return scroller[0];
        }
        function _fnScrollDraw(settings) {
            var scroll = settings.oScroll, scrollX = scroll.sX, scrollXInner = scroll.sXInner, scrollY = scroll.sY, barWidth = scroll.iBarWidth, divHeader = $(settings.nScrollHead), divHeaderStyle = divHeader[0].style, divHeaderInner = divHeader.children("div"), divHeaderInnerStyle = divHeaderInner[0].style, divHeaderTable = divHeaderInner.children("table"), divBodyEl = settings.nScrollBody, divBody = $(divBodyEl), divBodyStyle = divBodyEl.style, divFooter = $(settings.nScrollFoot), divFooterInner = divFooter.children("div"), divFooterTable = divFooterInner.children("table"), header = $(settings.nTHead), table = $(settings.nTable), tableEl = table[0], tableStyle = tableEl.style, footer = settings.nTFoot ? $(settings.nTFoot) : null, browser = settings.oBrowser, ie67 = browser.bScrollOversize, headerTrgEls, footerTrgEls, headerSrcEls, footerSrcEls, headerCopy, footerCopy, headerWidths = [], footerWidths = [], headerContent = [], idx, correction, sanityWidth, zeroOut = function(nSizer) {
                var style = nSizer.style;
                style.paddingTop = "0";
                style.paddingBottom = "0";
                style.borderTopWidth = "0";
                style.borderBottomWidth = "0";
                style.height = 0;
            };
            table.children("thead, tfoot").remove();
            headerCopy = header.clone().prependTo(table);
            headerTrgEls = header.find("tr");
            headerSrcEls = headerCopy.find("tr");
            headerCopy.find("th, td").removeAttr("tabindex");
            if (footer) {
                footerCopy = footer.clone().prependTo(table);
                footerTrgEls = footer.find("tr");
                footerSrcEls = footerCopy.find("tr");
            }
            if (!scrollX) {
                divBodyStyle.width = "100%";
                divHeader[0].style.width = "100%";
            }
            $.each(_fnGetUniqueThs(settings, headerCopy), function(i, el) {
                idx = _fnVisibleToColumnIndex(settings, i);
                el.style.width = settings.aoColumns[idx].sWidth;
            });
            if (footer) {
                _fnApplyToChildren(function(n) {
                    n.style.width = "";
                }, footerSrcEls);
            }
            if (scroll.bCollapse && scrollY !== "") {
                divBodyStyle.height = divBody[0].offsetHeight + header[0].offsetHeight + "px";
            }
            sanityWidth = table.outerWidth();
            if (scrollX === "") {
                tableStyle.width = "100%";
                if (ie67 && (table.find("tbody").height() > divBodyEl.offsetHeight || divBody.css("overflow-y") == "scroll")) {
                    tableStyle.width = _fnStringToCss(table.outerWidth() - barWidth);
                }
            } else {
                if (scrollXInner !== "") {
                    tableStyle.width = _fnStringToCss(scrollXInner);
                } else if (sanityWidth == divBody.width() && divBody.height() < table.height()) {
                    tableStyle.width = _fnStringToCss(sanityWidth - barWidth);
                    if (table.outerWidth() > sanityWidth - barWidth) {
                        tableStyle.width = _fnStringToCss(sanityWidth);
                    }
                } else {
                    tableStyle.width = _fnStringToCss(sanityWidth);
                }
            }
            sanityWidth = table.outerWidth();
            _fnApplyToChildren(zeroOut, headerSrcEls);
            _fnApplyToChildren(function(nSizer) {
                headerContent.push(nSizer.innerHTML);
                headerWidths.push(_fnStringToCss($(nSizer).css("width")));
            }, headerSrcEls);
            _fnApplyToChildren(function(nToSize, i) {
                nToSize.style.width = headerWidths[i];
            }, headerTrgEls);
            $(headerSrcEls).height(0);
            if (footer) {
                _fnApplyToChildren(zeroOut, footerSrcEls);
                _fnApplyToChildren(function(nSizer) {
                    footerWidths.push(_fnStringToCss($(nSizer).css("width")));
                }, footerSrcEls);
                _fnApplyToChildren(function(nToSize, i) {
                    nToSize.style.width = footerWidths[i];
                }, footerTrgEls);
                $(footerSrcEls).height(0);
            }
            _fnApplyToChildren(function(nSizer, i) {
                nSizer.innerHTML = '<div class="dataTables_sizing" style="height:0;overflow:hidden;">' + headerContent[i] + "</div>";
                nSizer.style.width = headerWidths[i];
            }, headerSrcEls);
            if (footer) {
                _fnApplyToChildren(function(nSizer, i) {
                    nSizer.innerHTML = "";
                    nSizer.style.width = footerWidths[i];
                }, footerSrcEls);
            }
            if (table.outerWidth() < sanityWidth) {
                correction = divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css("overflow-y") == "scroll" ? sanityWidth + barWidth : sanityWidth;
                if (ie67 && (divBodyEl.scrollHeight > divBodyEl.offsetHeight || divBody.css("overflow-y") == "scroll")) {
                    tableStyle.width = _fnStringToCss(correction - barWidth);
                }
                if (scrollX === "" || scrollXInner !== "") {
                    _fnLog(settings, 1, "Possible column misalignment", 6);
                }
            } else {
                correction = "100%";
            }
            divBodyStyle.width = _fnStringToCss(correction);
            divHeaderStyle.width = _fnStringToCss(correction);
            if (footer) {
                settings.nScrollFoot.style.width = _fnStringToCss(correction);
            }
            if (!scrollY) {
                if (ie67) {
                    divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + barWidth);
                }
            }
            if (scrollY && scroll.bCollapse) {
                divBodyStyle.height = _fnStringToCss(scrollY);
                var iExtra = scrollX && tableEl.offsetWidth > divBodyEl.offsetWidth ? barWidth : 0;
                if (tableEl.offsetHeight < divBodyEl.offsetHeight) {
                    divBodyStyle.height = _fnStringToCss(tableEl.offsetHeight + iExtra);
                }
            }
            var iOuterWidth = table.outerWidth();
            divHeaderTable[0].style.width = _fnStringToCss(iOuterWidth);
            divHeaderInnerStyle.width = _fnStringToCss(iOuterWidth);
            var bScrolling = table.height() > divBodyEl.clientHeight || divBody.css("overflow-y") == "scroll";
            var padding = "padding" + (browser.bScrollbarLeft ? "Left" : "Right");
            divHeaderInnerStyle[padding] = bScrolling ? barWidth + "px" : "0px";
            if (footer) {
                divFooterTable[0].style.width = _fnStringToCss(iOuterWidth);
                divFooterInner[0].style.width = _fnStringToCss(iOuterWidth);
                divFooterInner[0].style[padding] = bScrolling ? barWidth + "px" : "0px";
            }
            divBody.scroll();
            if ((settings.bSorted || settings.bFiltered) && !settings._drawHold) {
                divBodyEl.scrollTop = 0;
            }
        }
        function _fnApplyToChildren(fn, an1, an2) {
            var index = 0, i = 0, iLen = an1.length;
            var nNode1, nNode2;
            while (i < iLen) {
                nNode1 = an1[i].firstChild;
                nNode2 = an2 ? an2[i].firstChild : null;
                while (nNode1) {
                    if (nNode1.nodeType === 1) {
                        if (an2) {
                            fn(nNode1, nNode2, index);
                        } else {
                            fn(nNode1, index);
                        }
                        index++;
                    }
                    nNode1 = nNode1.nextSibling;
                    nNode2 = an2 ? nNode2.nextSibling : null;
                }
                i++;
            }
        }
        var __re_html_remove = /<.*?>/g;
        function _fnCalculateColumnWidths(oSettings) {
            var table = oSettings.nTable, columns = oSettings.aoColumns, scroll = oSettings.oScroll, scrollY = scroll.sY, scrollX = scroll.sX, scrollXInner = scroll.sXInner, columnCount = columns.length, visibleColumns = _fnGetColumns(oSettings, "bVisible"), headerCells = $("th", oSettings.nTHead), tableWidthAttr = table.getAttribute("width"), tableContainer = table.parentNode, userInputs = false, i, column, columnIdx, width, outerWidth;
            for (i = 0; i < visibleColumns.length; i++) {
                column = columns[visibleColumns[i]];
                if (column.sWidth !== null) {
                    column.sWidth = _fnConvertToWidth(column.sWidthOrig, tableContainer);
                    userInputs = true;
                }
            }
            if (!userInputs && !scrollX && !scrollY && columnCount == _fnVisbleColumns(oSettings) && columnCount == headerCells.length) {
                for (i = 0; i < columnCount; i++) {
                    columns[i].sWidth = _fnStringToCss(headerCells.eq(i).width());
                }
            } else {
                var tmpTable = $(table).clone().empty().css("visibility", "hidden").removeAttr("id").append($(oSettings.nTHead).clone(false)).append($(oSettings.nTFoot).clone(false)).append($("<tbody><tr/></tbody>"));
                tmpTable.find("tfoot th, tfoot td").css("width", "");
                var tr = tmpTable.find("tbody tr");
                headerCells = _fnGetUniqueThs(oSettings, tmpTable.find("thead")[0]);
                for (i = 0; i < visibleColumns.length; i++) {
                    column = columns[visibleColumns[i]];
                    headerCells[i].style.width = column.sWidthOrig !== null && column.sWidthOrig !== "" ? _fnStringToCss(column.sWidthOrig) : "";
                }
                if (oSettings.aoData.length) {
                    for (i = 0; i < visibleColumns.length; i++) {
                        columnIdx = visibleColumns[i];
                        column = columns[columnIdx];
                        $(_fnGetWidestNode(oSettings, columnIdx)).clone(false).append(column.sContentPadding).appendTo(tr);
                    }
                }
                tmpTable.appendTo(tableContainer);
                if (scrollX && scrollXInner) {
                    tmpTable.width(scrollXInner);
                } else if (scrollX) {
                    tmpTable.css("width", "auto");
                    if (tmpTable.width() < tableContainer.offsetWidth) {
                        tmpTable.width(tableContainer.offsetWidth);
                    }
                } else if (scrollY) {
                    tmpTable.width(tableContainer.offsetWidth);
                } else if (tableWidthAttr) {
                    tmpTable.width(tableWidthAttr);
                }
                _fnScrollingWidthAdjust(oSettings, tmpTable[0]);
                if (scrollX) {
                    var total = 0;
                    for (i = 0; i < visibleColumns.length; i++) {
                        column = columns[visibleColumns[i]];
                        outerWidth = $(headerCells[i]).outerWidth();
                        total += column.sWidthOrig === null ? outerWidth : parseInt(column.sWidth, 10) + outerWidth - $(headerCells[i]).width();
                    }
                    tmpTable.width(_fnStringToCss(total));
                    table.style.width = _fnStringToCss(total);
                }
                for (i = 0; i < visibleColumns.length; i++) {
                    column = columns[visibleColumns[i]];
                    width = $(headerCells[i]).width();
                    if (width) {
                        column.sWidth = _fnStringToCss(width);
                    }
                }
                table.style.width = _fnStringToCss(tmpTable.css("width"));
                tmpTable.remove();
            }
            if (tableWidthAttr) {
                table.style.width = _fnStringToCss(tableWidthAttr);
            }
            if ((tableWidthAttr || scrollX) && !oSettings._reszEvt) {
                $(window).bind("resize.DT-" + oSettings.sInstance, _fnThrottle(function() {
                    _fnAdjustColumnSizing(oSettings);
                }));
                oSettings._reszEvt = true;
            }
        }
        function _fnThrottle(fn, freq) {
            var frequency = freq !== undefined ? freq : 200, last, timer;
            return function() {
                var that = this, now = +new Date(), args = arguments;
                if (last && now < last + frequency) {
                    clearTimeout(timer);
                    timer = setTimeout(function() {
                        last = undefined;
                        fn.apply(that, args);
                    }, frequency);
                } else if (last) {
                    last = now;
                    fn.apply(that, args);
                } else {
                    last = now;
                }
            };
        }
        function _fnConvertToWidth(width, parent) {
            if (!width) {
                return 0;
            }
            var n = $("<div/>").css("width", _fnStringToCss(width)).appendTo(parent || document.body);
            var val = n[0].offsetWidth;
            n.remove();
            return val;
        }
        function _fnScrollingWidthAdjust(settings, n) {
            var scroll = settings.oScroll;
            if (scroll.sX || scroll.sY) {
                var correction = !scroll.sX ? scroll.iBarWidth : 0;
                n.style.width = _fnStringToCss($(n).outerWidth() - correction);
            }
        }
        function _fnGetWidestNode(settings, colIdx) {
            var idx = _fnGetMaxLenString(settings, colIdx);
            if (idx < 0) {
                return null;
            }
            var data = settings.aoData[idx];
            return !data.nTr ? $("<td/>").html(_fnGetCellData(settings, idx, colIdx, "display"))[0] : data.anCells[colIdx];
        }
        function _fnGetMaxLenString(settings, colIdx) {
            var s, max = -1, maxIdx = -1;
            for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
                s = _fnGetCellData(settings, i, colIdx, "display") + "";
                s = s.replace(__re_html_remove, "");
                if (s.length > max) {
                    max = s.length;
                    maxIdx = i;
                }
            }
            return maxIdx;
        }
        function _fnStringToCss(s) {
            if (s === null) {
                return "0px";
            }
            if (typeof s == "number") {
                return s < 0 ? "0px" : s + "px";
            }
            return s.match(/\d$/) ? s + "px" : s;
        }
        function _fnScrollBarWidth() {
            if (!DataTable.__scrollbarWidth) {
                var inner = $("<p/>").css({
                    width: "100%",
                    height: 200,
                    padding: 0
                })[0];
                var outer = $("<div/>").css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: 200,
                    height: 150,
                    padding: 0,
                    overflow: "hidden",
                    visibility: "hidden"
                }).append(inner).appendTo("body");
                var w1 = inner.offsetWidth;
                outer.css("overflow", "scroll");
                var w2 = inner.offsetWidth;
                if (w1 === w2) {
                    w2 = outer[0].clientWidth;
                }
                outer.remove();
                DataTable.__scrollbarWidth = w1 - w2;
            }
            return DataTable.__scrollbarWidth;
        }
        function _fnSortFlatten(settings) {
            var i, iLen, k, kLen, aSort = [], aiOrig = [], aoColumns = settings.aoColumns, aDataSort, iCol, sType, srcCol, fixed = settings.aaSortingFixed, fixedObj = $.isPlainObject(fixed), nestedSort = [], add = function(a) {
                if (a.length && !$.isArray(a[0])) {
                    nestedSort.push(a);
                } else {
                    nestedSort.push.apply(nestedSort, a);
                }
            };
            if ($.isArray(fixed)) {
                add(fixed);
            }
            if (fixedObj && fixed.pre) {
                add(fixed.pre);
            }
            add(settings.aaSorting);
            if (fixedObj && fixed.post) {
                add(fixed.post);
            }
            for (i = 0; i < nestedSort.length; i++) {
                srcCol = nestedSort[i][0];
                aDataSort = aoColumns[srcCol].aDataSort;
                for (k = 0, kLen = aDataSort.length; k < kLen; k++) {
                    iCol = aDataSort[k];
                    sType = aoColumns[iCol].sType || "string";
                    if (nestedSort[i]._idx === undefined) {
                        nestedSort[i]._idx = $.inArray(nestedSort[i][1], aoColumns[iCol].asSorting);
                    }
                    aSort.push({
                        src: srcCol,
                        col: iCol,
                        dir: nestedSort[i][1],
                        index: nestedSort[i]._idx,
                        type: sType,
                        formatter: DataTable.ext.type.order[sType + "-pre"]
                    });
                }
            }
            return aSort;
        }
        function _fnSort(oSettings) {
            var i, ien, iLen, j, jLen, k, kLen, sDataType, nTh, aiOrig = [], oExtSort = DataTable.ext.type.order, aoData = oSettings.aoData, aoColumns = oSettings.aoColumns, aDataSort, data, iCol, sType, oSort, formatters = 0, sortCol, displayMaster = oSettings.aiDisplayMaster, aSort;
            _fnColumnTypes(oSettings);
            aSort = _fnSortFlatten(oSettings);
            for (i = 0, ien = aSort.length; i < ien; i++) {
                sortCol = aSort[i];
                if (sortCol.formatter) {
                    formatters++;
                }
                _fnSortData(oSettings, sortCol.col);
            }
            if (_fnDataSource(oSettings) != "ssp" && aSort.length !== 0) {
                for (i = 0, iLen = displayMaster.length; i < iLen; i++) {
                    aiOrig[displayMaster[i]] = i;
                }
                if (formatters === aSort.length) {
                    displayMaster.sort(function(a, b) {
                        var x, y, k, test, sort, len = aSort.length, dataA = aoData[a]._aSortData, dataB = aoData[b]._aSortData;
                        for (k = 0; k < len; k++) {
                            sort = aSort[k];
                            x = dataA[sort.col];
                            y = dataB[sort.col];
                            test = x < y ? -1 : x > y ? 1 : 0;
                            if (test !== 0) {
                                return sort.dir === "asc" ? test : -test;
                            }
                        }
                        x = aiOrig[a];
                        y = aiOrig[b];
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                } else {
                    displayMaster.sort(function(a, b) {
                        var x, y, k, l, test, sort, fn, len = aSort.length, dataA = aoData[a]._aSortData, dataB = aoData[b]._aSortData;
                        for (k = 0; k < len; k++) {
                            sort = aSort[k];
                            x = dataA[sort.col];
                            y = dataB[sort.col];
                            fn = oExtSort[sort.type + "-" + sort.dir] || oExtSort["string-" + sort.dir];
                            test = fn(x, y);
                            if (test !== 0) {
                                return test;
                            }
                        }
                        x = aiOrig[a];
                        y = aiOrig[b];
                        return x < y ? -1 : x > y ? 1 : 0;
                    });
                }
            }
            oSettings.bSorted = true;
        }
        function _fnSortAria(settings) {
            var label;
            var nextSort;
            var columns = settings.aoColumns;
            var aSort = _fnSortFlatten(settings);
            var oAria = settings.oLanguage.oAria;
            for (var i = 0, iLen = columns.length; i < iLen; i++) {
                var col = columns[i];
                var asSorting = col.asSorting;
                var sTitle = col.sTitle.replace(/<.*?>/g, "");
                var th = col.nTh;
                th.removeAttribute("aria-sort");
                if (col.bSortable) {
                    if (aSort.length > 0 && aSort[0].col == i) {
                        th.setAttribute("aria-sort", aSort[0].dir == "asc" ? "ascending" : "descending");
                        nextSort = asSorting[aSort[0].index + 1] || asSorting[0];
                    } else {
                        nextSort = asSorting[0];
                    }
                    label = sTitle + (nextSort === "asc" ? oAria.sSortAscending : oAria.sSortDescending);
                } else {
                    label = sTitle;
                }
                th.setAttribute("aria-label", label);
            }
        }
        function _fnSortListener(settings, colIdx, append, callback) {
            var col = settings.aoColumns[colIdx];
            var sorting = settings.aaSorting;
            var asSorting = col.asSorting;
            var nextSortIdx;
            var next = function(a, overflow) {
                var idx = a._idx;
                if (idx === undefined) {
                    idx = $.inArray(a[1], asSorting);
                }
                return idx + 1 < asSorting.length ? idx + 1 : overflow ? null : 0;
            };
            if (typeof sorting[0] === "number") {
                sorting = settings.aaSorting = [ sorting ];
            }
            if (append && settings.oFeatures.bSortMulti) {
                var sortIdx = $.inArray(colIdx, _pluck(sorting, "0"));
                if (sortIdx !== -1) {
                    nextSortIdx = next(sorting[sortIdx], true);
                    if (nextSortIdx === null) {
                        sorting.splice(sortIdx, 1);
                    } else {
                        sorting[sortIdx][1] = asSorting[nextSortIdx];
                        sorting[sortIdx]._idx = nextSortIdx;
                    }
                } else {
                    sorting.push([ colIdx, asSorting[0], 0 ]);
                    sorting[sorting.length - 1]._idx = 0;
                }
            } else if (sorting.length && sorting[0][0] == colIdx) {
                nextSortIdx = next(sorting[0]);
                sorting.length = 1;
                sorting[0][1] = asSorting[nextSortIdx];
                sorting[0]._idx = nextSortIdx;
            } else {
                sorting.length = 0;
                sorting.push([ colIdx, asSorting[0] ]);
                sorting[0]._idx = 0;
            }
            _fnReDraw(settings);
            if (typeof callback == "function") {
                callback(settings);
            }
        }
        function _fnSortAttachListener(settings, attachTo, colIdx, callback) {
            var col = settings.aoColumns[colIdx];
            _fnBindAction(attachTo, {}, function(e) {
                if (col.bSortable === false) {
                    return;
                }
                if (settings.oFeatures.bProcessing) {
                    _fnProcessingDisplay(settings, true);
                    setTimeout(function() {
                        _fnSortListener(settings, colIdx, e.shiftKey, callback);
                        if (_fnDataSource(settings) !== "ssp") {
                            _fnProcessingDisplay(settings, false);
                        }
                    }, 0);
                } else {
                    _fnSortListener(settings, colIdx, e.shiftKey, callback);
                }
            });
        }
        function _fnSortingClasses(settings) {
            var oldSort = settings.aLastSort;
            var sortClass = settings.oClasses.sSortColumn;
            var sort = _fnSortFlatten(settings);
            var features = settings.oFeatures;
            var i, ien, colIdx;
            if (features.bSort && features.bSortClasses) {
                for (i = 0, ien = oldSort.length; i < ien; i++) {
                    colIdx = oldSort[i].src;
                    $(_pluck(settings.aoData, "anCells", colIdx)).removeClass(sortClass + (i < 2 ? i + 1 : 3));
                }
                for (i = 0, ien = sort.length; i < ien; i++) {
                    colIdx = sort[i].src;
                    $(_pluck(settings.aoData, "anCells", colIdx)).addClass(sortClass + (i < 2 ? i + 1 : 3));
                }
            }
            settings.aLastSort = sort;
        }
        function _fnSortData(settings, idx) {
            var column = settings.aoColumns[idx];
            var customSort = DataTable.ext.order[column.sSortDataType];
            var customData;
            if (customSort) {
                customData = customSort.call(settings.oInstance, settings, idx, _fnColumnIndexToVisible(settings, idx));
            }
            var row, cellData;
            var formatter = DataTable.ext.type.order[column.sType + "-pre"];
            for (var i = 0, ien = settings.aoData.length; i < ien; i++) {
                row = settings.aoData[i];
                if (!row._aSortData) {
                    row._aSortData = [];
                }
                if (!row._aSortData[idx] || customSort) {
                    cellData = customSort ? customData[i] : _fnGetCellData(settings, i, idx, "sort");
                    row._aSortData[idx] = formatter ? formatter(cellData) : cellData;
                }
            }
        }
        function _fnSaveState(settings) {
            if (!settings.oFeatures.bStateSave || settings.bDestroying) {
                return;
            }
            var state = {
                time: +new Date(),
                start: settings._iDisplayStart,
                length: settings._iDisplayLength,
                order: $.extend(true, [], settings.aaSorting),
                search: _fnSearchToCamel(settings.oPreviousSearch),
                columns: $.map(settings.aoColumns, function(col, i) {
                    return {
                        visible: col.bVisible,
                        search: _fnSearchToCamel(settings.aoPreSearchCols[i])
                    };
                })
            };
            _fnCallbackFire(settings, "aoStateSaveParams", "stateSaveParams", [ settings, state ]);
            settings.oSavedState = state;
            settings.fnStateSaveCallback.call(settings.oInstance, settings, state);
        }
        function _fnLoadState(settings, oInit) {
            var i, ien;
            var columns = settings.aoColumns;
            if (!settings.oFeatures.bStateSave) {
                return;
            }
            var state = settings.fnStateLoadCallback.call(settings.oInstance, settings);
            if (!state || !state.time) {
                return;
            }
            var abStateLoad = _fnCallbackFire(settings, "aoStateLoadParams", "stateLoadParams", [ settings, state ]);
            if ($.inArray(false, abStateLoad) !== -1) {
                return;
            }
            var duration = settings.iStateDuration;
            if (duration > 0 && state.time < +new Date() - duration * 1e3) {
                return;
            }
            if (columns.length !== state.columns.length) {
                return;
            }
            settings.oLoadedState = $.extend(true, {}, state);
            settings._iDisplayStart = state.start;
            settings.iInitDisplayStart = state.start;
            settings._iDisplayLength = state.length;
            settings.aaSorting = [];
            $.each(state.order, function(i, col) {
                settings.aaSorting.push(col[0] >= columns.length ? [ 0, col[1] ] : col);
            });
            $.extend(settings.oPreviousSearch, _fnSearchToHung(state.search));
            for (i = 0, ien = state.columns.length; i < ien; i++) {
                var col = state.columns[i];
                columns[i].bVisible = col.visible;
                $.extend(settings.aoPreSearchCols[i], _fnSearchToHung(col.search));
            }
            _fnCallbackFire(settings, "aoStateLoaded", "stateLoaded", [ settings, state ]);
        }
        function _fnSettingsFromNode(table) {
            var settings = DataTable.settings;
            var idx = $.inArray(table, _pluck(settings, "nTable"));
            return idx !== -1 ? settings[idx] : null;
        }
        function _fnLog(settings, level, msg, tn) {
            msg = "DataTables warning: " + (settings !== null ? "table id=" + settings.sTableId + " - " : "") + msg;
            if (tn) {
                msg += ". For more information about this error, please see " + "http://datatables.net/tn/" + tn;
            }
            if (!level) {
                var ext = DataTable.ext;
                var type = ext.sErrMode || ext.errMode;
                if (type == "alert") {
                    alert(msg);
                } else {
                    throw new Error(msg);
                }
            } else if (window.console && console.log) {
                console.log(msg);
            }
        }
        function _fnMap(ret, src, name, mappedName) {
            if ($.isArray(name)) {
                $.each(name, function(i, val) {
                    if ($.isArray(val)) {
                        _fnMap(ret, src, val[0], val[1]);
                    } else {
                        _fnMap(ret, src, val);
                    }
                });
                return;
            }
            if (mappedName === undefined) {
                mappedName = name;
            }
            if (src[name] !== undefined) {
                ret[mappedName] = src[name];
            }
        }
        function _fnExtend(out, extender, breakRefs) {
            var val;
            for (var prop in extender) {
                if (extender.hasOwnProperty(prop)) {
                    val = extender[prop];
                    if ($.isPlainObject(val)) {
                        if (!$.isPlainObject(out[prop])) {
                            out[prop] = {};
                        }
                        $.extend(true, out[prop], val);
                    } else if (breakRefs && prop !== "data" && prop !== "aaData" && $.isArray(val)) {
                        out[prop] = val.slice();
                    } else {
                        out[prop] = val;
                    }
                }
            }
            return out;
        }
        function _fnBindAction(n, oData, fn) {
            $(n).bind("click.DT", oData, function(e) {
                n.blur();
                fn(e);
            }).bind("keypress.DT", oData, function(e) {
                if (e.which === 13) {
                    e.preventDefault();
                    fn(e);
                }
            }).bind("selectstart.DT", function() {
                return false;
            });
        }
        function _fnCallbackReg(oSettings, sStore, fn, sName) {
            if (fn) {
                oSettings[sStore].push({
                    fn: fn,
                    sName: sName
                });
            }
        }
        function _fnCallbackFire(settings, callbackArr, e, args) {
            var ret = [];
            if (callbackArr) {
                ret = $.map(settings[callbackArr].slice().reverse(), function(val, i) {
                    return val.fn.apply(settings.oInstance, args);
                });
            }
            if (e !== null) {
                $(settings.nTable).trigger(e + ".dt", args);
            }
            return ret;
        }
        function _fnLengthOverflow(settings) {
            var start = settings._iDisplayStart, end = settings.fnDisplayEnd(), len = settings._iDisplayLength;
            if (start >= end) {
                start = end - len;
            }
            start -= start % len;
            if (len === -1 || start < 0) {
                start = 0;
            }
            settings._iDisplayStart = start;
        }
        function _fnRenderer(settings, type) {
            var renderer = settings.renderer;
            var host = DataTable.ext.renderer[type];
            if ($.isPlainObject(renderer) && renderer[type]) {
                return host[renderer[type]] || host._;
            } else if (typeof renderer === "string") {
                return host[renderer] || host._;
            }
            return host._;
        }
        function _fnDataSource(settings) {
            if (settings.oFeatures.bServerSide) {
                return "ssp";
            } else if (settings.ajax || settings.sAjaxSource) {
                return "ajax";
            }
            return "dom";
        }
        DataTable = function(options) {
            this.$ = function(sSelector, oOpts) {
                return this.api(true).$(sSelector, oOpts);
            };
            this._ = function(sSelector, oOpts) {
                return this.api(true).rows(sSelector, oOpts).data();
            };
            this.api = function(traditional) {
                return traditional ? new _Api(_fnSettingsFromNode(this[_ext.iApiIndex])) : new _Api(this);
            };
            this.fnAddData = function(data, redraw) {
                var api = this.api(true);
                var rows = $.isArray(data) && ($.isArray(data[0]) || $.isPlainObject(data[0])) ? api.rows.add(data) : api.row.add(data);
                if (redraw === undefined || redraw) {
                    api.draw();
                }
                return rows.flatten().toArray();
            };
            this.fnAdjustColumnSizing = function(bRedraw) {
                var api = this.api(true).columns.adjust();
                var settings = api.settings()[0];
                var scroll = settings.oScroll;
                if (bRedraw === undefined || bRedraw) {
                    api.draw(false);
                } else if (scroll.sX !== "" || scroll.sY !== "") {
                    _fnScrollDraw(settings);
                }
            };
            this.fnClearTable = function(bRedraw) {
                var api = this.api(true).clear();
                if (bRedraw === undefined || bRedraw) {
                    api.draw();
                }
            };
            this.fnClose = function(nTr) {
                this.api(true).row(nTr).child.hide();
            };
            this.fnDeleteRow = function(target, callback, redraw) {
                var api = this.api(true);
                var rows = api.rows(target);
                var settings = rows.settings()[0];
                var data = settings.aoData[rows[0][0]];
                rows.remove();
                if (callback) {
                    callback.call(this, settings, data);
                }
                if (redraw === undefined || redraw) {
                    api.draw();
                }
                return data;
            };
            this.fnDestroy = function(remove) {
                this.api(true).destroy(remove);
            };
            this.fnDraw = function(complete) {
                this.api(true).draw(!complete);
            };
            this.fnFilter = function(sInput, iColumn, bRegex, bSmart, bShowGlobal, bCaseInsensitive) {
                var api = this.api(true);
                if (iColumn === null || iColumn === undefined) {
                    api.search(sInput, bRegex, bSmart, bCaseInsensitive);
                } else {
                    api.column(iColumn).search(sInput, bRegex, bSmart, bCaseInsensitive);
                }
                api.draw();
            };
            this.fnGetData = function(src, col) {
                var api = this.api(true);
                if (src !== undefined) {
                    var type = src.nodeName ? src.nodeName.toLowerCase() : "";
                    return col !== undefined || type == "td" || type == "th" ? api.cell(src, col).data() : api.row(src).data() || null;
                }
                return api.data().toArray();
            };
            this.fnGetNodes = function(iRow) {
                var api = this.api(true);
                return iRow !== undefined ? api.row(iRow).node() : api.rows().nodes().flatten().toArray();
            };
            this.fnGetPosition = function(node) {
                var api = this.api(true);
                var nodeName = node.nodeName.toUpperCase();
                if (nodeName == "TR") {
                    return api.row(node).index();
                } else if (nodeName == "TD" || nodeName == "TH") {
                    var cell = api.cell(node).index();
                    return [ cell.row, cell.columnVisible, cell.column ];
                }
                return null;
            };
            this.fnIsOpen = function(nTr) {
                return this.api(true).row(nTr).child.isShown();
            };
            this.fnOpen = function(nTr, mHtml, sClass) {
                return this.api(true).row(nTr).child(mHtml, sClass).show().child()[0];
            };
            this.fnPageChange = function(mAction, bRedraw) {
                var api = this.api(true).page(mAction);
                if (bRedraw === undefined || bRedraw) {
                    api.draw(false);
                }
            };
            this.fnSetColumnVis = function(iCol, bShow, bRedraw) {
                var api = this.api(true).column(iCol).visible(bShow);
                if (bRedraw === undefined || bRedraw) {
                    api.columns.adjust().draw();
                }
            };
            this.fnSettings = function() {
                return _fnSettingsFromNode(this[_ext.iApiIndex]);
            };
            this.fnSort = function(aaSort) {
                this.api(true).order(aaSort).draw();
            };
            this.fnSortListener = function(nNode, iColumn, fnCallback) {
                this.api(true).order.listener(nNode, iColumn, fnCallback);
            };
            this.fnUpdate = function(mData, mRow, iColumn, bRedraw, bAction) {
                var api = this.api(true);
                if (iColumn === undefined || iColumn === null) {
                    api.row(mRow).data(mData);
                } else {
                    api.cell(mRow, iColumn).data(mData);
                }
                if (bAction === undefined || bAction) {
                    api.columns.adjust();
                }
                if (bRedraw === undefined || bRedraw) {
                    api.draw();
                }
                return 0;
            };
            this.fnVersionCheck = _ext.fnVersionCheck;
            var _that = this;
            var emptyInit = options === undefined;
            var len = this.length;
            if (emptyInit) {
                options = {};
            }
            this.oApi = this.internal = _ext.internal;
            for (var fn in DataTable.ext.internal) {
                if (fn) {
                    this[fn] = _fnExternApiFunc(fn);
                }
            }
            this.each(function() {
                var o = {};
                var oInit = len > 1 ? _fnExtend(o, options, true) : options;
                var i = 0, iLen, j, jLen, k, kLen;
                var sId = this.getAttribute("id");
                var bInitHandedOff = false;
                var defaults = DataTable.defaults;
                if (this.nodeName.toLowerCase() != "table") {
                    _fnLog(null, 0, "Non-table node initialisation (" + this.nodeName + ")", 2);
                    return;
                }
                _fnCompatOpts(defaults);
                _fnCompatCols(defaults.column);
                _fnCamelToHungarian(defaults, defaults, true);
                _fnCamelToHungarian(defaults.column, defaults.column, true);
                _fnCamelToHungarian(defaults, oInit);
                var allSettings = DataTable.settings;
                for (i = 0, iLen = allSettings.length; i < iLen; i++) {
                    if (allSettings[i].nTable == this) {
                        var bRetrieve = oInit.bRetrieve !== undefined ? oInit.bRetrieve : defaults.bRetrieve;
                        var bDestroy = oInit.bDestroy !== undefined ? oInit.bDestroy : defaults.bDestroy;
                        if (emptyInit || bRetrieve) {
                            return allSettings[i].oInstance;
                        } else if (bDestroy) {
                            allSettings[i].oInstance.fnDestroy();
                            break;
                        } else {
                            _fnLog(allSettings[i], 0, "Cannot reinitialise DataTable", 3);
                            return;
                        }
                    }
                    if (allSettings[i].sTableId == this.id) {
                        allSettings.splice(i, 1);
                        break;
                    }
                }
                if (sId === null || sId === "") {
                    sId = "DataTables_Table_" + DataTable.ext._unique++;
                    this.id = sId;
                }
                var oSettings = $.extend(true, {}, DataTable.models.oSettings, {
                    nTable: this,
                    oApi: _that.internal,
                    oInit: oInit,
                    sDestroyWidth: $(this)[0].style.width,
                    sInstance: sId,
                    sTableId: sId
                });
                allSettings.push(oSettings);
                oSettings.oInstance = _that.length === 1 ? _that : $(this).dataTable();
                _fnCompatOpts(oInit);
                if (oInit.oLanguage) {
                    _fnLanguageCompat(oInit.oLanguage);
                }
                if (oInit.aLengthMenu && !oInit.iDisplayLength) {
                    oInit.iDisplayLength = $.isArray(oInit.aLengthMenu[0]) ? oInit.aLengthMenu[0][0] : oInit.aLengthMenu[0];
                }
                oInit = _fnExtend($.extend(true, {}, defaults), oInit);
                _fnMap(oSettings.oFeatures, oInit, [ "bPaginate", "bLengthChange", "bFilter", "bSort", "bSortMulti", "bInfo", "bProcessing", "bAutoWidth", "bSortClasses", "bServerSide", "bDeferRender" ]);
                _fnMap(oSettings, oInit, [ "asStripeClasses", "ajax", "fnServerData", "fnFormatNumber", "sServerMethod", "aaSorting", "aaSortingFixed", "aLengthMenu", "sPaginationType", "sAjaxSource", "sAjaxDataProp", "iStateDuration", "sDom", "bSortCellsTop", "iTabIndex", "fnStateLoadCallback", "fnStateSaveCallback", "renderer", "searchDelay", [ "iCookieDuration", "iStateDuration" ], [ "oSearch", "oPreviousSearch" ], [ "aoSearchCols", "aoPreSearchCols" ], [ "iDisplayLength", "_iDisplayLength" ], [ "bJQueryUI", "bJUI" ] ]);
                _fnMap(oSettings.oScroll, oInit, [ [ "sScrollX", "sX" ], [ "sScrollXInner", "sXInner" ], [ "sScrollY", "sY" ], [ "bScrollCollapse", "bCollapse" ] ]);
                _fnMap(oSettings.oLanguage, oInit, "fnInfoCallback");
                _fnCallbackReg(oSettings, "aoDrawCallback", oInit.fnDrawCallback, "user");
                _fnCallbackReg(oSettings, "aoServerParams", oInit.fnServerParams, "user");
                _fnCallbackReg(oSettings, "aoStateSaveParams", oInit.fnStateSaveParams, "user");
                _fnCallbackReg(oSettings, "aoStateLoadParams", oInit.fnStateLoadParams, "user");
                _fnCallbackReg(oSettings, "aoStateLoaded", oInit.fnStateLoaded, "user");
                _fnCallbackReg(oSettings, "aoRowCallback", oInit.fnRowCallback, "user");
                _fnCallbackReg(oSettings, "aoRowCreatedCallback", oInit.fnCreatedRow, "user");
                _fnCallbackReg(oSettings, "aoHeaderCallback", oInit.fnHeaderCallback, "user");
                _fnCallbackReg(oSettings, "aoFooterCallback", oInit.fnFooterCallback, "user");
                _fnCallbackReg(oSettings, "aoInitComplete", oInit.fnInitComplete, "user");
                _fnCallbackReg(oSettings, "aoPreDrawCallback", oInit.fnPreDrawCallback, "user");
                var oClasses = oSettings.oClasses;
                if (oInit.bJQueryUI) {
                    $.extend(oClasses, DataTable.ext.oJUIClasses, oInit.oClasses);
                    if (oInit.sDom === defaults.sDom && defaults.sDom === "lfrtip") {
                        oSettings.sDom = '<"H"lfr>t<"F"ip>';
                    }
                    if (!oSettings.renderer) {
                        oSettings.renderer = "jqueryui";
                    } else if ($.isPlainObject(oSettings.renderer) && !oSettings.renderer.header) {
                        oSettings.renderer.header = "jqueryui";
                    }
                } else {
                    $.extend(oClasses, DataTable.ext.classes, oInit.oClasses);
                }
                $(this).addClass(oClasses.sTable);
                if (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "") {
                    oSettings.oScroll.iBarWidth = _fnScrollBarWidth();
                }
                if (oSettings.oScroll.sX === true) {
                    oSettings.oScroll.sX = "100%";
                }
                if (oSettings.iInitDisplayStart === undefined) {
                    oSettings.iInitDisplayStart = oInit.iDisplayStart;
                    oSettings._iDisplayStart = oInit.iDisplayStart;
                }
                if (oInit.iDeferLoading !== null) {
                    oSettings.bDeferLoading = true;
                    var tmp = $.isArray(oInit.iDeferLoading);
                    oSettings._iRecordsDisplay = tmp ? oInit.iDeferLoading[0] : oInit.iDeferLoading;
                    oSettings._iRecordsTotal = tmp ? oInit.iDeferLoading[1] : oInit.iDeferLoading;
                }
                var oLanguage = oSettings.oLanguage;
                $.extend(true, oLanguage, oInit.oLanguage);
                if (oLanguage.sUrl !== "") {
                    $.ajax({
                        dataType: "json",
                        url: oLanguage.sUrl,
                        success: function(json) {
                            _fnLanguageCompat(json);
                            _fnCamelToHungarian(defaults.oLanguage, json);
                            $.extend(true, oLanguage, json);
                            _fnInitialise(oSettings);
                        },
                        error: function() {
                            _fnInitialise(oSettings);
                        }
                    });
                    bInitHandedOff = true;
                }
                if (oInit.asStripeClasses === null) {
                    oSettings.asStripeClasses = [ oClasses.sStripeOdd, oClasses.sStripeEven ];
                }
                var stripeClasses = oSettings.asStripeClasses;
                var rowOne = $("tbody tr:eq(0)", this);
                if ($.inArray(true, $.map(stripeClasses, function(el, i) {
                    return rowOne.hasClass(el);
                })) !== -1) {
                    $("tbody tr", this).removeClass(stripeClasses.join(" "));
                    oSettings.asDestroyStripes = stripeClasses.slice();
                }
                var anThs = [];
                var aoColumnsInit;
                var nThead = this.getElementsByTagName("thead");
                if (nThead.length !== 0) {
                    _fnDetectHeader(oSettings.aoHeader, nThead[0]);
                    anThs = _fnGetUniqueThs(oSettings);
                }
                if (oInit.aoColumns === null) {
                    aoColumnsInit = [];
                    for (i = 0, iLen = anThs.length; i < iLen; i++) {
                        aoColumnsInit.push(null);
                    }
                } else {
                    aoColumnsInit = oInit.aoColumns;
                }
                for (i = 0, iLen = aoColumnsInit.length; i < iLen; i++) {
                    _fnAddColumn(oSettings, anThs ? anThs[i] : null);
                }
                _fnApplyColumnDefs(oSettings, oInit.aoColumnDefs, aoColumnsInit, function(iCol, oDef) {
                    _fnColumnOptions(oSettings, iCol, oDef);
                });
                if (rowOne.length) {
                    var a = function(cell, name) {
                        return cell.getAttribute("data-" + name) ? name : null;
                    };
                    $.each(_fnGetRowElements(oSettings, rowOne[0]).cells, function(i, cell) {
                        var col = oSettings.aoColumns[i];
                        if (col.mData === i) {
                            var sort = a(cell, "sort") || a(cell, "order");
                            var filter = a(cell, "filter") || a(cell, "search");
                            if (sort !== null || filter !== null) {
                                col.mData = {
                                    _: i + ".display",
                                    sort: sort !== null ? i + ".@data-" + sort : undefined,
                                    type: sort !== null ? i + ".@data-" + sort : undefined,
                                    filter: filter !== null ? i + ".@data-" + filter : undefined
                                };
                                _fnColumnOptions(oSettings, i);
                            }
                        }
                    });
                }
                var features = oSettings.oFeatures;
                if (oInit.bStateSave) {
                    features.bStateSave = true;
                    _fnLoadState(oSettings, oInit);
                    _fnCallbackReg(oSettings, "aoDrawCallback", _fnSaveState, "state_save");
                }
                if (oInit.aaSorting === undefined) {
                    var sorting = oSettings.aaSorting;
                    for (i = 0, iLen = sorting.length; i < iLen; i++) {
                        sorting[i][1] = oSettings.aoColumns[i].asSorting[0];
                    }
                }
                _fnSortingClasses(oSettings);
                if (features.bSort) {
                    _fnCallbackReg(oSettings, "aoDrawCallback", function() {
                        if (oSettings.bSorted) {
                            var aSort = _fnSortFlatten(oSettings);
                            var sortedColumns = {};
                            $.each(aSort, function(i, val) {
                                sortedColumns[val.src] = val.dir;
                            });
                            _fnCallbackFire(oSettings, null, "order", [ oSettings, aSort, sortedColumns ]);
                            _fnSortAria(oSettings);
                        }
                    });
                }
                _fnCallbackReg(oSettings, "aoDrawCallback", function() {
                    if (oSettings.bSorted || _fnDataSource(oSettings) === "ssp" || features.bDeferRender) {
                        _fnSortingClasses(oSettings);
                    }
                }, "sc");
                _fnBrowserDetect(oSettings);
                var captions = $(this).children("caption").each(function() {
                    this._captionSide = $(this).css("caption-side");
                });
                var thead = $(this).children("thead");
                if (thead.length === 0) {
                    thead = $("<thead/>").appendTo(this);
                }
                oSettings.nTHead = thead[0];
                var tbody = $(this).children("tbody");
                if (tbody.length === 0) {
                    tbody = $("<tbody/>").appendTo(this);
                }
                oSettings.nTBody = tbody[0];
                var tfoot = $(this).children("tfoot");
                if (tfoot.length === 0 && captions.length > 0 && (oSettings.oScroll.sX !== "" || oSettings.oScroll.sY !== "")) {
                    tfoot = $("<tfoot/>").appendTo(this);
                }
                if (tfoot.length === 0 || tfoot.children().length === 0) {
                    $(this).addClass(oClasses.sNoFooter);
                } else if (tfoot.length > 0) {
                    oSettings.nTFoot = tfoot[0];
                    _fnDetectHeader(oSettings.aoFooter, oSettings.nTFoot);
                }
                if (oInit.aaData) {
                    for (i = 0; i < oInit.aaData.length; i++) {
                        _fnAddData(oSettings, oInit.aaData[i]);
                    }
                } else if (oSettings.bDeferLoading || _fnDataSource(oSettings) == "dom") {
                    _fnAddTr(oSettings, $(oSettings.nTBody).children("tr"));
                }
                oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
                oSettings.bInitialised = true;
                if (bInitHandedOff === false) {
                    _fnInitialise(oSettings);
                }
            });
            _that = null;
            return this;
        };
        var __apiStruct = [];
        var __arrayProto = Array.prototype;
        var _toSettings = function(mixed) {
            var idx, jq;
            var settings = DataTable.settings;
            var tables = $.map(settings, function(el, i) {
                return el.nTable;
            });
            if (!mixed) {
                return [];
            } else if (mixed.nTable && mixed.oApi) {
                return [ mixed ];
            } else if (mixed.nodeName && mixed.nodeName.toLowerCase() === "table") {
                idx = $.inArray(mixed, tables);
                return idx !== -1 ? [ settings[idx] ] : null;
            } else if (mixed && typeof mixed.settings === "function") {
                return mixed.settings().toArray();
            } else if (typeof mixed === "string") {
                jq = $(mixed);
            } else if (mixed instanceof $) {
                jq = mixed;
            }
            if (jq) {
                return jq.map(function(i) {
                    idx = $.inArray(this, tables);
                    return idx !== -1 ? settings[idx] : null;
                }).toArray();
            }
        };
        _Api = function(context, data) {
            if (!this instanceof _Api) {
                throw "DT API must be constructed as a new object";
            }
            var settings = [];
            var ctxSettings = function(o) {
                var a = _toSettings(o);
                if (a) {
                    settings.push.apply(settings, a);
                }
            };
            if ($.isArray(context)) {
                for (var i = 0, ien = context.length; i < ien; i++) {
                    ctxSettings(context[i]);
                }
            } else {
                ctxSettings(context);
            }
            this.context = _unique(settings);
            if (data) {
                this.push.apply(this, data.toArray ? data.toArray() : data);
            }
            this.selector = {
                rows: null,
                cols: null,
                opts: null
            };
            _Api.extend(this, this, __apiStruct);
        };
        DataTable.Api = _Api;
        _Api.prototype = {
            concat: __arrayProto.concat,
            context: [],
            each: function(fn) {
                for (var i = 0, ien = this.length; i < ien; i++) {
                    fn.call(this, this[i], i, this);
                }
                return this;
            },
            eq: function(idx) {
                var ctx = this.context;
                return ctx.length > idx ? new _Api(ctx[idx], this[idx]) : null;
            },
            filter: function(fn) {
                var a = [];
                if (__arrayProto.filter) {
                    a = __arrayProto.filter.call(this, fn, this);
                } else {
                    for (var i = 0, ien = this.length; i < ien; i++) {
                        if (fn.call(this, this[i], i, this)) {
                            a.push(this[i]);
                        }
                    }
                }
                return new _Api(this.context, a);
            },
            flatten: function() {
                var a = [];
                return new _Api(this.context, a.concat.apply(a, this.toArray()));
            },
            join: __arrayProto.join,
            indexOf: __arrayProto.indexOf || function(obj, start) {
                for (var i = start || 0, ien = this.length; i < ien; i++) {
                    if (this[i] === obj) {
                        return i;
                    }
                }
                return -1;
            },
            iterator: function(flatten, type, fn, alwaysNew) {
                var a = [], ret, i, ien, j, jen, context = this.context, rows, items, item, selector = this.selector;
                if (typeof flatten === "string") {
                    alwaysNew = fn;
                    fn = type;
                    type = flatten;
                    flatten = false;
                }
                for (i = 0, ien = context.length; i < ien; i++) {
                    var apiInst = new _Api(context[i]);
                    if (type === "table") {
                        ret = fn.call(apiInst, context[i], i);
                        if (ret !== undefined) {
                            a.push(ret);
                        }
                    } else if (type === "columns" || type === "rows") {
                        ret = fn.call(apiInst, context[i], this[i], i);
                        if (ret !== undefined) {
                            a.push(ret);
                        }
                    } else if (type === "column" || type === "column-rows" || type === "row" || type === "cell") {
                        items = this[i];
                        if (type === "column-rows") {
                            rows = _selector_row_indexes(context[i], selector.opts);
                        }
                        for (j = 0, jen = items.length; j < jen; j++) {
                            item = items[j];
                            if (type === "cell") {
                                ret = fn.call(apiInst, context[i], item.row, item.column, i, j);
                            } else {
                                ret = fn.call(apiInst, context[i], item, i, j, rows);
                            }
                            if (ret !== undefined) {
                                a.push(ret);
                            }
                        }
                    }
                }
                if (a.length || alwaysNew) {
                    var api = new _Api(context, flatten ? a.concat.apply([], a) : a);
                    var apiSelector = api.selector;
                    apiSelector.rows = selector.rows;
                    apiSelector.cols = selector.cols;
                    apiSelector.opts = selector.opts;
                    return api;
                }
                return this;
            },
            lastIndexOf: __arrayProto.lastIndexOf || function(obj, start) {
                return this.indexOf.apply(this.toArray.reverse(), arguments);
            },
            length: 0,
            map: function(fn) {
                var a = [];
                if (__arrayProto.map) {
                    a = __arrayProto.map.call(this, fn, this);
                } else {
                    for (var i = 0, ien = this.length; i < ien; i++) {
                        a.push(fn.call(this, this[i], i));
                    }
                }
                return new _Api(this.context, a);
            },
            pluck: function(prop) {
                return this.map(function(el) {
                    return el[prop];
                });
            },
            pop: __arrayProto.pop,
            push: __arrayProto.push,
            reduce: __arrayProto.reduce || function(fn, init) {
                return _fnReduce(this, fn, init, 0, this.length, 1);
            },
            reduceRight: __arrayProto.reduceRight || function(fn, init) {
                return _fnReduce(this, fn, init, this.length - 1, -1, -1);
            },
            reverse: __arrayProto.reverse,
            selector: null,
            shift: __arrayProto.shift,
            sort: __arrayProto.sort,
            splice: __arrayProto.splice,
            toArray: function() {
                return __arrayProto.slice.call(this);
            },
            to$: function() {
                return $(this);
            },
            toJQuery: function() {
                return $(this);
            },
            unique: function() {
                return new _Api(this.context, _unique(this));
            },
            unshift: __arrayProto.unshift
        };
        _Api.extend = function(scope, obj, ext) {
            if (!obj || !(obj instanceof _Api) && !obj.__dt_wrapper) {
                return;
            }
            var i, ien, j, jen, struct, inner, methodScoping = function(scope, fn, struc) {
                return function() {
                    var ret = fn.apply(scope, arguments);
                    _Api.extend(ret, ret, struc.methodExt);
                    return ret;
                };
            };
            for (i = 0, ien = ext.length; i < ien; i++) {
                struct = ext[i];
                obj[struct.name] = typeof struct.val === "function" ? methodScoping(scope, struct.val, struct) : $.isPlainObject(struct.val) ? {} : struct.val;
                obj[struct.name].__dt_wrapper = true;
                _Api.extend(scope, obj[struct.name], struct.propExt);
            }
        };
        _Api.register = _api_register = function(name, val) {
            if ($.isArray(name)) {
                for (var j = 0, jen = name.length; j < jen; j++) {
                    _Api.register(name[j], val);
                }
                return;
            }
            var i, ien, heir = name.split("."), struct = __apiStruct, key, method;
            var find = function(src, name) {
                for (var i = 0, ien = src.length; i < ien; i++) {
                    if (src[i].name === name) {
                        return src[i];
                    }
                }
                return null;
            };
            for (i = 0, ien = heir.length; i < ien; i++) {
                method = heir[i].indexOf("()") !== -1;
                key = method ? heir[i].replace("()", "") : heir[i];
                var src = find(struct, key);
                if (!src) {
                    src = {
                        name: key,
                        val: {},
                        methodExt: [],
                        propExt: []
                    };
                    struct.push(src);
                }
                if (i === ien - 1) {
                    src.val = val;
                } else {
                    struct = method ? src.methodExt : src.propExt;
                }
            }
        };
        _Api.registerPlural = _api_registerPlural = function(pluralName, singularName, val) {
            _Api.register(pluralName, val);
            _Api.register(singularName, function() {
                var ret = val.apply(this, arguments);
                if (ret === this) {
                    return this;
                } else if (ret instanceof _Api) {
                    return ret.length ? $.isArray(ret[0]) ? new _Api(ret.context, ret[0]) : ret[0] : undefined;
                }
                return ret;
            });
        };
        var __table_selector = function(selector, a) {
            if (typeof selector === "number") {
                return [ a[selector] ];
            }
            var nodes = $.map(a, function(el, i) {
                return el.nTable;
            });
            return $(nodes).filter(selector).map(function(i) {
                var idx = $.inArray(this, nodes);
                return a[idx];
            }).toArray();
        };
        _api_register("tables()", function(selector) {
            return selector ? new _Api(__table_selector(selector, this.context)) : this;
        });
        _api_register("table()", function(selector) {
            var tables = this.tables(selector);
            var ctx = tables.context;
            return ctx.length ? new _Api(ctx[0]) : tables;
        });
        _api_registerPlural("tables().nodes()", "table().node()", function() {
            return this.iterator("table", function(ctx) {
                return ctx.nTable;
            }, 1);
        });
        _api_registerPlural("tables().body()", "table().body()", function() {
            return this.iterator("table", function(ctx) {
                return ctx.nTBody;
            }, 1);
        });
        _api_registerPlural("tables().header()", "table().header()", function() {
            return this.iterator("table", function(ctx) {
                return ctx.nTHead;
            }, 1);
        });
        _api_registerPlural("tables().footer()", "table().footer()", function() {
            return this.iterator("table", function(ctx) {
                return ctx.nTFoot;
            }, 1);
        });
        _api_registerPlural("tables().containers()", "table().container()", function() {
            return this.iterator("table", function(ctx) {
                return ctx.nTableWrapper;
            }, 1);
        });
        _api_register("draw()", function(resetPaging) {
            return this.iterator("table", function(settings) {
                _fnReDraw(settings, resetPaging === false);
            });
        });
        _api_register("page()", function(action) {
            if (action === undefined) {
                return this.page.info().page;
            }
            return this.iterator("table", function(settings) {
                _fnPageChange(settings, action);
            });
        });
        _api_register("page.info()", function(action) {
            if (this.context.length === 0) {
                return undefined;
            }
            var settings = this.context[0], start = settings._iDisplayStart, len = settings._iDisplayLength, visRecords = settings.fnRecordsDisplay(), all = len === -1;
            return {
                page: all ? 0 : Math.floor(start / len),
                pages: all ? 1 : Math.ceil(visRecords / len),
                start: start,
                end: settings.fnDisplayEnd(),
                length: len,
                recordsTotal: settings.fnRecordsTotal(),
                recordsDisplay: visRecords
            };
        });
        _api_register("page.len()", function(len) {
            if (len === undefined) {
                return this.context.length !== 0 ? this.context[0]._iDisplayLength : undefined;
            }
            return this.iterator("table", function(settings) {
                _fnLengthChange(settings, len);
            });
        });
        var __reload = function(settings, holdPosition, callback) {
            if (_fnDataSource(settings) == "ssp") {
                _fnReDraw(settings, holdPosition);
            } else {
                _fnProcessingDisplay(settings, true);
                _fnBuildAjax(settings, [], function(json) {
                    _fnClearTable(settings);
                    var data = _fnAjaxDataSrc(settings, json);
                    for (var i = 0, ien = data.length; i < ien; i++) {
                        _fnAddData(settings, data[i]);
                    }
                    _fnReDraw(settings, holdPosition);
                    _fnProcessingDisplay(settings, false);
                });
            }
            if (callback) {
                var api = new _Api(settings);
                api.one("draw", function() {
                    callback(api.ajax.json());
                });
            }
        };
        _api_register("ajax.json()", function() {
            var ctx = this.context;
            if (ctx.length > 0) {
                return ctx[0].json;
            }
        });
        _api_register("ajax.params()", function() {
            var ctx = this.context;
            if (ctx.length > 0) {
                return ctx[0].oAjaxData;
            }
        });
        _api_register("ajax.reload()", function(callback, resetPaging) {
            return this.iterator("table", function(settings) {
                __reload(settings, resetPaging === false, callback);
            });
        });
        _api_register("ajax.url()", function(url) {
            var ctx = this.context;
            if (url === undefined) {
                if (ctx.length === 0) {
                    return undefined;
                }
                ctx = ctx[0];
                return ctx.ajax ? $.isPlainObject(ctx.ajax) ? ctx.ajax.url : ctx.ajax : ctx.sAjaxSource;
            }
            return this.iterator("table", function(settings) {
                if ($.isPlainObject(settings.ajax)) {
                    settings.ajax.url = url;
                } else {
                    settings.ajax = url;
                }
            });
        });
        _api_register("ajax.url().load()", function(callback, resetPaging) {
            return this.iterator("table", function(ctx) {
                __reload(ctx, resetPaging === false, callback);
            });
        });
        var _selector_run = function(selector, select) {
            var out = [], res, a, i, ien, j, jen, selectorType = typeof selector;
            if (!selector || selectorType === "string" || selectorType === "function" || selector.length === undefined) {
                selector = [ selector ];
            }
            for (i = 0, ien = selector.length; i < ien; i++) {
                a = selector[i] && selector[i].split ? selector[i].split(",") : [ selector[i] ];
                for (j = 0, jen = a.length; j < jen; j++) {
                    res = select(typeof a[j] === "string" ? $.trim(a[j]) : a[j]);
                    if (res && res.length) {
                        out.push.apply(out, res);
                    }
                }
            }
            return out;
        };
        var _selector_opts = function(opts) {
            if (!opts) {
                opts = {};
            }
            if (opts.filter && !opts.search) {
                opts.search = opts.filter;
            }
            return {
                search: opts.search || "none",
                order: opts.order || "current",
                page: opts.page || "all"
            };
        };
        var _selector_first = function(inst) {
            for (var i = 0, ien = inst.length; i < ien; i++) {
                if (inst[i].length > 0) {
                    inst[0] = inst[i];
                    inst.length = 1;
                    inst.context = [ inst.context[i] ];
                    return inst;
                }
            }
            inst.length = 0;
            return inst;
        };
        var _selector_row_indexes = function(settings, opts) {
            var i, ien, tmp, a = [], displayFiltered = settings.aiDisplay, displayMaster = settings.aiDisplayMaster;
            var search = opts.search, order = opts.order, page = opts.page;
            if (_fnDataSource(settings) == "ssp") {
                return search === "removed" ? [] : _range(0, displayMaster.length);
            } else if (page == "current") {
                for (i = settings._iDisplayStart, ien = settings.fnDisplayEnd(); i < ien; i++) {
                    a.push(displayFiltered[i]);
                }
            } else if (order == "current" || order == "applied") {
                a = search == "none" ? displayMaster.slice() : search == "applied" ? displayFiltered.slice() : $.map(displayMaster, function(el, i) {
                    return $.inArray(el, displayFiltered) === -1 ? el : null;
                });
            } else if (order == "index" || order == "original") {
                for (i = 0, ien = settings.aoData.length; i < ien; i++) {
                    if (search == "none") {
                        a.push(i);
                    } else {
                        tmp = $.inArray(i, displayFiltered);
                        if (tmp === -1 && search == "removed" || tmp >= 0 && search == "applied") {
                            a.push(i);
                        }
                    }
                }
            }
            return a;
        };
        var __row_selector = function(settings, selector, opts) {
            return _selector_run(selector, function(sel) {
                var selInt = _intVal(sel);
                var i, ien;
                if (selInt !== null && !opts) {
                    return [ selInt ];
                }
                var rows = _selector_row_indexes(settings, opts);
                if (selInt !== null && $.inArray(selInt, rows) !== -1) {
                    return [ selInt ];
                } else if (!sel) {
                    return rows;
                }
                if (typeof sel === "function") {
                    return $.map(rows, function(idx) {
                        var row = settings.aoData[idx];
                        return sel(idx, row._aData, row.nTr) ? idx : null;
                    });
                }
                var nodes = _removeEmpty(_pluck_order(settings.aoData, rows, "nTr"));
                if (sel.nodeName) {
                    if ($.inArray(sel, nodes) !== -1) {
                        return [ sel._DT_RowIndex ];
                    }
                }
                return $(nodes).filter(sel).map(function() {
                    return this._DT_RowIndex;
                }).toArray();
            });
        };
        _api_register("rows()", function(selector, opts) {
            if (selector === undefined) {
                selector = "";
            } else if ($.isPlainObject(selector)) {
                opts = selector;
                selector = "";
            }
            opts = _selector_opts(opts);
            var inst = this.iterator("table", function(settings) {
                return __row_selector(settings, selector, opts);
            }, 1);
            inst.selector.rows = selector;
            inst.selector.opts = opts;
            return inst;
        });
        _api_register("rows().nodes()", function() {
            return this.iterator("row", function(settings, row) {
                return settings.aoData[row].nTr || undefined;
            }, 1);
        });
        _api_register("rows().data()", function() {
            return this.iterator(true, "rows", function(settings, rows) {
                return _pluck_order(settings.aoData, rows, "_aData");
            }, 1);
        });
        _api_registerPlural("rows().cache()", "row().cache()", function(type) {
            return this.iterator("row", function(settings, row) {
                var r = settings.aoData[row];
                return type === "search" ? r._aFilterData : r._aSortData;
            }, 1);
        });
        _api_registerPlural("rows().invalidate()", "row().invalidate()", function(src) {
            return this.iterator("row", function(settings, row) {
                _fnInvalidate(settings, row, src);
            });
        });
        _api_registerPlural("rows().indexes()", "row().index()", function() {
            return this.iterator("row", function(settings, row) {
                return row;
            }, 1);
        });
        _api_registerPlural("rows().remove()", "row().remove()", function() {
            var that = this;
            return this.iterator("row", function(settings, row, thatIdx) {
                var data = settings.aoData;
                data.splice(row, 1);
                for (var i = 0, ien = data.length; i < ien; i++) {
                    if (data[i].nTr !== null) {
                        data[i].nTr._DT_RowIndex = i;
                    }
                }
                var displayIndex = $.inArray(row, settings.aiDisplay);
                _fnDeleteIndex(settings.aiDisplayMaster, row);
                _fnDeleteIndex(settings.aiDisplay, row);
                _fnDeleteIndex(that[thatIdx], row, false);
                _fnLengthOverflow(settings);
            });
        });
        _api_register("rows.add()", function(rows) {
            var newRows = this.iterator("table", function(settings) {
                var row, i, ien;
                var out = [];
                for (i = 0, ien = rows.length; i < ien; i++) {
                    row = rows[i];
                    if (row.nodeName && row.nodeName.toUpperCase() === "TR") {
                        out.push(_fnAddTr(settings, row)[0]);
                    } else {
                        out.push(_fnAddData(settings, row));
                    }
                }
                return out;
            }, 1);
            var modRows = this.rows(-1);
            modRows.pop();
            modRows.push.apply(modRows, newRows.toArray());
            return modRows;
        });
        _api_register("row()", function(selector, opts) {
            return _selector_first(this.rows(selector, opts));
        });
        _api_register("row().data()", function(data) {
            var ctx = this.context;
            if (data === undefined) {
                return ctx.length && this.length ? ctx[0].aoData[this[0]]._aData : undefined;
            }
            ctx[0].aoData[this[0]]._aData = data;
            _fnInvalidate(ctx[0], this[0], "data");
            return this;
        });
        _api_register("row().node()", function() {
            var ctx = this.context;
            return ctx.length && this.length ? ctx[0].aoData[this[0]].nTr || null : null;
        });
        _api_register("row.add()", function(row) {
            if (row instanceof $ && row.length) {
                row = row[0];
            }
            var rows = this.iterator("table", function(settings) {
                if (row.nodeName && row.nodeName.toUpperCase() === "TR") {
                    return _fnAddTr(settings, row)[0];
                }
                return _fnAddData(settings, row);
            });
            return this.row(rows[0]);
        });
        var __details_add = function(ctx, row, data, klass) {
            var rows = [];
            var addRow = function(r, k) {
                if (r.nodeName && r.nodeName.toLowerCase() === "tr") {
                    rows.push(r);
                } else {
                    var created = $("<tr><td/></tr>").addClass(k);
                    $("td", created).addClass(k).html(r)[0].colSpan = _fnVisbleColumns(ctx);
                    rows.push(created[0]);
                }
            };
            if ($.isArray(data) || data instanceof $) {
                for (var i = 0, ien = data.length; i < ien; i++) {
                    addRow(data[i], klass);
                }
            } else {
                addRow(data, klass);
            }
            if (row._details) {
                row._details.remove();
            }
            row._details = $(rows);
            if (row._detailsShow) {
                row._details.insertAfter(row.nTr);
            }
        };
        var __details_remove = function(api, idx) {
            var ctx = api.context;
            if (ctx.length) {
                var row = ctx[0].aoData[idx !== undefined ? idx : api[0]];
                if (row._details) {
                    row._details.remove();
                    row._detailsShow = undefined;
                    row._details = undefined;
                }
            }
        };
        var __details_display = function(api, show) {
            var ctx = api.context;
            if (ctx.length && api.length) {
                var row = ctx[0].aoData[api[0]];
                if (row._details) {
                    row._detailsShow = show;
                    if (show) {
                        row._details.insertAfter(row.nTr);
                    } else {
                        row._details.detach();
                    }
                    __details_events(ctx[0]);
                }
            }
        };
        var __details_events = function(settings) {
            var api = new _Api(settings);
            var namespace = ".dt.DT_details";
            var drawEvent = "draw" + namespace;
            var colvisEvent = "column-visibility" + namespace;
            var destroyEvent = "destroy" + namespace;
            var data = settings.aoData;
            api.off(drawEvent + " " + colvisEvent + " " + destroyEvent);
            if (_pluck(data, "_details").length > 0) {
                api.on(drawEvent, function(e, ctx) {
                    if (settings !== ctx) {
                        return;
                    }
                    api.rows({
                        page: "current"
                    }).eq(0).each(function(idx) {
                        var row = data[idx];
                        if (row._detailsShow) {
                            row._details.insertAfter(row.nTr);
                        }
                    });
                });
                api.on(colvisEvent, function(e, ctx, idx, vis) {
                    if (settings !== ctx) {
                        return;
                    }
                    var row, visible = _fnVisbleColumns(ctx);
                    for (var i = 0, ien = data.length; i < ien; i++) {
                        row = data[i];
                        if (row._details) {
                            row._details.children("td[colspan]").attr("colspan", visible);
                        }
                    }
                });
                api.on(destroyEvent, function(e, ctx) {
                    if (settings !== ctx) {
                        return;
                    }
                    for (var i = 0, ien = data.length; i < ien; i++) {
                        if (data[i]._details) {
                            __details_remove(api, i);
                        }
                    }
                });
            }
        };
        var _emp = "";
        var _child_obj = _emp + "row().child";
        var _child_mth = _child_obj + "()";
        _api_register(_child_mth, function(data, klass) {
            var ctx = this.context;
            if (data === undefined) {
                return ctx.length && this.length ? ctx[0].aoData[this[0]]._details : undefined;
            } else if (data === true) {
                this.child.show();
            } else if (data === false) {
                __details_remove(this);
            } else if (ctx.length && this.length) {
                __details_add(ctx[0], ctx[0].aoData[this[0]], data, klass);
            }
            return this;
        });
        _api_register([ _child_obj + ".show()", _child_mth + ".show()" ], function(show) {
            __details_display(this, true);
            return this;
        });
        _api_register([ _child_obj + ".hide()", _child_mth + ".hide()" ], function() {
            __details_display(this, false);
            return this;
        });
        _api_register([ _child_obj + ".remove()", _child_mth + ".remove()" ], function() {
            __details_remove(this);
            return this;
        });
        _api_register(_child_obj + ".isShown()", function() {
            var ctx = this.context;
            if (ctx.length && this.length) {
                return ctx[0].aoData[this[0]]._detailsShow || false;
            }
            return false;
        });
        var __re_column_selector = /^(.+):(name|visIdx|visible)$/;
        var __columnData = function(settings, column, r1, r2, rows) {
            var a = [];
            for (var row = 0, ien = rows.length; row < ien; row++) {
                a.push(_fnGetCellData(settings, rows[row], column));
            }
            return a;
        };
        var __column_selector = function(settings, selector, opts) {
            var columns = settings.aoColumns, names = _pluck(columns, "sName"), nodes = _pluck(columns, "nTh");
            return _selector_run(selector, function(s) {
                var selInt = _intVal(s);
                if (s === "") {
                    return _range(columns.length);
                }
                if (selInt !== null) {
                    return [ selInt >= 0 ? selInt : columns.length + selInt ];
                }
                if (typeof s === "function") {
                    var rows = _selector_row_indexes(settings, opts);
                    return $.map(columns, function(col, idx) {
                        return s(idx, __columnData(settings, idx, 0, 0, rows), nodes[idx]) ? idx : null;
                    });
                }
                var match = typeof s === "string" ? s.match(__re_column_selector) : "";
                if (match) {
                    switch (match[2]) {
                      case "visIdx":
                      case "visible":
                        var idx = parseInt(match[1], 10);
                        if (idx < 0) {
                            var visColumns = $.map(columns, function(col, i) {
                                return col.bVisible ? i : null;
                            });
                            return [ visColumns[visColumns.length + idx] ];
                        }
                        return [ _fnVisibleToColumnIndex(settings, idx) ];

                      case "name":
                        return $.map(names, function(name, i) {
                            return name === match[1] ? i : null;
                        });
                    }
                } else {
                    return $(nodes).filter(s).map(function() {
                        return $.inArray(this, nodes);
                    }).toArray();
                }
            });
        };
        var __setColumnVis = function(settings, column, vis, recalc) {
            var cols = settings.aoColumns, col = cols[column], data = settings.aoData, row, cells, i, ien, tr;
            if (vis === undefined) {
                return col.bVisible;
            }
            if (col.bVisible === vis) {
                return;
            }
            if (vis) {
                var insertBefore = $.inArray(true, _pluck(cols, "bVisible"), column + 1);
                for (i = 0, ien = data.length; i < ien; i++) {
                    tr = data[i].nTr;
                    cells = data[i].anCells;
                    if (tr) {
                        tr.insertBefore(cells[column], cells[insertBefore] || null);
                    }
                }
            } else {
                $(_pluck(settings.aoData, "anCells", column)).detach();
            }
            col.bVisible = vis;
            _fnDrawHead(settings, settings.aoHeader);
            _fnDrawHead(settings, settings.aoFooter);
            if (recalc === undefined || recalc) {
                _fnAdjustColumnSizing(settings);
                if (settings.oScroll.sX || settings.oScroll.sY) {
                    _fnScrollDraw(settings);
                }
            }
            _fnCallbackFire(settings, null, "column-visibility", [ settings, column, vis ]);
            _fnSaveState(settings);
        };
        _api_register("columns()", function(selector, opts) {
            if (selector === undefined) {
                selector = "";
            } else if ($.isPlainObject(selector)) {
                opts = selector;
                selector = "";
            }
            opts = _selector_opts(opts);
            var inst = this.iterator("table", function(settings) {
                return __column_selector(settings, selector, opts);
            }, 1);
            inst.selector.cols = selector;
            inst.selector.opts = opts;
            return inst;
        });
        _api_registerPlural("columns().header()", "column().header()", function(selector, opts) {
            return this.iterator("column", function(settings, column) {
                return settings.aoColumns[column].nTh;
            }, 1);
        });
        _api_registerPlural("columns().footer()", "column().footer()", function(selector, opts) {
            return this.iterator("column", function(settings, column) {
                return settings.aoColumns[column].nTf;
            }, 1);
        });
        _api_registerPlural("columns().data()", "column().data()", function() {
            return this.iterator("column-rows", __columnData, 1);
        });
        _api_registerPlural("columns().dataSrc()", "column().dataSrc()", function() {
            return this.iterator("column", function(settings, column) {
                return settings.aoColumns[column].mData;
            }, 1);
        });
        _api_registerPlural("columns().cache()", "column().cache()", function(type) {
            return this.iterator("column-rows", function(settings, column, i, j, rows) {
                return _pluck_order(settings.aoData, rows, type === "search" ? "_aFilterData" : "_aSortData", column);
            }, 1);
        });
        _api_registerPlural("columns().nodes()", "column().nodes()", function() {
            return this.iterator("column-rows", function(settings, column, i, j, rows) {
                return _pluck_order(settings.aoData, rows, "anCells", column);
            }, 1);
        });
        _api_registerPlural("columns().visible()", "column().visible()", function(vis, calc) {
            return this.iterator("column", function(settings, column) {
                if (vis === undefined) {
                    return settings.aoColumns[column].bVisible;
                }
                __setColumnVis(settings, column, vis, calc);
            });
        });
        _api_registerPlural("columns().indexes()", "column().index()", function(type) {
            return this.iterator("column", function(settings, column) {
                return type === "visible" ? _fnColumnIndexToVisible(settings, column) : column;
            }, 1);
        });
        _api_register("columns.adjust()", function() {
            return this.iterator("table", function(settings) {
                _fnAdjustColumnSizing(settings);
            }, 1);
        });
        _api_register("column.index()", function(type, idx) {
            if (this.context.length !== 0) {
                var ctx = this.context[0];
                if (type === "fromVisible" || type === "toData") {
                    return _fnVisibleToColumnIndex(ctx, idx);
                } else if (type === "fromData" || type === "toVisible") {
                    return _fnColumnIndexToVisible(ctx, idx);
                }
            }
        });
        _api_register("column()", function(selector, opts) {
            return _selector_first(this.columns(selector, opts));
        });
        var __cell_selector = function(settings, selector, opts) {
            var data = settings.aoData;
            var rows = _selector_row_indexes(settings, opts);
            var cells = _removeEmpty(_pluck_order(data, rows, "anCells"));
            var allCells = $([].concat.apply([], cells));
            var row;
            var columns = settings.aoColumns.length;
            var a, i, ien, j, o, host;
            return _selector_run(selector, function(s) {
                var fnSelector = typeof s === "function";
                if (s === null || s === undefined || fnSelector) {
                    a = [];
                    for (i = 0, ien = rows.length; i < ien; i++) {
                        row = rows[i];
                        for (j = 0; j < columns; j++) {
                            o = {
                                row: row,
                                column: j
                            };
                            if (fnSelector) {
                                host = settings.aoData[row];
                                if (s(o, _fnGetCellData(settings, row, j), host.anCells[j])) {
                                    a.push(o);
                                }
                            } else {
                                a.push(o);
                            }
                        }
                    }
                    return a;
                }
                if ($.isPlainObject(s)) {
                    return [ s ];
                }
                return allCells.filter(s).map(function(i, el) {
                    row = el.parentNode._DT_RowIndex;
                    return {
                        row: row,
                        column: $.inArray(el, data[row].anCells)
                    };
                }).toArray();
            });
        };
        _api_register("cells()", function(rowSelector, columnSelector, opts) {
            if ($.isPlainObject(rowSelector)) {
                if (typeof rowSelector.row !== undefined) {
                    opts = columnSelector;
                    columnSelector = null;
                } else {
                    opts = rowSelector;
                    rowSelector = null;
                }
            }
            if ($.isPlainObject(columnSelector)) {
                opts = columnSelector;
                columnSelector = null;
            }
            if (columnSelector === null || columnSelector === undefined) {
                return this.iterator("table", function(settings) {
                    return __cell_selector(settings, rowSelector, _selector_opts(opts));
                });
            }
            var columns = this.columns(columnSelector, opts);
            var rows = this.rows(rowSelector, opts);
            var a, i, ien, j, jen;
            var cells = this.iterator("table", function(settings, idx) {
                a = [];
                for (i = 0, ien = rows[idx].length; i < ien; i++) {
                    for (j = 0, jen = columns[idx].length; j < jen; j++) {
                        a.push({
                            row: rows[idx][i],
                            column: columns[idx][j]
                        });
                    }
                }
                return a;
            }, 1);
            $.extend(cells.selector, {
                cols: columnSelector,
                rows: rowSelector,
                opts: opts
            });
            return cells;
        });
        _api_registerPlural("cells().nodes()", "cell().node()", function() {
            return this.iterator("cell", function(settings, row, column) {
                var cells = settings.aoData[row].anCells;
                return cells ? cells[column] : undefined;
            }, 1);
        });
        _api_register("cells().data()", function() {
            return this.iterator("cell", function(settings, row, column) {
                return _fnGetCellData(settings, row, column);
            }, 1);
        });
        _api_registerPlural("cells().cache()", "cell().cache()", function(type) {
            type = type === "search" ? "_aFilterData" : "_aSortData";
            return this.iterator("cell", function(settings, row, column) {
                return settings.aoData[row][type][column];
            }, 1);
        });
        _api_registerPlural("cells().render()", "cell().render()", function(type) {
            return this.iterator("cell", function(settings, row, column) {
                return _fnGetCellData(settings, row, column, type);
            }, 1);
        });
        _api_registerPlural("cells().indexes()", "cell().index()", function() {
            return this.iterator("cell", function(settings, row, column) {
                return {
                    row: row,
                    column: column,
                    columnVisible: _fnColumnIndexToVisible(settings, column)
                };
            }, 1);
        });
        _api_registerPlural("cells().invalidate()", "cell().invalidate()", function(src) {
            return this.iterator("cell", function(settings, row, column) {
                _fnInvalidate(settings, row, src, column);
            });
        });
        _api_register("cell()", function(rowSelector, columnSelector, opts) {
            return _selector_first(this.cells(rowSelector, columnSelector, opts));
        });
        _api_register("cell().data()", function(data) {
            var ctx = this.context;
            var cell = this[0];
            if (data === undefined) {
                return ctx.length && cell.length ? _fnGetCellData(ctx[0], cell[0].row, cell[0].column) : undefined;
            }
            _fnSetCellData(ctx[0], cell[0].row, cell[0].column, data);
            _fnInvalidate(ctx[0], cell[0].row, "data", cell[0].column);
            return this;
        });
        _api_register("order()", function(order, dir) {
            var ctx = this.context;
            if (order === undefined) {
                return ctx.length !== 0 ? ctx[0].aaSorting : undefined;
            }
            if (typeof order === "number") {
                order = [ [ order, dir ] ];
            } else if (!$.isArray(order[0])) {
                order = Array.prototype.slice.call(arguments);
            }
            return this.iterator("table", function(settings) {
                settings.aaSorting = order.slice();
            });
        });
        _api_register("order.listener()", function(node, column, callback) {
            return this.iterator("table", function(settings) {
                _fnSortAttachListener(settings, node, column, callback);
            });
        });
        _api_register([ "columns().order()", "column().order()" ], function(dir) {
            var that = this;
            return this.iterator("table", function(settings, i) {
                var sort = [];
                $.each(that[i], function(j, col) {
                    sort.push([ col, dir ]);
                });
                settings.aaSorting = sort;
            });
        });
        _api_register("search()", function(input, regex, smart, caseInsen) {
            var ctx = this.context;
            if (input === undefined) {
                return ctx.length !== 0 ? ctx[0].oPreviousSearch.sSearch : undefined;
            }
            return this.iterator("table", function(settings) {
                if (!settings.oFeatures.bFilter) {
                    return;
                }
                _fnFilterComplete(settings, $.extend({}, settings.oPreviousSearch, {
                    sSearch: input + "",
                    bRegex: regex === null ? false : regex,
                    bSmart: smart === null ? true : smart,
                    bCaseInsensitive: caseInsen === null ? true : caseInsen
                }), 1);
            });
        });
        _api_registerPlural("columns().search()", "column().search()", function(input, regex, smart, caseInsen) {
            return this.iterator("column", function(settings, column) {
                var preSearch = settings.aoPreSearchCols;
                if (input === undefined) {
                    return preSearch[column].sSearch;
                }
                if (!settings.oFeatures.bFilter) {
                    return;
                }
                $.extend(preSearch[column], {
                    sSearch: input + "",
                    bRegex: regex === null ? false : regex,
                    bSmart: smart === null ? true : smart,
                    bCaseInsensitive: caseInsen === null ? true : caseInsen
                });
                _fnFilterComplete(settings, settings.oPreviousSearch, 1);
            });
        });
        _api_register("state()", function() {
            return this.context.length ? this.context[0].oSavedState : null;
        });
        _api_register("state.clear()", function() {
            return this.iterator("table", function(settings) {
                settings.fnStateSaveCallback.call(settings.oInstance, settings, {});
            });
        });
        _api_register("state.loaded()", function() {
            return this.context.length ? this.context[0].oLoadedState : null;
        });
        _api_register("state.save()", function() {
            return this.iterator("table", function(settings) {
                _fnSaveState(settings);
            });
        });
        DataTable.versionCheck = DataTable.fnVersionCheck = function(version) {
            var aThis = DataTable.version.split(".");
            var aThat = version.split(".");
            var iThis, iThat;
            for (var i = 0, iLen = aThat.length; i < iLen; i++) {
                iThis = parseInt(aThis[i], 10) || 0;
                iThat = parseInt(aThat[i], 10) || 0;
                if (iThis === iThat) {
                    continue;
                }
                return iThis > iThat;
            }
            return true;
        };
        DataTable.isDataTable = DataTable.fnIsDataTable = function(table) {
            var t = $(table).get(0);
            var is = false;
            $.each(DataTable.settings, function(i, o) {
                if (o.nTable === t || o.nScrollHead === t || o.nScrollFoot === t) {
                    is = true;
                }
            });
            return is;
        };
        DataTable.tables = DataTable.fnTables = function(visible) {
            return $.map(DataTable.settings, function(o) {
                if (!visible || visible && $(o.nTable).is(":visible")) {
                    return o.nTable;
                }
            });
        };
        DataTable.util = {
            throttle: _fnThrottle,
            escapeRegex: _fnEscapeRegex
        };
        DataTable.camelToHungarian = _fnCamelToHungarian;
        _api_register("$()", function(selector, opts) {
            var rows = this.rows(opts).nodes(), jqRows = $(rows);
            return $([].concat(jqRows.filter(selector).toArray(), jqRows.find(selector).toArray()));
        });
        $.each([ "on", "one", "off" ], function(i, key) {
            _api_register(key + "()", function() {
                var args = Array.prototype.slice.call(arguments);
                if (!args[0].match(/\.dt\b/)) {
                    args[0] += ".dt";
                }
                var inst = $(this.tables().nodes());
                inst[key].apply(inst, args);
                return this;
            });
        });
        _api_register("clear()", function() {
            return this.iterator("table", function(settings) {
                _fnClearTable(settings);
            });
        });
        _api_register("settings()", function() {
            return new _Api(this.context, this.context);
        });
        _api_register("data()", function() {
            return this.iterator("table", function(settings) {
                return _pluck(settings.aoData, "_aData");
            }).flatten();
        });
        _api_register("destroy()", function(remove) {
            remove = remove || false;
            return this.iterator("table", function(settings) {
                var orig = settings.nTableWrapper.parentNode;
                var classes = settings.oClasses;
                var table = settings.nTable;
                var tbody = settings.nTBody;
                var thead = settings.nTHead;
                var tfoot = settings.nTFoot;
                var jqTable = $(table);
                var jqTbody = $(tbody);
                var jqWrapper = $(settings.nTableWrapper);
                var rows = $.map(settings.aoData, function(r) {
                    return r.nTr;
                });
                var i, ien;
                settings.bDestroying = true;
                _fnCallbackFire(settings, "aoDestroyCallback", "destroy", [ settings ]);
                if (!remove) {
                    new _Api(settings).columns().visible(true);
                }
                jqWrapper.unbind(".DT").find(":not(tbody *)").unbind(".DT");
                $(window).unbind(".DT-" + settings.sInstance);
                if (table != thead.parentNode) {
                    jqTable.children("thead").detach();
                    jqTable.append(thead);
                }
                if (tfoot && table != tfoot.parentNode) {
                    jqTable.children("tfoot").detach();
                    jqTable.append(tfoot);
                }
                jqTable.detach();
                jqWrapper.detach();
                settings.aaSorting = [];
                settings.aaSortingFixed = [];
                _fnSortingClasses(settings);
                $(rows).removeClass(settings.asStripeClasses.join(" "));
                $("th, td", thead).removeClass(classes.sSortable + " " + classes.sSortableAsc + " " + classes.sSortableDesc + " " + classes.sSortableNone);
                if (settings.bJUI) {
                    $("th span." + classes.sSortIcon + ", td span." + classes.sSortIcon, thead).detach();
                    $("th, td", thead).each(function() {
                        var wrapper = $("div." + classes.sSortJUIWrapper, this);
                        $(this).append(wrapper.contents());
                        wrapper.detach();
                    });
                }
                if (!remove && orig) {
                    orig.insertBefore(table, settings.nTableReinsertBefore);
                }
                jqTbody.children().detach();
                jqTbody.append(rows);
                jqTable.css("width", settings.sDestroyWidth).removeClass(classes.sTable);
                ien = settings.asDestroyStripes.length;
                if (ien) {
                    jqTbody.children().each(function(i) {
                        $(this).addClass(settings.asDestroyStripes[i % ien]);
                    });
                }
                var idx = $.inArray(settings, DataTable.settings);
                if (idx !== -1) {
                    DataTable.settings.splice(idx, 1);
                }
            });
        });
        DataTable.version = "1.10.4";
        DataTable.settings = [];
        DataTable.models = {};
        DataTable.models.oSearch = {
            bCaseInsensitive: true,
            sSearch: "",
            bRegex: false,
            bSmart: true
        };
        DataTable.models.oRow = {
            nTr: null,
            anCells: null,
            _aData: [],
            _aSortData: null,
            _aFilterData: null,
            _sFilterRow: null,
            _sRowStripe: "",
            src: null
        };
        DataTable.models.oColumn = {
            idx: null,
            aDataSort: null,
            asSorting: null,
            bSearchable: null,
            bSortable: null,
            bVisible: null,
            _sManualType: null,
            _bAttrSrc: false,
            fnCreatedCell: null,
            fnGetData: null,
            fnSetData: null,
            mData: null,
            mRender: null,
            nTh: null,
            nTf: null,
            sClass: null,
            sContentPadding: null,
            sDefaultContent: null,
            sName: null,
            sSortDataType: "std",
            sSortingClass: null,
            sSortingClassJUI: null,
            sTitle: null,
            sType: null,
            sWidth: null,
            sWidthOrig: null
        };
        DataTable.defaults = {
            aaData: null,
            aaSorting: [ [ 0, "asc" ] ],
            aaSortingFixed: [],
            ajax: null,
            aLengthMenu: [ 10, 25, 50, 100 ],
            aoColumns: null,
            aoColumnDefs: null,
            aoSearchCols: [],
            asStripeClasses: null,
            bAutoWidth: true,
            bDeferRender: false,
            bDestroy: false,
            bFilter: true,
            bInfo: true,
            bJQueryUI: false,
            bLengthChange: true,
            bPaginate: true,
            bProcessing: false,
            bRetrieve: false,
            bScrollCollapse: false,
            bServerSide: false,
            bSort: true,
            bSortMulti: true,
            bSortCellsTop: false,
            bSortClasses: true,
            bStateSave: false,
            fnCreatedRow: null,
            fnDrawCallback: null,
            fnFooterCallback: null,
            fnFormatNumber: function(toFormat) {
                return toFormat.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.oLanguage.sThousands);
            },
            fnHeaderCallback: null,
            fnInfoCallback: null,
            fnInitComplete: null,
            fnPreDrawCallback: null,
            fnRowCallback: null,
            fnServerData: null,
            fnServerParams: null,
            fnStateLoadCallback: function(settings) {
                try {
                    return JSON.parse((settings.iStateDuration === -1 ? sessionStorage : localStorage).getItem("DataTables_" + settings.sInstance + "_" + location.pathname));
                } catch (e) {}
            },
            fnStateLoadParams: null,
            fnStateLoaded: null,
            fnStateSaveCallback: function(settings, data) {
                try {
                    (settings.iStateDuration === -1 ? sessionStorage : localStorage).setItem("DataTables_" + settings.sInstance + "_" + location.pathname, JSON.stringify(data));
                } catch (e) {}
            },
            fnStateSaveParams: null,
            iStateDuration: 7200,
            iDeferLoading: null,
            iDisplayLength: 10,
            iDisplayStart: 0,
            iTabIndex: 0,
            oClasses: {},
            oLanguage: {
                oAria: {
                    sSortAscending: ": activate to sort column ascending",
                    sSortDescending: ": activate to sort column descending"
                },
                oPaginate: {
                    sFirst: "First",
                    sLast: "Last",
                    sNext: "Next",
                    sPrevious: "Previous"
                },
                sEmptyTable: "No data available in table",
                sInfo: "Showing _START_ to _END_ of _TOTAL_ entries",
                sInfoEmpty: "Showing 0 to 0 of 0 entries",
                sInfoFiltered: "(filtered from _MAX_ total entries)",
                sInfoPostFix: "",
                sDecimal: "",
                sThousands: ",",
                sLengthMenu: "Show _MENU_ entries",
                sLoadingRecords: "Loading...",
                sProcessing: "Processing...",
                sSearch: "Search:",
                sSearchPlaceholder: "",
                sUrl: "",
                sZeroRecords: "No matching records found"
            },
            oSearch: $.extend({}, DataTable.models.oSearch),
            sAjaxDataProp: "data",
            sAjaxSource: null,
            sDom: "lfrtip",
            searchDelay: null,
            sPaginationType: "simple_numbers",
            sScrollX: "",
            sScrollXInner: "",
            sScrollY: "",
            sServerMethod: "GET",
            renderer: null
        };
        _fnHungarianMap(DataTable.defaults);
        DataTable.defaults.column = {
            aDataSort: null,
            iDataSort: -1,
            asSorting: [ "asc", "desc" ],
            bSearchable: true,
            bSortable: true,
            bVisible: true,
            fnCreatedCell: null,
            mData: null,
            mRender: null,
            sCellType: "td",
            sClass: "",
            sContentPadding: "",
            sDefaultContent: null,
            sName: "",
            sSortDataType: "std",
            sTitle: null,
            sType: null,
            sWidth: null
        };
        _fnHungarianMap(DataTable.defaults.column);
        DataTable.models.oSettings = {
            oFeatures: {
                bAutoWidth: null,
                bDeferRender: null,
                bFilter: null,
                bInfo: null,
                bLengthChange: null,
                bPaginate: null,
                bProcessing: null,
                bServerSide: null,
                bSort: null,
                bSortMulti: null,
                bSortClasses: null,
                bStateSave: null
            },
            oScroll: {
                bCollapse: null,
                iBarWidth: 0,
                sX: null,
                sXInner: null,
                sY: null
            },
            oLanguage: {
                fnInfoCallback: null
            },
            oBrowser: {
                bScrollOversize: false,
                bScrollbarLeft: false
            },
            ajax: null,
            aanFeatures: [],
            aoData: [],
            aiDisplay: [],
            aiDisplayMaster: [],
            aoColumns: [],
            aoHeader: [],
            aoFooter: [],
            oPreviousSearch: {},
            aoPreSearchCols: [],
            aaSorting: null,
            aaSortingFixed: [],
            asStripeClasses: null,
            asDestroyStripes: [],
            sDestroyWidth: 0,
            aoRowCallback: [],
            aoHeaderCallback: [],
            aoFooterCallback: [],
            aoDrawCallback: [],
            aoRowCreatedCallback: [],
            aoPreDrawCallback: [],
            aoInitComplete: [],
            aoStateSaveParams: [],
            aoStateLoadParams: [],
            aoStateLoaded: [],
            sTableId: "",
            nTable: null,
            nTHead: null,
            nTFoot: null,
            nTBody: null,
            nTableWrapper: null,
            bDeferLoading: false,
            bInitialised: false,
            aoOpenRows: [],
            sDom: null,
            searchDelay: null,
            sPaginationType: "two_button",
            iStateDuration: 0,
            aoStateSave: [],
            aoStateLoad: [],
            oSavedState: null,
            oLoadedState: null,
            sAjaxSource: null,
            sAjaxDataProp: null,
            bAjaxDataGet: true,
            jqXHR: null,
            json: undefined,
            oAjaxData: undefined,
            fnServerData: null,
            aoServerParams: [],
            sServerMethod: null,
            fnFormatNumber: null,
            aLengthMenu: null,
            iDraw: 0,
            bDrawing: false,
            iDrawError: -1,
            _iDisplayLength: 10,
            _iDisplayStart: 0,
            _iRecordsTotal: 0,
            _iRecordsDisplay: 0,
            bJUI: null,
            oClasses: {},
            bFiltered: false,
            bSorted: false,
            bSortCellsTop: null,
            oInit: null,
            aoDestroyCallback: [],
            fnRecordsTotal: function() {
                return _fnDataSource(this) == "ssp" ? this._iRecordsTotal * 1 : this.aiDisplayMaster.length;
            },
            fnRecordsDisplay: function() {
                return _fnDataSource(this) == "ssp" ? this._iRecordsDisplay * 1 : this.aiDisplay.length;
            },
            fnDisplayEnd: function() {
                var len = this._iDisplayLength, start = this._iDisplayStart, calc = start + len, records = this.aiDisplay.length, features = this.oFeatures, paginate = features.bPaginate;
                if (features.bServerSide) {
                    return paginate === false || len === -1 ? start + records : Math.min(start + len, this._iRecordsDisplay);
                } else {
                    return !paginate || calc > records || len === -1 ? records : calc;
                }
            },
            oInstance: null,
            sInstance: null,
            iTabIndex: 0,
            nScrollHead: null,
            nScrollFoot: null,
            aLastSort: [],
            oPlugins: {}
        };
        DataTable.ext = _ext = {
            classes: {},
            errMode: "alert",
            feature: [],
            search: [],
            internal: {},
            legacy: {
                ajax: null
            },
            pager: {},
            renderer: {
                pageButton: {},
                header: {}
            },
            order: {},
            type: {
                detect: [],
                search: {},
                order: {}
            },
            _unique: 0,
            fnVersionCheck: DataTable.fnVersionCheck,
            iApiIndex: 0,
            oJUIClasses: {},
            sVersion: DataTable.version
        };
        $.extend(_ext, {
            afnFiltering: _ext.search,
            aTypes: _ext.type.detect,
            ofnSearch: _ext.type.search,
            oSort: _ext.type.order,
            afnSortData: _ext.order,
            aoFeatures: _ext.feature,
            oApi: _ext.internal,
            oStdClasses: _ext.classes,
            oPagination: _ext.pager
        });
        $.extend(DataTable.ext.classes, {
            sTable: "dataTable",
            sNoFooter: "no-footer",
            sPageButton: "paginate_button",
            sPageButtonActive: "current",
            sPageButtonDisabled: "disabled",
            sStripeOdd: "odd",
            sStripeEven: "even",
            sRowEmpty: "dataTables_empty",
            sWrapper: "dataTables_wrapper",
            sFilter: "dataTables_filter",
            sInfo: "dataTables_info",
            sPaging: "dataTables_paginate paging_",
            sLength: "dataTables_length",
            sProcessing: "dataTables_processing",
            sSortAsc: "sorting_asc",
            sSortDesc: "sorting_desc",
            sSortable: "sorting",
            sSortableAsc: "sorting_asc_disabled",
            sSortableDesc: "sorting_desc_disabled",
            sSortableNone: "sorting_disabled",
            sSortColumn: "sorting_",
            sFilterInput: "",
            sLengthSelect: "",
            sScrollWrapper: "dataTables_scroll",
            sScrollHead: "dataTables_scrollHead",
            sScrollHeadInner: "dataTables_scrollHeadInner",
            sScrollBody: "dataTables_scrollBody",
            sScrollFoot: "dataTables_scrollFoot",
            sScrollFootInner: "dataTables_scrollFootInner",
            sHeaderTH: "",
            sFooterTH: "",
            sSortJUIAsc: "",
            sSortJUIDesc: "",
            sSortJUI: "",
            sSortJUIAscAllowed: "",
            sSortJUIDescAllowed: "",
            sSortJUIWrapper: "",
            sSortIcon: "",
            sJUIHeader: "",
            sJUIFooter: ""
        });
        (function() {
            var _empty = "";
            _empty = "";
            var _stateDefault = _empty + "ui-state-default";
            var _sortIcon = _empty + "css_right ui-icon ui-icon-";
            var _headerFooter = _empty + "fg-toolbar ui-toolbar ui-widget-header ui-helper-clearfix";
            $.extend(DataTable.ext.oJUIClasses, DataTable.ext.classes, {
                sPageButton: "fg-button ui-button " + _stateDefault,
                sPageButtonActive: "ui-state-disabled",
                sPageButtonDisabled: "ui-state-disabled",
                sPaging: "dataTables_paginate fg-buttonset ui-buttonset fg-buttonset-multi " + "ui-buttonset-multi paging_",
                sSortAsc: _stateDefault + " sorting_asc",
                sSortDesc: _stateDefault + " sorting_desc",
                sSortable: _stateDefault + " sorting",
                sSortableAsc: _stateDefault + " sorting_asc_disabled",
                sSortableDesc: _stateDefault + " sorting_desc_disabled",
                sSortableNone: _stateDefault + " sorting_disabled",
                sSortJUIAsc: _sortIcon + "triangle-1-n",
                sSortJUIDesc: _sortIcon + "triangle-1-s",
                sSortJUI: _sortIcon + "carat-2-n-s",
                sSortJUIAscAllowed: _sortIcon + "carat-1-n",
                sSortJUIDescAllowed: _sortIcon + "carat-1-s",
                sSortJUIWrapper: "DataTables_sort_wrapper",
                sSortIcon: "DataTables_sort_icon",
                sScrollHead: "dataTables_scrollHead " + _stateDefault,
                sScrollFoot: "dataTables_scrollFoot " + _stateDefault,
                sHeaderTH: _stateDefault,
                sFooterTH: _stateDefault,
                sJUIHeader: _headerFooter + " ui-corner-tl ui-corner-tr",
                sJUIFooter: _headerFooter + " ui-corner-bl ui-corner-br"
            });
        })();
        var extPagination = DataTable.ext.pager;
        function _numbers(page, pages) {
            var numbers = [], buttons = extPagination.numbers_length, half = Math.floor(buttons / 2), i = 1;
            if (pages <= buttons) {
                numbers = _range(0, pages);
            } else if (page <= half) {
                numbers = _range(0, buttons - 2);
                numbers.push("ellipsis");
                numbers.push(pages - 1);
            } else if (page >= pages - 1 - half) {
                numbers = _range(pages - (buttons - 2), pages);
                numbers.splice(0, 0, "ellipsis");
                numbers.splice(0, 0, 0);
            } else {
                numbers = _range(page - 1, page + 2);
                numbers.push("ellipsis");
                numbers.push(pages - 1);
                numbers.splice(0, 0, "ellipsis");
                numbers.splice(0, 0, 0);
            }
            numbers.DT_el = "span";
            return numbers;
        }
        $.extend(extPagination, {
            simple: function(page, pages) {
                return [ "previous", "next" ];
            },
            full: function(page, pages) {
                return [ "first", "previous", "next", "last" ];
            },
            simple_numbers: function(page, pages) {
                return [ "previous", _numbers(page, pages), "next" ];
            },
            full_numbers: function(page, pages) {
                return [ "first", "previous", _numbers(page, pages), "next", "last" ];
            },
            _numbers: _numbers,
            numbers_length: 7
        });
        $.extend(true, DataTable.ext.renderer, {
            pageButton: {
                _: function(settings, host, idx, buttons, page, pages) {
                    var classes = settings.oClasses;
                    var lang = settings.oLanguage.oPaginate;
                    var btnDisplay, btnClass, counter = 0;
                    var attach = function(container, buttons) {
                        var i, ien, node, button;
                        var clickHandler = function(e) {
                            _fnPageChange(settings, e.data.action, true);
                        };
                        for (i = 0, ien = buttons.length; i < ien; i++) {
                            button = buttons[i];
                            if ($.isArray(button)) {
                                var inner = $("<" + (button.DT_el || "div") + "/>").appendTo(container);
                                attach(inner, button);
                            } else {
                                btnDisplay = "";
                                btnClass = "";
                                switch (button) {
                                  case "ellipsis":
                                    container.append("<span>&hellip;</span>");
                                    break;

                                  case "first":
                                    btnDisplay = lang.sFirst;
                                    btnClass = button + (page > 0 ? "" : " " + classes.sPageButtonDisabled);
                                    break;

                                  case "previous":
                                    btnDisplay = lang.sPrevious;
                                    btnClass = button + (page > 0 ? "" : " " + classes.sPageButtonDisabled);
                                    break;

                                  case "next":
                                    btnDisplay = lang.sNext;
                                    btnClass = button + (page < pages - 1 ? "" : " " + classes.sPageButtonDisabled);
                                    break;

                                  case "last":
                                    btnDisplay = lang.sLast;
                                    btnClass = button + (page < pages - 1 ? "" : " " + classes.sPageButtonDisabled);
                                    break;

                                  default:
                                    btnDisplay = button + 1;
                                    btnClass = page === button ? classes.sPageButtonActive : "";
                                    break;
                                }
                                if (btnDisplay) {
                                    node = $("<a>", {
                                        "class": classes.sPageButton + " " + btnClass,
                                        "aria-controls": settings.sTableId,
                                        "data-dt-idx": counter,
                                        tabindex: settings.iTabIndex,
                                        id: idx === 0 && typeof button === "string" ? settings.sTableId + "_" + button : null
                                    }).html(btnDisplay).appendTo(container);
                                    _fnBindAction(node, {
                                        action: button
                                    }, clickHandler);
                                    counter++;
                                }
                            }
                        }
                    };
                    try {
                        var activeEl = $(document.activeElement).data("dt-idx");
                        attach($(host).empty(), buttons);
                        if (activeEl !== null) {
                            $(host).find("[data-dt-idx=" + activeEl + "]").focus();
                        }
                    } catch (e) {}
                }
            }
        });
        $.extend(DataTable.ext.type.detect, [ function(d, settings) {
            var decimal = settings.oLanguage.sDecimal;
            return _isNumber(d, decimal) ? "num" + decimal : null;
        }, function(d, settings) {
            if (d && !(d instanceof Date) && (!_re_date_start.test(d) || !_re_date_end.test(d))) {
                return null;
            }
            var parsed = Date.parse(d);
            return parsed !== null && !isNaN(parsed) || _empty(d) ? "date" : null;
        }, function(d, settings) {
            var decimal = settings.oLanguage.sDecimal;
            return _isNumber(d, decimal, true) ? "num-fmt" + decimal : null;
        }, function(d, settings) {
            var decimal = settings.oLanguage.sDecimal;
            return _htmlNumeric(d, decimal) ? "html-num" + decimal : null;
        }, function(d, settings) {
            var decimal = settings.oLanguage.sDecimal;
            return _htmlNumeric(d, decimal, true) ? "html-num-fmt" + decimal : null;
        }, function(d, settings) {
            return _empty(d) || typeof d === "string" && d.indexOf("<") !== -1 ? "html" : null;
        } ]);
        $.extend(DataTable.ext.type.search, {
            html: function(data) {
                return _empty(data) ? data : typeof data === "string" ? data.replace(_re_new_lines, " ").replace(_re_html, "") : "";
            },
            string: function(data) {
                return _empty(data) ? data : typeof data === "string" ? data.replace(_re_new_lines, " ") : data;
            }
        });
        var __numericReplace = function(d, decimalPlace, re1, re2) {
            if (d !== 0 && (!d || d === "-")) {
                return -Infinity;
            }
            if (decimalPlace) {
                d = _numToDecimal(d, decimalPlace);
            }
            if (d.replace) {
                if (re1) {
                    d = d.replace(re1, "");
                }
                if (re2) {
                    d = d.replace(re2, "");
                }
            }
            return d * 1;
        };
        function _addNumericSort(decimalPlace) {
            $.each({
                num: function(d) {
                    return __numericReplace(d, decimalPlace);
                },
                "num-fmt": function(d) {
                    return __numericReplace(d, decimalPlace, _re_formatted_numeric);
                },
                "html-num": function(d) {
                    return __numericReplace(d, decimalPlace, _re_html);
                },
                "html-num-fmt": function(d) {
                    return __numericReplace(d, decimalPlace, _re_html, _re_formatted_numeric);
                }
            }, function(key, fn) {
                _ext.type.order[key + decimalPlace + "-pre"] = fn;
                if (key.match(/^html\-/)) {
                    _ext.type.search[key + decimalPlace] = _ext.type.search.html;
                }
            });
        }
        $.extend(_ext.type.order, {
            "date-pre": function(d) {
                return Date.parse(d) || 0;
            },
            "html-pre": function(a) {
                return _empty(a) ? "" : a.replace ? a.replace(/<.*?>/g, "").toLowerCase() : a + "";
            },
            "string-pre": function(a) {
                return _empty(a) ? "" : typeof a === "string" ? a.toLowerCase() : !a.toString ? "" : a.toString();
            },
            "string-asc": function(x, y) {
                return x < y ? -1 : x > y ? 1 : 0;
            },
            "string-desc": function(x, y) {
                return x < y ? 1 : x > y ? -1 : 0;
            }
        });
        _addNumericSort("");
        $.extend(true, DataTable.ext.renderer, {
            header: {
                _: function(settings, cell, column, classes) {
                    $(settings.nTable).on("order.dt.DT", function(e, ctx, sorting, columns) {
                        if (settings !== ctx) {
                            return;
                        }
                        var colIdx = column.idx;
                        cell.removeClass(column.sSortingClass + " " + classes.sSortAsc + " " + classes.sSortDesc).addClass(columns[colIdx] == "asc" ? classes.sSortAsc : columns[colIdx] == "desc" ? classes.sSortDesc : column.sSortingClass);
                    });
                },
                jqueryui: function(settings, cell, column, classes) {
                    $("<div/>").addClass(classes.sSortJUIWrapper).append(cell.contents()).append($("<span/>").addClass(classes.sSortIcon + " " + column.sSortingClassJUI)).appendTo(cell);
                    $(settings.nTable).on("order.dt.DT", function(e, ctx, sorting, columns) {
                        if (settings !== ctx) {
                            return;
                        }
                        var colIdx = column.idx;
                        cell.removeClass(classes.sSortAsc + " " + classes.sSortDesc).addClass(columns[colIdx] == "asc" ? classes.sSortAsc : columns[colIdx] == "desc" ? classes.sSortDesc : column.sSortingClass);
                        cell.find("span." + classes.sSortIcon).removeClass(classes.sSortJUIAsc + " " + classes.sSortJUIDesc + " " + classes.sSortJUI + " " + classes.sSortJUIAscAllowed + " " + classes.sSortJUIDescAllowed).addClass(columns[colIdx] == "asc" ? classes.sSortJUIAsc : columns[colIdx] == "desc" ? classes.sSortJUIDesc : column.sSortingClassJUI);
                    });
                }
            }
        });
        DataTable.render = {
            number: function(thousands, decimal, precision, prefix) {
                return {
                    display: function(d) {
                        var negative = d < 0 ? "-" : "";
                        d = Math.abs(parseFloat(d));
                        var intPart = parseInt(d, 10);
                        var floatPart = precision ? decimal + (d - intPart).toFixed(precision).substring(2) : "";
                        return negative + (prefix || "") + intPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, thousands) + floatPart;
                    }
                };
            }
        };
        function _fnExternApiFunc(fn) {
            return function() {
                var args = [ _fnSettingsFromNode(this[DataTable.ext.iApiIndex]) ].concat(Array.prototype.slice.call(arguments));
                return DataTable.ext.internal[fn].apply(this, args);
            };
        }
        $.extend(DataTable.ext.internal, {
            _fnExternApiFunc: _fnExternApiFunc,
            _fnBuildAjax: _fnBuildAjax,
            _fnAjaxUpdate: _fnAjaxUpdate,
            _fnAjaxParameters: _fnAjaxParameters,
            _fnAjaxUpdateDraw: _fnAjaxUpdateDraw,
            _fnAjaxDataSrc: _fnAjaxDataSrc,
            _fnAddColumn: _fnAddColumn,
            _fnColumnOptions: _fnColumnOptions,
            _fnAdjustColumnSizing: _fnAdjustColumnSizing,
            _fnVisibleToColumnIndex: _fnVisibleToColumnIndex,
            _fnColumnIndexToVisible: _fnColumnIndexToVisible,
            _fnVisbleColumns: _fnVisbleColumns,
            _fnGetColumns: _fnGetColumns,
            _fnColumnTypes: _fnColumnTypes,
            _fnApplyColumnDefs: _fnApplyColumnDefs,
            _fnHungarianMap: _fnHungarianMap,
            _fnCamelToHungarian: _fnCamelToHungarian,
            _fnLanguageCompat: _fnLanguageCompat,
            _fnBrowserDetect: _fnBrowserDetect,
            _fnAddData: _fnAddData,
            _fnAddTr: _fnAddTr,
            _fnNodeToDataIndex: _fnNodeToDataIndex,
            _fnNodeToColumnIndex: _fnNodeToColumnIndex,
            _fnGetCellData: _fnGetCellData,
            _fnSetCellData: _fnSetCellData,
            _fnSplitObjNotation: _fnSplitObjNotation,
            _fnGetObjectDataFn: _fnGetObjectDataFn,
            _fnSetObjectDataFn: _fnSetObjectDataFn,
            _fnGetDataMaster: _fnGetDataMaster,
            _fnClearTable: _fnClearTable,
            _fnDeleteIndex: _fnDeleteIndex,
            _fnInvalidate: _fnInvalidate,
            _fnGetRowElements: _fnGetRowElements,
            _fnCreateTr: _fnCreateTr,
            _fnBuildHead: _fnBuildHead,
            _fnDrawHead: _fnDrawHead,
            _fnDraw: _fnDraw,
            _fnReDraw: _fnReDraw,
            _fnAddOptionsHtml: _fnAddOptionsHtml,
            _fnDetectHeader: _fnDetectHeader,
            _fnGetUniqueThs: _fnGetUniqueThs,
            _fnFeatureHtmlFilter: _fnFeatureHtmlFilter,
            _fnFilterComplete: _fnFilterComplete,
            _fnFilterCustom: _fnFilterCustom,
            _fnFilterColumn: _fnFilterColumn,
            _fnFilter: _fnFilter,
            _fnFilterCreateSearch: _fnFilterCreateSearch,
            _fnEscapeRegex: _fnEscapeRegex,
            _fnFilterData: _fnFilterData,
            _fnFeatureHtmlInfo: _fnFeatureHtmlInfo,
            _fnUpdateInfo: _fnUpdateInfo,
            _fnInfoMacros: _fnInfoMacros,
            _fnInitialise: _fnInitialise,
            _fnInitComplete: _fnInitComplete,
            _fnLengthChange: _fnLengthChange,
            _fnFeatureHtmlLength: _fnFeatureHtmlLength,
            _fnFeatureHtmlPaginate: _fnFeatureHtmlPaginate,
            _fnPageChange: _fnPageChange,
            _fnFeatureHtmlProcessing: _fnFeatureHtmlProcessing,
            _fnProcessingDisplay: _fnProcessingDisplay,
            _fnFeatureHtmlTable: _fnFeatureHtmlTable,
            _fnScrollDraw: _fnScrollDraw,
            _fnApplyToChildren: _fnApplyToChildren,
            _fnCalculateColumnWidths: _fnCalculateColumnWidths,
            _fnThrottle: _fnThrottle,
            _fnConvertToWidth: _fnConvertToWidth,
            _fnScrollingWidthAdjust: _fnScrollingWidthAdjust,
            _fnGetWidestNode: _fnGetWidestNode,
            _fnGetMaxLenString: _fnGetMaxLenString,
            _fnStringToCss: _fnStringToCss,
            _fnScrollBarWidth: _fnScrollBarWidth,
            _fnSortFlatten: _fnSortFlatten,
            _fnSort: _fnSort,
            _fnSortAria: _fnSortAria,
            _fnSortListener: _fnSortListener,
            _fnSortAttachListener: _fnSortAttachListener,
            _fnSortingClasses: _fnSortingClasses,
            _fnSortData: _fnSortData,
            _fnSaveState: _fnSaveState,
            _fnLoadState: _fnLoadState,
            _fnSettingsFromNode: _fnSettingsFromNode,
            _fnLog: _fnLog,
            _fnMap: _fnMap,
            _fnBindAction: _fnBindAction,
            _fnCallbackReg: _fnCallbackReg,
            _fnCallbackFire: _fnCallbackFire,
            _fnLengthOverflow: _fnLengthOverflow,
            _fnRenderer: _fnRenderer,
            _fnDataSource: _fnDataSource,
            _fnRowAttributes: _fnRowAttributes,
            _fnCalculateEnd: function() {}
        });
        $.fn.dataTable = DataTable;
        $.fn.dataTableSettings = DataTable.settings;
        $.fn.dataTableExt = DataTable.ext;
        $.fn.DataTable = function(opts) {
            return $(this).dataTable(opts).api();
        };
        $.each(DataTable, function(prop, val) {
            $.fn.DataTable[prop] = val;
        });
        return $.fn.dataTable;
    });
})(window, document);

(function(window, document, undefined) {
    var factory = function($, DataTable) {
        "use strict";
        var ColVis = function(oDTSettings, oInit) {
            if (!this.CLASS || this.CLASS != "ColVis") {
                alert("Warning: ColVis must be initialised with the keyword 'new'");
            }
            if (typeof oInit == "undefined") {
                oInit = {};
            }
            if ($.fn.dataTable.camelToHungarian) {
                $.fn.dataTable.camelToHungarian(ColVis.defaults, oInit);
            }
            this.s = {
                dt: null,
                oInit: oInit,
                hidden: true,
                abOriginal: []
            };
            this.dom = {
                wrapper: null,
                button: null,
                collection: null,
                background: null,
                catcher: null,
                buttons: [],
                groupButtons: [],
                restore: null
            };
            ColVis.aInstances.push(this);
            this.s.dt = $.fn.dataTable.Api ? new $.fn.dataTable.Api(oDTSettings).settings()[0] : oDTSettings;
            this._fnConstruct(oInit);
            return this;
        };
        ColVis.prototype = {
            button: function() {
                return this.dom.wrapper;
            },
            fnRebuild: function() {
                this.rebuild();
            },
            rebuild: function() {
                for (var i = this.dom.buttons.length - 1; i >= 0; i--) {
                    this.dom.collection.removeChild(this.dom.buttons[i]);
                }
                this.dom.buttons.splice(0, this.dom.buttons.length);
                if (this.dom.restore) {
                    this.dom.restore.parentNode(this.dom.restore);
                }
                this._fnAddGroups();
                this._fnAddButtons();
                this._fnDrawCallback();
            },
            _fnConstruct: function(init) {
                this._fnApplyCustomisation(init);
                var that = this;
                var i, iLen;
                this.dom.wrapper = document.createElement("div");
                this.dom.wrapper.className = "ColVis";
                this.dom.button = $("<button />", {
                    "class": !this.s.dt.bJUI ? "ColVis_Button ColVis_MasterButton" : "ColVis_Button ColVis_MasterButton ui-button ui-state-default"
                }).append("<span>" + this.s.buttonText + "</span>").bind(this.s.activate == "mouseover" ? "mouseover" : "click", function(e) {
                    e.preventDefault();
                    that._fnCollectionShow();
                }).appendTo(this.dom.wrapper)[0];
                this.dom.catcher = this._fnDomCatcher();
                this.dom.collection = this._fnDomCollection();
                this.dom.background = this._fnDomBackground();
                this._fnAddGroups();
                this._fnAddButtons();
                for (i = 0, iLen = this.s.dt.aoColumns.length; i < iLen; i++) {
                    this.s.abOriginal.push(this.s.dt.aoColumns[i].bVisible);
                }
                this.s.dt.aoDrawCallback.push({
                    fn: function() {
                        that._fnDrawCallback.call(that);
                    },
                    sName: "ColVis"
                });
                $(this.s.dt.oInstance).bind("column-reorder", function(e, oSettings, oReorder) {
                    for (i = 0, iLen = that.s.aiExclude.length; i < iLen; i++) {
                        that.s.aiExclude[i] = oReorder.aiInvertMapping[that.s.aiExclude[i]];
                    }
                    var mStore = that.s.abOriginal.splice(oReorder.iFrom, 1)[0];
                    that.s.abOriginal.splice(oReorder.iTo, 0, mStore);
                    that.fnRebuild();
                });
                this._fnDrawCallback();
            },
            _fnApplyCustomisation: function(init) {
                $.extend(true, this.s, ColVis.defaults, init);
                if (!this.s.showAll && this.s.bShowAll) {
                    this.s.showAll = this.s.sShowAll;
                }
                if (!this.s.restore && this.s.bRestore) {
                    this.s.restore = this.s.sRestore;
                }
                var groups = this.s.groups;
                var hungarianGroups = this.s.aoGroups;
                if (groups) {
                    for (var i = 0, ien = groups.length; i < ien; i++) {
                        if (groups[i].title) {
                            hungarianGroups[i].sTitle = groups[i].title;
                        }
                        if (groups[i].columns) {
                            hungarianGroups[i].aiColumns = groups[i].columns;
                        }
                    }
                }
            },
            _fnDrawCallback: function() {
                var columns = this.s.dt.aoColumns;
                var buttons = this.dom.buttons;
                var groups = this.s.aoGroups;
                var button;
                for (var i = 0, ien = buttons.length; i < ien; i++) {
                    button = buttons[i];
                    if (button.__columnIdx !== undefined) {
                        $("input", button).prop("checked", columns[button.__columnIdx].bVisible);
                    }
                }
                var allVisible = function(columnIndeces) {
                    for (var k = 0, kLen = columnIndeces.length; k < kLen; k++) {
                        if (columns[columnIndeces[k]].bVisible === false) {
                            return false;
                        }
                    }
                    return true;
                };
                var allHidden = function(columnIndeces) {
                    for (var m = 0, mLen = columnIndeces.length; m < mLen; m++) {
                        if (columns[columnIndeces[m]].bVisible === true) {
                            return false;
                        }
                    }
                    return true;
                };
                for (var j = 0, jLen = groups.length; j < jLen; j++) {
                    if (allVisible(groups[j].aiColumns)) {
                        $("input", this.dom.groupButtons[j]).prop("checked", true);
                        $("input", this.dom.groupButtons[j]).prop("indeterminate", false);
                    } else if (allHidden(groups[j].aiColumns)) {
                        $("input", this.dom.groupButtons[j]).prop("checked", false);
                        $("input", this.dom.groupButtons[j]).prop("indeterminate", false);
                    } else {
                        $("input", this.dom.groupButtons[j]).prop("indeterminate", true);
                    }
                }
            },
            _fnAddGroups: function() {
                var nButton;
                if (typeof this.s.aoGroups != "undefined") {
                    for (var i = 0, iLen = this.s.aoGroups.length; i < iLen; i++) {
                        nButton = this._fnDomGroupButton(i);
                        this.dom.groupButtons.push(nButton);
                        this.dom.buttons.push(nButton);
                        this.dom.collection.appendChild(nButton);
                    }
                }
            },
            _fnAddButtons: function() {
                var nButton, columns = this.s.dt.aoColumns;
                if ($.inArray("all", this.s.aiExclude) === -1) {
                    for (var i = 0, iLen = columns.length; i < iLen; i++) {
                        if ($.inArray(i, this.s.aiExclude) === -1) {
                            nButton = this._fnDomColumnButton(i);
                            nButton.__columnIdx = i;
                            this.dom.buttons.push(nButton);
                        }
                    }
                }
                if (this.s.order === "alpha") {
                    this.dom.buttons.sort(function(a, b) {
                        var titleA = columns[a.__columnIdx].sTitle;
                        var titleB = columns[b.__columnIdx].sTitle;
                        return titleA === titleB ? 0 : titleA < titleB ? -1 : 1;
                    });
                }
                if (this.s.restore) {
                    nButton = this._fnDomRestoreButton();
                    nButton.className += " ColVis_Restore";
                    this.dom.buttons.push(nButton);
                }
                if (this.s.showAll) {
                    nButton = this._fnDomShowXButton(this.s.showAll, true);
                    nButton.className += " ColVis_ShowAll";
                    this.dom.buttons.push(nButton);
                }
                if (this.s.showNone) {
                    nButton = this._fnDomShowXButton(this.s.showNone, false);
                    nButton.className += " ColVis_ShowNone";
                    this.dom.buttons.push(nButton);
                }
                $(this.dom.collection).append(this.dom.buttons);
            },
            _fnDomRestoreButton: function() {
                var that = this, dt = this.s.dt;
                return $('<li class="ColVis_Special ' + (dt.bJUI ? "ui-button ui-state-default" : "") + '">' + this.s.restore + "</li>").click(function(e) {
                    for (var i = 0, iLen = that.s.abOriginal.length; i < iLen; i++) {
                        that.s.dt.oInstance.fnSetColumnVis(i, that.s.abOriginal[i], false);
                    }
                    that._fnAdjustOpenRows();
                    that.s.dt.oInstance.fnAdjustColumnSizing(false);
                    that.s.dt.oInstance.fnDraw(false);
                })[0];
            },
            _fnDomShowXButton: function(str, action) {
                var that = this, dt = this.s.dt;
                return $('<li class="ColVis_Special ' + (dt.bJUI ? "ui-button ui-state-default" : "") + '">' + str + "</li>").click(function(e) {
                    for (var i = 0, iLen = that.s.abOriginal.length; i < iLen; i++) {
                        if (that.s.aiExclude.indexOf(i) === -1) {
                            that.s.dt.oInstance.fnSetColumnVis(i, action, false);
                        }
                    }
                    that._fnAdjustOpenRows();
                    that.s.dt.oInstance.fnAdjustColumnSizing(false);
                    that.s.dt.oInstance.fnDraw(false);
                })[0];
            },
            _fnDomGroupButton: function(i) {
                var that = this, dt = this.s.dt, oGroup = this.s.aoGroups[i];
                return $('<li class="ColVis_Special ' + (dt.bJUI ? "ui-button ui-state-default" : "") + '">' + "<label>" + '<input type="checkbox" />' + "<span>" + oGroup.sTitle + "</span>" + "</label>" + "</li>").click(function(e) {
                    var showHide = !$("input", this).is(":checked");
                    if (e.target.nodeName.toLowerCase() !== "li") {
                        showHide = !showHide;
                    }
                    for (var j = 0; j < oGroup.aiColumns.length; j++) {
                        that.s.dt.oInstance.fnSetColumnVis(oGroup.aiColumns[j], showHide);
                    }
                })[0];
            },
            _fnDomColumnButton: function(i) {
                var that = this, column = this.s.dt.aoColumns[i], dt = this.s.dt;
                var title = this.s.fnLabel === null ? column.sTitle : this.s.fnLabel(i, column.sTitle, column.nTh);
                return $("<li " + (dt.bJUI ? 'class="ui-button ui-state-default"' : "") + ">" + "<label>" + '<input type="checkbox" />' + "<span>" + title + "</span>" + "</label>" + "</li>").click(function(e) {
                    var showHide = !$("input", this).is(":checked");
                    if (e.target.nodeName.toLowerCase() !== "li") {
                        showHide = !showHide;
                    }
                    var oldIndex = $.fn.dataTableExt.iApiIndex;
                    $.fn.dataTableExt.iApiIndex = that._fnDataTablesApiIndex.call(that);
                    if (dt.oFeatures.bServerSide) {
                        that.s.dt.oInstance.fnSetColumnVis(i, showHide, false);
                        that.s.dt.oInstance.fnAdjustColumnSizing(false);
                        if (dt.oScroll.sX !== "" || dt.oScroll.sY !== "") {
                            that.s.dt.oInstance.oApi._fnScrollDraw(that.s.dt);
                        }
                        that._fnDrawCallback();
                    } else {
                        that.s.dt.oInstance.fnSetColumnVis(i, showHide);
                    }
                    $.fn.dataTableExt.iApiIndex = oldIndex;
                    if (e.target.nodeName.toLowerCase() === "input" && that.s.fnStateChange !== null) {
                        that.s.fnStateChange.call(that, i, showHide);
                    }
                })[0];
            },
            _fnDataTablesApiIndex: function() {
                for (var i = 0, iLen = this.s.dt.oInstance.length; i < iLen; i++) {
                    if (this.s.dt.oInstance[i] == this.s.dt.nTable) {
                        return i;
                    }
                }
                return 0;
            },
            _fnDomCollection: function() {
                return $("<ul />", {
                    "class": !this.s.dt.bJUI ? "ColVis_collection" : "ColVis_collection ui-buttonset ui-buttonset-multi"
                }).css({
                    display: "none",
                    opacity: 0,
                    position: !this.s.bCssPosition ? "absolute" : ""
                })[0];
            },
            _fnDomCatcher: function() {
                var that = this, nCatcher = document.createElement("div");
                nCatcher.className = "ColVis_catcher";
                $(nCatcher).click(function() {
                    that._fnCollectionHide.call(that, null, null);
                });
                return nCatcher;
            },
            _fnDomBackground: function() {
                var that = this;
                var background = $("<div></div>").addClass("ColVis_collectionBackground").css("opacity", 0).click(function() {
                    that._fnCollectionHide.call(that, null, null);
                });
                if (this.s.activate == "mouseover") {
                    background.mouseover(function() {
                        that.s.overcollection = false;
                        that._fnCollectionHide.call(that, null, null);
                    });
                }
                return background[0];
            },
            _fnCollectionShow: function() {
                var that = this, i, iLen, iLeft;
                var oPos = $(this.dom.button).offset();
                var nHidden = this.dom.collection;
                var nBackground = this.dom.background;
                var iDivX = parseInt(oPos.left, 10);
                var iDivY = parseInt(oPos.top + $(this.dom.button).outerHeight(), 10);
                if (!this.s.bCssPosition) {
                    nHidden.style.top = iDivY + "px";
                    nHidden.style.left = iDivX + "px";
                }
                $(nHidden).css({
                    display: "block",
                    opacity: 0
                });
                nBackground.style.bottom = "0px";
                nBackground.style.right = "0px";
                var oStyle = this.dom.catcher.style;
                oStyle.height = $(this.dom.button).outerHeight() + "px";
                oStyle.width = $(this.dom.button).outerWidth() + "px";
                oStyle.top = oPos.top + "px";
                oStyle.left = iDivX + "px";
                document.body.appendChild(nBackground);
                document.body.appendChild(nHidden);
                document.body.appendChild(this.dom.catcher);
                $(nHidden).animate({
                    opacity: 1
                }, that.s.iOverlayFade);
                $(nBackground).animate({
                    opacity: .1
                }, that.s.iOverlayFade, "linear", function() {
                    if ($.browser && $.browser.msie && $.browser.version == "6.0") {
                        that._fnDrawCallback();
                    }
                });
                if (!this.s.bCssPosition) {
                    iLeft = this.s.sAlign == "left" ? iDivX : iDivX - $(nHidden).outerWidth() + $(this.dom.button).outerWidth();
                    nHidden.style.left = iLeft + "px";
                    var iDivWidth = $(nHidden).outerWidth();
                    var iDivHeight = $(nHidden).outerHeight();
                    var iDocWidth = $(document).width();
                    if (iLeft + iDivWidth > iDocWidth) {
                        nHidden.style.left = iDocWidth - iDivWidth + "px";
                    }
                }
                this.s.hidden = false;
            },
            _fnCollectionHide: function() {
                var that = this;
                if (!this.s.hidden && this.dom.collection !== null) {
                    this.s.hidden = true;
                    $(this.dom.collection).animate({
                        opacity: 0
                    }, that.s.iOverlayFade, function(e) {
                        this.style.display = "none";
                    });
                    $(this.dom.background).animate({
                        opacity: 0
                    }, that.s.iOverlayFade, function(e) {
                        document.body.removeChild(that.dom.background);
                        document.body.removeChild(that.dom.catcher);
                    });
                }
            },
            _fnAdjustOpenRows: function() {
                var aoOpen = this.s.dt.aoOpenRows;
                var iVisible = this.s.dt.oApi._fnVisbleColumns(this.s.dt);
                for (var i = 0, iLen = aoOpen.length; i < iLen; i++) {
                    aoOpen[i].nTr.getElementsByTagName("td")[0].colSpan = iVisible;
                }
            }
        };
        ColVis.fnRebuild = function(oTable) {
            var nTable = null;
            if (typeof oTable != "undefined") {
                nTable = oTable.fnSettings().nTable;
            }
            for (var i = 0, iLen = ColVis.aInstances.length; i < iLen; i++) {
                if (typeof oTable == "undefined" || nTable == ColVis.aInstances[i].s.dt.nTable) {
                    ColVis.aInstances[i].fnRebuild();
                }
            }
        };
        ColVis.defaults = {
            active: "click",
            buttonText: "Show / hide columns",
            aiExclude: [],
            bRestore: false,
            sRestore: "Restore original",
            bShowAll: false,
            sShowAll: "Show All",
            sAlign: "left",
            fnStateChange: null,
            iOverlayFade: 500,
            fnLabel: null,
            bCssPosition: false,
            aoGroups: [],
            order: "column"
        };
        ColVis.aInstances = [];
        ColVis.prototype.CLASS = "ColVis";
        ColVis.VERSION = "1.1.1";
        ColVis.prototype.VERSION = ColVis.VERSION;
        if (typeof $.fn.dataTable == "function" && typeof $.fn.dataTableExt.fnVersionCheck == "function" && $.fn.dataTableExt.fnVersionCheck("1.7.0")) {
            $.fn.dataTableExt.aoFeatures.push({
                fnInit: function(oDTSettings) {
                    var init = oDTSettings.oInit;
                    var colvis = new ColVis(oDTSettings, init.colVis || init.oColVis || {});
                    return colvis.button();
                },
                cFeature: "C",
                sFeature: "ColVis"
            });
        } else {
            alert("Warning: ColVis requires DataTables 1.7 or greater - www.datatables.net/download");
        }
        $.fn.dataTable.ColVis = ColVis;
        $.fn.DataTable.ColVis = ColVis;
        return ColVis;
    };
    if (typeof define === "function" && define.amd) {
        define([ "jquery", "datatables" ], factory);
    } else if (typeof exports === "object") {
        factory(require("jquery"), require("datatables"));
    } else if (jQuery && !jQuery.fn.dataTable.ColVis) {
        factory(jQuery, jQuery.fn.dataTable);
    }
})(window, document);

(function(window, document, undefined) {
    function fnInvertKeyValues(aIn) {
        var aRet = [];
        for (var i = 0, iLen = aIn.length; i < iLen; i++) {
            aRet[aIn[i]] = i;
        }
        return aRet;
    }
    function fnArraySwitch(aArray, iFrom, iTo) {
        var mStore = aArray.splice(iFrom, 1)[0];
        aArray.splice(iTo, 0, mStore);
    }
    function fnDomSwitch(nParent, iFrom, iTo) {
        var anTags = [];
        for (var i = 0, iLen = nParent.childNodes.length; i < iLen; i++) {
            if (nParent.childNodes[i].nodeType == 1) {
                anTags.push(nParent.childNodes[i]);
            }
        }
        var nStore = anTags[iFrom];
        if (iTo !== null) {
            nParent.insertBefore(nStore, anTags[iTo]);
        } else {
            nParent.appendChild(nStore);
        }
    }
    $.fn.dataTableExt.oApi.fnColReorder = function(oSettings, iFrom, iTo) {
        var v110 = $.fn.dataTable.Api ? true : false;
        var i, iLen, j, jLen, iCols = oSettings.aoColumns.length, nTrs, oCol;
        var attrMap = function(obj, prop, mapping) {
            if (!obj[prop]) {
                return;
            }
            var a = obj[prop].split(".");
            var num = a.shift();
            if (isNaN(num * 1)) {
                return;
            }
            obj[prop] = mapping[num * 1] + "." + a.join(".");
        };
        if (iFrom == iTo) {
            return;
        }
        if (iFrom < 0 || iFrom >= iCols) {
            this.oApi._fnLog(oSettings, 1, "ColReorder 'from' index is out of bounds: " + iFrom);
            return;
        }
        if (iTo < 0 || iTo >= iCols) {
            this.oApi._fnLog(oSettings, 1, "ColReorder 'to' index is out of bounds: " + iTo);
            return;
        }
        var aiMapping = [];
        for (i = 0, iLen = iCols; i < iLen; i++) {
            aiMapping[i] = i;
        }
        fnArraySwitch(aiMapping, iFrom, iTo);
        var aiInvertMapping = fnInvertKeyValues(aiMapping);
        for (i = 0, iLen = oSettings.aaSorting.length; i < iLen; i++) {
            oSettings.aaSorting[i][0] = aiInvertMapping[oSettings.aaSorting[i][0]];
        }
        if (oSettings.aaSortingFixed !== null) {
            for (i = 0, iLen = oSettings.aaSortingFixed.length; i < iLen; i++) {
                oSettings.aaSortingFixed[i][0] = aiInvertMapping[oSettings.aaSortingFixed[i][0]];
            }
        }
        for (i = 0, iLen = iCols; i < iLen; i++) {
            oCol = oSettings.aoColumns[i];
            for (j = 0, jLen = oCol.aDataSort.length; j < jLen; j++) {
                oCol.aDataSort[j] = aiInvertMapping[oCol.aDataSort[j]];
            }
            if (v110) {
                oCol.idx = aiInvertMapping[oCol.idx];
            }
        }
        if (v110) {
            $.each(oSettings.aLastSort, function(i, val) {
                oSettings.aLastSort[i].src = aiInvertMapping[val.src];
            });
        }
        for (i = 0, iLen = iCols; i < iLen; i++) {
            oCol = oSettings.aoColumns[i];
            if (typeof oCol.mData == "number") {
                oCol.mData = aiInvertMapping[oCol.mData];
                oSettings.oApi._fnColumnOptions(oSettings, i, {});
            } else if ($.isPlainObject(oCol.mData)) {
                attrMap(oCol.mData, "_", aiInvertMapping);
                attrMap(oCol.mData, "filter", aiInvertMapping);
                attrMap(oCol.mData, "sort", aiInvertMapping);
                attrMap(oCol.mData, "type", aiInvertMapping);
                oSettings.oApi._fnColumnOptions(oSettings, i, {});
            }
        }
        if (oSettings.aoColumns[iFrom].bVisible) {
            var iVisibleIndex = this.oApi._fnColumnIndexToVisible(oSettings, iFrom);
            var iInsertBeforeIndex = null;
            i = iTo < iFrom ? iTo : iTo + 1;
            while (iInsertBeforeIndex === null && i < iCols) {
                iInsertBeforeIndex = this.oApi._fnColumnIndexToVisible(oSettings, i);
                i++;
            }
            nTrs = oSettings.nTHead.getElementsByTagName("tr");
            for (i = 0, iLen = nTrs.length; i < iLen; i++) {
                fnDomSwitch(nTrs[i], iVisibleIndex, iInsertBeforeIndex);
            }
            if (oSettings.nTFoot !== null) {
                nTrs = oSettings.nTFoot.getElementsByTagName("tr");
                for (i = 0, iLen = nTrs.length; i < iLen; i++) {
                    fnDomSwitch(nTrs[i], iVisibleIndex, iInsertBeforeIndex);
                }
            }
            for (i = 0, iLen = oSettings.aoData.length; i < iLen; i++) {
                if (oSettings.aoData[i].nTr !== null) {
                    fnDomSwitch(oSettings.aoData[i].nTr, iVisibleIndex, iInsertBeforeIndex);
                }
            }
        }
        fnArraySwitch(oSettings.aoColumns, iFrom, iTo);
        fnArraySwitch(oSettings.aoPreSearchCols, iFrom, iTo);
        for (i = 0, iLen = oSettings.aoData.length; i < iLen; i++) {
            var data = oSettings.aoData[i];
            if (v110) {
                if (data.anCells) {
                    fnArraySwitch(data.anCells, iFrom, iTo);
                }
                if (data.src !== "dom" && $.isArray(data._aData)) {
                    fnArraySwitch(data._aData, iFrom, iTo);
                }
            } else {
                if ($.isArray(data._aData)) {
                    fnArraySwitch(data._aData, iFrom, iTo);
                }
                fnArraySwitch(data._anHidden, iFrom, iTo);
            }
        }
        for (i = 0, iLen = oSettings.aoHeader.length; i < iLen; i++) {
            fnArraySwitch(oSettings.aoHeader[i], iFrom, iTo);
        }
        if (oSettings.aoFooter !== null) {
            for (i = 0, iLen = oSettings.aoFooter.length; i < iLen; i++) {
                fnArraySwitch(oSettings.aoFooter[i], iFrom, iTo);
            }
        }
        if (v110) {
            var api = new $.fn.dataTable.Api(oSettings);
            api.rows().invalidate();
        }
        for (i = 0, iLen = iCols; i < iLen; i++) {
            $(oSettings.aoColumns[i].nTh).off("click.DT");
            this.oApi._fnSortAttachListener(oSettings, oSettings.aoColumns[i].nTh, i);
        }
        $(oSettings.oInstance).trigger("column-reorder", [ oSettings, {
            iFrom: iFrom,
            iTo: iTo,
            aiInvertMapping: aiInvertMapping
        } ]);
    };
    var factory = function($, DataTable) {
        "use strict";
        var ColReorder = function(dt, opts) {
            var oDTSettings;
            if ($.fn.dataTable.Api) {
                oDTSettings = new $.fn.dataTable.Api(dt).settings()[0];
            } else if (dt.fnSettings) {
                oDTSettings = dt.fnSettings();
            } else if (typeof dt === "string") {
                if ($.fn.dataTable.fnIsDataTable($(dt)[0])) {
                    oDTSettings = $(dt).eq(0).dataTable().fnSettings();
                }
            } else if (dt.nodeName && dt.nodeName.toLowerCase() === "table") {
                if ($.fn.dataTable.fnIsDataTable(dt.nodeName)) {
                    oDTSettings = $(dt.nodeName).dataTable().fnSettings();
                }
            } else if (dt instanceof jQuery) {
                if ($.fn.dataTable.fnIsDataTable(dt[0])) {
                    oDTSettings = dt.eq(0).dataTable().fnSettings();
                }
            } else {
                oDTSettings = dt;
            }
            var camelToHungarian = $.fn.dataTable.camelToHungarian;
            if (camelToHungarian) {
                camelToHungarian(ColReorder.defaults, ColReorder.defaults, true);
                camelToHungarian(ColReorder.defaults, opts || {});
            }
            this.s = {
                dt: null,
                init: $.extend(true, {}, ColReorder.defaults, opts),
                fixed: 0,
                fixedRight: 0,
                dropCallback: null,
                mouse: {
                    startX: -1,
                    startY: -1,
                    offsetX: -1,
                    offsetY: -1,
                    target: -1,
                    targetIndex: -1,
                    fromIndex: -1
                },
                aoTargets: []
            };
            this.dom = {
                drag: null,
                pointer: null
            };
            this.s.dt = oDTSettings.oInstance.fnSettings();
            this.s.dt._colReorder = this;
            this._fnConstruct();
            oDTSettings.oApi._fnCallbackReg(oDTSettings, "aoDestroyCallback", $.proxy(this._fnDestroy, this), "ColReorder");
            return this;
        };
        ColReorder.prototype = {
            fnReset: function() {
                var a = [];
                for (var i = 0, iLen = this.s.dt.aoColumns.length; i < iLen; i++) {
                    a.push(this.s.dt.aoColumns[i]._ColReorder_iOrigCol);
                }
                this._fnOrderColumns(a);
                return this;
            },
            fnGetCurrentOrder: function() {
                return this.fnOrder();
            },
            fnOrder: function(set) {
                if (set === undefined) {
                    var a = [];
                    for (var i = 0, iLen = this.s.dt.aoColumns.length; i < iLen; i++) {
                        a.push(this.s.dt.aoColumns[i]._ColReorder_iOrigCol);
                    }
                    return a;
                }
                this._fnOrderColumns(fnInvertKeyValues(set));
                return this;
            },
            _fnConstruct: function() {
                var that = this;
                var iLen = this.s.dt.aoColumns.length;
                var i;
                if (this.s.init.iFixedColumns) {
                    this.s.fixed = this.s.init.iFixedColumns;
                }
                this.s.fixedRight = this.s.init.iFixedColumnsRight ? this.s.init.iFixedColumnsRight : 0;
                if (this.s.init.fnReorderCallback) {
                    this.s.dropCallback = this.s.init.fnReorderCallback;
                }
                for (i = 0; i < iLen; i++) {
                    if (i > this.s.fixed - 1 && i < iLen - this.s.fixedRight) {
                        this._fnMouseListener(i, this.s.dt.aoColumns[i].nTh);
                    }
                    this.s.dt.aoColumns[i]._ColReorder_iOrigCol = i;
                }
                this.s.dt.oApi._fnCallbackReg(this.s.dt, "aoStateSaveParams", function(oS, oData) {
                    that._fnStateSave.call(that, oData);
                }, "ColReorder_State");
                var aiOrder = null;
                if (this.s.init.aiOrder) {
                    aiOrder = this.s.init.aiOrder.slice();
                }
                if (this.s.dt.oLoadedState && typeof this.s.dt.oLoadedState.ColReorder != "undefined" && this.s.dt.oLoadedState.ColReorder.length == this.s.dt.aoColumns.length) {
                    aiOrder = this.s.dt.oLoadedState.ColReorder;
                }
                if (aiOrder) {
                    if (!that.s.dt._bInitComplete) {
                        var bDone = false;
                        this.s.dt.aoDrawCallback.push({
                            fn: function() {
                                if (!that.s.dt._bInitComplete && !bDone) {
                                    bDone = true;
                                    var resort = fnInvertKeyValues(aiOrder);
                                    that._fnOrderColumns.call(that, resort);
                                }
                            },
                            sName: "ColReorder_Pre"
                        });
                    } else {
                        var resort = fnInvertKeyValues(aiOrder);
                        that._fnOrderColumns.call(that, resort);
                    }
                } else {
                    this._fnSetColumnIndexes();
                }
            },
            _fnOrderColumns: function(a) {
                if (a.length != this.s.dt.aoColumns.length) {
                    this.s.dt.oInstance.oApi._fnLog(this.s.dt, 1, "ColReorder - array reorder does not " + "match known number of columns. Skipping.");
                    return;
                }
                for (var i = 0, iLen = a.length; i < iLen; i++) {
                    var currIndex = $.inArray(i, a);
                    if (i != currIndex) {
                        fnArraySwitch(a, currIndex, i);
                        this.s.dt.oInstance.fnColReorder(currIndex, i);
                    }
                }
                if (this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "") {
                    this.s.dt.oInstance.fnAdjustColumnSizing();
                }
                this.s.dt.oInstance.oApi._fnSaveState(this.s.dt);
                this._fnSetColumnIndexes();
            },
            _fnStateSave: function(oState) {
                var i, iLen, aCopy, iOrigColumn;
                var oSettings = this.s.dt;
                var columns = oSettings.aoColumns;
                oState.ColReorder = [];
                if (oState.aaSorting) {
                    for (i = 0; i < oState.aaSorting.length; i++) {
                        oState.aaSorting[i][0] = columns[oState.aaSorting[i][0]]._ColReorder_iOrigCol;
                    }
                    var aSearchCopy = $.extend(true, [], oState.aoSearchCols);
                    for (i = 0, iLen = columns.length; i < iLen; i++) {
                        iOrigColumn = columns[i]._ColReorder_iOrigCol;
                        oState.aoSearchCols[iOrigColumn] = aSearchCopy[i];
                        oState.abVisCols[iOrigColumn] = columns[i].bVisible;
                        oState.ColReorder.push(iOrigColumn);
                    }
                } else if (oState.order) {
                    for (i = 0; i < oState.order.length; i++) {
                        oState.order[i][0] = columns[oState.order[i][0]]._ColReorder_iOrigCol;
                    }
                    var stateColumnsCopy = $.extend(true, [], oState.columns);
                    for (i = 0, iLen = columns.length; i < iLen; i++) {
                        iOrigColumn = columns[i]._ColReorder_iOrigCol;
                        oState.columns[iOrigColumn] = stateColumnsCopy[i];
                        oState.ColReorder.push(iOrigColumn);
                    }
                }
            },
            _fnMouseListener: function(i, nTh) {
                var that = this;
                $(nTh).on("mousedown.ColReorder", function(e) {
                    e.preventDefault();
                    that._fnMouseDown.call(that, e, nTh);
                });
            },
            _fnMouseDown: function(e, nTh) {
                var that = this;
                var target = $(e.target).closest("th, td");
                var offset = target.offset();
                var idx = parseInt($(nTh).attr("data-column-index"), 10);
                if (idx === undefined) {
                    return;
                }
                this.s.mouse.startX = e.pageX;
                this.s.mouse.startY = e.pageY;
                this.s.mouse.offsetX = e.pageX - offset.left;
                this.s.mouse.offsetY = e.pageY - offset.top;
                this.s.mouse.target = this.s.dt.aoColumns[idx].nTh;
                this.s.mouse.targetIndex = idx;
                this.s.mouse.fromIndex = idx;
                this._fnRegions();
                $(document).on("mousemove.ColReorder", function(e) {
                    that._fnMouseMove.call(that, e);
                }).on("mouseup.ColReorder", function(e) {
                    that._fnMouseUp.call(that, e);
                });
            },
            _fnMouseMove: function(e) {
                var that = this;
                if (this.dom.drag === null) {
                    if (Math.pow(Math.pow(e.pageX - this.s.mouse.startX, 2) + Math.pow(e.pageY - this.s.mouse.startY, 2), .5) < 5) {
                        return;
                    }
                    this._fnCreateDragNode();
                }
                this.dom.drag.css({
                    left: e.pageX - this.s.mouse.offsetX,
                    top: e.pageY - this.s.mouse.offsetY
                });
                var bSet = false;
                var lastToIndex = this.s.mouse.toIndex;
                for (var i = 1, iLen = this.s.aoTargets.length; i < iLen; i++) {
                    if (e.pageX < this.s.aoTargets[i - 1].x + (this.s.aoTargets[i].x - this.s.aoTargets[i - 1].x) / 2) {
                        this.dom.pointer.css("left", this.s.aoTargets[i - 1].x);
                        this.s.mouse.toIndex = this.s.aoTargets[i - 1].to;
                        bSet = true;
                        break;
                    }
                }
                if (!bSet) {
                    this.dom.pointer.css("left", this.s.aoTargets[this.s.aoTargets.length - 1].x);
                    this.s.mouse.toIndex = this.s.aoTargets[this.s.aoTargets.length - 1].to;
                }
                if (this.s.init.bRealtime && lastToIndex !== this.s.mouse.toIndex) {
                    this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex);
                    this.s.mouse.fromIndex = this.s.mouse.toIndex;
                    this._fnRegions();
                }
            },
            _fnMouseUp: function(e) {
                var that = this;
                $(document).off("mousemove.ColReorder mouseup.ColReorder");
                if (this.dom.drag !== null) {
                    this.dom.drag.remove();
                    this.dom.pointer.remove();
                    this.dom.drag = null;
                    this.dom.pointer = null;
                    this.s.dt.oInstance.fnColReorder(this.s.mouse.fromIndex, this.s.mouse.toIndex);
                    this._fnSetColumnIndexes();
                    if (this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "") {
                        this.s.dt.oInstance.fnAdjustColumnSizing();
                    }
                    if (this.s.dropCallback !== null) {
                        this.s.dropCallback.call(this);
                    }
                    this.s.dt.oInstance.oApi._fnSaveState(this.s.dt);
                }
            },
            _fnRegions: function() {
                var aoColumns = this.s.dt.aoColumns;
                this.s.aoTargets.splice(0, this.s.aoTargets.length);
                this.s.aoTargets.push({
                    x: $(this.s.dt.nTable).offset().left,
                    to: 0
                });
                var iToPoint = 0;
                for (var i = 0, iLen = aoColumns.length; i < iLen; i++) {
                    if (i != this.s.mouse.fromIndex) {
                        iToPoint++;
                    }
                    if (aoColumns[i].bVisible) {
                        this.s.aoTargets.push({
                            x: $(aoColumns[i].nTh).offset().left + $(aoColumns[i].nTh).outerWidth(),
                            to: iToPoint
                        });
                    }
                }
                if (this.s.fixedRight !== 0) {
                    this.s.aoTargets.splice(this.s.aoTargets.length - this.s.fixedRight);
                }
                if (this.s.fixed !== 0) {
                    this.s.aoTargets.splice(0, this.s.fixed);
                }
            },
            _fnCreateDragNode: function() {
                var scrolling = this.s.dt.oScroll.sX !== "" || this.s.dt.oScroll.sY !== "";
                var origCell = this.s.dt.aoColumns[this.s.mouse.targetIndex].nTh;
                var origTr = origCell.parentNode;
                var origThead = origTr.parentNode;
                var origTable = origThead.parentNode;
                var cloneCell = $(origCell).clone();
                this.dom.drag = $(origTable.cloneNode(false)).addClass("DTCR_clonedTable").append(origThead.cloneNode(false).appendChild(origTr.cloneNode(false).appendChild(cloneCell[0]))).css({
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: $(origCell).outerWidth(),
                    height: $(origCell).outerHeight()
                }).appendTo("body");
                this.dom.pointer = $("<div></div>").addClass("DTCR_pointer").css({
                    position: "absolute",
                    top: scrolling ? $("div.dataTables_scroll", this.s.dt.nTableWrapper).offset().top : $(this.s.dt.nTable).offset().top,
                    height: scrolling ? $("div.dataTables_scroll", this.s.dt.nTableWrapper).height() : $(this.s.dt.nTable).height()
                }).appendTo("body");
            },
            _fnDestroy: function() {
                var i, iLen;
                for (i = 0, iLen = this.s.dt.aoDrawCallback.length; i < iLen; i++) {
                    if (this.s.dt.aoDrawCallback[i].sName === "ColReorder_Pre") {
                        this.s.dt.aoDrawCallback.splice(i, 1);
                        break;
                    }
                }
                $(this.s.dt.nTHead).find("*").off(".ColReorder");
                $.each(this.s.dt.aoColumns, function(i, column) {
                    $(column.nTh).removeAttr("data-column-index");
                });
                this.s.dt._colReorder = null;
                this.s = null;
            },
            _fnSetColumnIndexes: function() {
                $.each(this.s.dt.aoColumns, function(i, column) {
                    $(column.nTh).attr("data-column-index", i);
                });
            }
        };
        ColReorder.defaults = {
            aiOrder: null,
            bRealtime: false,
            iFixedColumns: 0,
            iFixedColumnsRight: 0,
            fnReorderCallback: null
        };
        ColReorder.version = "1.1.2";
        $.fn.dataTable.ColReorder = ColReorder;
        $.fn.DataTable.ColReorder = ColReorder;
        if (typeof $.fn.dataTable == "function" && typeof $.fn.dataTableExt.fnVersionCheck == "function" && $.fn.dataTableExt.fnVersionCheck("1.9.3")) {
            $.fn.dataTableExt.aoFeatures.push({
                fnInit: function(settings) {
                    var table = settings.oInstance;
                    if (!settings._colReorder) {
                        var dtInit = settings.oInit;
                        var opts = dtInit.colReorder || dtInit.oColReorder || {};
                        new ColReorder(settings, opts);
                    } else {
                        table.oApi._fnLog(settings, 1, "ColReorder attempted to initialise twice. Ignoring second");
                    }
                    return null;
                },
                cFeature: "R",
                sFeature: "ColReorder"
            });
        } else {
            alert("Warning: ColReorder requires DataTables 1.9.3 or greater - www.datatables.net/download");
        }
        if ($.fn.dataTable.Api) {
            $.fn.dataTable.Api.register("colReorder.reset()", function() {
                return this.iterator("table", function(ctx) {
                    ctx._colReorder.fnReset();
                });
            });
            $.fn.dataTable.Api.register("colReorder.order()", function(set) {
                if (set) {
                    return this.iterator("table", function(ctx) {
                        ctx._colReorder.fnOrder(set);
                    });
                }
                return this.context.length ? this.context[0]._colReorder.fnOrder() : null;
            });
        }
        return ColReorder;
    };
    if (typeof define === "function" && define.amd) {
        define([ "jquery", "datatables" ], factory);
    } else if (typeof exports === "object") {
        factory(require("jquery"), require("datatables"));
    } else if (jQuery && !jQuery.fn.dataTable.ColReorder) {
        factory(jQuery, jQuery.fn.dataTable);
    }
})(window, document);

(function(window, document, undefined) {
    var factory = function($, DataTable) {
        "use strict";
        var Responsive = function(settings, opts) {
            if (!DataTable.versionCheck || !DataTable.versionCheck("1.10.1")) {
                throw "DataTables Responsive requires DataTables 1.10.1 or newer";
            }
            this.s = {
                dt: new DataTable.Api(settings),
                columns: []
            };
            if (this.s.dt.settings()[0].responsive) {
                return;
            }
            if (opts && typeof opts.details === "string") {
                opts.details = {
                    type: opts.details
                };
            }
            this.c = $.extend(true, {}, Responsive.defaults, DataTable.defaults.responsive, opts);
            settings.responsive = this;
            this._constructor();
        };
        Responsive.prototype = {
            _constructor: function() {
                var that = this;
                var dt = this.s.dt;
                dt.settings()[0]._responsive = this;
                $(window).on("resize.dtr orientationchange.dtr", dt.settings()[0].oApi._fnThrottle(function() {
                    that._resize();
                }));
                dt.on("destroy.dtr", function() {
                    $(window).off("resize.dtr orientationchange.dtr");
                });
                this.c.breakpoints.sort(function(a, b) {
                    return a.width < b.width ? 1 : a.width > b.width ? -1 : 0;
                });
                this._classLogic();
                this._resizeAuto();
                this._resize();
                var details = this.c.details;
                if (details.type) {
                    that._detailsInit();
                    this._detailsVis();
                    dt.on("column-visibility.dtr", function() {
                        that._detailsVis();
                    });
                    $(dt.table().node()).addClass("dtr-" + details.type);
                }
            },
            _columnsVisiblity: function(breakpoint) {
                var dt = this.s.dt;
                var columns = this.s.columns;
                var i, ien;
                var display = $.map(columns, function(col) {
                    return col.auto && col.minWidth === null ? false : col.auto === true ? "-" : $.inArray(breakpoint, col.includeIn) !== -1;
                });
                var requiredWidth = 0;
                for (i = 0, ien = display.length; i < ien; i++) {
                    if (display[i] === true) {
                        requiredWidth += columns[i].minWidth;
                    }
                }
                var widthAvailable = dt.table().container().offsetWidth;
                var usedWidth = widthAvailable - requiredWidth;
                for (i = 0, ien = display.length; i < ien; i++) {
                    if (columns[i].control) {
                        usedWidth -= columns[i].minWidth;
                    } else if (display[i] === "-") {
                        display[i] = usedWidth - columns[i].minWidth < 0 ? false : true;
                        usedWidth -= columns[i].minWidth;
                    }
                }
                var showControl = false;
                for (i = 0, ien = columns.length; i < ien; i++) {
                    if (!columns[i].control && !columns[i].never && !display[i]) {
                        showControl = true;
                        break;
                    }
                }
                for (i = 0, ien = columns.length; i < ien; i++) {
                    if (columns[i].control) {
                        display[i] = showControl;
                    }
                }
                if ($.inArray(true, display) === -1) {
                    display[0] = true;
                }
                return display;
            },
            _classLogic: function() {
                var that = this;
                var calc = {};
                var breakpoints = this.c.breakpoints;
                var columns = this.s.dt.columns().eq(0).map(function(i) {
                    var className = this.column(i).header().className;
                    return {
                        className: className,
                        includeIn: [],
                        auto: false,
                        control: false,
                        never: className.match(/\bnever\b/) ? true : false
                    };
                });
                var add = function(colIdx, name) {
                    var includeIn = columns[colIdx].includeIn;
                    if ($.inArray(name, includeIn) === -1) {
                        includeIn.push(name);
                    }
                };
                var column = function(colIdx, name, operator, matched) {
                    var size, i, ien;
                    if (!operator) {
                        columns[colIdx].includeIn.push(name);
                    } else if (operator === "max-") {
                        size = that._find(name).width;
                        for (i = 0, ien = breakpoints.length; i < ien; i++) {
                            if (breakpoints[i].width <= size) {
                                add(colIdx, breakpoints[i].name);
                            }
                        }
                    } else if (operator === "min-") {
                        size = that._find(name).width;
                        for (i = 0, ien = breakpoints.length; i < ien; i++) {
                            if (breakpoints[i].width >= size) {
                                add(colIdx, breakpoints[i].name);
                            }
                        }
                    } else if (operator === "not-") {
                        for (i = 0, ien = breakpoints.length; i < ien; i++) {
                            if (breakpoints[i].name.indexOf(matched) === -1) {
                                add(colIdx, breakpoints[i].name);
                            }
                        }
                    }
                };
                columns.each(function(col, i) {
                    var classNames = col.className.split(" ");
                    var hasClass = false;
                    for (var k = 0, ken = classNames.length; k < ken; k++) {
                        var className = $.trim(classNames[k]);
                        if (className === "all") {
                            hasClass = true;
                            col.includeIn = $.map(breakpoints, function(a) {
                                return a.name;
                            });
                            return;
                        } else if (className === "none" || className === "never") {
                            hasClass = true;
                            return;
                        } else if (className === "control") {
                            hasClass = true;
                            col.control = true;
                            return;
                        }
                        $.each(breakpoints, function(j, breakpoint) {
                            var brokenPoint = breakpoint.name.split("-");
                            var re = new RegExp("(min\\-|max\\-|not\\-)?(" + brokenPoint[0] + ")(\\-[_a-zA-Z0-9])?");
                            var match = className.match(re);
                            if (match) {
                                hasClass = true;
                                if (match[2] === brokenPoint[0] && match[3] === "-" + brokenPoint[1]) {
                                    column(i, breakpoint.name, match[1], match[2] + match[3]);
                                } else if (match[2] === brokenPoint[0] && !match[3]) {
                                    column(i, breakpoint.name, match[1], match[2]);
                                }
                            }
                        });
                    }
                    if (!hasClass) {
                        col.auto = true;
                    }
                });
                this.s.columns = columns;
            },
            _detailsInit: function() {
                var that = this;
                var dt = this.s.dt;
                var details = this.c.details;
                if (details.type === "inline") {
                    details.target = "td:first-child";
                }
                var target = details.target;
                var selector = typeof target === "string" ? target : "td";
                $(dt.table().body()).on("click", selector, function(e) {
                    if (!$(dt.table().node()).hasClass("collapsed")) {
                        return;
                    }
                    if (!dt.row($(this).closest("tr")).length) {
                        return;
                    }
                    if (typeof target === "number") {
                        var targetIdx = target < 0 ? dt.columns().eq(0).length + target : target;
                        if (dt.cell(this).index().column !== targetIdx) {
                            return;
                        }
                    }
                    var row = dt.row($(this).closest("tr"));
                    if (row.child.isShown()) {
                        row.child(false);
                        $(row.node()).removeClass("parent");
                    } else {
                        var info = that.c.details.renderer(dt, row[0]);
                        row.child(info, "child").show();
                        $(row.node()).addClass("parent");
                    }
                });
            },
            _detailsVis: function() {
                var that = this;
                var dt = this.s.dt;
                var hiddenColumns = dt.columns().indexes().filter(function(idx) {
                    var col = dt.column(idx);
                    if (col.visible()) {
                        return null;
                    }
                    return $(col.header()).hasClass("never") ? null : idx;
                });
                var haveHidden = true;
                if (hiddenColumns.length === 0 || hiddenColumns.length === 1 && this.s.columns[hiddenColumns[0]].control) {
                    haveHidden = false;
                }
                if (haveHidden) {
                    $(dt.table().node()).addClass("collapsed");
                    dt.rows().eq(0).each(function(idx) {
                        var row = dt.row(idx);
                        if (row.child()) {
                            var info = that.c.details.renderer(dt, row[0]);
                            if (info === false) {
                                row.child.hide();
                            } else {
                                row.child(info, "child").show();
                            }
                        }
                    });
                } else {
                    $(dt.table().node()).removeClass("collapsed");
                    dt.rows().eq(0).each(function(idx) {
                        dt.row(idx).child.hide();
                    });
                }
            },
            _find: function(name) {
                var breakpoints = this.c.breakpoints;
                for (var i = 0, ien = breakpoints.length; i < ien; i++) {
                    if (breakpoints[i].name === name) {
                        return breakpoints[i];
                    }
                }
            },
            _resize: function() {
                var dt = this.s.dt;
                var width = $(window).width();
                var breakpoints = this.c.breakpoints;
                var breakpoint = breakpoints[0].name;
                for (var i = breakpoints.length - 1; i >= 0; i--) {
                    if (width <= breakpoints[i].width) {
                        breakpoint = breakpoints[i].name;
                        break;
                    }
                }
                var columns = this._columnsVisiblity(breakpoint);
                dt.columns().eq(0).each(function(colIdx, i) {
                    dt.column(colIdx).visible(columns[i]);
                });
            },
            _resizeAuto: function() {
                var dt = this.s.dt;
                var columns = this.s.columns;
                if (!this.c.auto) {
                    return;
                }
                if ($.inArray(true, $.map(columns, function(c) {
                    return c.auto;
                })) === -1) {
                    return;
                }
                var tableWidth = dt.table().node().offsetWidth;
                var columnWidths = dt.columns;
                var clonedTable = dt.table().node().cloneNode(false);
                var clonedHeader = $(dt.table().header().cloneNode(false)).appendTo(clonedTable);
                var clonedBody = $(dt.table().body().cloneNode(false)).appendTo(clonedTable);
                dt.rows({
                    page: "current"
                }).indexes().flatten().each(function(idx) {
                    var clone = dt.row(idx).node().cloneNode(true);
                    if (dt.columns(":hidden").flatten().length) {
                        $(clone).append(dt.cells(idx, ":hidden").nodes().to$().clone());
                    }
                    $(clone).appendTo(clonedBody);
                });
                var cells = dt.columns().header().to$().clone(false).wrapAll("tr").appendTo(clonedHeader);
                var inserted = $("<div/>").css({
                    width: 1,
                    height: 1,
                    overflow: "hidden"
                }).append(clonedTable).insertBefore(dt.table().node());
                dt.columns().eq(0).each(function(idx) {
                    columns[idx].minWidth = cells[idx].offsetWidth || 0;
                });
                inserted.remove();
            }
        };
        Responsive.breakpoints = [ {
            name: "desktop",
            width: Infinity
        }, {
            name: "tablet-l",
            width: 1024
        }, {
            name: "tablet-p",
            width: 768
        }, {
            name: "mobile-l",
            width: 480
        }, {
            name: "mobile-p",
            width: 320
        } ];
        Responsive.defaults = {
            breakpoints: Responsive.breakpoints,
            auto: true,
            details: {
                renderer: function(api, rowIdx) {
                    var data = api.cells(rowIdx, ":hidden").eq(0).map(function(cell) {
                        var header = $(api.column(cell.column).header());
                        var idx = api.cell(cell).index();
                        if (header.hasClass("control") || header.hasClass("never")) {
                            return "";
                        }
                        var dtPrivate = api.settings()[0];
                        var cellData = dtPrivate.oApi._fnGetCellData(dtPrivate, idx.row, idx.column, "display");
                        return '<li data-dtr-index="' + idx.column + '">' + '<span class="dtr-title">' + header.text() + ":" + "</span> " + '<span class="dtr-data">' + cellData + "</span>" + "</li>";
                    }).toArray().join("");
                    return data ? $('<ul data-dtr-index="' + rowIdx + '"/>').append(data) : false;
                },
                target: 0,
                type: "inline"
            }
        };
        var Api = $.fn.dataTable.Api;
        Api.register("responsive()", function() {
            return this;
        });
        Api.register("responsive.recalc()", function() {
            this.iterator("table", function(ctx) {
                if (ctx._responsive) {
                    ctx._responsive._resizeAuto();
                    ctx._responsive._resize();
                }
            });
        });
        Api.register("responsive.index()", function(li) {
            li = $(li);
            return {
                column: li.data("dtr-index"),
                row: li.parent().data("dtr-index")
            };
        });
        Responsive.version = "1.0.2";
        $.fn.dataTable.Responsive = Responsive;
        $.fn.DataTable.Responsive = Responsive;
        $(document).on("init.dt.dtr", function(e, settings, json) {
            if ($(settings.nTable).hasClass("responsive") || $(settings.nTable).hasClass("dt-responsive") || settings.oInit.responsive || DataTable.defaults.responsive) {
                var init = settings.oInit.responsive;
                if (init !== false) {
                    new Responsive(settings, $.isPlainObject(init) ? init : {});
                }
            }
        });
        return Responsive;
    };
    if (typeof define === "function" && define.amd) {
        define([ "jquery", "datatables" ], factory);
    } else if (typeof exports === "object") {
        factory(require("jquery"), require("datatables"));
    } else if (jQuery && !jQuery.fn.dataTable.Responsive) {
        factory(jQuery, jQuery.fn.dataTable);
    }
})(window, document);