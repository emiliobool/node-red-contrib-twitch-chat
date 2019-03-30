const { watch, src, dest, parallel, series } = require('gulp')
const inject = require('gulp-inject-string')
const ts = require('gulp-typescript')
const del = require('del')

const events = require('./src/events')
const commands = require('./src/commands')

const tsProject = ts.createProject('./tsconfig.json')
const es = require('event-stream')

const htmlTask = parallel([
    () =>
        src('src/*.html.ts')
            .pipe(
                es.map(function(file: any, cb: any) {
                    console.log(JSON.stringify(file))
                    return file
                    // inject.append(contents)
                })
            ),
    () =>
        src('src/*.html')
            .pipe(inject.replace("'{commands}'", JSON.stringify(commands)))
            .pipe(inject.replace("'{events}'", JSON.stringify(events)))
            .pipe(dest('lib')),
    () => src('./src/icons/**').pipe(dest('./lib/icons')),
])

function jsTask() {
    return src(['src/*.ts', '!src/*.spec*.ts'])
        .pipe(tsProject())
        .pipe(dest('lib'))
}

function docTask() {}
const buildTask = series(cleanTask, parallel([htmlTask, jsTask]))

function watchTask() {
    return watch(['src/*.html', 'src/*.ts', '!src/*.spec*.ts'], buildTask)
}

function cleanTask() {
    return del(['lib/**'])
}

exports.html = htmlTask
exports.js = jsTask
exports.build = buildTask
exports.clean = cleanTask
exports.default = buildTask
exports.watch = watchTask
exports.doc = docTask
