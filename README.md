

## 🚀 Features

### User Authentication
- Register and log in with email and password.
- Passwords securely hashed with bcrypt.
- JWT-based authentication stored in HTTP-only cookies.
- Middleware (`protect`, `checkUser`) to protect routes and manage session state.

### File Upload System
- Supports PDF, DOCX, XLSX file uploads (max 5MB).
- Drag-and-drop and click-to-upload functionality.
- File validation and error handling with Multer.

### AI-Powered Formatting
- Text extracted using `pdf-parse` (PDF) and `mammoth` (DOCX).
- Sent to Google Gemini AI with specific formatting rules.
- Returns a professionally formatted CV as plain text.

### Modern UI
- Built with EJS templates and TailwindCSS.
- Responsive, clean, and user-friendly design.
- Real-time feedback for upload success/error messages.

---

## 🛠 Tech Stack

- **Backend:** Node.js, Express.js, Mongoose, JWT
- **Frontend:** EJS, TailwindCSS
- **Database:** MongoDB
- **File Handling:** Multer
- **AI Processing:** Google Gemini API
- **Other Libraries:** `pdf-parse`, `mammoth`, `bcrypt`

---


## ⚙️ Environment Variables

Create a `.env` file in the project root and add:
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GEMINI_API_KEY=your_google_gemini_api_key



---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/advait2711/cv.git
cd cv

# Install dependencies
npm install

# Create .env file with required variables
# See Environment Variables section above

# Start the server
npm run dev  # For development
npm start    # For production




