# Master Prompt for GitHub Copilot - CRMS Project Continuation

## Project Overview
You are working on a **Class Routine Management System (CRMS)** - a full-stack web application for managing class schedules, routines, conflicts, and substitutes in educational institutions.

## Tech Stack
- **Backend**: Java Spring Boot 3.2.1 with Spring Security, JWT authentication
- **Frontend**: React 18 with Vite, React Router, Axios
- **Database**: PostgreSQL 14 with Flyway migrations
- **Cache**: Redis 7
- **Containerization**: Docker & Docker Compose
- **API**: RESTful API with `/api/v1/` prefix

## Project Structure
```
├── crms-api/                          # Spring Boot backend
│   ├── src/main/java/com/crms/
│   │   ├── config/                    # Security, CORS, Exception handlers
│   │   ├── controller/                # REST controllers
│   │   ├── domain/                    # JPA entities
│   │   ├── dto/                       # Data Transfer Objects
│   │   ├── repository/                # JPA repositories
│   │   ├── security/                  # JWT, UserDetails, Filters
│   │   └── service/                   # Business logic
│   ├── src/main/resources/
│   │   ├── application.yml            # Spring configuration
│   │   └── db/migration/              # Flyway SQL migrations
│   └── pom.xml                        # Maven dependencies
├── frontend/                          # React frontend
│   ├── src/
│   │   ├── components/                # Reusable components (Navbar, etc.)
│   │   ├── pages/                     # Page components (Dashboard, Login, etc.)
│   │   ├── styles/                    # CSS files
│   │   ├── App.jsx                    # Main app with routing
│   │   └── main.jsx                   # Entry point
│   └── package.json                   # NPM dependencies
└── docker-compose.yml                 # Multi-container setup
```

## Current State

### ✅ Completed Features
1. **Authentication System**
   - JWT-based authentication with access & refresh tokens
   - BCrypt password hashing
   - Login endpoint: `POST /api/v1/auth/login`
   - Demo users: admin@crms.edu, planner@crms.edu, faculty@crms.edu, student@crms.edu (password: password123)

2. **Modern UI/UX**
   - Material Design-inspired interface with Dark Mode support.
   - Fully responsive React Dashboard verified on mobile and desktop.
   - Integrated notifications and audit logs.

3. **Database & Infrastructure**
   - PostgreSQL with 22+ Flyway migrations applied automatically.
   - Full domain model: Users, Departments, Routines, Conflicts, Teachers, Subjects, TimeSlots, etc.
   - Dockerized environment with Health Checks and explicit networking.

4. **Functional Modules**
   - **Dashboard Statistics**: Fully implemented and fetching data from API.
   - **Routine Management**: Full CRUD support implemented.
   - **Conflict Detection**: Automated detection and resolution APIs working.
   - **Notifications**: Email and system alerts functional (fixed and verified).
   - **Substitutes**: Allocation logic and UI completed.

## API Endpoints Status

### ✅ Implemented
- `POST /api/v1/auth/login` - User login
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/routines` - List all routines
- `GET /api/v1/notifications` - User notifications
- `GET /api/v1/conflicts` - List conflicts
- `GET /api/v1/teachers` - List teachers
- `GET /api/v1/subjects` - List subjects
- `GET /api/v1/classes` - List classes
- `GET /api/v1/classrooms` - List classrooms
- `GET /api/v1/time-slots` - List time slots
- `GET /api/v1/audit-logs` - System audit logs
- `GET /api/v1/substitutes` - List substitutes
- `GET /api/v1/calendar/holidays` - Holiday management

## Design Patterns & Conventions

### Backend (Java Spring Boot)
```java
// Controller pattern
@RestController
@RequestMapping("/api/v1/resource")
public class ResourceController {
    @Autowired
    private ResourceService service;
    
    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAll() {
        return ResponseEntity.ok(service.findAll());
    }
}

// Service pattern
@Service
public class ResourceService {
    @Autowired
    private ResourceRepository repository;
    
    public List<Resource> findAll() {
        return repository.findAll();
    }
}

// Repository pattern
public interface ResourceRepository extends JpaRepository<Resource, UUID> {
    // Custom queries
}
```

### Frontend (React)
```jsx
// Component pattern
function ComponentName() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    fetchData()
  }, [])
  
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get('http://localhost:8080/api/v1/endpoint', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setData(response.data)
    } catch (err) {
      console.error(err)
    }
  }
  
  return <div>...</div>
}
```

### CSS Styling
```css
/* Use CSS variables for theming */
:root {
  --bg-primary: #ffffff;
  --text-primary: #202124;
  --primary-color: #1a73e8;
}

[data-theme='dark'] {
  --bg-primary: #202124;
  --text-primary: #e8eaed;
  --primary-color: #8ab4f8;
}

/* Component styles */
.component {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.3s ease;
}
```

## Security Configuration
- JWT secret: Configured via environment variable `JWT_SECRET`
- Token expiration: 24 hours (access token)
- CORS: Allowed origins - http://localhost:3000, http://localhost:3001
- Public endpoints: `/api/v1/auth/**`, `/actuator/health`
- Protected endpoints: Everything else requires JWT token

## Database Schema Highlights
```sql
-- Users table
users (id UUID, email VARCHAR UNIQUE, password_hash VARCHAR, 
       first_name VARCHAR, last_name VARCHAR, role VARCHAR, 
       department_id UUID, is_active BOOLEAN)

-- Routines table
routines (id UUID, name VARCHAR, academic_year VARCHAR, 
          semester VARCHAR, routine_type VARCHAR, status VARCHAR,
          created_by UUID, created_at TIMESTAMP)

-- Conflicts table
conflicts (id UUID, routine_id UUID, conflict_type VARCHAR,
           description TEXT, severity VARCHAR, status VARCHAR,
           detected_at TIMESTAMP)
```

## Environment Variables
```env
# Database
DB_USER=crms_user
DB_PASSWORD=crms_password
DB_NAME=crms_db
DB_PORT=5432

# Redis
REDIS_PORT=6379

# API
API_PORT=8080
JWT_SECRET=dev-secret-key-change-in-production

# Frontend
FRONTEND_PORT=3000
```

## Running the Application
```bash
# Start all services
docker-compose up -d

# Rebuild specific service
docker-compose up -d --build api
docker-compose up -d --build frontend

# View logs
docker logs crms-api
docker logs crms-frontend

# Stop all services
docker-compose down

# Stop and remove volumes (fresh start)
docker-compose down -v
```

## Next Steps / TODO
1. **AI Optimization Enhancements**
   - Fine-tune GOOGLE OR-Tools constraints for specific institution needs.
   - Add more complex scheduling rules (e.g., specific teacher preferences).

2. **Reporting**
   - Implement PDF/Excel export for the generated routines.
   - Add departmental analytic reports.

3. **User Management UI**
   - Build a comprehensive Admin UI for creating departments, subjects, and classrooms.
   - Add bulk import functionality for historical data.

4. **Testing Coverage**
   - Increase unit test coverage for the AI optimization logic.
   - Add end-to-end Playwright/Cypress tests for critical user flows.

## Important Notes
- Always use JWT token in Authorization header: `Bearer <token>`
- All API responses should follow consistent format
- Use proper HTTP status codes (200, 201, 400, 401, 404, 500)
- Handle errors gracefully with GlobalExceptionHandler
- Keep UI consistent with Google Material Design principles
- Test dark mode for all new components
- Ensure responsive design for mobile devices
- Use semantic HTML and accessibility best practices

## Code Quality Guidelines
- Follow Java naming conventions (camelCase for methods, PascalCase for classes)
- Use React hooks (useState, useEffect) instead of class components
- Keep components small and focused (Single Responsibility Principle)
- Extract reusable logic into custom hooks or utility functions
- Add JSDoc comments for complex functions
- Use async/await instead of .then() for promises
- Handle loading and error states in UI
- Validate user input on both frontend and backend

## Testing Credentials
```
Admin:   admin@crms.edu / password123
Planner: planner@crms.edu / password123
Faculty: faculty@crms.edu / password123
Student: student@crms.edu / password123
```

## URLs
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080
- API Health: http://localhost:8080/actuator/health

---

**When continuing development:**
1. Check which feature you're implementing from the TODO list
2. Start with backend (Controller → Service → Repository)
3. Then implement frontend (Component → API call → UI)
4. Test with Postman/curl before integrating with frontend
5. Ensure dark mode compatibility for new UI components
6. Follow the existing code patterns and conventions
7. Update this document if you add new major features

**Current Priority:** Implement Routine Management (CRUD operations) as it's the core feature of the system.
