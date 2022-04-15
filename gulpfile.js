const del = require('del');
const { src, dest, parallel, series } = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const swig = require('gulp-swig');
const imagemin = require('gulp-imagemin');

const data = {
    menus: [{
        name: 'Home',
        icon: 'aperture',
        link: 'index.html'
    }, {
        name: 'Features',
        link: 'features.html',
    }, {
        name: 'Abount',
        link: 'about.html',
    }, {
        name: 'Contact',
        link: '#',
        children: [{
            name: 'Twitter',
            link: ''
        }, {
            name: 'About',
            link: '',
        }, {
            name: 'divider'
        }]
    }],
    pkg: require('./package.json'),
    date: new Date(),
};

const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(dest('dist'));
};

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('dist'));
}

const html = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(swig({ data }))
        .pipe(dest('dist'))
}

const image = () => {
    return src('src/assets/images/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}

const font = () => {
    return src('src/assets/fonts/**', { base: 'src' })
        .pipe(imagemin())
        .pipe(dest('dist'))
}

const extra = () => {
    return src('public/**', { base: 'public' })
        .pipe(dest('dist'))
}

const clear = () => {
    return del('dist');
}

const compile = parallel(style, script, html, image, font); 
const build = series(clear, parallel(compile, extra));

module.exports = { build };
