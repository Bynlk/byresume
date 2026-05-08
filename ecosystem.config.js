module.exports = {
  apps: [
    {
      name: 'byresume',
      script: 'npm',
      args: 'start',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3001,
      },
      // 自动重启配置
      autorestart: true,
      watch: false,
      // 日志配置
      log_file: './logs/combined.log',
      out_file: './logs/out.log',
      error_file: './logs/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      // 资源限制
      max_memory_restart: '1G',
      // PM2 等待时间
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    }
  ]
};