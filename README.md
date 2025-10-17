# ANTSA Landing Page - Full-Stack CMS

A complete full-stack content management system for the ANTSA landing page with **secure server-side authentication** and full customization capabilities.

![ANTSA Landing Page](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Security](https://img.shields.io/badge/Security-Server--Side%20Auth-success)

## ✨ Key Features

### 🎨 Frontend
- **Modern React + TypeScript** - Built with latest React 18
- **Ant Design UI** - Professional, responsive components
- **Beautiful Animations** - Smooth scroll reveals and transitions
- **Mobile-First** - Works perfectly on all devices
- **Dynamic Content** - All content loaded from API

### 🔒 Backend (Server-Side Auth - NOT Client-Side!)
- **Secure JWT Authentication** - All auth logic on the server
- **bcrypt Password Hashing** - Industry-standard security
- **RESTful API** - Clean, well-documented endpoints
- **SQLite Database** - Lightweight, easily upgradable to PostgreSQL
- **Image Upload** - Secure file handling with validation
- **Input Validation** - express-validator on all inputs
- **CORS Protection** - Configurable allowed origins

### 🎛️ Admin Panel
- **Full Content Management** - Edit all text, images, and components
- **User-Friendly Interface** - No coding required
- **Real-Time Updates** - See changes immediately
- **Secure Access** - Protected by JWT authentication
- **Password Management** - Change password securely

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Modern web browser

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Initialize Database

```bash
# Seed the database with initial content and admin user
npm run backend:seed
```

**Default admin credentials:**
- Username: `admin`
- Password: [Contact admin for credentials]

**⚠️ IMPORTANT**: Change this password immediately after first login!

### 3. Start Development Servers

Open two terminal windows:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:3001`

**Terminal 2 - Frontend:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 4. Access the Application

- **Landing Page**: http://localhost:5173/
- **Admin Panel**: http://localhost:5173/admin
- **API**: http://localhost:3001/api

## 📚 Documentation

- **[Quick Start Guide](QUICK_START_GUIDE.md)** - Get started in 5 minutes
- **[Project Documentation](PROJECT_DOCUMENTATION.md)** - Complete technical documentation
- **[Backend API Docs](backend/README.md)** - API endpoints and usage
- **[Deployment Guide](DEPLOYMENT.md)** - Production deployment instructions

## 🏗️ Project Structure

```
antsa-landing-page/
├── backend/                    # Backend API server
│   ├── config/
│   │   └── database.js        # Database schema
│   ├── middleware/
│   │   └── auth.js            # JWT authentication
│   ├── routes/
│   │   ├── auth.js            # Login, logout, password change
│   │   ├── content.js         # Content management
│   │   └── images.js          # Image uploads
│   ├── scripts/
│   │   └── seed.js            # Database seeding
│   ├── server.js              # Express server
│   └── package.json
├── src/
│   ├── components/
│   │   ├── admin/             # Admin panel components
│   │   │   ├── LoginPage.tsx
│   │   │   ├── DashboardView.tsx
│   │   │   ├── HeroEditor.tsx
│   │   │   ├── FeaturesEditor.tsx
│   │   │   ├── PricingEditor.tsx
│   │   │   ├── TestimonialsEditor.tsx
│   │   │   ├── TeamEditor.tsx
│   │   │   ├── ContactEditor.tsx
│   │   │   └── SettingsView.tsx
│   │   └── [Landing page components]
│   ├── pages/
│   │   └── Admin.tsx          # Admin panel
│   ├── App.tsx                # Landing page
│   └── main.tsx               # Entry point
└── package.json
```

## 🔐 Security Features

✅ **Server-Side Authentication** - All auth logic is on the backend  
✅ **JWT Tokens** - Secure token-based authentication  
✅ **Password Hashing** - bcrypt with salt rounds  
✅ **Input Validation** - All inputs validated  
✅ **CORS Protection** - Configurable allowed origins  
✅ **SQL Injection Protection** - Prepared statements only  
✅ **File Upload Security** - Type and size validation  
✅ **Secure Password Change** - Requires current password  

## 📝 Using the Admin Panel

### First Login

1. Navigate to: http://localhost:5173/admin
2. Login with your admin credentials
3. **Immediately change password** in Settings!

### Managing Content

#### Hero Section
Edit the main landing section:
- Main title and subtitle
- Description text
- Button labels
- Badge text

#### Features
Add/edit/delete feature cards:
- Title and description
- Icon and colors
- Gradients
- Reorder features

#### Pricing
Create pricing plans:
- Plan name and price
- Feature lists
- Mark as featured
- Multiple tiers

#### Testimonials
Add client testimonials:
- Client name and role
- Testimonial text
- Star rating
- Reorder testimonials

#### Team
Manage team members:
- Name and role
- Biography
- Profile images (future feature)

#### Contact
Update contact information:
- Section title/subtitle
- Email and phone

#### Settings
- Admin password is securely configured
- Security guidelines

## 🎯 Common Use Cases

### Updating Hero Text

1. Login to admin panel
2. Click "Hero Section"
3. Edit any field
4. Click "Save Changes"
5. Refresh landing page to see changes

### Adding a New Feature

1. Go to "Features" section
2. Click "Add Feature"
3. Fill in:
   - Title: "New Feature"
   - Description: "Feature description"
   - Icon: "StarOutlined" (Ant Design icon name)
   - Color: "#48abe2"
   - Gradient: "linear-gradient(135deg, #48abe2 0%, #2196f3 100%)"
4. Click "Create"

### Creating Pricing Plans

1. Go to "Pricing" section
2. Click "Add Plan"
3. Fill in plan details
4. Add features (one per line)
5. Toggle "Featured" if needed
6. Click "Create"

## 🐛 Troubleshooting

### Backend won't start

**Issue**: Port already in use  
**Solution**: 
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9
```

**Issue**: Database locked  
**Solution**: Only run one backend instance

### CORS Errors

**Issue**: Frontend can't connect to backend  
**Solution**: Add your URL to `backend/.env`:
```
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Login Issues

**Issue**: "Invalid credentials"  
**Solution**: Make sure you've run `npm run backend:seed`

**Issue**: "Token expired"  
**Solution**: Login again (tokens expire after 24h)

## 🚢 Deployment

### Pre-Deployment Checklist

- [ ] Change JWT_SECRET in `backend/.env`
- [x] Admin password securely configured
- [ ] Update ALLOWED_ORIGINS to production domain
- [ ] Set NODE_ENV=production
- [ ] Build frontend: `npm run build`
- [ ] Enable HTTPS
- [ ] Set up database backups

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

## 🔄 Development Workflow

### Making Changes

1. **Backend Changes**: Server auto-restarts with nodemon
2. **Frontend Changes**: Hot module replacement (instant updates)
3. **Database Changes**: Run migrations or re-seed

### Testing Changes

1. Make changes in admin panel
2. Refresh landing page
3. Verify changes appear correctly

## 📊 Database Schema

### Core Tables

- **users** - Admin users with hashed passwords
- **sections** - Page sections (hero, features, pricing, etc.)
- **content** - Text content for each section
- **images** - Uploaded images with metadata
- **feature_items** - Feature cards
- **pricing_plans** - Pricing plans with features
- **testimonials** - Client testimonials
- **team_members** - Team member profiles

## 🔧 Tech Stack

### Frontend
- React 18.3
- TypeScript 5.6
- Ant Design 5.26
- Vite 6.0
- React Router DOM 6.24

### Backend
- Node.js 18+
- Express 4.19
- better-sqlite3 (SQLite)
- JWT (jsonwebtoken)
- bcryptjs
- multer (file uploads)
- express-validator

## 🎯 Future Enhancements

Potential features to add:

- [ ] Multi-user support with roles
- [ ] Content versioning and rollback
- [ ] Rich text editor
- [ ] Drag-and-drop reordering
- [ ] Image cropping/resizing
- [ ] Email notifications
- [ ] Analytics integration
- [ ] Multi-language support
- [ ] Content scheduling

## 🤝 Contributing

This is a proprietary project for ANTSA. For questions or issues, contact the development team.

## 📝 Scripts

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Lint code

# Backend
npm run backend      # Start backend in dev mode
npm run backend:seed # Seed database
```

## ⚠️ Important Security Notes

1. **Never commit `.env` files** - Use `.env.example` as template
2. **Change default password** - Do this immediately after first login
3. **Use HTTPS in production** - Never use HTTP for authentication
4. **Regular updates** - Keep dependencies updated
5. **Database backups** - Set up automated backups

## 📞 Support

For technical support:
- Email: dev@antsa.com.au
- Documentation: See docs in this repository

## 📄 License

Proprietary - ANTSA

---

**Built with ❤️ for ANTSA** | Transform Mental Healthcare with AI
