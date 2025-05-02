# Book Generator Web

A Node.js/Express-based single-page web application to generate customizable books. Users can add characters, view all created characters, set book details, generate a plot, preview the structure, and produce a full book (100–400 pages, 10–100 chapters) displayed on-screen and downloadable as Markdown.

## Features
- **Character Maker Section**: Add characters with attributes (name, age, gender, occupation, personality, backstory, physical traits, motivations, relationships).
- **Book Maker Section**: Add characters and set book details (genre, setting, tone, themes, page count, chapter count, conflict intensity, title, key plot points).
- **Characters Section**: View all created characters with their full summaries.
- Generate a plot based on characters and settings.
- Preview the book structure with chapter outlines.
- Generate a complete book with a narrative arc, viewable in the browser and downloadable as Markdown.
- Single-page interface with button-styled navigation and dynamic section toggling.

## Prerequisites
- Node.js 16+ (verify: `node --version`)
- Git (verify: `git --version`)

## Setup (Local)
Follow these steps to run the app locally, ensuring all buttons and functions work without errors.

1. **Clone or Update Repository**:
   - New:
     ```bash
     git clone https://github.com/your-username/book-generator-web.git
     cd book-generator-web
     ```
   - Existing:
     ```bash
     cd path/to/book-generator-web
     rm -rf public app.js package.json Procfile .gitignore README.md output
     ```

2. **Create Project Structure**:
   - Ensure:
     ```
     book-generator-web/
     ├── app.js
     ├── public/
     │   ├── index.html
     │   └── style.css
     ├── output/
     │   └── .gitkeep
     ├── package.json
     ├── Procfile
     ├── .gitignore
     └── README.md
     ```
   - Run:
     ```bash
     mkdir -p public output
     touch output/.gitkeep
     ```
   - Copy artifact content into each file using a text editor (e.g., VS Code).

3. **Verify Structure**:
   - Run:
     ```bash
     ls -R
     ```
     Expected:
     ```
     .:
     app.js  output  package.json  Procfile  public  README.md  .gitignore

     ./output:
     .gitkeep

     ./public:
     index.html  style.css
     ```

4. **Install Dependencies**:
   - Run:
     ```bash
     npm install
     ```
   - Verify:
     ```bash
     npm ls express
     ```

5. **Run Application**:
   - Start:
     ```bash
     npm start
     ```
   - Expected:
     ```
     Server running on http://localhost:3000
     ```
   - Open `http://localhost:3000`. See homepage with buttons.

6. **Commit to GitHub** (Optional):
   - Run:
     ```bash
     git add .
     git commit -m "Converted to single-page app with characters section"
     git push origin main
     ```

## Usage
1. **Homepage**: `http://localhost:3000`. See buttons: “Create Your First Character”, “Design Your Book”, etc.
2. **Character Maker**:
   - Click “Create Your First Character” or “Add Character” button.
   - See character form. Enter Name: “Alice”, Age: “25”, submit.
   - Return to homepage, see character summary in output section.
3. **Book Maker**:
   - Click “Design Your Book” or “Set Book Details” button.
   - **Add Character**: Enter Name: “Bob”, Age: “30”, submit. Return to homepage with summary.
   - **Set Details**: Enter Genre: “Fantasy”, Setting: “Medieval Kingdom”, Tone: “Epic”, Themes: “Heroism, Betrayal”, Page Count: “200”, Chapter Count: “20”, Conflict Intensity: “Medium”, Title: “The Quest”, submit. Return to homepage with success message.
4. **Characters**:
   - Click “View Characters” button.
   - See list of all characters (e.g., Alice, Bob) with their summaries.
5. **Generate Plot**:
   - Click “Generate Plot” button.
   - See plot summary in output section.
6. **Preview Structure**:
   - Click “Preview Book Structure” button.
   - See chapter outline in output section.
7. **Generate Book**:
   - Click “Generate Full Book” button.
   - See book content in display section.
   - Click “Download Book” to save as Markdown (e.g., `The_Quest_20250430_XXXXXX.md`).

## Troubleshooting
If buttons fail or errors occur:
- **Terminal**:
  - Run `npm start`. Check for:
    ```
    Accessing add_character route
    Accessing get_characters route
    ```
    If missing, route not hit.
  - Look for:
    ```
    Error: Cannot find module
    ```
    Solution: Run `npm install`.
- **Files**:
  - Run:
    ```bash
    find . -type f
    ```
    Expected:
    ```
    ./app.js
    ./package.json
    ./Procfile
    ./README.md
    ./public/index.html
    ./public/style.css
    ./output/.gitkeep
    ./.gitignore
    ```
- **Routes**:
  - Confirm `app.js` has:
    ```javascript
    app.post('/add_character', ...)
    app.get('/get_characters', ...)
    app.post('/set_details', ...)
    ```
  - Ensure `index.html` has:
    ```html
    <button class="nav-button" onclick="showSection('characters-section'); fetchCharacters()">View Characters</button>
    ```
- **Browser**:
  - F12 > Console. Check for errors (e.g., `Failed to fetch`).
  - F12 > Network. Click button. Check for 404 on `/get_characters`.
  - Clear cache: F12 > Application > Clear site data.
- **Functionality**:
  - If form submits but no output, check terminal for `Error in add_character`.
  - If characters don’t display, check `/get_characters` response in Network tab.
  - Ensure session persists (check logs for `req.session.generator`).
- **Still Failing**:
  - Provide:
    - Terminal output after `npm start`.
    - Browser console errors.
    - `ls -R` output.
    - OS and Node.js version.

## Optional: Deploy to Heroku
1. Install Heroku CLI:
   ```bash
   brew tap heroku/brew && brew install heroku  # macOS
   ```
2. Deploy:
   ```bash
   heroku login
   heroku create book-generator-web
   git push heroku main
   heroku open
   ```

## Alternative Hosting
- **Render**: `https://render.com`, Build: `npm install`, Start: `node app.js`.
- **ngrok**:
  ```bash
  npm install -g ngrok
  ngrok http 3000
  ```

## License
MIT License.

## Contributing
Fork, modify, submit pull request.