# Heroku Deployment Checklist

Complete this checklist before deploying to Heroku.

## Pre-Deployment Setup

- [ ] **Install Heroku CLI**
  ```bash
  brew tap heroku/brew && brew install heroku
  heroku login
  ```

- [ ] **Review Procfile**
  - Procfile exists in root directory
  - Contains: `web: npm run start:prod`
  - Contains: `release: npm run db:setup`

- [ ] **Verify package.json**
  - [ ] "start:prod" script exists: `npm run build:react && node server.js`
  - [ ] "build:react" script exists: `react-scripts build`
  - [ ] "engines" field specifies Node 18.16.0
  - [ ] All dependencies are correct

- [ ] **Database Configuration**
  - [ ] config/database.js supports DATABASE_URL
  - [ ] SSL configured for production PostgreSQL
  - [ ] Connection pooling configured

- [ ] **Server Configuration**
  - [ ] Server uses PORT environment variable
  - [ ] CORS configured with CLIENT_URL
  - [ ] Static file serving from build/ configured
  - [ ] Client-side routing handled

- [ ] **Environment Variables**
  - [ ] JWT_SECRET is configured
  - [ ] NODE_ENV set to production
  - [ ] CLIENT_URL points to Heroku app

## Deployment Steps

1. [ ] **Git Configuration**
   ```bash
   git add -A
   git commit -m "Prepare for Heroku deployment"
   git push origin main
   ```

2. [ ] **Create Heroku App**
   ```bash
   heroku create btlivestream-app
   # Replace 'btlivestream-app' with your desired app name
   ```

3. [ ] **Add PostgreSQL**
   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. [ ] **Set Environment Variables**
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-strong-random-secret
   heroku config:set CLIENT_URL=https://your-app-name.herokuapp.com
   ```

5. [ ] **Deploy to Heroku**
   ```bash
   git push heroku main
   ```

6. [ ] **Monitor Deployment**
   ```bash
   heroku logs --tail
   ```

7. [ ] **Verify Deployment**
   ```bash
   heroku open
   # or
   curl https://your-app-name.herokuapp.com/api/health
   ```

## Post-Deployment Verification

- [ ] **API Health Check**
  ```bash
  curl https://your-app-name.herokuapp.com/api/health
  ```

- [ ] **Database Connected**
  ```bash
  heroku run "npm run db:init" --exit-code
  ```

- [ ] **Frontend Loads**
  - Visit https://your-app-name.herokuapp.com
  - Check that React app loads

- [ ] **Authentication Works**
  - Test user registration
  - Test user login
  - Verify JWT tokens

- [ ] **API Endpoints Respond**
  ```bash
  # Create a test user
  curl -X POST https://your-app-name.herokuapp.com/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123","name":"Test User"}'
  ```

## Common Issues & Solutions

### Build Fails
```bash
# Clear build cache and rebuild
heroku run "npm run build:react" --exit-code
heroku restart
```

### Database Issues
```bash
# Check database status
heroku pg:info

# Reset database (WARNING: Deletes all data)
heroku pg:reset DATABASE
heroku run "npm run db:setup" --exit-code
```

### Cannot find module errors
```bash
# Verify package.json is correct
git push heroku main

# Clear Heroku cache
git push heroku main --force
```

### App crashes on startup
```bash
# View logs
heroku logs --tail --app=your-app-name

# Check Node version
node --version
```

## Monitoring

### Real-time Logs
```bash
heroku logs --tail
```

### View Config
```bash
heroku config
```

### Check Dyno Status
```bash
heroku ps
```

### Scale Dynos
```bash
# Start with 1 free dyno
heroku ps:scale web=1

# Upgrade to paid tier for better performance
heroku dyno:type standard-1x
```

## Rollback

If something breaks, rollback to previous version:
```bash
heroku releases
heroku rollback v1  # Adjust version number as needed
```

## Performance Tips

- [ ] **Enable caching** - Configure Redis add-on for sessions
- [ ] **Database indexes** - Verify indexes are created
- [ ] **Connection pooling** - Already configured in code
- [ ] **Compression** - Add compression middleware if needed
- [ ] **CDN** - Use CloudFlare for static assets

## Security Checklist

- [ ] **HTTPS Only** - Heroku enforces HTTPS
- [ ] **Environment Secrets** - All secrets in Heroku config (not in code)
- [ ] **Database Encryption** - Heroku PostgreSQL encrypted by default
- [ ] **CORS Configured** - Limited to CLIENT_URL
- [ ] **Password Hashing** - Using bcryptjs
- [ ] **JWT Secrets** - Strong random secret in production

## Additional Resources

- [Heroku Node.js Deployment](https://devcenter.heroku.com/articles/deploying-nodejs)
- [Heroku PostgreSQL](https://devcenter.heroku.com/articles/heroku-postgresql)
- [Procfile Documentation](https://devcenter.heroku.com/articles/procfile)
- [Heroku CLI Reference](https://devcenter.heroku.com/articles/heroku-cli)

---

**Last Updated:** February 2026
**App Name:** BTLiveStream
**Status:** Ready for deployment
