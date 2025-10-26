-- Seed 30 dummy users with real-world data across 3 roles

-- INSERT INTO users (id, username, password, email, first_name, last_name, tenant_id, role, company_name, phone_number, created_at)
-- VALUES

-- ADMIN Users (10)
INSERT INTO users VALUES 
('1', 'admin1', 'Admin123!', 'admin1@acmecorp.com', 'James', 'Anderson', 'TENANT-ACME', 'ADMIN', 'Acme Corporation', '+1-555-0101'),
('2', 'admin2', 'Admin123!', 'admin2@techglob.com', 'Sarah', 'Mitchell', 'TENANT-TECHGLOB', 'ADMIN', 'TechGlob Inc', '+1-555-0102'),
('3', 'admin3', 'Admin123!', 'admin3@finnova.com', 'Michael', 'Chen', 'TENANT-FINNOVA', 'ADMIN', 'Finnova Ltd', '+1-555-0103'),
('4', 'admin4', 'Admin123!', 'admin4@digitalsys.com', 'Emily', 'Rodriguez', 'TENANT-DIGITALSYS', 'ADMIN', 'Digital Systems', '+1-555-0104'),
('5', 'admin5', 'Admin123!', 'admin5@cloudwave.com', 'David', 'Thompson', 'TENANT-CLOUDWAVE', 'ADMIN', 'CloudWave Tech', '+1-555-0105'),
('6', 'admin6', 'Admin123!', 'admin6@securebank.com', 'Lisa', 'Wang', 'TENANT-SECUREBANK', 'ADMIN', 'SecureBank Corp', '+1-555-0106'),
('7', 'admin7', 'Admin123!', 'admin7@fintechpro.com', 'Robert', 'Garcia', 'TENANT-FINTECHPRO', 'ADMIN', 'FinTech Pro', '+1-555-0107'),
('8', 'admin8', 'Admin123!', 'admin8@accelpay.com', 'Jennifer', 'Brown', 'TENANT-ACCELPAY', 'ADMIN', 'AccelPay Solutions', '+1-555-0108'),
('9', 'admin9', 'Admin123!', 'admin9@merchantco.com', 'Christopher', 'Lee', 'TENANT-MERCHANTCO', 'ADMIN', 'Merchant Co', '+1-555-0109'),
('10', 'admin10', 'Admin123!', 'admin10@paymentplus.com', 'Michelle', 'Martinez', 'TENANT-PAYMENTPLUS', 'ADMIN', 'Payment Plus', '+1-555-0110'),

-- USER Users (10)
('11', 'user1', 'User123!', 'user1@acmecorp.com', 'John', 'Smith', 'TENANT-ACME', 'USER', 'Acme Corporation', '+1-555-0111'),
('12', 'user2', 'User123!', 'user2@techglob.com', 'Emma', 'Johnson', 'TENANT-TECHGLOB', 'USER', 'TechGlob Inc', '+1-555-0112'),
('13', 'user3', 'User123!', 'user3@finnova.com', 'Daniel', 'Williams', 'TENANT-FINNOVA', 'USER', 'Finnova Ltd', '+1-555-0113'),
('14', 'user4', 'User123!', 'user4@digitalsys.com', 'Olivia', 'Davis', 'TENANT-DIGITALSYS', 'USER', 'Digital Systems', '+1-555-0114'),
('15', 'user5', 'User123!', 'user5@cloudwave.com', 'William', 'Miller', 'TENANT-CLOUDWAVE', 'USER', 'CloudWave Tech', '+1-555-0115'),
('16', 'user6', 'User123!', 'user6@securebank.com', 'Sophia', 'Wilson', 'TENANT-SECUREBANK', 'USER', 'SecureBank Corp', '+1-555-0116'),
('17', 'user7', 'User123!', 'user7@fintechpro.com', 'Benjamin', 'Moore', 'TENANT-FINTECHPRO', 'USER', 'FinTech Pro', '+1-555-0117'),
('18', 'user8', 'User123!', 'user8@accelpay.com', 'Ava', 'Taylor', 'TENANT-ACCELPAY', 'USER', 'AccelPay Solutions', '+1-555-0118'),
('19', 'user9', 'User123!', 'user9@merchantco.com', 'Ethan', 'Harris', 'TENANT-MERCHANTCO', 'USER', 'Merchant Co', '+1-555-0119'),
('20', 'user10', 'User123!', 'user10@paymentplus.com', 'Isabella', 'Clark', 'TENANT-PAYMENTPLUS', 'USER', 'Payment Plus', '+1-555-0120'),

-- AUDITOR Users (10)
('21', 'auditor1', 'Auditor123!', 'auditor1@acmecorp.com', 'Alexander', 'Lewis', 'TENANT-ACME', 'AUDITOR', 'Acme Corporation', '+1-555-0121'),
('22', 'auditor2', 'Auditor123!', 'auditor2@techglob.com', 'Mia', 'Walker', 'TENANT-TECHGLOB', 'AUDITOR', 'TechGlob Inc', '+1-555-0122'),
('23', 'auditor3', 'Auditor123!', 'auditor3@finnova.com', 'Noah', 'Hall', 'TENANT-FINNOVA', 'AUDITOR', 'Finnova Ltd', '+1-555-0123'),
('24', 'auditor4', 'Auditor123!', 'auditor4@digitalsys.com', 'Charlotte', 'Allen', 'TENANT-DIGITALSYS', 'AUDITOR', 'Digital Systems', '+1-555-0124'),
('25', 'auditor5', 'Auditor123!', 'auditor5@cloudwave.com', 'Henry', 'Young', 'TENANT-CLOUDWAVE', 'AUDITOR', 'CloudWave Tech', '+1-555-0125'),
('26', 'auditor6', 'Auditor123!', 'auditor6@securebank.com', 'Amelia', 'King', 'TENANT-SECUREBANK', 'AUDITOR', 'SecureBank Corp', '+1-555-0126'),
('27', 'auditor7', 'Auditor123!', 'auditor7@fintechpro.com', 'Lucas', 'Wright', 'TENANT-FINTECHPRO', 'AUDITOR', 'FinTech Pro', '+1-555-0127'),
('28', 'auditor8', 'Auditor123!', 'auditor8@accelpay.com', 'Harper', 'Scott', 'TENANT-ACCELPAY', 'AUDITOR', 'AccelPay Solutions', '+1-555-0128'),
('29', 'auditor9', 'Auditor123!', 'auditor9@merchantco.com', 'Mason', 'Torres', 'TENANT-MERCHANTCO', 'AUDITOR', 'Merchant Co', '+1-555-0129'),
('30', 'auditor10', 'Auditor123!', 'auditor10@paymentplus.com', 'Ella', 'Nguyen', 'TENANT-PAYMENTPLUS', 'AUDITOR', 'Payment Plus', '+1-555-0130');

