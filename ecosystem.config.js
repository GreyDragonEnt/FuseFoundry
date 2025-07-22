module.exports = {
  apps: [{
    name: 'fusefoundry',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/fusefoundry',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/pm2/fusefoundry-error.log',
    out_file: '/var/log/pm2/fusefoundry-out.log',
    log_file: '/var/log/pm2/fusefoundry.log',
    time: true,
    watch: false,
    ignore_watch: ['node_modules', '.git', '.next'],
    max_memory_restart: '1G',
    node_args: '--max-old-space-size=1024',
    
    // Auto-restart settings
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Development environment (for testing)
    env_development: {
      NODE_ENV: 'development',
      PORT: 3001,
      watch: true
    }
  }]
};
