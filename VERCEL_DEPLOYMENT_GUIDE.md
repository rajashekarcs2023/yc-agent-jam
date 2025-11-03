# 🚀 Vercel Deployment Guide for CodeLab AI

## ✅ **Frontend Ready for Deployment**

Your Next.js frontend is ready to deploy to Vercel! Here's how:

### **Option 1: Quick Demo Deployment (Recommended)**

**1. Deploy Frontend to Vercel:**
```bash
cd /Users/radhikadanda/yc-agent-jam/code
npx vercel --prod
```

**2. Keep Backend Running Locally:**
- Keep your backend running: `python main.py`
- Update deployed app to use local backend for demo

**3. For YC Agent Jam Demo:**
- Show deployed frontend URL to judges
- Backend runs locally with all 4 sponsor APIs
- Perfect for live demonstration

---

### **Option 2: Full Production Deployment**

**Frontend (Vercel):**
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Deploy automatically

**Backend (Railway/Render):**
1. Deploy Python FastAPI backend to Railway or Render
2. Update environment variable in Vercel

---

## 🎯 **Deployment Steps**

### **Step 1: Deploy to Vercel**

```bash
# Navigate to frontend directory
cd /Users/radhikadanda/yc-agent-jam/code

# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod
```

### **Step 2: Configure Environment Variables**

**In Vercel Dashboard:**
- Go to your project settings
- Add environment variable:
  - `NEXT_PUBLIC_API_URL` = `http://localhost:8000` (for demo)
  - Or your production backend URL

### **Step 3: Test Deployment**

**What works on Vercel:**
- ✅ Professional 3-tab interface
- ✅ All UI components and interactions
- ✅ Frontend-only features
- ✅ Responsive design

**What needs backend:**
- ⚠️ Code optimization experiments
- ⚠️ Documentation generation
- ⚠️ GitHub repository analysis

---

## 🎬 **Perfect for YC Agent Jam Demo**

### **Demo Setup:**
1. **Deployed Frontend**: Professional interface on Vercel
2. **Local Backend**: All 4 sponsor APIs working
3. **Live Demo**: Show both frontend and backend capabilities

### **Demo Flow:**
1. **Show Vercel URL**: Professional deployed interface
2. **Run Local Backend**: All features working live
3. **Demonstrate Features**: 
   - Code optimization with variant containers
   - Documentation to code generation
   - GitHub repository analysis
4. **Highlight Production Ready**: Deployable platform

---

## 🔧 **Files Modified for Deployment**

**✅ Environment Variables Added:**
- `/code/.env.local` - Backend URL configuration
- All API calls now use `process.env.NEXT_PUBLIC_API_URL`

**✅ Components Updated:**
- `experiment-lab.tsx` - Dynamic API URLs
- `documentation-generator.tsx` - Environment-based endpoints
- `github-analyzer.tsx` - Configurable backend URL
- `experiment-results.tsx` - Flexible API calls

**✅ WebSocket Support:**
- Automatic HTTP/HTTPS to WS/WSS conversion
- Works with both local and production backends

---

## 📊 **Deployment Benefits**

### **For YC Agent Jam:**
- ✅ **Professional URL** to share with judges
- ✅ **Production-ready** frontend demonstration
- ✅ **Scalable architecture** shown in practice
- ✅ **Full functionality** with local backend

### **For Future:**
- ✅ **Easy scaling** - just deploy backend to cloud
- ✅ **Environment flexibility** - dev/staging/prod configs
- ✅ **Modern stack** - Next.js 16 + FastAPI
- ✅ **Performance optimized** - Vercel edge deployment

---

## 🎉 **Ready to Deploy!**

Your CodeLab AI platform is fully prepared for Vercel deployment. The frontend will work beautifully on Vercel, and you can run the backend locally for your YC Agent Jam demo to show all the AI capabilities live!

### **Commands to Deploy:**
```bash
cd /Users/radhikadanda/yc-agent-jam/code
npx vercel --prod
```

### **Commands to Run Demo:**
```bash
# Terminal 1: Backend
cd /Users/radhikadanda/yc-agent-jam
source yc-env/bin/activate
python main.py

# Terminal 2: Show deployed frontend
# Visit your Vercel URL
```

**🏆 Perfect setup for winning YC Agent Jam 2025!**