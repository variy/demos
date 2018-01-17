var taskListData = require('../data/tasks');
var optsMap = {
    'all': {
        opts: require('./all-model'),
        _filter: function(list){
            return _.extend(list);
        }
    },
    'today': {
        opts: require('./today-model'),
        _filter: function(list){
            return list.filter(function(item){
                return new Date(item.date).toDateString() === new Date().toDateString();
            })
        }
    },
    'tomorrow': {
        opts: require('./today-model'),
        _filter: function(list){
            return list.filter(function(item){
                return new Date(item.date).toDateString() === new Date().toDateString();
            })
        }
    }
}

var _initData = function(list, opts) {
    var arr = [];
    for (var attr in opts) {
        var item = opts[attr];
        arr.push({
            txt: item.txt,
            list: item._filter(list)
        })
    }
    return arr;
}

var O = function(list, type){
    this.type = type || 'all';
    this.originList = list;
    this.validList = optsMap[this.type]._filter(this.originList);
    this.opts = optsMap[type].opts;
    this.listData = _initData(this.validList, this.opts);
}

O.prototype.toggleType = function(type){
    this.type = type;
    this.opts = optsMap[type].opts;
    this.validList = optsMap[this.type]._filter(this.originList);
    this.listData = _initData(this.validList, this.opts);
}

O.prototype.initData = function(id, opts){
    var target = _.findWhere(this.originList, {id: id});
    for(var attr in opts){
        target[attr] = opts[attr];
    }

    this.validList = optsMap[this.type]._filter(this.originList);
    this.listData = _initData(this.validList, this.opts);
}

module.exports = new O(taskListData, 'all');



