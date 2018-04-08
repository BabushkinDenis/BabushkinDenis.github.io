"use strict";
/* jshint browser:true, jquery:true,browserify:true */

var Handlebars = require("hbsfy/runtime");

var isArray = function (value) {
    return Object.prototype.toString.call(value) === "[object Array]";
};

var ExpressionRegistry = function () {
    this.expressions = [];
};

ExpressionRegistry.prototype.add = function (operator, method) {
    this.expressions[operator] = method;
};

ExpressionRegistry.prototype.call = function (operator, left, right) {
    if (!this.expressions.hasOwnProperty(operator)) {
        throw new Error("Unknown operator '" + operator + "'");
    }

    return this.expressions[operator](left, right);
};

var eR = new ExpressionRegistry();

eR.add("not", function (left, right) {
    return left != right;
});
eR.add(">", function (left, right) {
    return left > right;
});
eR.add("<", function (left, right) {
    return left < right;
});
eR.add(">=", function (left, right) {
    return left >= right;
});
eR.add("<=", function (left, right) {
    return left <= right;
});
eR.add("==", function (left, right) {
    return left == right;
});
eR.add("===", function (left, right) {
    return left === right;
});
eR.add("!==", function (left, right) {
    return left !== right;
});
eR.add("in", function (left, right) {
    if (!isArray(right)) {
        right = right.split(",");
    }
    return right.indexOf(left) !== -1;
});

var isHelper = function () {
    var args = arguments,
            left = args[0],
            operator = args[1],
            right = args[2],
            options = args[3];

    if (args.length == 2) {
        options = args[1];
        if (left) {
            return options.fn(this);
        }
        return options.inverse(this);
    }

    if (args.length == 3) {
        right = args[1];
        options = args[2];
        if (left == right) {
            return options.fn(this);
        }
        return options.inverse(this);
    }

    if (eR.call(operator, left, right)) {
        return options.fn(this);
    }
    return options.inverse(this);
};

Handlebars.registerHelper("is", isHelper);

Handlebars.registerHelper("literal", function (array, index) {
    if (index - 1 >= 0) {
        return(array[index - 1].offname);
    }
});

Handlebars.registerHelper("formatPhone", function (phone) {
    phone = phone.toString();
    return phone.substr(0, 1) + "(" + phone.substr(1, 3) + ") " + phone.substr(4, 3) + "-" + phone.substr(7, 2) + "-" + phone.substr(9, 2);
});

Handlebars.registerHelper("formatDate", function (unixtime) {
    unixtime = parseInt(unixtime);
    var date = new Date(unixtime*1000);
    // Hours part from the timestamp
    var day = date.getDate();
    // Minutes part from the timestamp
    var month = date.getMonth()<10?"0"+date.getMonth():date.getMonth();
    // Seconds part from the timestamp
    var year = date.getYear();
    return day + "." + month + "." + year;
});

Handlebars.registerHelper("multiply", function (value, multiplier) {
    return value * multiplier;
});

Handlebars.registerHelper("inArray", function (value, array, coll) {
    if (array.filter(function (obj) {
        return obj[coll] === value;
    })[0]) {
        return true;
    } else {
        return false;
    }

});


Handlebars.registerHelper("if_eq", function (a, b, opts) {
    if (a == b) { // Or === depending on your needs
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});


Handlebars.registerHelper("between", function (a, b, c,opts) {
    if (a >= b && a < c) { // Or === depending on your needs
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});



Handlebars.registerHelper("paginate", function(pagination, options) {
  var type = options.hash.type || 'middle';
  var ret = '';
  var pageCount = Number(pagination.pageCount);
  var page = Number(pagination.page);
  var limit;
  if (options.hash.limit) limit = +options.hash.limit;

  //page pageCount
  if(pageCount<1) {

    return;
  }
  var newContext = {};
  switch (type) {
    case 'middle':
      if (typeof limit === 'number') {
        if(pageCount> 1) {
            var i = 0;
            var leftCount = Math.ceil(limit / 2) - 1;
            var rightCount = limit - leftCount - 1;
            if (page + rightCount > pageCount)
              leftCount = limit - (pageCount - page) - 1;
            if (page - leftCount < 1)
              leftCount = page - 1;
            var start = page - leftCount;

            while (i < limit && i < pageCount) {
              newContext = { n: start };
              if (start === page) newContext.active = true;
              ret = ret + options.fn(newContext);
              start++;
              i++;
            }
        }
      }
      else {
        for (var i = 1; i <= pageCount; i++) {
          newContext = { n: i };
          if (i === page) newContext.active = true;
          ret = ret + options.fn(newContext);
        }
      }
      break;
    case 'previous':
      if (page === 1) {
        newContext = { disabled: true, n: 1 }
      }
      else {
        newContext = { n: page - 1 }
      }
      ret = ret + options.fn(newContext);
      break;
    case 'next':
      newContext = {};
      if (page === pageCount) {
        newContext = { disabled: true, n: pageCount }
      }
      else {
        newContext = { n: page + 1 }
      }
      ret = ret + options.fn(newContext);
      break;
    case 'first':
      if (page === 1) {
        newContext = { disabled: true, n: 1 }
      }
      else {
        newContext = { n: 1 }
      }
      ret = ret + options.fn(newContext);
      break;
    case 'last':
      if (page === pageCount) {
        newContext = { disabled: true, n: pageCount }
      }
      else {
        newContext = { n: pageCount }
      }
      ret = ret + options.fn(newContext);
      break;
  }

  return ret;
});





Handlebars.registerHelper("index", function (a) {
    return a + 1;
});

Handlebars.registerHelper("math", function (lvalue, operator, rvalue, options) {
    lvalue = parseFloat(lvalue);
    rvalue = parseFloat(rvalue);

    return {
        "+": lvalue + rvalue,
        "-": lvalue - rvalue,
        "*": lvalue * rvalue,
        "/": lvalue / rvalue,
        "%": lvalue % rvalue
    }[operator];
});

Handlebars.registerHelper("compare", function (v1, operator, v2, options) {
    switch (operator) {
        case "!=":
            return (v1 != v2) ? true : false;
        case "==":
            return (v1 == v2) ? true : false;
        case "===":
            return (v1 === v2) ? true : false;
        case "<":
            return (v1 < v2) ? true : false;
        case "<=":
            return (v1 <= v2) ? true : false;
        case ">":
            return (v1 > v2) ? true : false;
        case ">=":
            return (v1 >= v2) ? true : false;
        case "&&":
            return (v1 && v2) ? true : false;
        case "||":
            return (v1 || v2) ? true : false;
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper("formatDate", function (number, decimals, dec_point, thousands_sep) {
    return helper.number_format(number, decimals, dec_point, thousands_sep);
});

Handlebars.registerHelper("formatPhone", function (text) {
    return text.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, "+$1 $2 $3 $4 $5");
});

Handlebars.registerHelper("formatNumber", function (text, postfix) {
    var price = Number.prototype.toFixed.call(parseFloat(text) || 0, 0),
            //заменяем точку на запятую
            price_sep = price.replace(",", /(\D)/g),
            //добавляем пробел как разделитель в целых
            price_sep = price_sep.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1 ");

    return price_sep + postfix;
});

Handlebars.registerHelper("if_eq", function (a, b, opts) {
    if (a == b) // Or === depending on your needs
        return opts.fn(this);
    else
        return opts.inverse(this);
});

Handlebars.registerHelper("ending", function (number, base, e0, e1, e2) {
    base = !base ? "" : base;

    if (number % 100 > 10 && number % 100 < 20)
        return base + e0;
    if (number % 10 === 1)
        return base + e1;
    if (number % 10 >= 2 && number % 10 <= 4)
        return base + e2;
    return base + e0;

});

Handlebars.registerHelper("unixtime", function (time) {
    var date = new Date(time > 9461215465 ? time : time * 1000),
            day = ((date.getDate() + "").length == 1 ? "0" : "") + (date.getDate() + "");
    month = (((date.getMonth() + 1) + "").length == 1 ? "0" : "") + (date.getMonth() + 1);

    return day + "." + month + "." + date.getFullYear();
});

Handlebars.registerHelper("dateAndTime", function (time) {
    time = time; // Разобраться со временем!!
    var date = new Date(time > 9461215465 ? time : time * 1000),
            day = ((date.getDate() + "").length == 1 ? "0" : "") + (date.getDate() + ""),
            month = (((date.getMonth() + 1) + "").length == 1 ? "0" : "") + (date.getMonth() + 1),
            hours = ((date.getHours() + "").length == 1 ? "0" : "") + (date.getHours()),
            minutes = ((date.getMinutes() + "").length == 1 ? "0" : "") + (date.getMinutes());

    return day + "." + month + "." + date.getFullYear() + " " + hours + ":" + minutes;
});

Handlebars.registerHelper("ifCond", function (v1, operator, v2, options) {
    switch (operator) {
        case "!=":
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case "==":
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case "===":
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case "<":
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case "<=":
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case ">":
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case ">=":
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case "&&":
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case "||":
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

Handlebars.registerHelper("setVar", function (varName, varValue, options) {
    options.data.root[varName] = varValue;
});

Handlebars.registerHelper("for", function (from, to, incr, block) {
    var accum = "";
    for (var i = from; i < to; i += incr)
        accum += block.fn(i);
    return accum;
});













Handlebars.registerHelper("heightWindow", function () {
    return document.body.clientHeight ;
});