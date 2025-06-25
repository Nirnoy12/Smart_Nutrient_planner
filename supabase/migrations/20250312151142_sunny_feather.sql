/*
  # Create meals table and setup RLS

  1. New Tables
    - `meals`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `calories` (integer)
      - `image_url` (text, nullable)
      - `items` (jsonb)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `meals` table
    - Add policies for authenticated users to:
      - Read their own meals
      - Create new meals
*/

CREATE TABLE IF NOT EXISTS meals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  calories integer NOT NULL,
  image_url text,
  items jsonb NOT NULL DEFAULT '[]',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own meals"
  ON meals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create meals"
  ON meals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);