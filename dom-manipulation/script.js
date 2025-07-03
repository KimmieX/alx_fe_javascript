const defaultQuotes = [
    { text: "The only way to do great work is to love what you do.", category: "Inspiration", author: "Steve Jobs" },
    { text: "Strive not to be a success, but rather to be of value.", category: "Motivation", author: "Albert Einstein" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", category: "Dreams", author: "Eleanor Roosevelt" },
    { text: "The mind is everything. What you think you become.", category: "Mindset", author: "Buddha" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life", author: "John Lennon" },
    { text: "The best way to predict the future is to create it.", category: "Innovation", author: "Peter Drucker" },
    { text: "It is during our darkest moments that we must focus to see the light.", category: "Resilience", author: "Aristotle" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", category: "Leadership", author: "Ralph Waldo Emerson" },
    { text: "The only impossible journey is the one you never begin.", category: "Adventure", author: "Tony Robbins" },
    { text: "Success is not final, failure is not fatal: It is the courage to continue that counts.", category: "Perseverance", author: "Winston Churchill" }
];
let quotes = [];

const quoteDisplay = document.getElementById('quoteDisplay');
const quoteText = document.getElementById('quoteText');
const quoteCategory = document.getElementById('quoteCategory');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteFormToggleBtn = document.getElementById('addQuoteFormToggle');
const addQuoteSection = document.getElementById('addQuoteSection');
const submitNewQuoteBtn = document.getElementById('submitNewQuote');
const newQuoteTextInput = document.getElementById('newQuoteText');
const newQuoteAuthorInput = document.getElementById('newQuoteAuthor');
const newQuoteCategoryInput = document.getElementById('newQuoteCategory');
const messageBox = document.getElementById('messageBox');
const categorySelect = document.getElementById('categorySelect');
const exportQuotesBtn = document.getElementById('exportQuotesBtn');
const importFileInput = document.getElementById('importFile');
const lastViewedQuoteElement = document.getElementById('lastViewedQuote');


function showMessage(message, type = 'info') {
    messageBox.textContent = message;
    messageBox.className = 'mt-6 p-4 rounded-lg border';
    messageBox.style.display = 'block'; 
    switch (type) {
        case 'success':
            messageBox.classList.add('bg-green-100', 'text-green-800', 'border-green-300');
            break;
        case 'error':
            messageBox.classList.add('bg-red-100', 'text-red-800', 'border-red-300');
            break;
        case 'info':
        default:
            messageBox.classList.add('bg-blue-100', 'text-blue-800', 'border-blue-300');
            break;
    }

    // Hide the message box after 3 seconds
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}

function saveQuotes() {
    try {
        localStorage.setItem('quotes', JSON.stringify(quotes));
    } catch (e) {
        console.error("Error saving to local storage: ", e);
        showMessage("Failed to save quotes locally. Storage might be full.", "error");
    }
}

function loadQuotes() {
    try {
        const storedQuotes = localStorage.getItem('quotes');
        if (storedQuotes) {
            quotes = JSON.parse(storedQuotes);
        } else {
            quotes = [...defaultQuotes]; 
        }
    } catch (e) {
        console.error("Error loading from local storage: ", e);
        showMessage("Failed to load quotes from local storage. Data might be corrupted.", "error");
        quotes = [...defaultQuotes]; 
}

function saveLastViewedQuote(quoteTextValue) {
    try {
        sessionStorage.setItem('lastViewedQuote', quoteTextValue);
        lastViewedQuoteElement.textContent = `Last viewed quote (session): "${quoteTextValue}"`;
    } catch (e) {
        console.error("Error saving last viewed quote to session storage: ", e);
    }}
function loadLastViewedQuote() {
    try {
        const lastQuote = sessionStorage.getItem('lastViewedQuote');
        if (lastQuote) {
            lastViewedQuoteElement.textContent = `Last viewed quote (session): "${lastQuote}"`;
        } else {
            lastViewedQuoteElement.textContent = "Last viewed quote (session): Not set.";
        }
    } catch (e) {
        console.error("Error loading last viewed quote from session storage: ", e);
    }
}

function populateCategories() {
    const categories = ['all', ...new Set(quotes.map(quote => quote.category.toLowerCase()))];

    categorySelect.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category => {
        if (category !== 'all') { 
            const option = document.createElement('option');
            option.value = category;
            option.textContent = category.charAt(0).toUpperCase() + category.slice(1);
            categorySelect.appendChild(option);
        }
    });
}

function showRandomQuote() {
    const selectedCategory = categorySelect.value;
    let filteredQuotes = quotes;
    if (selectedCategory !== 'all') {
        filteredQuotes = quotes.filter(quote => quote.category.toLowerCase() === selectedCategory);
    }

    if (filteredQuotes.length === 0) {
        quoteText.textContent = "No quotes available for this category. Try adding some or selecting 'All Categories'!";
        quoteCategory.textContent = ""; 
        saveLastViewedQuote("No quote displayed"); 
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteText.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.author || 'Unknown'} (${randomQuote.category})`;

    saveLastViewedQuote(randomQuote.text);
}
function addQuote() {
    const text = newQuoteTextInput.value.trim();
    const author = newQuoteAuthorInput.value.trim();
    const category = newQuoteCategoryInput.value.trim();
    if (!text || !category) {
        showMessage("Please enter both quote text and category.", "error");
        return;
    }

    const newQuote = {
        text: text,
        author: author || 'Unknown', 
        category: category
    };

    quotes.push(newQuote);
    saveQuotes(); 
    showMessage("Quote added successfully!", "success");
    newQuoteTextInput.value = '';
    newQuoteAuthorInput.value = '';
    newQuoteCategoryInput.value = '';

    populateCategories();
     showRandomQuote();
}
function exportQuotes() {
    try {
        const dataStr = JSON.stringify(quotes, null, 2); 
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'quotes.json'; 
        document.body.appendChild(a);
        a.click(); 
        document.body.removeChild(a); 
        URL.revokeObjectURL(url);
        showMessage("Quotes exported successfully!", "success");
    } catch (e) {
        console.error("Error exporting quotes: ", e);
        showMessage("Failed to export quotes. Please try again.", "error");
    }
}

function importFromJsonFile(event) {
    const file = event.target.files[0];
    if (!file) {
        return;
    }

    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);

            if (!Array.isArray(importedQuotes) || !importedQuotes.every(q => q.text && q.category)) {
                showMessage("Invalid JSON file format. Please ensure it's an array of quote objects with 'text' and 'category'.", "error");
                return;
            }

            quotes.push(...importedQuotes);
            saveQuotes(); 
            showMessage('Quotes imported successfully!', 'success');

            populateCategories();
            showRandomQuote();
        } catch (error) {
            console.error("Error parsing JSON file: ", error);
            showMessage("Error reading or parsing JSON file. Please ensure it's a valid JSON format.", "error");
        }
    };
    fileReader.onerror = function() {
        showMessage("Error reading file. Please try again.", "error");
    };
    fileReader.readAsText(file); 
}
newQuoteBtn.addEventListener('click', showRandomQuote);
submitNewQuoteBtn.addEventListener('click', addQuote);
addQuoteFormToggleBtn.addEventListener('click', () => {
    addQuoteSection.classList.toggle('hidden');
    if (!addQuoteSection.classList.contains('hidden')) {
        addQuoteFormToggleBtn.textContent = "Hide Add Quote Form";
    } else {
        addQuoteFormToggleBtn.textContent = "Add New Quote";
    }
});

categorySelect.addEventListener('change', showRandomQuote);
exportQuotesBtn.addEventListener('click', exportQuotes);
importFileInput.addEventListener('change', importFrom
document.addEventListener('DOMContentLoaded', () => {
    loadQuotes();         
    populateCategories(); 
    showRandomQuote();   
    loadLastViewedQuote();
});
