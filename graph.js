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

// bootstrap the demo
new Vue({
    el: '#demo',
    data: {
        newLabel: '',
        stats: stats
    }
})
