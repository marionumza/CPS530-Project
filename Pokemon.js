// register the grid component
Vue.component('demo-grid', {

    template: '#grid-template', //allows <script type="text/x-template" id="grid-template"> in html to be used for template direction
    replace: true, //wraps the template and allows it to work
    props: { //passing data from parent componenets
        data: Array,
        columns: Array,
        filterKey: String
    },
    data: function () {
        var sortOrders = {}
        this.columns.forEach(function (key) {
            sortOrders[key] = 1
        })
        return {
            sortKey: '',
            sortOrders: sortOrders
        }
    },
    computed: {
        filteredData: function () {
            var sortKey = this.sortKey
            var filterKey = this.filterKey && this.filterKey.toLowerCase()
            var order = this.sortOrders[sortKey] || 1
            var data = this.data
            if (filterKey) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
                    })
                })
            }
            if (sortKey) {
                data = data.slice().sort(function (a, b) {
                    a = a[sortKey]
                    b = b[sortKey]
                    return (a === b ? 0 : a > b ? 1 : -1) * order
                })
            }
            return data
        }
    },
    filters: {
        capitalize: function (str) {
            return str.charAt(0).toUpperCase() + str.slice(1)
        }
    },
    methods: {
        sortBy: function (key) {
            this.sortKey = key
            this.sortOrders[key] = this.sortOrders[key] * -1
        }
    }
})

/**
 * Created by ClarkYin on 2016-11-02.
 */
// The raw data to observe
var stats = [
    { label: 'HP', value: 100 },
    { label: 'ATK', value: 100 },
    { label: 'DEF', value: 100 },
    { label: 'SP.ATK', value: 100 },
    { label: 'SP.DEF', value: 100 },
    { label: 'SPEED', value: 100 }
]

// A resusable polygon graph component
Vue.component('polygraph', {
    props: ['stats'],
    template: '#polygraph-template',
    computed: {
        // a computed property for the polygon's points
        points: function () {
            var total = this.stats.length
            return this.stats.map(function (stat, i) {
                var point = valueToPoint(stat.value, i, total)
                return point.x + ',' + point.y
            }).join(' ')
        }
    },
    components: {
        // a sub component for the labels
        'axis-label': {
            props: {
                stat: Object,
                index: Number,
                total: Number
            },
            template: '#axis-label-template',
            computed: {
                point: function () {
                    return valueToPoint(
                        +this.stat.value + 10,
                        this.index,
                        this.total
                    )
                }
            }
        }
    }
})

// math helper...
function valueToPoint (value, index, total) {
    var x     = 0
    var y     = -value * 0.8
    var angle = Math.PI * 2 / total * index
    var cos   = Math.cos(angle)
    var sin   = Math.sin(angle)
    var tx    = x * cos - y * sin + 100
    var ty    = x * sin + y * cos + 100
    return {
        x: tx,
        y: ty
    }
}

// bootstrap the app
var pokeapp = new Vue({
    el: '#pokeapp',
    data: {
        gridColumns: ['name', 'type', 'hp', 'attack', 'defense','sp.Atk','sp.Def','speed'],
        gridData: [
            { name: 'Bulbasaur', type: "Grass \\ Poison", hp:"45", attack:"49", defense: "49", 'sp.Atk': "65", 'sp.Def': "65", speed: "45"},
            { name: 'Charmander', type: "Fire", hp:"39", attack:"52", defense: "43", 'sp.Atk': "60", 'sp.Def': "50", speed: "65"},
            { name: 'Squirtle', type: "Water", hp:"44", attack:"48", defense: "65", 'sp.Atk': "50", 'sp.Def': "64", speed: "43"},
            { name: 'Pikachu', type: "Electric", hp:"35", attack:"55", defense: "40", 'sp.Atk': "55", 'sp.Def': "55", speed: "90"},
        ],
        selected: [
            { text: 'Bulbasaur'},
            { text: 'Charmander'},
            { text: 'Squirtle'}]
    }
})

// bootstrap the demo
new Vue({
    el: '#demo',
    data: {
        newLabel: '',
        stats: stats
    }
})
