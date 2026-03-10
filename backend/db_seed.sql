-- Application Maintenance Tracker - Seed Data
-- Run AFTER db_setup.sql
-- Passwords are bcrypt hashes of: user123, admin123, dev123, test123
-- You can regenerate hashes with: node -e "const b=require('bcrypt'); b.hash('yourpassword',10).then(h=>console.log(h))"

INSERT INTO users (name, email, password, role) VALUES
  ('Alice User',      'user@amt.com',      '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'USER'),
  ('Bob Admin',       'admin@amt.com',     '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'ADMIN'),
  ('Carol Developer', 'dev@amt.com',       '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'DEVELOPER'),
  ('Dave Tester',     'tester@amt.com',    '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'TESTER'),
  ('Eve Developer',   'dev2@amt.com',      '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'DEVELOPER'),
  ('Frank Tester',    'tester2@amt.com',   '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'TESTER')
ON CONFLICT (email) DO NOTHING;

-- Note: All seed users have password = "password123"
-- All users above log in with password: password123
