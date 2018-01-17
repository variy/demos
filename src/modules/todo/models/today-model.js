module.exports = {
    notDone: {
        txt: '未完成',
        _filter: function(list) {
            return list.filter(function(item) {
                return !item.done;
            });
        }
    },
    hasDone: {
        txt: '已完成',
        _filter: function(list) {
            return list.filter(function(item) {
                return item.done;
            });
        }
    }
};