#!/bin/bash
# Database setup script for FuseFoundry

set -e

DB_NAME="fusefoundry"
DB_USER="fusefoundry_user"
DB_PASSWORD="$(openssl rand -base64 32)"

echo "🗄️ Setting up PostgreSQL database for FuseFoundry..."

# Install PostgreSQL if not already installed
if ! command -v psql &> /dev/null; then
    echo "📦 Installing PostgreSQL..."
    sudo apt update
    sudo apt install -y postgresql postgresql-contrib
fi

# Start PostgreSQL service
sudo systemctl enable postgresql
sudo systemctl start postgresql

# Create database and user
echo "👤 Creating database and user..."
sudo -u postgres psql << EOF
-- Create database
CREATE DATABASE $DB_NAME;

-- Create user
CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;

-- Grant schema privileges
GRANT ALL ON SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $DB_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $DB_USER;

-- Alter default privileges
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO $DB_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO $DB_USER;

-- Exit
\q
EOF

# Run initial migration
echo "🔄 Running initial database migration..."
sudo -u postgres psql -d $DB_NAME -f /var/www/fusefoundry/database/001_initial_schema.sql

# Update environment file with database credentials
echo "⚙️ Updating environment variables..."
sudo -u fusefoundry bash << EOF
cd /var/www/fusefoundry
cp .env .env.backup

# Add database configuration
cat >> .env << DBEOF

# Database Configuration
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
DB_HOST=localhost
DB_PORT=5432
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASSWORD

# Redis Configuration (install separately if needed)
REDIS_URL=redis://localhost:6379

# JWT Secret for authentication
JWT_SECRET=$(openssl rand -base64 64)

# Session secret
SESSION_SECRET=$(openssl rand -base64 32)
DBEOF
EOF

# Set up database backup script
echo "💾 Setting up database backup..."
sudo tee /home/fusefoundry/backup-db.sh > /dev/null << 'EOF'
#!/bin/bash
# Database backup script

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/fusefoundry/backups/database"
DB_NAME="fusefoundry"

mkdir -p $BACKUP_DIR

# Create database backup
sudo -u postgres pg_dump $DB_NAME | gzip > $BACKUP_DIR/fusefoundry_$DATE.sql.gz

# Keep only last 30 backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Database backup completed: fusefoundry_$DATE.sql.gz"
EOF

sudo chmod +x /home/fusefoundry/backup-db.sh
sudo chown fusefoundry:fusefoundry /home/fusefoundry/backup-db.sh

# Set up daily backup cron job
echo "⏰ Setting up daily database backup..."
sudo -u fusefoundry crontab -l 2>/dev/null | { cat; echo "0 2 * * * /home/fusefoundry/backup-db.sh"; } | sudo -u fusefoundry crontab -

echo ""
echo "✅ Database setup complete!"
echo ""
echo "📋 Database Information:"
echo "Database Name: $DB_NAME"
echo "Database User: $DB_USER"
echo "Database Password: $DB_PASSWORD"
echo ""
echo "🔐 Security Notes:"
echo "- Database password has been generated and added to .env"
echo "- Daily backups are configured at 2 AM"
echo "- Backup location: /home/fusefoundry/backups/database"
echo ""
echo "🔄 Next steps:"
echo "1. Restart your FuseFoundry application to use the database"
echo "2. Consider setting up Redis for caching"
echo "3. Install database management tools if needed"
echo ""
echo "📊 Database Management Commands:"
echo "- Connect to database: sudo -u postgres psql -d $DB_NAME"
echo "- Manual backup: /home/fusefoundry/backup-db.sh"
echo "- View tables: sudo -u postgres psql -d $DB_NAME -c '\\dt'"
echo ""
