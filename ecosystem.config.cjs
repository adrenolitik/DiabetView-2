module.exports = {
  apps: [
    {
      name: 'diabetview2',
      script: 'npx',
      args: 'vite preview --port 3000 --host 0.0.0.0',
      cwd: '/home/user/webapp',
      env: { NODE_ENV: 'production' },
      watch: false,
      instances: 1,
      exec_mode: 'fork'
    }
  ]
}
