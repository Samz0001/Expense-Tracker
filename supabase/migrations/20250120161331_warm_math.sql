/*
  # Expense Tracker Schema

  1. New Tables
    - `expenses`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `amount` (decimal)
      - `category` (text)
      - `description` (text)
      - `date` (date)
      - `created_at` (timestamp)
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `icon` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their expenses
    - Add policies for reading categories
*/

-- Create categories table
CREATE TABLE categories (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    icon text NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Create expenses table
CREATE TABLE expenses (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    amount decimal NOT NULL,
    category uuid REFERENCES categories NOT NULL,
    description text,
    date date DEFAULT CURRENT_DATE,
    created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;

-- Categories policies (readable by all authenticated users)
CREATE POLICY "Categories are viewable by authenticated users"
    ON categories FOR SELECT
    TO authenticated
    USING (true);

-- Expenses policies
CREATE POLICY "Users can manage their own expenses"
    ON expenses FOR ALL
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Insert default categories
INSERT INTO categories (name, icon) VALUES
    ('Food', 'utensils'),
    ('Transportation', 'car'),
    ('Shopping', 'shopping-bag'),
    ('Entertainment', 'tv'),
    ('Bills', 'file-text'),
    ('Healthcare', 'heart-pulse'),
    ('Education', 'book-open'),
    ('Other', 'more-horizontal');