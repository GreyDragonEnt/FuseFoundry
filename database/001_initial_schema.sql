-- FuseFoundry Database Schema
-- Initial migration for user management, analytics, and Athena conversations

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table for customer management
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    phone VARCHAR(50),
    industry VARCHAR(100),
    company_size VARCHAR(50),
    lead_source VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new', -- new, qualified, customer, inactive
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Athena conversation history
CREATE TABLE athena_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255) NOT NULL,
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    mode VARCHAR(50) DEFAULT 'teaser', -- teaser, full
    business_context TEXT,
    response_time_ms INTEGER,
    tokens_used INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Add index for faster queries
    INDEX idx_athena_session (session_id),
    INDEX idx_athena_user (user_id),
    INDEX idx_athena_created (created_at)
);

-- Contact form submissions
CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company VARCHAR(255),
    message TEXT NOT NULL,
    services TEXT[], -- Array of selected services
    phone VARCHAR(50),
    budget_range VARCHAR(100),
    timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new', -- new, responded, qualified, converted
    assigned_to VARCHAR(255),
    follow_up_date DATE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_contact_status (status),
    INDEX idx_contact_created (created_at)
);

-- Website analytics events
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(100) NOT NULL, -- page_view, button_click, form_submit, etc.
    page_path VARCHAR(255),
    page_title VARCHAR(255),
    referrer VARCHAR(255),
    utm_source VARCHAR(100),
    utm_medium VARCHAR(100),
    utm_campaign VARCHAR(100),
    user_agent TEXT,
    ip_address INET,
    country_code VARCHAR(2),
    session_id VARCHAR(255),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    metadata JSONB, -- Flexible storage for additional event data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_analytics_event_type (event_type),
    INDEX idx_analytics_page_path (page_path),
    INDEX idx_analytics_session (session_id),
    INDEX idx_analytics_created (created_at)
);

-- Email campaigns and tracking
CREATE TABLE email_campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    template VARCHAR(100),
    status VARCHAR(50) DEFAULT 'draft', -- draft, scheduled, sent
    scheduled_at TIMESTAMP WITH TIME ZONE,
    sent_at TIMESTAMP WITH TIME ZONE,
    recipient_count INTEGER DEFAULT 0,
    open_count INTEGER DEFAULT 0,
    click_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Email tracking for individual recipients
CREATE TABLE email_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_id UUID REFERENCES email_campaigns(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'sent', -- sent, delivered, opened, clicked, bounced
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE,
    bounce_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_email_tracking_campaign (campaign_id),
    INDEX idx_email_tracking_user (user_id),
    INDEX idx_email_tracking_status (status)
);

-- Business insights and KPIs
CREATE TABLE business_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(15,2) NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- revenue, leads, conversion_rate, etc.
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    source VARCHAR(100), -- athena, contact_form, organic, etc.
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_metrics_name (metric_name),
    INDEX idx_metrics_period (period_start, period_end),
    INDEX idx_metrics_type (metric_type)
);

-- Athena AI model usage and costs tracking
CREATE TABLE ai_usage_tracking (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    model_name VARCHAR(100) NOT NULL, -- gemini-2.0-flash, etc.
    prompt_tokens INTEGER NOT NULL,
    response_tokens INTEGER NOT NULL,
    total_tokens INTEGER NOT NULL,
    estimated_cost DECIMAL(10,4), -- In USD
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    session_id VARCHAR(255),
    conversation_id UUID REFERENCES athena_conversations(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_ai_usage_model (model_name),
    INDEX idx_ai_usage_user (user_id),
    INDEX idx_ai_usage_created (created_at)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_submissions_updated_at 
    BEFORE UPDATE ON contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_campaigns_updated_at 
    BEFORE UPDATE ON email_campaigns 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create views for common queries
CREATE VIEW user_summary AS
SELECT 
    u.id,
    u.email,
    u.name,
    u.company,
    u.status,
    u.created_at,
    COUNT(DISTINCT ac.id) as athena_conversations,
    COUNT(DISTINCT cs.id) as contact_submissions,
    MAX(ac.created_at) as last_athena_interaction,
    MAX(cs.created_at) as last_contact_submission
FROM users u
LEFT JOIN athena_conversations ac ON u.id = ac.user_id
LEFT JOIN contact_submissions cs ON u.email = cs.email
GROUP BY u.id, u.email, u.name, u.company, u.status, u.created_at;

-- Analytics dashboard view
CREATE VIEW daily_metrics AS
SELECT 
    DATE(created_at) as date,
    COUNT(*) FILTER (WHERE event_type = 'page_view') as page_views,
    COUNT(DISTINCT session_id) as unique_sessions,
    COUNT(DISTINCT ip_address) as unique_visitors,
    COUNT(*) FILTER (WHERE event_type = 'contact_form_submit') as contact_submissions,
    COUNT(*) FILTER (WHERE event_type = 'athena_conversation') as athena_conversations
FROM analytics_events
GROUP BY DATE(created_at)
ORDER BY date DESC;

-- Insert some initial data
INSERT INTO business_metrics (metric_name, metric_value, metric_type, period_start, period_end, source)
VALUES 
    ('Monthly Recurring Revenue', 0.00, 'revenue', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, 'system'),
    ('Lead Conversion Rate', 0.00, 'conversion_rate', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, 'system'),
    ('Customer Acquisition Cost', 0.00, 'cost', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE, 'system');
