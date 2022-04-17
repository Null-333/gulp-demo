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

const merge = () => {
    return src('dist/*.html')
        .pipe(useref({ searchPath: ['dist', '.'] }))
        .pipe($if(/\.js$/, uglify()))
        .pipe($if(/\.css$/, minCss()))
        .pipe($if(/\.html$/, minHtml({ 
            collapseWhitespace: true,
            minifyCSS: true,
            minifyJS: true,
        })))
        .pipe(dest('release'));
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
        files: 'dist/**',
        server: {
            baseDir: ['dist', 'src', 'public'],
            routes: {
                '/node_modules': 'node_modules'
            }
        }
    });
}

const compile = parallel(style, script, html); 
const build = series(clear, parallel(compile, image, font, extra));
const dev = series(clear, compile, server);

module.exports = { build, dev, merge, compile };
