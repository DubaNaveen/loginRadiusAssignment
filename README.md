# LoginRadius Service

A full-stack login application with brute-force protection.

## Features

- User login and registration
- User-level blocking (5 failed attempts → 15 min block)
- IP-level blocking (100 failed attempts → IP block)
- Modern React UI

## Setup

### Prerequisites
- Node.js
- MySQL

### Installation
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env



# Start development server
npm run dev
```



## Architecture

- **Backend**: Node.js + Express + MySQL + Sequelize
- **Frontend**: React + TypeScript
- **Security**: JWT + bcrypt + brute force protection

## Deployment

### Vercel
```bash
npm i -g vercel
vercel
```

### Railway
```bash
npm i -g @railway/cli
railway login
railway up
```

## Testing
```bash
npm run test:all
```

## License
ISC
# backend_service_lr
