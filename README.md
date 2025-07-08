# 3D Portfolio

A visually stunning, interactive 3D portfolio built with React and Three.js. Showcases your skills, projects, and contact info in a unique, immersive environment.

![screenshot](public/logo512.png)

---

## ✨ Features
- **3D Interactive Scene**: Explore buildings representing different sections (About, Projects, Skills, Contact).
- **Animated Loading Screen**: Custom background, animated icons, and interactive mouse effects.
- **Personalized Greeting**: User enters their name for a custom welcome.
- **Keyboard & Mouse Navigation**: WASD camera movement, orbit controls, and clickable buildings.
- **Responsive Design**: Works on desktop and mobile.
- **Beautiful Modals**: Section content in stylish, scrollable modals.
- **Customizable**: Easily update your info, projects, and style.

---

## 🚀 Getting Started

### 1. **Clone the repository**
```bash
git clone https://github.com/your-username/3d-portfolio.git
cd 3d-portfolio
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Run locally**
```bash
npm start
```
Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Project Structure
```
3d-portfolio/
  public/           # Static assets (index.html, icons, etc.)
  src/
    components/     # React components (3D scene, UI, modals, etc.)
    App.js          # Main app entry
    index.js        # React entry point
  package.json      # Project metadata & scripts
```

---

## 🌐 Deployment

### **Deploy to Vercel**
1. Push your code to GitHub/GitLab/Bitbucket.
2. Go to [vercel.com](https://vercel.com/) and import your repo.
3. Vercel auto-detects React. Default build command: `npm run build`. Output: `build/`.
4. Click **Deploy**. Done!

You’ll get a live URL like `https://your-portfolio.vercel.app`.

---

## ⚙️ Customization
- **Edit your info**: Update content in `src/components/PortfolioModal.js`, `UI.js`, etc.
- **Change 3D scene**: Tweak `Scene.js`, `Building.js`, and styles in `App.css`/component CSS.
- **Add music**: Place `.mp3` files in `public/` and update components to use them.

---

## 🙏 Credits
- [React](https://reactjs.org/)
- [Three.js](https://threejs.org/)
- [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [@react-three/drei](https://docs.pmnd.rs/drei/introduction)
- [Vercel](https://vercel.com/)

---

## 📄 License
[MIT](LICENSE)
