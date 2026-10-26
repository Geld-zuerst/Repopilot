<p align="center">
  <h1 align="center">🧭 RepoPilot</h1>
  <p align="center">
    <strong>Understand a GitHub Repository Before You Dive In.</strong>
  </p>
  <p align="center">
    Paste a public GitHub URL to explore repository structure, languages, documentation, dependencies, contributors, releases, and recent activity.
  </p>
  <p align="center">
    <a href="#-features">Features</a> •
    <a href="#-tech-stack">Tech Stack</a> •
    <a href="#-architecture">Architecture</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-environment-variables">Environment Variables</a> •
    <a href="#-project-structure">Project Structure</a>
  </p>
</p>

---

## 📖 About

**RepoPilot** helps developers evaluate public GitHub repositories before they clone, adopt, or contribute to them. Paste a repository URL to get its README, language breakdown, source tree and file previews, supported package dependencies, recent commits, contributors, releases, and project statistics in one view.

### What makes RepoPilot different?

- 🌳 **Repository Overview** — See stars, forks, issues, license, size, default branch, topics, language usage, and top-level structure.
- 📄 **File Browser & README** — Search a repository’s public file tree and preview individual text files on demand.
- 📦 **Dependency Discovery** — Read dependencies from `package.json`, `requirements.txt`, `pyproject.toml`, `Cargo.toml`, and `go.mod`.
- 📈 **Maintenance Signals** — Review recent commits, top contributors, releases, and last-push date.
- 🔒 **Read-Only** — RepoPilot does not clone, modify, or store the repository contents.
- 👥 **Optional Community** — Accounts, project listings, developer profiles, and community posts are also available.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🌳 **Repository analysis** | Paste a public GitHub URL to inspect repository metadata, source tree, languages, and documentation |
| 📦 **Dependencies** | Extract declared dependencies from common JavaScript, Python, Rust, and Go manifests |
| 📈 **Project activity** | Explore recent commits, contributors, releases, stars, forks, and open issues |
| 🧾 **Source previews** | Search repository paths and preview text files directly from GitHub |
| 👥 **Optional community** | JWT accounts, project listings, developer profiles, posts, likes, and comments |
| 🎨 **Cyberpunk UI Design** | Premium dark theme with glassmorphism, neon accents, and Framer Motion animations |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [Next.js](https://nextjs.org/) | 16.4 | React framework (App Router, Turbopack) |
| [React](https://react.dev/) | 19.3 | UI library |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety |
| [Tailwind CSS](https://tailwindcss.com/) | 4.x | Utility-first styling |
| [Three.js](https://threejs.org/) | 0.186 | 3D graphics & WebGL |
| [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) | 9.8 | React renderer for Three.js |
| [@react-three/drei](https://github.com/pmndrs/drei) | 10.7 | Three.js helpers & abstractions |
| [Framer Motion](https://www.framer.com/motion/) | 14.3 | Animations & transitions |
| [Lucide React](https://lucide.dev/) | 1.58 | Icon library |
| [Axios](https://axios-http.com/) | 1.20 | HTTP client |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Django](https://www.djangoproject.com/) | 4.2 | Web framework |
| [Django REST Framework](https://www.django-rest-framework.org/) | 3.15 | REST API toolkit |
| [SimpleJWT](https://django-rest-framework-simplejwt.readthedocs.io/) | 5.3 | JWT authentication |
| [django-cors-headers](https://github.com/adamchainz/django-cors-headers) | 4.4 | CORS management |
| [python-decouple](https://github.com/HBNetwork/python-decouple) | 3.8 | Environment configuration |
| [Pillow](https://python-pillow.org/) | 10.4 | Image processing (avatars) |

### Database
| Technology | Purpose |
|---|---|
| **SQLite** | Lightweight relational database (via Django ORM) |

Repository analysis uses GitHub's public REST API. AI-generated code explanations and private-repository access are not implemented.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 16 + React 19)              │
│                                                                 │
│  ┌───────────┐  ┌──────────────┐  ┌───────────┐  ┌──────────┐  │
│  │  Landing   │  │ Repository   │  │ File Tree │  │ Optional │  │
│  │  Page +    │  │  Dashboard   │  │ + Preview │  │ Community│  │
│  │ Repo URL   │  │  Overview    │  │ README    │  │  Posts   │  │
│  └───────────┘  └──────────────┘  └───────────┘  └──────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │ GitHub public REST API
┌───────────────────────────┼─────────────────────────────────────┐
│                  Backend (Django REST Framework)                 │
│                            │                                    │
│  ┌──────────────┐  ┌──────┴───────┐  ┌───────────────────┐     │
│  │   accounts/  │  │  projects/   │  │    community/     │     │
│  │  Auth & JWT  │  │  Repo CRUD   │  │  Posts, Comments  │     │
│  │  Profiles    │  │  Metadata    │  │  Likes, Follow    │     │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘     │
│         └─────────────────┼───────────────────┘                 │
│                           │                                     │
│                    ┌──────┴───────┐                              │
│                    │  Django ORM  │                              │
│                    └──────┬───────┘                              │
└───────────────────────────┼─────────────────────────────────────┘
                            │
                     ┌──────┴───────┐
                     │   SQLite DB  │
                     └──────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                Public repository information                     │
│                                                                 │
│  Metadata ── Languages ── Tree ── README ── Activity/Manifests  │
│             File previews are requested only when opened         │
└─────────────────────────────────────────────────────────────────┘
```

### API Endpoints

#### Authentication (`/api/auth/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register/` | Register new user (returns tokens) |
| `POST` | `/api/auth/login/` | Login with email & password |
| `POST` | `/api/auth/refresh/` | Refresh access token |
| `GET/PUT/PATCH` | `/api/auth/profile/` | View/update user profile |
| `GET` | `/api/auth/users/?search=` | Search users |
| `GET` | `/api/auth/users/<username>/` | View user profile |
| `POST` | `/api/auth/users/<username>/follow/` | Toggle follow/unfollow |

#### Projects (`/api/projects/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/projects/` | List projects (filter by `featured`, `language`, `tag`, `search`) |
| `POST` | `/api/projects/create/` | Create new project (auth required) |
| `GET` | `/api/projects/mine/` | List your projects |
| `GET` | `/api/projects/<id>/` | Project details |
| `PUT/PATCH` | `/api/projects/<id>/update/` | Update project (owner only) |
| `DELETE` | `/api/projects/<id>/delete/` | Delete project (owner only) |

#### Community (`/api/community/`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/community/feed/` | Get feed (`?following=true` for following-only) |
| `GET/POST` | `/api/community/posts/` | List/create posts |
| `GET/PUT/DELETE` | `/api/community/posts/<id>/` | Post CRUD |
| `POST` | `/api/community/posts/<id>/like/` | Toggle like |
| `GET/POST` | `/api/community/posts/<post_pk>/comments/` | List/create comments |
| `DELETE` | `/api/community/posts/<post_pk>/comments/<id>/delete/` | Delete comment |

#### Platform
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats/` | Platform-wide statistics |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v20.9 or higher
- **Python** 3.12 recommended for the pinned backend dependencies
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Geld-zuerst/Repopilot.git
cd Repopilot
```

### 2. Backend Setup (Django API)

```powershell
# From the repository root. Python 3.12 is recommended for the pinned dependencies.
cd backend
py -3.12 -m venv .venv312
.\.venv312\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8000
```

The optional Django API is available at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)

```powershell
# Navigate to frontend (from project root)
cd frontend
npm install
npm run dev
```

Frontend will be running at `http://localhost:3000`.

Repository analysis works directly with GitHub's public API and does not require the optional Django server. GitHub's unauthenticated API rate limit applies.

---

## 🔑 Environment Variables

### Frontend — `frontend/.env.local`

| Variable | Required | Description |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ⬜ | URL of the Django backend; defaults to `http://localhost:8000` |
| `GITHUB_ID` | ⬜ | Not required for public repository analysis |
| `GITHUB_SECRET` | ⬜ | Not required for public repository analysis |
| `NEXTAUTH_SECRET` | ⬜ | Not used by the current authentication flow |
| `NEXTAUTH_URL` | ⬜ | Not used by the current authentication flow |

### Backend — `backend/.env`

| Variable | Required | Description |
|---|:---:|---|
| `SECRET_KEY` | ✅ | Django secret key for cryptographic signing |
| `DEBUG` | ✅ | Set to `True` for development, `False` for production |
| `ALLOWED_HOSTS` | ✅ | Comma-separated list (e.g., `localhost,127.0.0.1`) |
| `GEMINI_API_KEY` | ⬜ | Reserved for a future AI integration |
| `OLLAMA_BASE_URL` | ⬜ | Reserved for a future local AI integration |

---

## 📁 Project Structure

```
Repopilot/
│
├── frontend/                        # Next.js 16 + React 19 Frontend
│   ├── app/                         # App Router
│   │   ├── layout.tsx               # Root layout, SEO metadata, session provider
│   │   ├── page.tsx                 # Repository-analyzer landing page
│   │   ├── analyze/                 # GitHub repository overview, file browser, dependencies
│   │   ├── login/ and register/     # JWT account flows
│   │   ├── projects/                # Project directory and project detail/CRUD
│   │   ├── community/               # Posts, likes, comments, and feed
│   │   ├── users/                   # Developer directory and public profiles
│   │   ├── profile/                 # Edit your developer profile
│   │   └── globals.css              # Design system and responsive app styles
│   ├── components/
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx      # Hero CTA with staggered animations & 3D scene
│   │   │   └── RepoScene.tsx        # Three.js 3D canvas — glass cube, orbiting nodes, particles
│   │   ├── repository/
│   │   │   └── RepositoryAnalyzer.tsx # GitHub repo dashboard and detail tabs
│   │   ├── layout/
│   │   │   ├── AppHeader.tsx        # Workspace navigation and session controls
│   │   │   ├── Navbar.tsx           # Landing page navigation
│   │   │   └── PageShell.tsx        # Shared workspace page layout
│   │   └── sections/
│   │       ├── CodeExplorer.tsx     # Repository analyzer feature overview
│   │       └── Features.tsx         # 4 interactive feature cards with custom SVG visuals
│   ├── lib/
│   │   ├── api.ts                   # Typed API requests and JWT refresh handling
│   │   └── github.ts                # Public GitHub API, source tree, manifests, and file reads
│   ├── public/                      # Static assets
│   ├── package.json                 # Dependencies
│   ├── tsconfig.json                # TypeScript config
│   └── next.config.ts               # Next.js & Turbopack config
│
├── backend/                         # Django REST Framework Backend
│   ├── accounts/                    # Auth, User model, Profiles, Follow system
│   │   ├── models.py                # Custom User (email login, skills, following M2M)
│   │   ├── serializers.py           # User & auth serializers
│   │   ├── views.py                 # Register, Login, Profile, Follow views
│   │   └── urls.py                  # /api/auth/ routes
│   ├── projects/                    # Repository tracking & metadata
│   │   ├── models.py                # Project model (GitHub stats, languages, tags)
│   │   ├── serializers.py           # Project serializers
│   │   ├── views.py                 # CRUD + filtering views
│   │   └── urls.py                  # /api/projects/ routes
│   ├── community/                   # Social feed — posts, comments, likes
│   │   ├── models.py                # Post & Comment models
│   │   ├── serializers.py           # Feed serializers
│   │   ├── views.py                 # Feed, CRUD, like toggle, comment views
│   │   └── urls.py                  # /api/community/ routes
│   ├── repopilot/                   # Django core configuration
│   │   ├── settings.py              # App config, JWT, CORS, database
│   │   ├── urls.py                  # Root URL router + /api/stats/
│   │   ├── asgi.py                  # ASGI entry point
│   │   └── wsgi.py                  # WSGI entry point
│   ├── manage.py                    # Django CLI
│   └── requirements.txt             # Python dependencies
│
├── state/                           # State diagrams (PNG)
│
├── Agent.md                         # AI agent behavioral contract & JSON response schema
├── Instruction.md                   # Core development & security guidelines
├── design.md                        # UI/UX design tokens & typography spec
├── solution.md                      # Problem statement, personas, system architecture
├── userflow.md                      # End-to-end user journey maps
└── README.md                        # ← You are here
```

---

## 🎨 Design & UI

RepoPilot features a **cyberpunk-inspired dark theme** with a carefully crafted design system:

- **Color Palette:** Deep space black (`#07080F`), electric violet (`#8B5CF6`), neon cyan (`#22D3EE`)
- **Typography:** Inter (body), JetBrains Mono (code)
- **3D Graphics:** Interactive Three.js scene with frosted glass cube, `MeshTransmissionMaterial` with chromatic aberration, orbiting file nodes, connection lines, and 80-point particle fields
- **Glassmorphism:** Frosted glass effects throughout the UI — navbar, cards, panels
- **Animations:** Staggered Framer Motion entrances, scroll-triggered reveals, hover effects
- **Repository analyzer:** GitHub URL input, repository overview, file tree and previews, README, languages, dependencies, contributors, releases, and commits

---

## 🔒 Security Design

Repository analysis is currently read-only and uses the public GitHub API:

| Principle | Implementation |
|---|---|
| **Read-Only** | Does not clone, modify, or execute repository code |
| **Public Repositories** | Private repositories are not supported |
| **On-Demand Previews** | Text file contents are fetched from GitHub only when a user opens a file; preview files are limited to 250 KB |
| **No Repository Storage** | Repository data is held in page state and is not saved to the app database |

---

## 📝 How It Works

1. **Paste a GitHub URL** — Enter a link to a public repository.
2. **Load its overview** — RepoPilot reads repository metadata, languages, README, and the default-branch tree.
3. **Inspect the project** — Review dependency manifests, recent commits, top contributors, and releases.
4. **Browse source** — Search file paths and open individual text files from GitHub on demand.

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please review the [Agent.md](Agent.md) and [Instruction.md](Instruction.md) files for development guidelines and security requirements.

---

## 📄 License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/Geld-zuerst">Geld-zuerst</a>
</p>
