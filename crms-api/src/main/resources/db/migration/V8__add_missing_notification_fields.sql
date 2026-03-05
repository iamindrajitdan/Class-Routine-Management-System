-- Add missing columns to notifications table to match the JPA Entity
ALTER TABLE notifications ADD COLUMN delivery_status VARCHAR(50) NOT NULL DEFAULT 'PENDING';
ALTER TABLE notifications ADD COLUMN related_resource_type VARCHAR(100);
ALTER TABLE notifications ADD COLUMN related_resource_id UUID;
ALTER TABLE notifications ADD COLUMN updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Create missing index
CREATE INDEX idx_notification_status ON notifications(delivery_status);

-- Rename 'type' to 'notification_type' if needed, Entity maps notificationType directly, but let's check V1 which defines 'type'
ALTER TABLE notifications RENAME COLUMN type TO notification_type;
CREATE INDEX idx_notification_type ON notifications(notification_type);

-- Create updated_at trigger function for notifications
CREATE TRIGGER update_notifications_updated_at BEFORE UPDATE ON notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
