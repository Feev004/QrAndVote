# API Backend

`
npm run build

pm2 start dist/index.js -n "api_notion"
pm2 restart api_notion

pm2 status 
pm2 stop [id]name
pm2 delete [id]name
pm2 restart [id]name
pm2 start [file] -n "name"
`