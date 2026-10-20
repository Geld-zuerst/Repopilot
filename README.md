<p align="center">
  <h1 align="center">🧭 RepoPilot</h1>
  <p align="center">
    <strong>Understand Any Codebase. Navigate Every Line.</strong>
  </p>
  <p align="center">
    An AI-powered codebase intelligence platform that provides <em>evidence-backed, citation-verified</em> answers grounded in real source files — never hallucinated.
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

**RepoPilot** is a full-stack web application designed to solve one of the biggest challenges developers face: **understanding unfamiliar or complex codebases**. Whether you're onboarding to a new team, inheriting legacy code, or contributing to open-source, RepoPilot gives you the tools to navigate and understand any repository with confidence.

### What makes RepoPilot different?

- 🔍 **Evidence-First Answers** — Every AI explanation is anchored to exact source files and line ranges that you can inspect directly in the built-in code viewer. No hallucinations, no made-up function names.
- 🔒 **Local-First & Privacy-Safe** — Repository code stays strictly local. Supports local AI models (via Ollama) or controlled cloud integrations, ensuring zero code leaks.
- 🛡️ **Read-Only & Secure** — Operates in read-only mode. Automatically prunes secrets (`.env`, `.pem`, `.key`), binaries, and dependency folders. Never executes repository code.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI-Powered Code Investigation** | Ask questions about any codebase and receive evidence-backed answers with verified file & line citations |
| 🌳 **Interactive File Tree Browser** | Browse the full directory structure of any repository |
| 📄 **Syntax-Highlighted Code Viewer** | View file contents with syntax highlighting and line numbers |
| 🎯 **Citation Verification** | Every AI claim links to exact `file:line_start–line_end` ranges you can verify |
| 🌐 **3D Repository Visualization** | Stunning Three.js 3D scene with rotating glass cube, orbiting file nodes, and particle fields |
| 👥 **Developer Community** | Social feed with posts, comments, likes, and follow system |
| 📂 **Project Registry** | Track and catalog repositories with metadata, languages, GitHub stats, and tags |
| 🔐 **JWT Authentication** | Secure email-based auth with access/refresh token rotation and blacklisting |
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

### AI Engine (Target Architecture)
| Technology | Purpose |
|---|---|
| [Ollama](https://ollama.com/) | Local-first AI model runtime (Llama 3, Mistral, Qwen) |
| [Google Gemini 2.0 Flash](https://ai.google.dev/) | Cloud AI integration (optional) |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                   Frontend (Next.js 16 + React 19)              │
│                                                                 │
│  ┌───────────┐  ┌──────────────┐  ┌───────────┐  ┌──────────┐  │
│  │  Landing   │  │ 3D Repo Scene│  │   Code    │  │ Community│  │
│  │  Page +    │  │  (Three.js)  │  │ Explorer  │  │   Feed   │  │
│  │  Navbar    │  │  Glass Cube  │  │ + AI Chat │  │  Posts   │  │
│  └───────────┘  └──────────────┘  └───────────┘  └──────────┘  │
│                           │                                     │
└───────────────────────────┼─────────────────────────────────────┘
                            │ REST API (Axios)
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
│              AI Investigation Engine (Target Arch)               │
│                                                                 │
│  Repository ──► Scanner ──► Indexer ──► Search ──► AI Model     │
│  (read-only)   (safe       (file &     (keyword   (Ollama /     │
│                traversal)   line index)  search)   Gemini)       │
│                                            │                    │
│                                     ┌──────┴───────┐            │
│                                     │   Citation   │            │
│                                     │  Validator   │            │
│                                     └──────────────┘            │
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

- **Node.js** v18 or higher
- **Python** 3.9 or higher (3.11 recommended)
- **npm** or **yarn**
- **Git**

### 1. Clone the Repository

```bash
git clone https://github.com/Geld-zuerst/Repopilot.git
cd Repopilot
```

### 2. Backend Setup (Django API)

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv

# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create environment file (see Environment Variables section)
# Add your SECRET_KEY and other settings to backend/.env

# Run database migrations
python manage.py makemigrations accounts projects community
python manage.py migrate

# (Optional) Create admin superuser
python manage.py createsuperuser

# Start the Django development server
python manage.py runserver 8000
```

Backend API will be running at `http://localhost:8000`.

### 3. Frontend Setup (Next.js)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file (see Environment Variables section)
# Add NEXT_PUBLIC_API_URL and other settings to frontend/.env.local

# Start the Next.js development server
npm run dev
```

Frontend will be running at `http://localhost:3000`.

---

## 🔑 Environment Variables

### Frontend — `frontend/.env.local`

| Variable | Required | Description |
|---|:---:|---|
| `NEXT_PUBLIC_API_URL` | ✅ | URL of the Django backend (e.g., `http://localhost:8000`) |
| `GITHUB_ID` | ⬜ | GitHub OAuth App Client ID (if using GitHub OAuth) |
| `GITHUB_SECRET` | ⬜ | GitHub OAuth App Client Secret |
| `NEXTAUTH_SECRET` | ⬜ | Random secret for session encryption (`openssl rand -base64 32`) |
| `NEXTAUTH_URL` | ⬜ | Canonical URL of the site (e.g., `http://localhost:3000`) |

### Backend — `backend/.env`

| Variable | Required | Description |
|---|:---:|---|
| `SECRET_KEY` | ✅ | Django secret key for cryptographic signing |
| `DEBUG` | ✅ | Set to `True` for development, `False` for production |
| `ALLOWED_HOSTS` | ✅ | Comma-separated list (e.g., `localhost,127.0.0.1`) |
| `GEMINI_API_KEY` | ⬜ | Google Gemini API Key (if using cloud AI) |
| `OLLAMA_BASE_URL` | ⬜ | Ollama API URL (defaults to `http://localhost:11434`) |

---

## 📁 Project Structure

```
Repopilot/
│
├── frontend/                        # Next.js 16 + React 19 Frontend
│   ├── app/                         # App Router
│   │   ├── layout.tsx               # Root layout, SEO metadata, OpenGraph tags
│   │   ├── page.tsx                 # Landing page (Navbar, Hero, CodeExplorer, Features)
│   │   └── globals.css              # Design system — CSS tokens, neon theme, animations
│   ├── components/
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx      # Hero CTA with staggered animations & 3D scene
│   │   │   └── RepoScene.tsx        # Three.js 3D canvas — glass cube, orbiting nodes, particles
│   │   ├── layout/
│   │   │   └── Navbar.tsx           # Glassmorphism sticky nav with ⌘K search
│   │   └── sections/
│   │       ├── CodeExplorer.tsx     # Mock IDE — file tree, code viewer, AI investigation panel
│   │       └── Features.tsx         # 4 interactive feature cards with custom SVG visuals
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
- **Code Explorer:** Three-panel mock IDE showcasing the AI investigation workflow with tree view, line-numbered code viewer, and evidence-backed AI response panel

---

## 🔒 Security Design

RepoPilot takes a **security-first approach** to code analysis:

| Principle | Implementation |
|---|---|
| **Read-Only** | Never modifies or executes repository code |
| **Secret Pruning** | Automatically excludes `.env`, `.pem`, `.key`, and credential files |
| **Path Sandboxing** | Traversal cannot follow symlinks outside the repository root |
| **Prompt Injection Resistance** | Repository comments/docs are treated as untrusted input, never as prompt instructions |
| **Local-First AI** | Supports Ollama for fully local model inference — zero code leaves your machine |

---

## 📝 How It Works

1. **Sign Up / Sign In** — Create an account with email-based JWT authentication
2. **Browse Projects** — Explore the project registry or add your own repositories
3. **Select a Repo** — Pick a repository to investigate
4. **Scan & Index** — RepoPilot safely scans the file tree and builds a lightweight index
5. **Ask Questions** — Query the AI about the codebase in natural language
6. **Get Verified Answers** — Receive evidence-backed explanations with exact file & line citations
7. **Engage the Community** — Share insights, discuss findings, and follow other developers

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
