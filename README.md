# 🎵 Musica - Next Gen Music Site 🎶

Welcome to the **Musica - Next Gen Music Site**, a platform where music comes alive! This app is your gateway to endless grooves, from soft ballads to party anthems. Built with cutting-edge technology, it delivers an unparalleled user experience.

<!-- ![Music App Banner](https://via.placeholder.com/1200x400?text=Your+Music+Journey+Starts+Here!) -->
![Home Page](https://github.com/Sachin-fsd/all-images/blob/main/musica-home-page.png?raw=true)

<p align="center">
  <img src="https://github.com/Sachin-fsd/all-images/blob/main/musica-home-page-mobile.png?raw=true" alt="Image 2" width="45%" height="500px">
  <img src="https://github.com/Sachin-fsd/all-images/blob/main/musica-home-page-mobile2.png?raw=true" alt="Image 1" width="45%" height="500px">
</p>


---

## 🚀 Features

- **Interactive Carousel**: Swipe through your favorite albums effortlessly.
- **Dynamic Playlists**: Automatically updates across users when songs or playlists change.
- **Global Play/Pause Control**: Hit the spacebar and let the music take over.
- **Dark Mode** 🌙: Perfectly tuned for night-time listening.
- **Responsive Design**: Looks stunning on all devices.
- **Real-time Updates**: Stay synced with live changes.
- **Custom Hover Effects**: Enjoy a smooth UI while interacting with the app.
- **Jam To Connect with Friends**: Jam feature to play same song with your friends anywhere in world.

---

## 🎯 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/)
- **Database**: MongoDB Atlas
- **Styling**: Tailwind CSS, Custom Fonts, and CSS Animations
- **Real-time Sync**: Supabase Edge Functions
- **Jam Feature**: Supabase for real time jam connection
<!-- - **Payment Integration**: Razorpay -->
- **Image Handling**: Optimized with Next.js Image Component

---

## 🌌 Screenshots

### Home Page 🌟
![Home Page Screenshot](https://github.com/Sachin-fsd/all-images/blob/main/musica-home-page.png?raw=true)

### Party Albums 🎉
![Party Albums Screenshot](https://github.com/Sachin-fsd/all-images/blob/main/musica-party-albums2.png?raw=true)

### Trending Albums 💿
![Soft Albums Screenshot](https://github.com/Sachin-fsd/all-images/blob/main/musica-party-albums.png?raw=true)

### Hit Albums 💿
![Hit Albums Screenshot](https://github.com/Sachin-fsd/all-images/blob/main/musica-hit-songs-lite2.png?raw=true)

### Light Mode ✨
![Light Mode Screenshot](https://github.com/Sachin-fsd/all-images/blob/main/musica-hit-songs-light.png?raw=true)

---

## 🛠 Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/yourusername/nextjs-music-site.git
   ```

2. Navigate to the project directory:
   ```bash
   cd nextjs-music-site
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

   Access the app at `http://localhost:3000`.

---

## 🌈 Customization

- Modify **CSS animations** in `styles/globals.css`.
- Update album details in `data/albums.js`.
- Configure MongoDB connection in `config/database.js`.

---

## 🎧 Usage

1. **Play a Song**: Click on any song to start playing.
2. **Switch Albums**: Use the carousel to explore more.
3. **Toggle Dark Mode**: Hit the moon icon 🌙 for a night-time vibe.
4. **Keyboard Controls**: Spacebar for play/pause.

---

## 🛡 Security

- All sensitive data, like API keys, is stored in environment variables.
<!-- - Payments are securely handled using Razorpay. -->

---


## ✅ CI/CD + Testing Workflow

You can keep your current branch-based workflow and automate checks before merge:

1. Create a feature branch from `main`.
2. Open a Pull Request to `main`.
3. GitHub Actions runs CI automatically:
   - `npm ci`
   - `npm run test:ci`
   - `npm run build`
4. Merge only when CI is green.
5. After merge to `main`, deploy runs automatically via Vercel workflow.

### Added automation files

- `.github/workflows/ci.yml` → runs tests + build on PRs and pushes to `main`.
- `.github/workflows/deploy-vercel.yml` → deploys `main` to Vercel (and supports manual trigger).
- `jest.config.cjs`, `jest.setup.js` → test runner setup.
- `__tests__/` → starter tests you can expand as features are added.

### Required GitHub secrets for deployment

Set this in your GitHub repository settings:

- `VERCEL_TOKEN`: Vercel personal access token with deploy permissions.
- `VERCEL_ORG_ID`: Vercel team/account org ID for the project.
- `VERCEL_PROJECT_ID`: Vercel project ID to allow non-interactive deploys in CI.

### Useful local commands

```bash
npm run test
npm run test:watch
npm run test:ci
npm run build
```

## 🤝 Contributions

Feel free to fork this repository and open a pull request with improvements or bug fixes. Contributions are always welcome! 💪

---

<!-- ## 🎨 Fonts & Colors

- **Primary Font**: [Inter](https://fonts.google.com/specimen/Inter)
- **Accent Colors**:
  - `#1DB954` (Spotify Green)
  - `#191414` (Dark Background)
  - `#FFFFFF` (Text on Dark Mode)

--- -->

## 🔗 Links

- **Live Demo**: [Music Site](https://musica-steel.vercel.app)
<!-- - **Documentation**: [API Docs](https://docs.yourmusicsite.com) -->
- **Contact**: [Email Us](mailto:sachineducational555@gmail.com)

---

## 📢 Disclaimer

All album covers and music belong to their respective artists and are used under fair use for demonstration purposes.

---

## 🎉 Credits

Made with ❤️ and 🎧 by [Sachin](https://github.com/Sachin-fsd).
