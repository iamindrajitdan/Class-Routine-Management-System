-- Fix invalid notification types in demo data to match NotificationType enum
-- SYSTEM -> SYSTEM_ALERT
-- ALERT -> SYSTEM_ALERT

UPDATE notifications 
SET notification_type = 'SYSTEM_ALERT' 
WHERE notification_type IN ('SYSTEM', 'ALERT');
