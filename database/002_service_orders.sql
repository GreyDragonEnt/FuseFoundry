-- Additional tables for service orders and requirements
-- Add to existing schema

-- Service orders table
CREATE TABLE service_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    service_id VARCHAR(100) NOT NULL, -- health-check, strategy-package, etc.
    service_title VARCHAR(255) NOT NULL,
    service_price DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, processing, completed, cancelled
    payment_status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_service_orders_user (user_id),
    INDEX idx_service_orders_service (service_id),
    INDEX idx_service_orders_status (status)
);

-- Service requirements data (flexible JSON storage)
CREATE TABLE service_requirements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES service_orders(id) ON DELETE CASCADE,
    website_url VARCHAR(500),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    social_accounts JSONB, -- Flexible array of social media accounts
    business_concerns TEXT, -- For consultation service
    preferred_consultation_time VARCHAR(255), -- For consultation service
    additional_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_service_requirements_order (order_id)
);

-- Add updated_at trigger for service_orders
CREATE TRIGGER update_service_orders_updated_at 
    BEFORE UPDATE ON service_orders 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample social_accounts JSON structure:
-- {
--   "accounts": [
--     {"platform": "instagram", "username": "@company", "url": "https://instagram.com/company"},
--     {"platform": "linkedin", "username": "Company Inc", "url": "https://linkedin.com/company/company-inc"},
--     {"platform": "twitter", "username": "@company", "url": "https://twitter.com/company"}
--   ]
-- }
