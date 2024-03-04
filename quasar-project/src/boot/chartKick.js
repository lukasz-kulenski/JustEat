import VueChartkick from 'vue-chartkick'
import 'chartkick/chart.js'

export default ({ app }) => {
    app.use(VueChartkick)
}