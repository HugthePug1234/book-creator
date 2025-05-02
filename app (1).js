const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const { v4: uuidv4 } = require('uuid');

const app = express();

// Logging
app.use(logger('dev'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true for HTTPS
}));

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    next();
});

// Character class
class Character {
    constructor(name, age, gender, occupation, personality, backstory, physical_traits, motivations, relationships) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.occupation = occupation;
        this.personality = personality;
        this.backstory = backstory;
        this.physical_traits = physical_traits;
        this.motivations = motivations;
        this.relationships = relationships;
        this.development = [];
    }

    getSummary() {
        const relStr = this.relationships && Object.keys(this.relationships).length
            ? Object.entries(this.relationships).map(([char, rel]) => `  - ${char}: ${rel}`).join('<br>')
            : 'None';
        const devStr = this.development.length ? this.development.join('<br>') : 'No development yet.';
        return `
Name: ${this.name}<br>
Age: ${this.age}<br>
Gender: ${this.gender}<br>
Occupation: ${this.occupation}<br>
Personality: ${this.personality}<br>
Backstory: ${this.backstory}<br>
Physical Traits: ${this.physical_traits}<br>
Motivations: ${this.motivations}<br>
Relationships:<br>${relStr}<br>
Development:<br>${devStr}
`;
    }

    addDevelopment(chapterNum, event) {
        this.development.push(`Chapter ${chapterNum}: ${event}`);
    }
}

// BookGenerator class
class BookGenerator {
    constructor() {
        this.characters = [];
        this.genre = '';
        this.setting = '';
        this.tone = '';
        this.themes = [];
        this.page_count = 100;
        this.chapter_count = 10;
        this.conflict_intensity = 'medium';
        this.plot = '';
        this.title = '';
        this.key_plot_points = [];
    }

    validateNonEmptyString(value, fieldName) {
        value = (value || '').trim();
        if (!value) throw new Error(`${fieldName} cannot be empty.`);
        return value;
    }

    validateInteger(value, fieldName, minVal = null, maxVal = null) {
        const num = parseInt(value, 10);
        if (isNaN(num)) throw new Error(`${fieldName} must be a valid integer.`);
        if (minVal !== null && num < minVal) throw new Error(`${fieldName} must be at least ${minVal}.`);
        if (maxVal !== null && num > maxVal) throw new Error(`${fieldName} must be at most ${maxVal}.`);
        return num;
    }

    addCharacter(name, age, gender, occupation, personality, backstory, physical_traits, motivations, relationships) {
        console.log(`Adding character: ${name}`);
        const ageNum = this.validateInteger(age, 'Age', 0);
        name = this.validateNonEmptyString(name, 'Name');
        gender = (gender || '').trim() || 'Not specified';
        occupation = (occupation || '').trim() || 'Not specified';
        personality = (personality || '').trim() || 'Not specified';
        backstory = (backstory || '').trim() || 'Not specified';
        physical_traits = (physical_traits || '').trim() || 'Not specified';
        motivations = (motivations || '').trim() || 'Not specified';
        const character = new Character(name, ageNum, gender, occupation, personality, backstory, physical_traits, motivations, relationships);
        this.characters.push(character);
        return character.getSummary();
    }

    getCharacters() {
        console.log('Fetching all characters');
        if (!this.characters.length) {
            return 'No characters created yet.';
        }
        return this.characters.map(c => c.getSummary()).join('<hr>');
    }

    setBookDetails(genre, setting, tone, themes, page_count, chapter_count, conflict_intensity, title, key_plot_points) {
        console.log(`Setting book details: ${title}`);
        this.genre = this.validateNonEmptyString(genre, 'Genre');
        this.setting = this.validateNonEmptyString(setting, 'Setting');
        this.tone = this.validateNonEmptyString(tone, 'Tone');
        this.themes = themes.split(',').map(t => t.trim()).filter(t => t);
        if (!this.themes.length) throw new Error('At least one theme is required.');
        this.page_count = this.validateInteger(page_count, 'Page Count', 100, 400);
        this.chapter_count = this.validateInteger(chapter_count, 'Chapter Count', 10, 100);
        this.conflict_intensity = (conflict_intensity || '').toLowerCase();
        if (!['low', 'medium', 'high'].includes(this.conflict_intensity)) {
            throw new Error('Conflict intensity must be low, medium, or high.');
        }
        this.title = this.validateNonEmptyString(title, 'Title');
        this.key_plot_points = key_plot_points.split(',').map(p => p.trim()).filter(p => p);
        return 'Book details set successfully!';
    }

    generatePlot() {
        console.log('Generating plot');
        if (this.characters.length < 2) {
            return 'Error: At least 2 characters are required to generate a plot.';
        }

        const protagonist = this.characters[0];
        const antagonist = this.characters[1] || null;

        const conflictTypes = {
            'Fantasy': ['quest for a magical artifact', 'battle against dark forces', 'coming-of-age journey'],
            'Sci-Fi': ['intergalactic war', 'AI rebellion', 'colonization of new planet'],
            'Mystery': ['murder investigation', 'missing person case', 'conspiracy unraveling'],
            'Romance': ['forbidden love', 'second-chance romance', 'love triangle'],
            'Thriller': ['political conspiracy', 'race against time', 'serial killer pursuit']
        };

        const intensityModifiers = {
            'low': 'subtle, character-driven',
            'medium': 'balanced, engaging',
            'high': 'intense, action-packed'
        };

        const conflict = (conflictTypes[this.genre] || ['personal struggle', 'rivalry', 'quest for truth'])[
            Math.floor(Math.random() * (conflictTypes[this.genre] || []).length)
        ];
        const intensityDesc = intensityModifiers[this.conflict_intensity] || 'balanced, engaging';

        let relDesc = '';
        if (antagonist && protagonist.relationships[antagonist.name]) {
            relDesc = `Their ${protagonist.relationships[antagonist.name].toLowerCase()} relationship fuels the tension. `;
        }

        let plotPointsDesc = '';
        if (this.key_plot_points.length) {
            plotPointsDesc = `Key events include ${this.key_plot_points.join(', ').toLowerCase()}. `;
        }

        this.plot = `
In ${this.setting}, ${protagonist.name}, a ${protagonist.occupation}, embarks on a ${this.tone} journey driven by ${protagonist.motivations.toLowerCase()}.<br>
The story revolves around ${intensityDesc} ${conflict}. ${antagonist ? antagonist.name : 'An opposing force'}, motivated by ${(antagonist ? antagonist.motivations : 'conflicting goals').toLowerCase()}, creates obstacles.<br>
${relDesc}${plotPointsDesc}Key themes include ${this.themes.join(', ')}.<br>
The narrative unfolds through ${protagonist.name}'s perspective, with ${this.conflict_intensity} stakes shaped by ${this.genre.toLowerCase()} elements.
`;
        return this.plot;
    }

    previewBookStructure() {
        console.log('Previewing book structure');
        if (!this.plot || !this.characters.length || !this.genre) {
            return 'Error: Please add characters, set book details, and generate a plot first.';
        }

        const pagesPerChapter = Math.floor(this.page_count / this.chapter_count);
        const narrativeArc = ['Introduction', 'Rising Action', 'Climax', 'Falling Action', 'Resolution'];
        const arcLength = Math.floor(this.chapter_count / narrativeArc.length);

        let structure = `
Book Structure Preview for '${this.title}'<br><br>
- Genre: ${this.genre}<br>
- Setting: ${this.setting}<br>
- Tone: ${this.tone}<br>
- Themes: ${this.themes.join(', ')}<br>
- Page Count: ${this.page_count}<br>
- Chapter Count: ${this.chapter_count}<br>
- Conflict Intensity: ${this.conflict_intensity}<br><br>
Chapter Outline:<br>
`;
        for (let i = 1; i <= this.chapter_count; i++) {
            const arcIndex = Math.min(Math.floor((i - 1) / arcLength), narrativeArc.length - 1);
            const arcStage = narrativeArc[arcIndex];
            structure += `- Chapter ${i} (${arcStage}): ~${pagesPerChapter} pages, advances the ${arcStage.toLowerCase()} arc.<br>`;
        }

        return structure;
    }

    generateChapter(chapterNum, pagesPerChapter, arcStage) {
        console.log(`Generating chapter ${chapterNum}`);
        const charactersInvolved = this.characters.sort(() => 0.5 - Math.random()).slice(0, Math.min(this.characters.length, Math.floor(Math.random() * 3) + 2));
        const characterNames = charactersInvolved.map(c => c.name);
        const intensityEvents = {
            'low': ['a quiet realization', 'a subtle misunderstanding', 'a heartfelt conversation'],
            'medium': ['a heated confrontation', 'a critical discovery', 'an unexpected alliance'],
            'high': ['a life-threatening chase', 'a world-altering revelation', 'a brutal betrayal']
        };
        const arcEvents = {
            'Introduction': ['sets the stage', 'introduces key tensions', 'establishes motives'],
            'Rising Action': ['escalates conflict', 'builds stakes', 'deepens relationships'],
            'Climax': ['reaches peak tension', 'forces a turning point', 'reveals critical truths'],
            'Falling Action': ['resolves major conflicts', 'shows consequences', 'ties up loose ends'],
            'Resolution': ['concludes the journey', 'reflects on growth', 'sets future paths']
        };
        const chapterEvent = (intensityEvents[this.conflict_intensity] || ['a critical moment'])[
            Math.floor(Math.random() * intensityEvents[this.conflict_intensity].length)
        ];
        const arcContext = (arcEvents[arcStage] || ['advances the story'])[
            Math.floor(Math.random() * arcEvents[arcStage].length)
        ];

        let plotPoint = '';
        if (this.key_plot_points.length && Math.random() < 0.2) {
            plotPoint = `This chapter ties to ${this.key_plot_points[Math.floor(Math.random() * this.key_plot_points.length)].toLowerCase()}. `;
        }

        let relDesc = '';
        if (charactersInvolved.length >= 2 && charactersInvolved[0].relationships[charactersInvolved[1].name]) {
            relDesc = `Their ${charactersInvolved[0].relationships[charactersInvolved[1].name].toLowerCase()} relationship shaped the encounter. `;
        }

        const devEvent = `${characterNames[0]} ${['grew more determined', 'faced doubts', 'found new resolve', 'changed perspective'][Math.floor(Math.random() * 4)]} due to ${chapterEvent}.`;
        charactersInvolved[0].addDevelopment(chapterNum, devEvent);

        return `
## Chapter ${chapterNum} (${arcStage})<br><br>
In ${this.setting}, ${characterNames[0]} faced ${chapterEvent}, which ${arcContext}. Driven by ${charactersInvolved[0].motivations.toLowerCase()}, they navigated ${this.genre.toLowerCase()} challenges. ${characterNames[1]}'s ${charactersInvolved[1].personality.toLowerCase()} nature influenced the outcome. ${relDesc}${plotPoint}<br><br>
The ${this.tone.toLowerCase()} atmosphere highlighted ${this.themes.join(', ').toLowerCase()}. ${characterNames[0]}'s ${charactersInvolved[0].physical_traits.toLowerCase()} played a role as they ${['confronted', 'evaded', 'collaborated with'][Math.floor(Math.random() * 3)]} ${characterNames[1]}.<br><br>
This ${this.conflict_intensity} moment advanced the ${this.plot.split('.')[1].trim().toLowerCase()}, spanning ~${pagesPerChapter} pages of ${this.genre.toLowerCase()} tension and character growth.<br>
`;
    }

    generateBook() {
        console.log('Generating full book');
        if (!this.plot || !this.characters.length || !this.genre) {
            return 'Error: Please add characters, set book details, and generate a plot first.';
        }

        const pagesPerChapter = Math.floor(this.page_count / this.chapter_count);
        const narrativeArc = ['Introduction', 'Rising Action', 'Climax', 'Falling Action', 'Resolution'];
        const arcLength = Math.floor(this.chapter_count / narrativeArc.length);

        let bookContent = `
# ${this.title}<br><br>
*Genre*: ${this.genre}<br>
*Setting*: ${this.setting}<br>
*Tone*: ${this.tone}<br>
*Themes*: ${this.themes.join(', ')}<br>
*Conflict Intensity*: ${this.conflict_intensity}<br>
*Page Count*: ${this.page_count}<br>
*Chapter Count*: ${this.chapter_count}<br>
*Key Plot Points*: ${this.key_plot_points.length ? this.key_plot_points.join(', ') : 'None'}<br>
*Created*: ${new Date().toISOString().split('.')[0].replace('T', ' ')}<br><br>
## Character Summaries<br>
${this.characters.map(c => c.getSummary()).join('')}<br>
## Plot Summary<br>
${this.plot}<br>
## Chapters<br>
`;
        for (let i = 1; i <= this.chapter_count; i++) {
            const arcIndex = Math.min(Math.floor((i - 1) / arcLength), narrativeArc.length - 1);
            const arcStage = narrativeArc[arcIndex];
            bookContent += this.generateChapter(i, pagesPerChapter, arcStage);
        }

        return bookContent;
    }
}

// Routes
app.get('/', (req, res) => {
    console.log('Accessing index route');
    if (!req.session.generator) {
        req.session.generator = new BookGenerator();
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/add_character', (req, res) => {
    console.log('Accessing add_character route');
    try {
        const { name, age, gender, occupation, personality, backstory, physical_traits, motivations, relationships } = req.body;
        let relObj = {};
        if (relationships) {
            relObj = relationships.split(',').reduce((acc, rel) => {
                if (rel.includes(':')) {
                    const [char, relType] = rel.split(':').map(s => s.trim());
                    acc[char] = relType;
                }
                return acc;
            }, {});
        }

        if (!req.session.generator) {
            req.session.generator = new BookGenerator();
        }

        const output = req.session.generator.addCharacter(
            name, age, gender, occupation, personality, backstory, physical_traits, motivations, relObj
        );
        res.json({ success: true, message: output });
    } catch (error) {
        console.error(`Error in add_character: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

app.get('/get_characters', (req, res) => {
    console.log('Accessing get_characters route');
    try {
        if (!req.session.generator) {
            req.session.generator = new BookGenerator();
        }
        const output = req.session.generator.getCharacters();
        res.json({ success: true, message: output });
    } catch (error) {
        console.error(`Error in get_characters: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

app.post('/set_details', (req, res) => {
    console.log('Accessing set_details route');
    try {
        const { genre, setting, tone, themes, page_count, chapter_count, conflict_intensity, title, key_plot_points } = req.body;
        if (!req.session.generator) {
            req.session.generator = new BookGenerator();
        }

        const output = req.session.generator.setBookDetails(
            genre, setting, tone, themes, page_count, chapter_count, conflict_intensity, title, key_plot_points
        );
        res.json({ success: true, message: output });
    } catch (error) {
        console.error(`Error in set_details: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

app.post('/generate_plot', (req, res) => {
    console.log('Accessing generate_plot route');
    try {
        if (!req.session.generator) {
            throw new Error('No book data available.');
        }
        const output = req.session.generator.generatePlot();
        res.json({ success: true, message: output });
    } catch (error) {
        console.error(`Error in generate_plot: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

app.post('/preview_structure', (req, res) => {
    console.log('Accessing preview_structure route');
    try {
        if (!req.session.generator) {
            throw new Error('No book data available.');
        }
        const output = req.session.generator.previewBookStructure();
        res.json({ success: true, message: output });
    } catch (error) {
        console.error(`Error in preview_structure: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

app.post('/generate_book', (req, res) => {
    console.log('Accessing generate_book route');
    try {
        if (!req.session.generator) {
            throw new Error('No book data available.');
        }
        const bookContent = req.session.generator.generateBook();
        req.session.bookContent = bookContent;
        res.json({ success: true, message: bookContent });
    } catch (error) {
        console.error(`Error in generate_book: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

app.get('/download_book', (req, res) => {
    console.log('Accessing download_book route');
    try {
        if (!req.session.bookContent) {
            throw new Error('No book available to download.');
        }
        const generator = req.session.generator || new BookGenerator();
        const filename = `${generator.title.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().replace(/[^0-9]/g, '').slice(0, 14)}.md`;
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 'text/markdown');
        res.send(req.session.bookContent);
    } catch (error) {
        console.error(`Error in download_book: ${error.message}`);
        res.json({ success: false, message: `Error: ${error.message}` });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});