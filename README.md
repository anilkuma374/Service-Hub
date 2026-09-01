# ServiceHub

## Run the project

1. Install packages:

```bash
npm install
```

2. Start JSON Server:

```bash
npm run server
```

3. Start React:

```bash
npm run dev
```

## Demo accounts

- Admin: use the admin account stored in `db.json`
- Center: use the center account stored in `db.json`
- User: use the user account stored in `db.json`

The login form does not display demo credentials.

## Functional features

- Login, registration and logout
- Admin and service-center navigation
- Add, edit, update and delete users
- Add, edit, update and delete services
- Add, edit, update and delete service centers
- Booking creation, status update and cancellation
- Vehicle add, edit and delete
- Payments, reviews and notifications CRUD
- Profile and settings updates
- CSV export buttons
- Car and bike repair/service options
- Car and bike images on the home page

API calls use Axios with `get`, `post`, `put`, `delete`, `.then()` and `.catch()`.
