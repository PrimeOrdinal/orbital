const gulp = require("gulp");
const del = require("del");
const spawn = require("child_process").spawn;

/**
 * Cleans the prpl-server build in the app directory.
 */
gulp.task("build:app:clean", () => {
  return del("packages/app/build", "packages/app/build");
});

/**
 * Cleans the prpl-server build in the server directory.
 */
gulp.task("build:server:clean", () => {
  return del("packages/server/dist");
});

/**
 * Copies the prpl-server build to the app directory while renaming the
 * node_modules directory so services like App Engine will upload it.
 */
gulp.task("build:app:copy:public", () => {
  // Note: npm run rename is a hack to workaround App Engine ignoring uploads of any "node_modules/" directory - rename the build output to "node_assets/" and update references.
  return gulp
    .src("packages/app/public/**")
    .pipe(gulp.dest("packages/app/build"));
});

/**
 * Copies the src build to the server directory
 */
gulp.task("build:server:copy:views", () => {
  return gulp
    .src("packages/server/src/views/**")
    .pipe(gulp.dest("packages/server/dist/views"));
});

/**
 * Copies the src build to the app directory
 */
gulp.task("build:app:copy:manifest", () => {
  return gulp
    .src("packages/app/package*")
    .pipe(gulp.dest("packages/app/build"));
});

/**
 * Copies the src build to the server directory
 */
gulp.task("build:server:copy:manifest", () => {
  return gulp
    .src("packages/server/package*")
    .pipe(gulp.dest("packages/server/dist"));
});

/**
 * Install npm dependencies
 */
gulp.task("build:app:npm", () => {
  const spawnOptions = {
    cwd: "packages/app/build",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };

  return spawn("npm", ["install", "--production"], spawnOptions);
});

/**
 * Install npm dependencies
 */
gulp.task("build:server:npm", () => {
  const spawnOptions = {
    cwd: "packages/server/dist",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };

  return spawn("npm", ["install", "--production"], spawnOptions);
});

/**
 * Compiles the source TypeScript and outputs to the app directory.
 */
gulp.task("build:app:polymer", () => {
  const spawnOptions = {
    cwd: "packages/app/build",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };

  return spawn("polymer", ["build",
  // "--base-path=packages/app"
  // "--auto-base-path"
  ], spawnOptions);
});

/**
 * Compiles the source TypeScript and outputs to the app directory.
 */
gulp.task("build:app:move", () => {
  const spawnOptions = {
    cwd: "packages/app/build",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };

  return spawn("mv", ["build", "../dist"], spawnOptions);
});

/**
 * Cleans the dist build in the app directory.
 */
gulp.task("build:app:tidy", () => {
  return del("packages/app/build");
});

/**
 * Compiles the source TypeScript and outputs to the app directory.
 */
gulp.task("build:app:tsc", () => {
  const spawnOptions = {
    cwd: "packages/app",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };

  return spawn("tsc", ["--build", "--force"], spawnOptions);
});

/**
 * Compiles the source TypeScript and outputs to the server directory.
 */
gulp.task("build:server:tsc", () => {
  const spawnOptions = {
    cwd: "packages/server",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };

  return spawn("tsc", ["--build", "--force"], spawnOptions);
});

gulp.task("build:app", gulp.series("build:app:clean", "build:app:copy:manifest", "build:app:copy:public", "build:app:npm", "build:app:tsc", "build:app:polymer", "build:app:move"));
gulp.task("build:server", gulp.series("build:server:clean", "build:server:copy:manifest", "build:server:copy:views", "build:server:npm", "build:server:tsc"));
gulp.task("build", gulp.series("build:app", "build:server"));

/**
 * Gulp task to run `tsc --watch` and `polymer serve` in parallel.
 */
gulp.task("serve:app", () => {
  const spawnOptions = {
    cwd: "packages/app/dist/esm-bundled",
    // `shell` option for Windows compatability. See:
    // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
    shell: true,
    stdio: "inherit"
  };
  // spawn("tsc", ["--build", "--watch"], spawnOptions);
  spawn(
    "polymer",
    ["serve", "--hostname", "0.0.0.0", "--port", "5864"],
    spawnOptions
  );
});

gulp.task("default", gulp.series("build"));
