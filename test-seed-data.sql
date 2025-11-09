-- Test data for service analytics reports
-- Insert test users
INSERT INTO users (id, email, name, role) VALUES
('11111111-1111-1111-1111-111111111111', 'test1@example.com', 'Test User 1', 'customer'),
('22222222-2222-2222-2222-222222222222', 'test2@example.com', 'Test User 2', 'customer'),
('33333333-3333-3333-3333-333333333333', 'test3@example.com', 'Test User 3', 'customer'),
('44444444-4444-4444-4444-444444444444', 'test4@example.com', 'Test User 4', 'customer');

-- Insert test service orders with various statuses and dates
INSERT INTO service_orders (id, user_id, service_id, service_title, service_price, status, payment_status, created_at) VALUES
-- Health Check orders
('a0000001-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', 'health-check', 'Business Health Check', 29.99, 'completed', 'paid', '2024-11-01 10:00:00'),
('a0000002-0000-0000-0000-000000000002', '22222222-2222-2222-2222-222222222222', 'health-check', 'Business Health Check', 29.99, 'completed', 'paid', '2024-11-15 14:30:00'),
('a0000003-0000-0000-0000-000000000003', '33333333-3333-3333-3333-333333333333', 'health-check', 'Business Health Check', 29.99, 'pending', 'pending', '2024-12-01 09:15:00'),

-- Strategy Package orders
('a0000004-0000-0000-0000-000000000004', '11111111-1111-1111-1111-111111111111', 'strategy-package', 'Business Strategy Package', 49.99, 'completed', 'paid', '2024-10-15 11:20:00'),
('a0000005-0000-0000-0000-000000000005', '22222222-2222-2222-2222-222222222222', 'strategy-package', 'Business Strategy Package', 49.99, 'processing', 'paid', '2024-11-20 16:45:00'),
('a0000006-0000-0000-0000-000000000006', '44444444-4444-4444-4444-444444444444', 'strategy-package', 'Business Strategy Package', 49.99, 'completed', 'paid', '2024-12-10 13:30:00'),

-- Transformation Blueprint orders
('a0000007-0000-0000-0000-000000000007', '33333333-3333-3333-3333-333333333333', 'transformation-blueprint', 'DIY Business Transformation Blueprint', 99.99, 'completed', 'paid', '2024-10-20 15:00:00'),
('a0000008-0000-0000-0000-000000000008', '11111111-1111-1111-1111-111111111111', 'transformation-blueprint', 'DIY Business Transformation Blueprint', 99.99, 'processing', 'paid', '2024-12-05 10:30:00'),

-- Strategy Consultation orders
('a0000009-0000-0000-0000-000000000009', '44444444-4444-4444-4444-444444444444', 'strategy-consultation', 'Business Strategy Consultation', 199.99, 'completed', 'paid', '2024-11-10 12:00:00'),
('a0000010-0000-0000-0000-000000000010', '22222222-2222-2222-2222-222222222222', 'strategy-consultation', 'Business Strategy Consultation', 199.99, 'cancelled', 'refunded', '2024-11-25 17:15:00');

-- Insert corresponding service requirements
INSERT INTO service_requirements (order_id, website, social_accounts, email, phone, business_concerns, consultation_time, created_at) VALUES
('a0000001-0000-0000-0000-000000000001', 'https://example1.com', '["instagram"]', 'test1@example.com', '+1234567890', NULL, NULL, '2024-11-01 10:05:00'),
('a0000002-0000-0000-0000-000000000002', 'https://example2.com', '["facebook"]', 'test2@example.com', NULL, NULL, NULL, '2024-11-15 14:35:00'),
('a0000003-0000-0000-0000-000000000003', 'https://example3.com', '["twitter"]', 'test3@example.com', '+1234567891', NULL, NULL, '2024-12-01 09:20:00'),
('a0000004-0000-0000-0000-000000000004', 'https://example1.com', '["instagram", "facebook", "linkedin"]', 'test1@example.com', '+1234567890', NULL, NULL, '2024-10-15 11:25:00'),
('a0000005-0000-0000-0000-000000000005', 'https://example2.com', '["twitter", "linkedin"]', 'test2@example.com', NULL, NULL, NULL, '2024-11-20 16:50:00'),
('a0000006-0000-0000-0000-000000000006', 'https://example4.com', '["instagram", "youtube", "tiktok"]', 'test4@example.com', '+1234567893', NULL, NULL, '2024-12-10 13:35:00'),
('a0000007-0000-0000-0000-000000000007', 'https://example3.com', '["facebook", "linkedin", "pinterest"]', 'test3@example.com', '+1234567891', NULL, NULL, '2024-10-20 15:05:00'),
('a0000008-0000-0000-0000-000000000008', 'https://example1.com', '["instagram", "twitter", "snapchat"]', 'test1@example.com', '+1234567890', NULL, NULL, '2024-12-05 10:35:00'),
('a0000009-0000-0000-0000-000000000009', 'https://example4.com', '["facebook", "instagram", "linkedin", "youtube"]', 'test4@example.com', '+1234567893', 'Looking to scale our digital marketing efforts', 'Friday 1:00 PM - 5:00 PM EST', '2024-11-10 12:05:00'),
('a0000010-0000-0000-0000-000000000010', 'https://example2.com', '["twitter", "tiktok", "pinterest", "snapchat"]', 'test2@example.com', NULL, 'Need help with social media strategy', 'Monday 9:00 AM - 12:00 PM EST', '2024-11-25 17:20:00');
