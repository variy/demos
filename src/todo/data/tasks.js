var Task = function(){
    this.date = '';
    this.title = '';
    this.description = '';
    this.tags = [];
};

module.exports = [
    {   
        id: '001',
        date: '2017-10-12 10:00',
        title: 'test1',

        description: 'test1-test1',
        done: false,
        tags: ['test']
    },
    {
        id: '002',
        date: '2017-10-12 11:00',
        title: 'test2',
        description: 'test-test',
        done: true,
        tags: ['test']
    },
    {
        id: '003',
        date: '2017-10-12 12:00',
        title: 'test3',
        description: 'test3-test3',
        done: true,
        tags: ['finance']
    },
    {
        id: '004',
        title: 'test4',
        description: 'test3-test3',
        done: false,
        tags: ['finance']
    },
    {
        id: '005',
        title: 'test5',
        description: 'test3-test3',
        done: false,
        tags: ['finance']
    },
    {
        id: '006',
        title: 'test6',
        date: '2017-10-12 12:00',
        description: 'test3-test3',
        done: false,
        tags: ['finance']
    },
    {
        id: '007',
        title: 'test7',
        date: '2017-10-13 12:00',
        description: 'test3-test3',
        done: false,
        tags: ['finance']
    }
]