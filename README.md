# Oyo Emergency BloodLink

Oyo Emergency BloodLink is a responsive, sample-data MVP for a student TBP project. It demonstrates how participating hospitals could coordinate reported blood availability and emergency blood requests more quickly.

> **Prototype — Sample Data Only.** The hospitals, users, inventory, alerts, and requests are fictional. This project is not a medical decision-making or transfusion-approval system.

## MVP scope

- Hospital and admin demo login
- Reported blood inventory, searchable by blood group, quantity, and hospital
- Emergency request creation with in-app alerts for matching hospitals
- Receiving-hospital acceptance, safe inventory reservation, and explicit completion
- Inventory updates with no negative quantity or overwriting reserved units
- Hospital dashboard, alerts, request tracking, and basic administration/activity view
- Timestamped inventory and a visible medical safety disclaimer

No patient records, real hospital integrations, payment services, GPS, SMS, or clinical compatibility recommendations are included.

## Stack and data mode

The UI uses Next.js App Router, TypeScript, React, and CSS. A PostgreSQL/Prisma relational schema is included at `prisma/schema.prisma` for a hosted deployment.

To keep the lecturer demo zero-cost and immediately runnable without a database service, the running MVP uses a local JSON sample-data store at `data/store.json`. It is created from `data/sample-store.json` on first run. The store provides the same entities needed for the workflow and persists edits during the local demo.

## Setup

1. Install Node.js 20+ and npm (or pnpm).
2. Copy `.env.example` to `.env` if preparing a future PostgreSQL deployment. No environment variable is required for the local demo mode.
3. Install packages:

   ```bash
   npm install
   ```

4. Reset/seed the local sample data:

   ```bash
   npm run db:seed
   ```

5. Start the application:

   ```bash
   npm run dev
   ```

Open `http://localhost:3000`.

## Demo accounts

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@bloodlink.demo` | `Admin123!` |
| Oyo Central Hospital | `oyo.central@bloodlink.demo` | `Hospital123!` |
| Ibadan Emergency Medical Centre | `ibadan.emergency@bloodlink.demo` | `Hospital123!` |
| Bodija General Hospital | `bodija.general@bloodlink.demo` | `Hospital123!` |

All other seeded hospital accounts use their displayed `.demo` email and `Hospital123!`.

## Primary demonstration workflow

1. Log in as **Ibadan Emergency Medical Centre**.
2. Open **Blood Availability** and search for `O+`; Oyo Central Hospital reports 10 units.
3. Select **Request Blood**, choose `O+`, quantity `3`, and urgency `EMERGENCY`; submit.
4. Sign out, then log in as **Oyo Central Hospital**.
5. Open **Alerts**, view the new request, and select **Accept request & reserve 3 units**.
6. The Oyo Central `O+` inventory now shows 7 available units and 3 reserved.
7. Sign in again as Ibadan to see the request status as `ACCEPTED`.
8. Sign in as Oyo Central and choose **Mark request completed**. The reported O+ quantity becomes 7 and the status is `COMPLETED`.

Run `npm run db:seed` any time to reset the demonstration data.

## Important limitations and safety

This prototype only displays blood reported as available. Authorized medical personnel must independently verify inventory, compatibility, transport, and clinical decisions before any transfusion. The included hotline is a non-functional UI example, not an emergency service.

For a production build, replace the demo store with Prisma queries/migrations against the configured PostgreSQL database, use strong password hashing and Auth.js, add audit retention, concurrency-safe database transactions, hospital onboarding, and appropriate governance/privacy controls.
