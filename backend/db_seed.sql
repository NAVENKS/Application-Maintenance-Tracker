

INSERT INTO users (name, email, password, role) VALUES
  ('Alice User',      'user@amt.com',      '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'USER'),
  ('Bob Admin',       'admin@amt.com',     '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'ADMIN'),
  ('Carol Developer', 'dev@amt.com',       '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'DEVELOPER'),
  ('Dave Tester',     'tester@amt.com',    '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'TESTER'),
  ('Eve Developer',   'dev2@amt.com',      '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'DEVELOPER'),
  ('Frank Tester',    'tester2@amt.com',   '$2b$10$YBBQ0TcGTaRKqzkamvDo9.RRxbaFEZzt6VXj6I0GGjfJfyRqZQkRe', 'TESTER')
ON CONFLICT (email) DO NOTHING;

