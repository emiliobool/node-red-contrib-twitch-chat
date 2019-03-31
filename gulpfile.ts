const path = require('path')
const { watch, src, dest, parallel, series } = require('gulp')
const inject = require('gulp-inject-string')
const ts = require('gulp-typescript')
const del = require('del')
const rename = require('gulp-rename')

const tsProject = ts.createProject('./tsconfig.json')
const through2 = require('through2')

const htmlTask = parallel([
    () =>
        src('src/*.html.ts')
            .pipe(
                through2.obj(function(file: any, _: any, cb: any) {
                    const { contents } = require(file.path)
                    file.contents = Buffer.from(contents)
                    cb(null, file)
                })
            )
            .pipe(rename({ extname: '' }))
            .pipe(dest('lib')),
    () => src('src/*.html').pipe(dest('lib')),
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
