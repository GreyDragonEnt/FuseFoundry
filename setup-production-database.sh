#!/bin/bash
# Production Database Setup Script for FuseFoundry
# Run this on your VPS after PostgreSQL installation

set -e

# Configuration
DB_NAME="fusefoundry_production"
DB_USER="fusefoundry"
DB_PASSWORD="$(openssl rand -base64 32)"
BACKUP_DIR="/var/backups/fusefoundry"

echo "🚀 Setting up FuseFoundry Production Database..."

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
fi

# Create database and user
echo "🔧 Creating database and user..."
sudo -u postgres psql -c "CREATE DATABASE $DB_NAME;" || echo "Database already exists"
sudo -u postgres psql -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" || echo "User already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
sudo -u postgres psql -c "ALTER USER $DB_USER CREATEDB;" # Allow user to create databases for testing

# Run schema migrations
echo "📋 Running schema migrations..."
cd /var/www/fusefoundry

# Run initial schema
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -f database/001_initial_schema.sql || echo "Schema 001 already applied"
PGPASSWORD=$DB_PASSWORD psql -h localhost -U $DB_USER -d $DB_NAME -f database/002_service_orders.sql || echo "Schema 002 already applied"

# Create backup directory
sudo mkdir -p $BACKUP_DIR
sudo chown fusefoundry:fusefoundry $BACKUP_DIR

# Create backup script
sudo tee /usr/local/bin/backup-fusefoundry.sh > /dev/null << EOF
#!/bin/bash
BACKUP_FILE="$BACKUP_DIR/fusefoundry_\$(date +%Y%m%d_%H%M%S).sql"
PGPASSWORD=$DB_PASSWORD pg_dump -h localhost -U $DB_USER $DB_NAME > \$BACKUP_FILE
gzip \$BACKUP_FILE
echo "Database backup created: \${BACKUP_FILE}.gz"

# Keep only last 7 days of backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +7 -delete
EOF

sudo chmod +x /usr/local/bin/backup-fusefoundry.sh

# Set up daily backup cron job
echo "0 2 * * * /usr/local/bin/backup-fusefoundry.sh" | sudo crontab -u fusefoundry -

# Update environment file
ENV_FILE="/var/www/fusefoundry/.env.production"
sudo tee $ENV_FILE > /dev/null << EOF
NODE_ENV=production
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
USE_MOCK_DB=false
NEXTAUTH_URL=https://fusefoundry.dev
NEXTAUTH_SECRET=$(openssl rand -base64 32)
ADMIN_EMAIL=admin@fusefoundry.dev
ADMIN_PASSWORD=FuseFoundry2025!
GOOGLE_AI_API_KEY=${GOOGLE_AI_API_KEY:-}
WEBHOOK_SECRET=${WEBHOOK_SECRET:-$(openssl rand -base64 32)}
WEBHOOK_PORT=9000
EOF

sudo chown fusefoundry:fusefoundry $ENV_FILE
sudo chmod 600 $ENV_FILE

echo "✅ Database setup complete!"
echo ""
echo "📝 Database Details:"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"
echo "   Password: $DB_PASSWORD"
echo ""
echo "🔐 Environment file created: $ENV_FILE"
echo "📦 Daily backups configured at 2 AM"
echo ""
echo "⚠️  IMPORTANT: Save the database password securely!"
echo "   Database Password: $DB_PASSWORD"
echo ""
echo "🔄 Next step: Restart the application with 'pm2 restart fusefoundry'"