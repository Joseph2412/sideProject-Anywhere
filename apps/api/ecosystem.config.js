module.exports = {
  apps: [{
    name: 'API',
    exec_mode: 'cluster',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    autorestart: true,
    watch: false,
    script: './dist/index.js',
    max_memory_restart: '1G'
  }]
}