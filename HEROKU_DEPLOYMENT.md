# Heroku Deployment Guide for BTLiveStream

This guide will walk you through deploying the BTLiveStream application to Heroku.

## Prerequisites

1. **Heroku CLI** - Install from https://devcenter.heroku.com/articles/heroku-cli
2. **Heroku Account** - Create at https://www.heroku.com
3. **Git** - Already initialized in this project

## Deployment Steps

### 1. Login to Heroku

```bash
heroku login
```

### 2. Create a New Heroku App

```bash
heroku create btlivestream-app
```

Replace `btlivestream-app` with your desired app name (must be unique across all Heroku).

### 3. Add PostgreSQL Database

```bash
heroku addons:create heroku-postgresql:hobby-dev
```

This creates a free PostgreSQL database. Heroku automatically sets the `DATABASE_URL` environment variable.

### 4. Set Environment Variables

```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your_secret_key_here
heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
```

Replace the values appropriately:
- `your_secret_key_here` - Use a strong, random secret
- `your-app-name` - Your Heroku app name

### 5. Deploy to Heroku

```bash
git push heroku main
```

Or if your main branch has a different name:
```bash
git push heroku your-branch-name:main
```

### 6. Initialize Database

The database initialization happens automatically via the release phase defined in `Procfile`:

```
release: npm run db:setup
```

You can also manually initialize if needed:
```bash
heroku run npm run db:setup
```

### 7. Verify Deployment

```bash
# Check app status
heroku ps

# View logs
heroku logs --tail

# Test the health endpoint
curl https://your-app-name.herokuapp.com/api/health
```

## Environment Variables

The following environment variables are automatically or should be configured:

| Variable | Source | Description |
|----------|--------|-------------|
| `DATABASE_URL` | Heroku Postgres add-on | PostgreSQL connection string |
| `NODE_ENV` | Manual | Must be set to `production` |
| `JWT_SECRET` | Manual | Secret key for JWT tokens |
| `CLIENT_URL` | Manual | Frontend URL for CORS |
| `SERVER_PORT` | Auto | Port provided by Heroku (default 5000) |

## Application Flow

1. **Release Phase** - Database tables are initialized (`npm run db:setup`)
2. **Web Process** - Express server starts and serves React static files
3. **React Frontend** - Built during `npm run build` and served from the Express server

## Important Notes

### Database Connections
- The app automatically uses the `DATABASE_URL` environment variable if available
- In production, the app pools connections and has timeouts configured

### Static Files
- React is built during deployment (`build` script in postbuild)
- Express serves these files from the `build/` directory
- All API routes remain accessible under `/api/`

### Logs
View application logs in real-time:
```bash
heroku logs --tail
```

### Troubleshooting

**Build fails:**
```bash
heroku run npm install
heroku run npm run build
```

**Database connection issues:**
```bash
heroku config
heroku pg:info
```

**Restart the app:**
```bash
heroku restart
```

**Scale dynos:**
```bash
heroku ps:scale web=1
```

## Scaling & Performance

### Free Tier Limitations
- 1 Dyno (basic web server)
- PostgreSQL hobby-dev (limited to 10,000 rows)
- App sleeps after 30 minutes of inactivity

### Upgrade to Paid
```bash
heroku dyno:type standard-1x
```

## Custom Domain

Connect a custom domain:
```bash
heroku domains:add www.example.com
```

Then update your domain registrar's DNS records.

## Continuous Deployment

Set up automatic deployments from GitHub:
1. Go to Heroku Dashboard
2. Select your app
3. Go to Deploy tab
4. Connect to GitHub
5. Enable automatic deploys

## Rolling Back

If something goes wrong, you can rollback:
```bash
heroku builds:info
heroku rollback v1
```

## Monitoring

Upgrade to access better monitoring:
```bash
heroku addons:create newrelic:wayne
```

## More Information

- [Heroku Node.js Support](https://devcenter.heroku.com/articles/nodejs-support)
- [Heroku PostgreSQL](https://devcenter.heroku.com/articles/heroku-postgresql)
- [Procfile Documentation](https://devcenter.heroku.com/articles/procfile)
