# ANTSA Landing Page Backend

Secure backend API with authentication and content management system for the ANTSA landing page.

## Features

- 🔐 **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- 📝 **Content Management**: Full CRUD operations for all landing page content
- 🖼️ **Image Upload**: Secure image upload and management
- 🗄️ **SQLite Database**: Lightweight, file-based database (easily upgradable to PostgreSQL)
- 🔒 **Server-Side Auth**: All authentication happens server-side, not in the client
- 📡 **RESTful API**: Clean, well-structured API endpoints

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment

The `.env` file has been created with default development settings. **IMPORTANT**: Change the JWT_SECRET in production!

### 3. Initialize Database

Run the seed script to create the database, tables, and initial content:

```bash
npm run seed
```

This will create:
- Database schema with all necessary tables
- Initial admin user (credentials configured separately via update-admin.js)
- Initial content from the current landing page

**✅ SECURITY**: Admin credentials are securely configured via separate script.

### 4. Start the Server

Development mode with auto-reload:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on `http://localhost:3001`

## API Endpoints

### Authentication

- `POST /api/auth/login` - Login with username/password
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/change-password` - Change password (requires auth)

### Content Management

- `GET /api/content` - Get all content (public)
- `GET /api/content/section/:sectionName` - Get content for specific section (public)
- `PUT /api/content/section/:sectionName` - Update section content (requires auth)

### Features

- `POST /api/content/features` - Create new feature (requires auth)
- `PUT /api/content/features/:id` - Update feature (requires auth)
- `DELETE /api/content/features/:id` - Delete feature (requires auth)

### Pricing Plans

- `POST /api/content/pricing` - Create pricing plan (requires auth)
- `PUT /api/content/pricing/:id` - Update pricing plan (requires auth)
- `DELETE /api/content/pricing/:id` - Delete pricing plan (requires auth)

### Testimonials

- `POST /api/content/testimonials` - Create testimonial (requires auth)
- `PUT /api/content/testimonials/:id` - Update testimonial (requires auth)
- `DELETE /api/content/testimonials/:id` - Delete testimonial (requires auth)

### Team Members

- `POST /api/content/team` - Create team member (requires auth)
- `PUT /api/content/team/:id` - Update team member (requires auth)
- `DELETE /api/content/team/:id` - Delete team member (requires auth)

### Images

- `POST /api/images/upload` - Upload image (requires auth)
- `GET /api/images/:filename` - Get image (public)
- `GET /api/images` - List all images (requires auth)
- `DELETE /api/images/:id` - Delete image (requires auth)

### Health Check

- `GET /api/health` - Server health check

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

Get a token by logging in:

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"YOUR_USERNAME","password":"YOUR_PASSWORD"}'
```

## Database Schema

### Tables

- **users**: Admin users with hashed passwords
- **sections**: Page sections (hero, features, pricing, etc.)
- **content**: Text content for each section
- **images**: Uploaded images with metadata
- **feature_items**: Feature cards
- **pricing_plans**: Pricing plan details
- **testimonials**: Client testimonials
- **team_members**: Team member profiles

## Security Features

1. **Password Hashing**: bcrypt with salt rounds
2. **JWT Tokens**: Expiring tokens (24h default)
3. **CORS Protection**: Configurable allowed origins
4. **Input Validation**: express-validator on all inputs
5. **File Upload Restrictions**: Image files only, 5MB limit
6. **SQL Injection Protection**: Prepared statements
7. **Server-Side Authentication**: No client-side auth logic

## Production Deployment

Before deploying to production:

1. ✅ Change `JWT_SECRET` to a strong random string
2. ✅ Admin password securely configured
3. ✅ Update `ALLOWED_ORIGINS` to your production domain
4. ✅ Set `NODE_ENV=production`
5. ✅ Consider using PostgreSQL instead of SQLite
6. ✅ Enable HTTPS
7. ✅ Set up proper logging and monitoring
8. ✅ Regular database backups

## Troubleshooting

**Database locked error**:
- Make sure only one instance of the server is running
- Check file permissions on `content.db`

**CORS errors**:
- Add your frontend URL to `ALLOWED_ORIGINS` in `.env`

**Token errors**:
- Verify `JWT_SECRET` is set correctly
- Check token hasn't expired (24h default)

## License

Proprietary - ANTSA

