const del = require('del');
const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const swig = require('gulp-swig');
const imagemin = require('gulp-imagemin');
const useref = require('gulp-useref');
const $if = require('gulp-if');
const uglify = require('gulp-uglify');
const minCss = require('gulp-clean-css');
const minHtml = require('gulp-htmlmin');
const browserSync = require('browser-sync');

const bs = browserSync.create();

const data = {
    menus: [
        {
            name: 'Home',
            icon: 'aperture',
            link: 'index.html'
        },
        {
            name: 'Features',
            link: 'features.html'
        },
        {
            name: 'About',
            link: 'about.html'
        },
        {
            name: 'Contact',
            link: '#',
            children: [
            {
                name: 'Twitter',
                link: 'https://twitter.com/w_zce'
            },
            {
                name: 'About',
                link: 'https://weibo.com/zceme'
            },
            {
                name: 'divider'
            },
            {
                name: 'About',
                link: 'https://github.com/zce'
            }
            ]
        }
    ],
    pkg: require('./package.json'),
    date: new Date(),
};

const style = () => {
    return src('src/assets/styles/*.scss', { base: 'src' })
        .pipe(sass({ outputStyle: 'expanded' }))
        .pipe(dest('temp'));
};

const script = () => {
    return src('src/assets/scripts/*.js', { base: 'src' })
        .pipe(babel({ presets: ['@babel/preset-env'] }))
        .pipe(dest('temp'));
}

const html = () => {
    return src('src/*.html', { base: 'src' })
        .pipe(swig({ data }))
        .pipe(dest('temp'))
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
    return del(['temp', 'dist']);
}

const merge = () => {
    return src('temp/*.html')
        .pipe(useref({ searchPath: ['temp', '.'] }))
        .pipe($if(/\.js$/, uglify()))
        .pipe($if(/\.css$/, minCss()))
        .pipe($if(/\.html$/, minHtml({ 
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
        })))
        .pipe(dest('dist'));
}

const server = () => {
    watch('src/assets/styles/*.scss', style);
    watch('src/assets/scripts/*.js', script);
    watch('src/*.html', html);

    watch([
        'src/assets/images/**',
        'src/assets/fonts/**',
        'public/**',
    ], bs.reload)

    bs.init({
        files: 'temp/**',
        server: {
            baseDir: ['temp', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
}

const compile = parallel(style, script, html); 
// 上线之前执行
const build = series(clear, parallel(series(compile, merge), image, font, extra));
const dev = series(clear, compile, server);

module.exports = { build, dev, merge, compile };
