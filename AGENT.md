# TEMUKARYA --- Agent Guide

> **Brand tagline:** Tempat Karya Lokal Bertemu Kepercayaan.\
> **English brand statement:** Where Local Dreams Meet Opportunities.\
> **Product type:** Multi-seller E-Commerce web application.\
> **Document purpose:** This file is the source of truth for AI coding
> agents and developers working on the TemuKarya project.

------------------------------------------------------------------------

## 1. Mission and Product Concept

TemuKarya is a digital marketplace that connects local businesses, UMKM,
and independent creators with buyers through a structured and
trust-oriented commerce experience.

The platform addresses two related problems:

1.  Local sellers and independent creators may have good products but
    limited access to digital markets and difficulty building
    credibility.
2.  Buyers may hesitate to purchase from unfamiliar stores when seller
    identity, store information, and product feedback are unclear.

TemuKarya responds with seller approval by an administrator, clear store
and product information, order management, and buyer ratings and
reviews.

**Core idea:** TemuKarya is not merely a place to transact. It is a
place where creative work finds opportunity and trust connects sellers
with buyers.

### Product goals

-   Make discovering products and stores straightforward.
-   Give approved sellers a clear way to manage their store, products,
    stock, and incoming orders.
-   Give buyers a transparent shopping journey from product discovery to
    completed order and review.
-   Give administrators the tools to govern users, seller applications,
    categories, and prohibited products.
-   Maintain a consistent, accessible, responsive, and maintainable
    application.

### Product positioning

A trust-oriented, multi-seller marketplace that helps local businesses
and independent creators reach buyers through a structured digital
commerce ecosystem.

Do not claim that seller approval guarantees product quality.
Verification supports seller-account credibility; product information,
stock accuracy, and buyer reviews remain important to informed
purchasing.

------------------------------------------------------------------------

## 2. Brand Identity

### Brand name

**TEMUKARYA**

Always write the brand as `TemuKarya` in interface copy, documentation,
and metadata, unless a visual wordmark intentionally uses uppercase
`TEMUKARYA`.

### Tagline

**Tempat Karya Lokal Bertemu Kepercayaan.**

Supporting English statement:

**Where Local Dreams Meet Opportunities.**

### Brand story

Every product has a story. Behind a product there may be creativity,
hard work, and the ambition of someone building a business. Yet many
local businesses and independent creators have difficulty reaching wider
markets and earning the trust of new customers.

At the same time, buyers need clear information before deciding to
purchase from a store they do not know.

TemuKarya brings these needs together. Sellers apply to join the
platform and wait for administrator approval before accessing seller
tools. Approved sellers can present their stores and products, while
buyers can discover products, review store information, track orders,
and share feedback after an order is completed.

TemuKarya aims to make digital commerce more accessible, structured, and
transparent---creating opportunities for sellers while helping buyers
make more informed decisions.

### Brand values

-   **Trust:** clear seller status, store details, product information,
    and review rules.
-   **Growth:** tools that help sellers present and manage their
    businesses.
-   **Connection:** a useful bridge between sellers, creators, and
    buyers.
-   **Creativity:** respect for distinctive products and independent
    work.
-   **Inclusivity:** a welcoming marketplace for businesses at different
    stages.

### Brand personality and voice

The brand should feel:

-   Trustworthy, not corporate or cold.
-   Warm, not childish.
-   Creative, not chaotic.
-   Modern, not trend-dependent.
-   Professional, not overly formal.

Use clear, friendly Indonesian as the default interface language. Avoid
exaggerated marketing claims, slang-heavy copy, and vague labels.

Example microcopy: - Homepage headline: **"Temukan Karya, Dukung Cerita
di Baliknya."** - Seller call to action: **"Mulai Ceritakan
Karyamu."** - Pending seller status: **"Akun Anda sedang dalam proses
peninjauan."** - Empty wishlist: **"Belum ada karya yang kamu simpan.
Yuk, temukan sesuatu yang menarik!"** - Completed order: **"Pesanan
selesai! Bagikan pengalamanmu melalui ulasan."**

------------------------------------------------------------------------

## 3. Visual Design System

### Design direction

Use **Modern Minimalist E-Commerce with Warm Editorial Design**.

The interface should combine: - Clear hierarchy and restrained
layouts. - Generous but purposeful whitespace. - Warm, authentic product
photography. - Consistent navigation and reusable components. -
Practical dashboard patterns for data-heavy tasks.

Use other products only as quality references, never copy their
branding, layouts, illustrations, or proprietary assets.

### Color palette

  -----------------------------------------------------------------------
  Token                   Hex                     Intended use
  ----------------------- ----------------------- -----------------------
  `brand.primary`         `#174B3A`               Primary actions, brand
                                                  identity, active
                                                  navigation

  `brand.cream`           `#F5F0E6`               Warm surfaces and
                                                  editorial sections

  `brand.accent`          `#D98B56`               Selective highlights
                                                  and secondary emphasis

  `neutral.charcoal`      `#292D2A`               Main text and dark
                                                  surfaces

  `neutral.white`         `#FFFFFF`               Cards and clean
                                                  surfaces

  `neutral.background`    `#FAF9F6`               Main application
                                                  background

  `neutral.border`        `#E8E6E0`               Dividers and input
                                                  borders

  `neutral.muted`         `#777B75`               Secondary text

  `status.success`        `#25845A`               Success states

  `status.warning`        `#D99A36`               Pending and warning
                                                  states

  `status.error`          `#C94C4C`               Errors and destructive
                                                  actions
  -----------------------------------------------------------------------

Rules: - Use forest green as the primary brand color. - Use terracotta
sparingly; it is an accent, not a second primary color. - Keep body text
readable against its background. - Never communicate status by color
alone; pair color with text or an icon. - Check contrast, especially for
small text and disabled controls. - Define colors as design tokens
rather than scattering raw hex values through components.

### Typography

-   **Plus Jakarta Sans:** headings and prominent titles.
-   **Inter:** body text, labels, forms, tables, and utility text.

Create a consistent type scale for display headings, page headings,
section headings, card titles, body text, captions, and labels. Avoid
arbitrary font sizes and weights.

### Layout and spacing

Use a consistent spacing scale based on multiples of 4 or 8 pixels.

Suggested starting points: - Card radius: 12--16 px. - Button radius:
8--12 px. - Input height: 44--48 px. - Card padding: 16--24 px. -
Section spacing: 48--80 px on larger screens.

Use a predictable container width, grid system, alignment rules, and
responsive breakpoints. Avoid arbitrary margins, inconsistent card
heights, and content escaping its parent container.

### Logo direction

Create a simple, scalable symbol suggesting two elements meeting or
connecting. It should represent the relationship between seller and
buyer, opportunity, creativity, and trust.

The logo must work in: - Desktop and mobile navigation. - Favicon. -
Authentication pages. - Dashboard navigation. - Loading and empty
states.

Do not rely on a generic shopping-cart icon as the entire brand
identity. Do not invent an existing official logo asset; if no asset
exists, create a clearly labeled temporary wordmark or simple original
placeholder and document where the final asset should go.

### Photography and imagery

Use authentic-looking, high-quality product and maker imagery. Favor
warm natural light, uncluttered backgrounds, and editorial composition.
Keep image aspect ratios consistent within each component. Provide
meaningful alt text. Use local placeholder assets or properly licensed
image sources; do not hotlink random images in production.

------------------------------------------------------------------------

## 4. UX Principles

Every page and component must follow these principles:

1.  **Clarity:** users should understand where they are and what they
    can do.
2.  **Consistency:** similar actions should look and behave the same
    everywhere.
3.  **Feedback:** every meaningful action needs visible success, error,
    loading, or disabled feedback.
4.  **Efficiency:** common tasks should require as few steps as
    practical.
5.  **Accessibility:** semantic HTML, keyboard access, visible focus,
    labels, and sufficient contrast.
6.  **Responsiveness:** layouts must work on mobile, tablet, laptop, and
    desktop.
7.  **Trust:** show useful store, product, order, and seller-status
    information without misleading claims.
8.  **Error prevention:** confirm destructive actions and validate input
    before submission.

Avoid: - Excessive gradients, glassmorphism, shadows, and decorative
animation. - Overcrowded dashboards. - Inconsistent spacing or
typography. - Tiny click targets. - Buttons that do nothing. - Fake
loading indicators or fake success messages. - Horizontal overflow on
mobile. - Empty pages without helpful empty states.

### Responsive targets

Test at approximately: - Mobile: 375--430 px. - Tablet: 768 px. -
Laptop: 1280 px. - Desktop: 1440 px and wider.

On mobile, adapt navigation and dashboards intentionally. Do not simply
shrink the desktop sidebar. Product grids should reduce columns as space
requires, and forms must remain comfortable to use.

------------------------------------------------------------------------

## 5. User Roles and Authorization

TemuKarya has four user types: Admin, Seller, Buyer, and Guest (Public
User).

Authorization must be enforced on the server and database---not only by
hiding frontend elements.

### Admin

Admin is the platform operator and can: - View platform overview and
statistics. - View and edit user information. - Delete users other than
the currently authenticated admin, subject to integrity rules. - Review
pending seller applications. - Approve or reject seller applications. -
View platform products and remove products that violate platform
rules. - Create, view, edit, and delete product categories. - View
stores and monitor platform orders.

Do not expose public Admin registration. Admin accounts must be
provisioned securely.

### Seller

Seller registration creates an account with status `pending`.

Seller statuses: - `pending` - `approved` - `rejected`

Rules: - Pending sellers cannot access seller dashboard or seller write
operations. - Approved sellers can manage only their own store and
products. - Rejected sellers see a rejection state and may delete their
account. - A seller must never access or modify another seller's records
by changing a URL, ID, or request payload.

Seller capabilities: - Manage store name, description, and image. -
Create, view, update, and delete own products. - Manage own product
stock and category selection. - View order items belonging to own
store. - Update permitted fulfillment statuses for own store's order
items.

### Buyer

Buyer capabilities: - View and manage own profile. - Browse and search
products. - View product and store details. - Add products to cart and
update quantities. - Remove cart items. - Checkout. - View own order
history and order details. - Track order status. - Review eligible
purchased products after completion. - Manage wishlist. - Manage
shipping addresses.

### Guest

Guest capabilities: - View public homepage. - Browse and search active
products. - View product details, store information, and published
reviews.

Guest restrictions: - Cannot add to cart or wishlist. - Cannot
checkout. - Cannot submit reviews. - Cannot access private dashboards or
account data.

When a guest selects a restricted action, direct them to login and
preserve the intended destination where practical.

------------------------------------------------------------------------

## 6. Information Architecture and Pages

### Public navigation

-   Home
-   Explore Products
-   About TemuKarya
-   Login
-   Register

### Public homepage

Required sections: 1. Brand navbar. 2. Hero section with headline
**"Temukan Karya, Dukung Cerita di Baliknya."** 3. Supporting
description and clear calls to action. 4. Featured products. 5. Popular
categories. 6. Recommended stores. 7. "Why TemuKarya" trust and value
section. 8. Brand story. 9. Seller invitation call to action. 10. Footer
with useful navigation and platform information.

Hero supporting copy: "Jelajahi produk unik dari pelaku usaha lokal dan
kreator independen. Temukan sesuatu yang bermakna, sekaligus dukung
mereka untuk terus berkembang."

### Buyer homepage

-   Personalized greeting.
-   Product search.
-   Recommended products.
-   Featured categories.
-   New arrivals.
-   Popular products.
-   Product cards with price, store, rating, and availability.
-   Add to Cart and Wishlist actions.

Recommendations may be randomized from eligible active products, but
should not imply personalization unless a real recommendation method
exists.

### Product listing

Show product image, name, price, store name, rating when available, and
availability.

Provide: - Search by product name. - Category filter. - Price filter. -
Sort by lowest price. - Sort by highest price. - Sort by newest.

Provide pagination or a clear incremental loading strategy.

### Product detail

Show: - Product image gallery. - Name and price. - Description. -
Category. - Store identity and store information. - Stock
availability. - Average rating and review count. - Published reviews. -
Quantity selector. - Add to Cart action for authenticated buyers.

Guests can view details but cannot perform buyer-only actions.

### Authentication

Login fields: - Email. - Password. - Show/hide password. - Validation
and understandable error messages. - Redirect according to authenticated
role and account status.

Registration: - Buyer and Seller only. - Full name, email, password,
confirm password, and account type. - Seller registration may collect
initial store information. - Seller status must be set to `pending` by
trusted backend logic.

Do not allow users to assign themselves the Admin role through client
input.

### Pending / rejected seller page

Pending message: "Terima kasih telah bergabung dengan TemuKarya. Akun
Anda sedang ditinjau oleh tim Admin. Dashboard toko akan tersedia
setelah proses verifikasi selesai."

Rejected message: "Pendaftaran toko Anda belum dapat disetujui."

Show a Delete Account action for rejected sellers, with confirmation and
appropriate data-retention rules.

### Buyer dashboard

Navigation: - Overview - My Profile - Shopping Cart - Wishlist - Order
History - Address Management - Logout

Overview should show useful order summaries and recent orders, not
decorative metrics without purpose.

### Seller dashboard

Navigation: - Overview - Store Management - My Products - Incoming
Orders - Logout

Overview: - Product count. - Stock summary. - Incoming orders. - Orders
being processed. - Completed orders.

Product management: - Product list/table. - Create, edit, and delete. -
Product image. - Name, description, price, stock, and category. -
Validation and confirmation.

Store management: - Store name. - Description. - Store image. -
Seller-owned store details.

Incoming orders must show only relevant order items for the
authenticated seller.

### Admin dashboard

Navigation: - Overview - User Management - Seller Verification - Product
Management - Category Management - Store Management - Order Monitoring -
Logout

Overview metrics: - Total users. - Total sellers. - Pending sellers. -
Total buyers. - Total active products. - Total orders.

Seller verification list: - Seller identity and registration
information. - Store information where available. - Registration date. -
Pending status. - Approve and Reject actions.

User management: - View, edit, and delete eligible users. - Display role
and seller status clearly.

Category management: - Create, view, edit, and delete categories. -
Protect categories that are still referenced by products.

------------------------------------------------------------------------

## 7. Core Business Rules

### Product management

Product fields: - ID. - Seller ID. - Category ID. - Name. -
Description. - Price. - Stock. - Image path or URL. - Active/moderation
status where applicable. - Created and updated timestamps.

Validation: - Required fields cannot be blank. - Price must be greater
than zero. - Stock cannot be negative. - Image type and size must be
validated. - Seller ownership must be verified by backend/database
policy.

### Seller verification

Allowed transitions: - `pending` → `approved` - `pending` → `rejected`

Only an authorized Admin may make these transitions. Store the decision
timestamp and, where appropriate, the reviewing admin ID. Prevent
sellers from changing their own verification status.

### Cart

-   Each buyer has a private cart.
-   Cart items reference products and quantities.
-   Quantity must be at least one.
-   Product must be active and have sufficient stock at checkout.
-   Display item subtotal (`price × quantity`) and cart total.
-   Do not trust client-calculated prices during checkout; re-read
    authoritative product prices and stock on the server.

### Checkout

Payment gateway integration is out of scope.

Checkout must: 1. Authenticate the buyer. 2. Read the buyer's cart from
trusted storage. 3. Validate each product's active status and current
stock. 4. Recalculate prices and totals on the server. 5. Create order
and order-item records. 6. Store the purchase-time unit price in each
order item. 7. Decrease stock safely. 8. Clear the cart only after the
order transaction succeeds. 9. Roll back all related changes if any
critical step fails.

Use a database transaction or equivalent atomic server-side operation.
Prevent overselling under concurrent checkout attempts.

### Multi-seller order model

A buyer may place one cart containing products from multiple stores. The
data model must preserve seller boundaries.

Use either: - A parent order with store-specific sub-orders, or - A
clearly documented order-item ownership model with secure seller-scoped
queries and status handling.

Prefer a parent order plus store-specific sub-orders if it makes
fulfillment and seller authorization clearer.

Each seller must only see and update their own store's fulfillment
records. Buyer order history should present a coherent view of the
overall purchase and its store-specific statuses.

### Order statuses

Suggested lifecycle: - `awaiting_payment` - `processing` - `shipped` -
`completed` - `cancelled` where cancellation rules are implemented

Because no payment gateway is required, clearly label the payment
process as simulated or out of scope. Do not falsely mark an order as
paid.

Define allowed status transitions and enforce them on the backend. A
seller may update only statuses permitted for that seller's sub-order.
The overall parent order status should be derived or updated
consistently from its sub-orders.

### Reviews

-   Only the buyer associated with an eligible completed order item may
    review the purchased product.
-   Rating range: 1--5.
-   One review per eligible order item.
-   Store buyer, product, order item, rating, review text, and
    timestamp.
-   Validate eligibility and ownership on the backend.
-   Display published reviews on the product detail page.
-   Calculate average rating and count from actual reviews.

### Categories

Admin manages categories. Sellers may only select existing categories.
Prevent deletion when a category is in use, or implement a documented
safe reassignment strategy.

### Store management

Each approved seller has one store. Store ownership must be enforced.
Public visitors may view published store information, while only the
owner and authorized Admin may modify it.

### Optional features

Implement only after core requirements work: - Wishlist. - Shipping
address management. - Advanced filtering and sorting. - Improved product
search.

------------------------------------------------------------------------

## 8. Data Model Guidance

Suggested entities/tables:

1.  `profiles`
2.  `stores`
3.  `categories`
4.  `products`
5.  `carts`
6.  `cart_items`
7.  `orders`
8.  `store_orders` or `sub_orders`
9.  `order_items`
10. `reviews`
11. `addresses`
12. `wishlists`
13. `wishlist_items`

Important relationships: - One seller profile owns one store. - One
store has many products. - One category can be referenced by many
products. - One buyer has one active cart. - One cart has many cart
items. - One parent order can have multiple store-specific sub-orders. -
Each sub-order has order items. - Each order item references a product
and stores the purchase-time price. - A buyer can have many addresses. -
A buyer can have many wishlist entries. - A product can have many
eligible reviews.

Use primary keys, foreign keys, unique constraints, check constraints,
indexes, and timestamps appropriately. Document deletion behavior and
protect order history from accidental cascading deletion.

Do not store derived totals as the only source of truth. If totals are
persisted for historical records, calculate and validate them
server-side.

------------------------------------------------------------------------

## 9. Technical Architecture

### Stack
- **Framework:** Next.js (App Router, JSX/TSX, Server Actions, Route Handlers)
- **Styling:** Tailwind CSS
- **Icons:** Lucide icons
- **Database & Backend:** PostgreSQL (menggunakan Raw SQL queries via Node.js `pg` driver atau postgres client langsung di Next.js server actions)
- **Database Storage:** File skema database disimpan terpusat sebagai file `.sql` di luar folder `/app` (misalnya di folder `/database/schema.sql` atau `/sql/init.sql`) agar mudah dijalankan di pgAdmin.

### Architecture Principles
- Gunakan Next.js Server Components dan Server Actions untuk menangani logika backend, autentikasi sesi, dan eksekusi Raw SQL ke PostgreSQL.
- Pisahkan query SQL mentah agar terorganisir dengan baik di dalam modul repository/service layer.
- Enforce role dan permission secara ketat di server-side (Server Actions / Middleware).
- Pastikan tidak ada kredensial database yang terekspos di sisi client.

------------------------------------------------------------------------

## 10. Reusable Component Library

Create consistent, reusable components.

### Global

-   BrandLogo
-   Navbar
-   Footer
-   Sidebar
-   Button
-   Input
-   Textarea
-   Select
-   Checkbox
-   Modal
-   Dropdown
-   Badge
-   Toast
-   Pagination
-   ConfirmationDialog
-   LoadingState
-   EmptyState
-   ErrorState

### Commerce

-   ProductCard
-   ProductGrid
-   ProductGallery
-   CategoryCard
-   StoreCard
-   Rating
-   ReviewCard
-   CartItem
-   OrderCard
-   OrderStatusBadge
-   PriceDisplay

### Dashboard

-   DashboardLayout
-   DashboardHeader
-   SidebarNavigation
-   StatCard
-   DataTable
-   SearchFilterBar
-   FormDialog
-   StatusSummary

Components must have consistent spacing, typography, states,
accessibility, and responsive behavior. Avoid duplicating nearly
identical components across role dashboards.

------------------------------------------------------------------------

## 11. Interaction and State Requirements

Every interactive element must have a real, defined behavior.

Implement: - Hover, focus, active, disabled, and loading states. - Form
validation and field-level feedback. - Success and error
notifications. - Confirmation for destructive actions. - Add-to-cart
feedback. - Cart quantity updates. - Empty cart, wishlist, and order
states. - Skeletons or loading indicators where useful. - Retry or
recovery actions for errors. - Accessible modal and dropdown behavior.

Do not show a success toast until the underlying operation succeeds. Do
not use fake data or local-only state as a substitute for persistence
when a feature is expected to work across sessions.

Use optimistic updates only where safe and provide rollback/error
feedback.

------------------------------------------------------------------------

## 12. Quality Assurance and Acceptance Criteria

The application is not complete merely because pages render.

Test at least these scenarios:

### Authentication and roles

-   Buyer can register and log in.
-   Seller can register and starts as Pending.
-   Pending Seller cannot access seller dashboard or seller write
    actions.
-   Admin can approve or reject a pending Seller.
-   Approved Seller can access seller features.
-   Rejected Seller sees the rejection state and permitted account
    deletion.
-   Guest cannot use buyer-only actions.
-   Public registration cannot create an Admin.

### Ownership and authorization

-   Seller A cannot view or edit Seller B's products.
-   Seller A cannot view or update Seller B's orders.
-   Buyer A cannot view Buyer B's private cart, addresses, or orders.
-   Admin-only actions are denied to other roles.
-   Direct URL access and forged requests are tested, not just hidden
    navigation links.

### Commerce

-   Seller can create, update, and delete own products.
-   Buyer can add, update, and remove cart items.
-   Invalid quantities and insufficient stock are rejected.
-   Checkout creates consistent order records.
-   Cart clears only after successful checkout.
-   Stock is not oversold during concurrent checkout.
-   Multi-seller purchases preserve seller-specific fulfillment
    boundaries.
-   Buyer can review only eligible completed order items.

### Interface

-   Responsive at mobile, tablet, laptop, and desktop widths.
-   No broken images or overflowing layouts.
-   All buttons and links work.
-   Forms have labels and clear validation.
-   Loading, empty, success, and error states exist where appropriate.
-   Keyboard focus is visible and controls are accessible.

Do not claim a feature is complete unless it has been implemented and
tested. Document known limitations honestly.

------------------------------------------------------------------------

## 13. Agent Workflow and Operating Rules

Work in small, reviewable phases. Do not attempt a large, unverified
rewrite.

### Phase 1 --- Inspect and plan

1.  Inspect the existing repository and project instructions.
2.  Identify the current framework, dependencies, routes, and
    conventions.
3.  Summarize what already exists and what is missing.
4.  Propose the architecture and implementation plan.
5.  Identify any assumptions that could affect database or business
    logic.

### Phase 2 --- Brand and design foundation

1.  Define color, typography, spacing, and layout tokens.
2.  Establish logo placement and brand assets.
3.  Build shared components.
4.  Validate responsive behavior before duplicating patterns.

### Phase 3 --- Public and authentication experience

1.  Homepage.
2.  Product listing and detail.
3.  Login and registration.
4.  Pending/rejected seller states.

### Phase 4 --- Role dashboards

1.  Buyer dashboard.
2.  Seller dashboard.
3.  Admin dashboard.
4.  Protect route groups and verify role-aware navigation.

### Phase 5 --- Backend and core commerce

1.  Database schema and migrations.
2.  Authentication/profile integration.
3.  RLS and authorization.
4.  Product/store/category management.
5.  Cart and atomic checkout.
6.  Multi-seller orders and status transitions.
7.  Reviews.

### Phase 6 --- Optional capabilities

Implement wishlist, addresses, and enhanced filters only after core
requirements pass.

### Phase 7 --- Testing and delivery

1.  Run type checks, linting, and build.
2.  Test role and ownership boundaries.
3.  Test primary user journeys.
4.  Fix responsive and accessibility issues.
5.  Document setup, environment variables, migrations, seed data, and
    demo accounts.

### Rules for the coding agent

-   Read this `AGENT.md` before making changes.
-   Inspect before editing; do not assume the repository is empty.
-   Preserve working features and existing conventions.
-   Do not remove required features to simplify implementation.
-   Do not add unnecessary dependencies.
-   Do not create fake backend integrations.
-   Do not expose secrets.
-   Do not silently change business rules.
-   Do not use mock data in production flows unless explicitly
    identified as demo data.
-   Keep code modular, typed, readable, and maintainable.
-   Explain significant architectural decisions.
-   If a requirement is ambiguous and materially affects data integrity
    or authorization, ask before committing to an irreversible design.
-   After each phase, report files changed, features completed, tests
    run, and remaining issues.

------------------------------------------------------------------------

## 14. Definition of Done

TemuKarya is ready for demonstration when:

-   The brand identity is consistent across the application.
-   Public users can browse products and stores.
-   Buyers can complete the supported shopping journey.
-   Sellers must be approved before accessing seller tools.
-   Approved sellers can manage only their own store and products.
-   Admins can manage users, seller verification, categories, and
    prohibited products.
-   Orders and seller-specific fulfillment are handled consistently.
-   Reviews are restricted to eligible completed purchases.
-   Data access is protected by backend authorization and database
    policies.
-   The interface is responsive, accessible, and coherent.
-   Setup and demonstration instructions are documented.
-   Known limitations, especially the absence of a real payment gateway,
    are clearly stated.

------------------------------------------------------------------------

## FINAL BRAND PRINCIPLE

**TEMUKARYA --- Tempat Karya Lokal Bertemu Kepercayaan.**

Every design decision, feature, interaction, and technical rule should
support the same promise:

**TemuKarya is where creative work finds opportunity, and trust connects
sellers with buyers.**
