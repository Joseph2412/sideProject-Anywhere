module.exports = {
  apps: [{
    name: 'HOST',
    exec_mode: 'cluster',
    log_date_format: 'YYYY-MM-DD HH:mm Z',
    autorestart: true,
    watch: false,
    script: 'npm',
    args: `run start`,
    max_memory_restart: '1G'
  }]
}