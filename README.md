# Secure Password Vault

A secure, privacy-first password manager with client-side encryption built with Next.js, TypeScript, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Git

### Local Setup

```bash
npm install

npm run dev
```

Visit: `http://localhost:3000` (if not preoccupied)

## 📁 File Structure Explained

```
password-vault/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API routes
│   │   │   ├── auth/                 # NextAuth endpoints
│   │   │   ├── vault/                # Vault CRUD operations
│   │   │   └── user/                 # User registration
│   │   ├── dashboard/                # Main vault dashboard
│   │   ├── login/                    # Login page
│   │   ├── register/                 # Registration page
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page (redirects)
│   │   ├── providers.tsx             # NextAuth provider
│   │   └── globals.css               # Tailwind imports
│   ├── components/                   # React components
│   │   ├── PasswordGenerator.tsx     # Password generation UI
│   │   ├── VaultList.tsx             # List of vault items
│   │   ├── VaultItem.tsx             # Single vault item card
│   │   ├── VaultForm.tsx             # Add/edit form
│   │   ├── SearchBar.tsx             # Search functionality
│   │   └── Navbar.tsx                # Navigation bar
│   ├── lib/                          # Utility functions
│   │   ├── db.ts                     # MongoDB connection
│   │   ├── encryption.ts             # Client-side encryption
│   │   └── passwordGenerator.ts      # Password generation logic
│   ├── models/                       # MongoDB models
│   │   ├── User.ts                   # User schema
│   │   └── VaultItem.ts              # Vault item schema
│   └── types/                        # TypeScript types
│       └── index.ts                  # All type definitions
├── .env.local                        # Environment variables
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── package.json                      # Dependencies
```

## 🔒 Security Features

### Client-Side Encryption
- **Library**: crypto-js
- **Key Derivation**: PBKDF2 with 1000 iterations
- **Why**: Server never sees plaintext passwords

### Password Generation
- Length: 8-32 characters
- Options: Uppercase, Lowercase, Numbers, Symbols
- Excludes similar characters (I, l, 1, O, 0)
- Cryptographically random

### Auto-Clear Clipboard
- Copied passwords auto-clear after 15 seconds
- Prevents accidental exposure

## 🎯 Features Implemented

-  Password generator with customizable options
-  Email + password authentication
-  Vault items with title, username, password, URL, notes
-  Client-side encryption (via crypto-js)
-  Copy to clipboard with auto-clear (15s)
-  Search/filter by title, username, URL
-  Dark Mode

## 🐛 Troubleshooting

### Issue: Build Errors
**Solution**:
```bash
# Clear cache and reinstall
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

## 📝 Crypto Library Explanation

**Why crypto-js?**

1. **Simplicity**: Easy API for AES-256 encryption
2. **Compatibility**: Works in both browser and Node.js
3. **Battle-tested**: Widely used, well-maintained library
4. **No Backend Crypto Needed**: Pure client-side encryption
5. **Small Bundle Size**: Minimal impact on app performance

---

**Built with ❤️ using Next.js, TypeScript, and MongoDB**