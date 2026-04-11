# InfraMitra — Ubuntu VM Deployment Guide

Deploy the InfraMitra IT Hardware Marketplace on a single Ubuntu VM with Nginx, PostgreSQL, and PM2.

---

## Prerequisites

- Ubuntu 22.04 or 24.04 LTS VM (minimum 2 vCPU, 4GB RAM, 40GB disk)
- Domain name pointed to your VM's public IP (e.g. `inframitra.com`)
- SSH access with sudo privileges
- Ports 22, 80, and 443 open in firewall/security group

---

## Software Stack Overview

| Software | Version | Purpose |
|----------|---------|---------|
| Ubuntu | 22.04/24.04 LTS | Operating System |
| Node.js | 20.x LTS | JavaScript runtime for Next.js |
| npm | 10.x | Package manager (comes with Node.js) |
| PostgreSQL | 16 | Relational database |
| Nginx | Latest | Reverse proxy & SSL termination |
| PM2 | Latest | Node.js process manager (auto-restart, logging) |
| Certbot | Latest | Free SSL certificates from Let's Encrypt |
| Git | Latest | Source code management |
| build-essential | Latest | C/C++ compilers for native Node.js modules (bcrypt, etc.) |
| curl | Latest | HTTP requests for downloading installers |
| ufw | Latest | Ubuntu firewall management |
| nano/vim | Latest | Text editor for config files |
| openssl | Latest | Generate secure secrets |
| tsx | Latest | TypeScript executor for Prisma seed scripts |
| Prisma CLI | 7.x | Database migrations & ORM client generation |

---

## Step 1: System Update & Essential Tools

```bash
# Connect to your VM
ssh your-user@your-vm-ip

# Update package lists and upgrade existing packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools and utilities
sudo apt install -y \
  curl \
  git \
  build-essential \
  ufw \
  nano \
  htop \
  unzip \
  wget \
  ca-certificates \
  gnupg \
  lsb-release \
  openssl \
  software-properties-common

# Verify installations
git --version
curl --version | head -1
openssl version
```

---

## Step 2: Install Node.js 20 LTS

Node.js is required to run the Next.js application.

```bash
# Add NodeSource repository for Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js (includes npm)
sudo apt install -y nodejs

# Verify installation
node -v   # Should show v20.x.x
npm -v    # Should show 10.x.x

# Update npm to latest version
sudo npm install -g npm@latest

# Install npx globally (usually comes with npm, but just in case)
sudo npm install -g npx
```

---

## Step 3: Install PostgreSQL 16

PostgreSQL is the database that stores all application data.

```bash
# Add PostgreSQL 16 official repository
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update

# Install PostgreSQL 16
sudo apt install -y postgresql-16 postgresql-contrib-16

# Start and enable PostgreSQL to run on boot
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify it's running
sudo systemctl status postgresql
psql --version   # Should show psql (PostgreSQL) 16.x

# Create the application database and user
sudo -u postgres psql <<EOF
CREATE USER inframitra WITH PASSWORD 'your_strong_password_here';
CREATE DATABASE hardware_marketplace OWNER inframitra;
GRANT ALL PRIVILEGES ON DATABASE hardware_marketplace TO inframitra;
\q
EOF

# Test the connection
psql -h localhost -U inframitra -d hardware_marketplace -c "SELECT 1;"
# Enter the password when prompted — should return 1
```

**Important**: Replace `your_strong_password_here` with a strong password. Generate one with:
```bash
openssl rand -base64 24
```

---

## Step 4: Install Nginx

Nginx serves as a reverse proxy, forwarding web traffic to the Node.js app and handling SSL.

```bash
# Install Nginx
sudo apt install -y nginx

# Start and enable Nginx to run on boot
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify it's running
sudo systemctl status nginx
nginx -v   # Should show nginx version

# Test — open your VM's IP in a browser, you should see "Welcome to nginx!"
curl http://localhost
```

---

## Step 5: Install PM2 (Process Manager)

PM2 keeps your Node.js app running 24/7, auto-restarts on crash, and manages logs.

```bash
# Install PM2 globally
sudo npm install -g pm2

# Verify
pm2 --version   # Should show 5.x.x

# Install log rotation module (prevents log files from growing too large)
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 50M
pm2 set pm2-logrotate:retain 10
pm2 set pm2-logrotate:compress true
```

---

## Step 6: Install Certbot (SSL Certificates)

Let's Encrypt provides free SSL certificates. Certbot automates the process.

```bash
# Install Certbot with Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Verify
certbot --version
```

---

## Step 7: Configure Firewall

```bash
# Allow SSH (so you don't lock yourself out!)
sudo ufw allow OpenSSH

# Allow HTTP and HTTPS traffic
sudo ufw allow 'Nginx Full'

# Enable the firewall
sudo ufw enable

# Verify rules
sudo ufw status verbose
```

Expected output:
```
Status: active
To                         Action      From
--                         ------      ----
OpenSSH                    ALLOW       Anywhere
Nginx Full                 ALLOW       Anywhere
```

---

## Step 8: Clone the Application

```bash
# Create app directory
sudo mkdir -p /var/www/inframitra
sudo chown $USER:$USER /var/www/inframitra

# Clone the repository
cd /var/www/inframitra
git clone <YOUR_REPO_URL> .

# If using a private repo, set up SSH key first:
# ssh-keygen -t ed25519 -C "deploy@inframitra.com"
# cat ~/.ssh/id_ed25519.pub   # Add this to GitHub Deploy Keys

# Install all Node.js dependencies
npm install

# Install tsx globally (needed for Prisma seed script)
sudo npm install -g tsx
```

---

## Step 9: Configure Environment Variables

```bash
# Copy the example env file
cp .env.example .env

# Edit with your production values
nano .env
```

Set these values in `.env`:

```env
# Database — use the password you created in Step 3
DATABASE_URL="postgresql://inframitra:your_strong_password_here@localhost:5432/hardware_marketplace"

# Auth — MUST change these for production!
NEXTAUTH_URL="https://inframitra.com"
NEXTAUTH_SECRET="paste-output-of-openssl-rand-base64-32"
AUTH_SECRET="same-value-as-NEXTAUTH_SECRET"

# Google OAuth (optional — register at console.cloud.google.com)
# Redirect URI: https://inframitra.com/api/auth/callback/google
AUTH_GOOGLE_ID=""
AUTH_GOOGLE_SECRET=""

# Microsoft OAuth (optional — register at portal.azure.com)
# Redirect URI: https://inframitra.com/api/auth/callback/microsoft-entra-id
AUTH_MICROSOFT_ENTRA_ID_ID=""
AUTH_MICROSOFT_ENTRA_ID_SECRET=""
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID="common"

# File uploads
UPLOAD_DIR="./public/uploads"

# Public URL
NEXT_PUBLIC_APP_URL="https://inframitra.com"
```

Generate secure secrets:
```bash
# Generate NEXTAUTH_SECRET (copy the output)
openssl rand -base64 32
```

Create the uploads directory:
```bash
mkdir -p /var/www/inframitra/public/uploads
```

---

## Step 10: Database Migrations & Seed Data

```bash
cd /var/www/inframitra

# Run all database migrations (creates tables)
npx prisma migrate deploy

# Generate Prisma client (builds the ORM)
npx prisma generate

# Seed initial data (categories, brands, 19 sample products, admin/seller/buyer accounts)
npx prisma db seed
```

After seeding, you'll see:
```
Test accounts:
  Admin:  admin@inframitra.com / admin123
  Seller: seller1@inframitra.com / seller123
  Buyer:  buyer@inframitra.com / buyer123
```

---

## Step 11: Build the Application

```bash
cd /var/www/inframitra

# Build the production bundle
npm run build
```

This compiles TypeScript, optimizes assets, and creates the `.next` directory. Takes 1-3 minutes depending on VM specs.

---

## Step 12: Start the Application with PM2

```bash
cd /var/www/inframitra

# Start the app on port 3001
pm2 start npm --name "inframitra" -- start -- --port 3001

# Verify it's running
pm2 status
pm2 logs inframitra --lines 20

# Test locally
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
# Should return 200

# Save the PM2 process list (persists across reboots)
pm2 save

# Configure PM2 to start on system boot
pm2 startup
# PM2 will print a command like:
# sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u your-user --hp /home/your-user
# Copy and run that exact command
```

---

## Step 13: Configure Nginx Reverse Proxy

```bash
sudo nano /etc/nginx/sites-available/inframitra
```

Paste this configuration (replace `inframitra.com` with your domain):

```nginx
server {
    listen 80;
    server_name inframitra.com www.inframitra.com;

    # Will be modified by Certbot for HTTPS redirect

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 90;
        proxy_connect_timeout 90;
        proxy_send_timeout 90;
    }

    # Serve uploaded files directly via Nginx (faster than Node.js)
    location /uploads/ {
        alias /var/www/inframitra/public/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # Cache Next.js static assets aggressively
    location /_next/static/ {
        proxy_pass http://127.0.0.1:3001;
        expires 365d;
        add_header Cache-Control "public, immutable";
    }

    # Max upload size (for hardware photos)
    client_max_body_size 50M;
}
```

Enable the site and test:

```bash
# Enable the site
sudo ln -s /etc/nginx/sites-available/inframitra /etc/nginx/sites-enabled/

# Remove the default Nginx page
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration for syntax errors
sudo nginx -t
# Should show: syntax is ok / test is successful

# Reload Nginx
sudo systemctl reload nginx
```

Visit `http://inframitra.com` in your browser — you should see the InfraMitra homepage.

---

## Step 14: Enable SSL (HTTPS)

```bash
# Get free SSL certificate from Let's Encrypt
sudo certbot --nginx -d inframitra.com -d www.inframitra.com

# Follow the prompts:
# - Enter email address
# - Agree to terms
# - Choose to redirect HTTP to HTTPS (recommended)

# Verify auto-renewal works
sudo certbot renew --dry-run
```

Your site is now live at `https://inframitra.com`

---

## Step 15: Post-Deployment Security Checklist

```bash
# 1. Change default admin password — login at https://inframitra.com/signin
#    with admin@inframitra.com / admin123, then go to /settings

# 2. Verify firewall is active
sudo ufw status

# 3. Disable root SSH login (if not already)
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
sudo systemctl restart ssh

# 4. Set up automatic security updates
sudo apt install -y unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# 5. Configure PostgreSQL to only accept local connections
# (default is already localhost-only, verify with:)
sudo grep "listen_addresses" /etc/postgresql/16/main/postgresql.conf
# Should show: listen_addresses = 'localhost'
```

---

## Verification Checklist

After deployment, verify everything works:

| Check | URL / Command | Expected |
|-------|---------------|----------|
| Homepage | `https://inframitra.com` | Landing page with hero, categories, services |
| Products | `https://inframitra.com/products` | 19 seeded products with INR prices |
| Sign In | `https://inframitra.com/signin` | Login form with email/password |
| Admin Login | Sign in with `admin@inframitra.com` | Access to `/admin` panel |
| Configure | `https://inframitra.com/configure` | Services showcase + form |
| Sell Hardware | `https://inframitra.com/sell-hardware` | Hardware selling form |
| E-Waste | `https://inframitra.com/e-recycle` | Full e-waste services page |
| AI Chat | Click blue chat bubble | Chatbot responds |
| WhatsApp | Click green button | Opens WhatsApp |
| Phone | Click blue phone button | Initiates call to +91 99106 68689 |
| SSL | Check browser padlock | Green padlock, valid certificate |
| API | `curl https://inframitra.com/api/products` | JSON with products |

---

## Maintenance Commands

```bash
# View app logs (live)
pm2 logs inframitra

# View last 100 lines of logs
pm2 logs inframitra --lines 100

# Restart the app
pm2 restart inframitra

# Stop the app
pm2 stop inframitra

# Monitor CPU/memory in real-time
pm2 monit

# Check system resources
htop
df -h     # Disk usage
free -h   # Memory usage

# Database backup (run daily via cron)
pg_dump -h localhost -U inframitra hardware_marketplace > /var/backups/inframitra_$(date +%Y%m%d_%H%M%S).sql

# Restore from backup
psql -h localhost -U inframitra hardware_marketplace < /var/backups/inframitra_20260407.sql

# Set up daily automated backup (runs at 2 AM)
(crontab -l 2>/dev/null; echo "0 2 * * * pg_dump -h localhost -U inframitra hardware_marketplace > /var/backups/inframitra_\$(date +\%Y\%m\%d).sql") | crontab -

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## Update & Redeploy

When you push new code to your repository:

```bash
cd /var/www/inframitra

# Pull latest code
git pull origin main

# Install any new dependencies
npm install

# Run any new database migrations
npx prisma migrate deploy
npx prisma generate

# Rebuild the application
npm run build

# Restart with zero downtime
pm2 restart inframitra

# Verify
pm2 status
curl -s -o /dev/null -w "%{http_code}" http://localhost:3001
```

Or use the deploy script:

```bash
# Create deploy script
cat > /var/www/inframitra/deploy.sh << 'EOF'
#!/bin/bash
set -e
echo "=== InfraMitra Deploy Started at $(date) ==="
cd /var/www/inframitra
git pull origin main
npm install
npx prisma migrate deploy
npx prisma generate
npm run build
pm2 restart inframitra
echo "=== Deploy Complete at $(date) ==="
EOF

chmod +x /var/www/inframitra/deploy.sh

# Run it anytime with:
./deploy.sh
```

---

## Troubleshooting

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| App won't start | `pm2 logs inframitra` | Check error messages, fix and restart |
| 502 Bad Gateway | `pm2 status` | App crashed — `pm2 restart inframitra` |
| Database connection error | `sudo systemctl status postgresql` | Start PostgreSQL: `sudo systemctl start postgresql` |
| "Cannot find module" | `npm install` in app directory | Missing dependencies — reinstall |
| Permission denied | `ls -la /var/www/inframitra` | Fix ownership: `sudo chown -R $USER:$USER /var/www/inframitra` |
| SSL certificate expired | `sudo certbot certificates` | Renew: `sudo certbot renew` |
| Disk full | `df -h` | Clean logs: `pm2 flush`, clean old backups |
| High memory | `pm2 monit` | Set memory limit: `pm2 restart inframitra --max-memory-restart 1G` |
| Port 3001 in use | `lsof -i :3001` | Kill old process: `kill -9 <PID>` |
| Prisma migration error | Check migration status | `npx prisma migrate status` |
| Nginx config error | `sudo nginx -t` | Fix syntax in `/etc/nginx/sites-available/inframitra` |
| Node.js version wrong | `node -v` | Reinstall: `sudo apt install -y nodejs` |
