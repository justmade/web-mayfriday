const appDirectory = process.env.APP_DIR || '/var/www/web-mayfriday/app'
const distDirectory = process.env.DIST_DIR || '/var/www/web-mayfriday/dist'

module.exports = {
  apps: [{
    name: 'web-mayfriday',
    cwd: appDirectory,
    script: './server.js',
    instances: 1,
    exec_mode: 'fork',
    max_memory_restart: '500M',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
      DIST_DIR: distDirectory,
    },
    error_file: '/var/log/pm2/web-mayfriday-error.log',
    out_file: '/var/log/pm2/web-mayfriday-out.log',
  }],
}
