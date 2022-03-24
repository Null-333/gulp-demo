import gulp from 'gulp';

// 实现这个项目的构建任务
const tast1 = (done) => {
    setTimeout(() => {
        console.log('tast1');
        done();
    }, 1000);
}
const tast2 = (done) => {
    setTimeout(() => {
        console.log('tast2');
        done();
    });
}
const tast3 = (done) => {
    setTimeout(() => {
        console.log('tast3');
        done();
    }, 1000);
}
const seriesTask = gulp.series(tast1, tast2, tast3);
const parallelTask = gulp.parallel(tast1, tast2, tast3);

export { seriesTask, parallelTask };
