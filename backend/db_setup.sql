DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('USER', 'ADMIN', 'DEVELOPER', 'TESTER');
  END IF;
END$$;


CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    VARCHAR(255) NOT NULL,
  role        user_role NOT NULL DEFAULT 'USER',
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tokens (
  token_id         SERIAL PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  description      TEXT NOT NULL,
  application_name VARCHAR(150) NOT NULL,
  environment      VARCHAR(100) NOT NULL,
  created_by       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  priority         VARCHAR(20) DEFAULT 'Low',
  status           VARCHAR(30) NOT NULL DEFAULT 'OPEN',
  created_at       TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_assignments (
  assignment_id  SERIAL PRIMARY KEY,
  token_id       INT NOT NULL UNIQUE REFERENCES tokens(token_id) ON DELETE CASCADE,
  developer_id   INT REFERENCES users(id) ON DELETE SET NULL,
  tester_id      INT REFERENCES users(id) ON DELETE SET NULL,
  assigned_by    INT REFERENCES users(id) ON DELETE SET NULL,
  admin_comment  TEXT DEFAULT '',
  assigned_at    TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS token_comments (
  comment_id  SERIAL PRIMARY KEY,
  token_id    INT NOT NULL REFERENCES tokens(token_id) ON DELETE CASCADE,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role        VARCHAR(20) NOT NULL,
  comment     TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS token_status_history (
  history_id  SERIAL PRIMARY KEY,
  token_id    INT NOT NULL REFERENCES tokens(token_id) ON DELETE CASCADE,
  old_status  VARCHAR(30),
  new_status  VARCHAR(30) NOT NULL,
  changed_by  INT REFERENCES users(id) ON DELETE SET NULL,
  changed_at  TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tokens_created_by ON tokens(created_by);
CREATE INDEX IF NOT EXISTS idx_tokens_status ON tokens(status);
CREATE INDEX IF NOT EXISTS idx_token_assignments_developer ON token_assignments(developer_id);
CREATE INDEX IF NOT EXISTS idx_token_assignments_tester ON token_assignments(tester_id);
CREATE INDEX IF NOT EXISTS idx_token_comments_token ON token_comments(token_id);
CREATE INDEX IF NOT EXISTS idx_status_history_token ON token_status_history(token_id);
