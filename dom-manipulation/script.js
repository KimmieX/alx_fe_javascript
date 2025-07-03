let quotes = [
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

    setTimeout(() => {
        messageBox.style.display = 'none';
    }, 3000);
}
function populateCategories() {
   
    const categories = ['all', ...new Set(quotes.map(quote => quote.category.toLowerCase()))];

    categorySelect.innerHTML = '<option value="all">All Categories</option>';

    categories.forEach(category ={
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
        return;
    }

    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];

    quoteText.textContent = `"${randomQuote.text}"`;
    quoteCategory.textContent = `- ${randomQuote.author || 'Unknown'} (${randomQuote.category})`;
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
    showMessage("Quote added successfully!", "success");

    newQuoteTextInput.value = '';
    newQuoteAuthorInput.value = '';
    newQuoteCategoryInput.value = '';

    populateCategories();
    showRandomQuote();
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

document.addEventListener('DOMContentLoaded', () => {
    populateCategories(); 
    showRandomQuote();    
});
