# Project: Fruit E-Commerce App

## 1. Project Goal

This project is a modern, user-friendly, and vibrant e-commerce website for selling fresh fruits. It will feature a storefront for users to browse and purchase products, and an admin dashboard for administrators to manage products and orders. This is a university project.

## 2. Technology Stack

* **Framework:** Next.js 
* **Language:** TypeScript
* **Backend & Database:** Supabase (PostgreSQL, Auth, Storage)
* **Styling:** Tailwind CSS
* **UI Component Library:** shadcn/ui (Style: default, Color: slate)
* **Form Handling:** Primarily Next.js Server Actions.

## 3. Database Schema (Supabase)

* **`fruits` Table:**
    * `id` (bigint, pk)
    * `created_at` (timestamptz)
    * `name` (text)
    * `description` (text)
    * `price_per_kg` (numeric)
    * `image_url` (text)
    * `stock_kg` (numeric)
* **`orders` Table:**
    * `id` (bigint, pk)
    * `created_at` (timestamptz)
    * `user_id` (uuid, fk to `auth.users`)
    * `status` (text, e.g., 'pending', 'paid', 'shipped')
    * `total_price` (numeric)
    * `order_details` (jsonb)
* **Users:** The built-in `auth.users` table from Supabase will be used.

## 4. Key Conventions & Architectural Decisions

* All form submissions must be handled using **Next.js Server Actions**.
* The admin panel will be located under the `/admin` route and will eventually be protected by role-based access control.
* Currency and price values are to be handled as `NUMERIC(10, 2)` in the database and processed carefully on the frontend.
* The code should be clean, readable, and well-documented with comments where necessary.