document.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(window.location.search);
    const isbn = params.get('isbn');
    const bookDetails = document.getElementById('bookDetails');
    const username = localStorage.getItem('username');
    const userSection = document.getElementById('userSection');
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    const apiKey = 'AIzaSyCFDaqjpgA8K_NqqCw93xorS3zumc_52u8'
    const reviewsSection = document.getElementById('reviewsSection');
    const reviewsContainer = document.getElementById('reviewsContainer');
    const loggedInUsername = localStorage.getItem('username'); // Add this line at the top
   

    if (isbn) {
        try {
            console.log(`Fetching data for ISBN: ${isbn}`);  // Logging ISBN
            const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`);
            const data = await response.json();
            console.log(`API response: `, data);  // Logging API response
            if (data.totalItems > 0) {
                const book = data.items[0].volumeInfo;
                //const bookCoverImage = book.imageLinks ? book.imageLinks.thumbnail.replace('zoom=1', '') + '&zoom=1' : 'https://via.placeholder.com/128x192?text=No+Image';
                //document.getElementById('bookCover').src = bookCoverImage;
                //document.body.style.backgroundImage = `url(${bookCoverImage})`;
                document.body.style.backgroundSize = "70% 100%";
                document.body.style.backgroundAttachment = "fixed"; // Keeps it fixed while scrolling
                document.body.style.backgroundPosition = "center center"; // Center the image on both axes
                document.body.style.backgroundRepeat = "no-repeat";
                document.body.style.backgroundColor = '#2d342d'; // Dark green as fallbac
                

               /*
                const overlay = document.createElement('div');
                overlay.style.position = "fixed";
                overlay.style.top = '50%'; 
                overlay.style.left = '50%'; 
                overlay.style.width = '70vw'; 
                overlay.style.height = '100vh'; 
                overlay.style.transform = 'translate(-50%, -50%)'; 
                overlay.style.backgroundColor = 'rgba(255, 255, 255, 0.65)'; 
                overlay.style.zIndex = '-1'; 
                document.body.appendChild(overlay);
                */
                bookDetails.innerHTML = `
                <div class="content-container flex">
    <!-- Left section (fixed) -->
    <div class="w-1/4 top-90 left-50 h-screen">
        <div class="relative"> 
            <img src="${book.imageLinks ? book.imageLinks.thumbnail.replace('zoom=1', '') + '&zoom=1' : 'https://via.placeholder.com/128x192?text=No+Image'}" alt="${book.title}" class="book-card card book-cover w-80 h-128 object-cover mb-8">
        </div>

        <!-- Button section: Preview and Add Buttons side by side -->
        <div class="flex items-right gap-0 relative" style="top: -90px; left: 200px">
            
            <div class="add-button-container">
                <button id="addButton" class="add-button relative flex items-center justify-center">
                    <div class="icon-container absolute left-2.8 flex flex-col space-y-1">
                        <div class="line w-5 h-0.5 bg-white"></div>
                        <div class="line w-5 h-0.5 bg-white"></div>
                        <div class="line w-5 h-0.5 bg-white"></div>
                    </div>
                    <div class="plus-icon absolute top-0 right-0 w-2 h-2 rounded-full bg-white text-green-600 text-xs flex items-center justify-center">
                        +
                    </div>
                </button>

                <!-- Dropdown Menu -->
                <div id="dropdownMenu" class="dropdown-menu hidden absolute top-full left-0 mt-2 w-40 bg-white rounded-md shadow-lg z-1000">
                    <ul class="menu-list">
                        <li><button id="addToLibraryButton" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Add to Library</button></li>
                        <li><button id="addToReadingListButton" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Add to Reading List</button></li>
                        <li><button id="addToTop5Button" class="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Add to Top 5</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Right section (scrollable) -->
    <div class="w-3/4 ml-8 top-90 text-white" style="margin-left: 60px;">
        <h1 class="text-4xl font-bold mb-3">${book.title}</h1>
        <h2 class="text-3xl mb-3">${book.authors ? book.authors.join(', ') : 'Unknown'}</h2>
        <p class="text-base mb-2"><strong>${book.publishedDate}, ${book.pageCount} pages</strong>
        <p class="text-base mb-2">${book.description ? book.description : 'No description available'}</p>

        <!-- Recommendations section -->
        <div id="recommendations" class="mt-8">
            <h2 class="text-3xl font-bold mb-4">Similar Books</h2>
            <div class="single-recommendations-wrapper relative w-full mt-8 overflow-hidden">
                <div id="loadingVisual" class="loading-balls-container">
                    <div class="ball"></div>
                    <div class="ball"></div>
                    <div class="ball"></div>
                </div>

                <div id="recommendationsContainer" class="single-recommendations-container"></div>
            </div>
        </div>

        <!-- Reviews section -->
        <div id="reviewsSection" class="mt-8">
            <h2 class="text-3xl font-bold mb-4">Reviews</h2>
            <div id="reviewsContainer"></div> <!-- Reviews will be dynamically inserted here -->
        </div>
    </div>
</div>
            `;
            const addButton = document.getElementById('addButton');
            const addToReadingListButton = document.getElementById('addToReadingListButton');
            const addToLibraryButton = document.getElementById('addToLibraryButton');
            const addToTop5Button = document.getElementById('addToTop5Button');
            const dropdownMenu = document.getElementById('dropdownMenu');
           
        
            addButton.addEventListener('click', () => {
                console.log('addButton clicked!');

                dropdownMenu.classList.toggle('hidden');
                dropdownMenu.style.display = 'block';


            });
        
            // Add functionality for each option
            addToLibraryButton.addEventListener('click', () => {
                addToLibrary(isbn);
                dropdownMenu.classList.add('hidden'); // Hide menu after action
            });
        
            addToReadingListButton.addEventListener('click', () => {
                addToReadingList(isbn);
                dropdownMenu.classList.add('hidden'); // Hide menu after action
            });
        
            addToTop5Button.addEventListener('click', () => {
                addToTop5(isbn);
                dropdownMenu.classList.add('hidden'); // Hide menu after action
            });
            window.addEventListener('click', (event) => {
                if (!addButton.contains(event.target) && !dropdownMenu.contains(event.target)) {
                    dropdownMenu.style.display = 'none';
                }
            });
            dropdownMenu.addEventListener('click', (event) => {
                event.stopPropagation();
            });
        


            
                fetchAndDisplayReviews(isbn);

                fetchRecommendations(isbn);

            } else {
                bookDetails.innerHTML = '<p style="color: white;">Book not found.</p>';
            }
        } catch (error) {
            console.error('Error fetching book data:', error);
            bookDetails.innerHTML = '<p>Error fetching book data.</p>';
        }
        } else {
        bookDetails.innerHTML = '<p>ISBN not provided.</p>';
    }
});
async function displayNoReviewMessage() {
    const reviewContainer = document.getElementById('reviewsContainer'); // Assuming there's a container for reviews

    // Clear any existing content in the review container
    reviewContainer.innerHTML = '';

    // Create a message element
    const noReviewsMessage = document.createElement('div');
    noReviewsMessage.classList.add('no-reviews-message', 'text-left', 'text-gray-500', 'p-4');
    noReviewsMessage.innerHTML = `
        <p>Be the first to review this book!</p>
    `;

    // Append the message to the review container
    reviewContainer.appendChild(noReviewsMessage);
}
async function fetchRecommendations(isbn) {
    try {
        document.getElementById('loadingVisual').classList.remove('hidden');

        const response = await fetch(`/api/book-recommendations?isbn=${encodeURIComponent(isbn)}`);
        const data = await response.json();

        if (data.success) {
            renderRecommendations(data.recommendations);
        } else {
            console.error('Error fetching recommendations:', data.message);
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }finally {
        // Hide the loading visual once the recommendations are loaded
        const loadingVisual = document.getElementById('loadingVisual');
        if (loadingVisual) {
            loadingVisual.classList.add('hidden');
        }    }
}

// Modal handling
function loadBook(isbn) {
    if (isbn) {
        initialize(isbn);
        document.getElementById('myModal').classList.remove('hidden');
        document.getElementById('myModal').classList.add('flex');
    } else {
        alert('ISBN not found.');
    }
}

function closeModal() {
    document.getElementById('myModal').classList.add('hidden');
    document.getElementById('myModal').classList.remove('flex');
}

window.onclick = function(event) {
    const modal = document.getElementById('myModal');
    if (event.target == modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
    }
}
// Initialize Google Books API
google.books.load();
 
function alertNotFound() {
   alert("Could not embed the book!");
}

function initialize(isbn) {
   var viewerCanvas = document.getElementById('viewerCanvas');
   if (viewerCanvas) {
       var viewer = new google.books.DefaultViewer(viewerCanvas);
       viewer.load('ISBN:' + isbn, alertNotFound);
   }
}

function addToTop5(isbn) {
    const apiKey = 'AIzaSyCFDaqjpgA8K_NqqCw93xorS3zumc_52u8'

    const username = localStorage.getItem('username');
    if (!username) {
        alert('You need to be logged in to add books to your top 5.');
        return;
    }

    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const book = data.items[0].volumeInfo;
            const bookData = {
                username,
                isbn,
                title: book.title,
                authors: book.authors ? book.authors.join(', ') : 'Unknown',
                categories: book.categories ? book.categories : [],
                pageCount: book.pageCount,
                description: book.description ? book.description : 'No description available',
                thumbnail: book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Image'
            };

            fetch('/api/library/top5/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Book added to your top 5!');
                } else {
                    alert('Failed to add book to top 5: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error adding book to top 5:', error);
                alert('Error adding book to top 5.');
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
            alert('Error fetching book data.');
        });
}


function addToReadingList(isbn) {
    const apiKey = 'AIzaSyCFDaqjpgA8K_NqqCw93xorS3zumc_52u8'
    const username = localStorage.getItem('username');
    if (!username) {
        alert('You need to be logged in to add books to your top 5.');
        return;
    }

    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const book = data.items[0].volumeInfo;
            const bookData = {
                username,
                isbn,
                title: book.title,
                authors: book.authors ? book.authors.join(', ') : 'Unknown',
                categories: book.categories ? book.categories : [],
                pageCount: book.pageCount,
                description: book.description ? book.description : 'No description available',
                thumbnail: book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Image'
            };

            fetch('/api/library/readList/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Book added to your reading list');
                } else {
                    alert('Failed to add book to reading list: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error adding book to reading list:', error);
                alert('Error adding book to reading list.');
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
            alert('Error fetching book data.');
        });
}

function addToLibrary(isbn) {
    const apiKey = 'AIzaSyCFDaqjpgA8K_NqqCw93xorS3zumc_52u8'
    const username = localStorage.getItem('username');
    if (!username) {
        alert('You need to be logged in to add books to your library.');
        return;
    }

    fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}&key=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            const book = data.items[0].volumeInfo;
            const bookData = {
                username,
                isbn,
                title: book.title,
                authors: book.authors ? book.authors.join(', ') : 'Unknown',
                categories: book.categories ? book.categories : [],
                pageCount: book.pageCount,
                description: book.description ? book.description : 'No description available',
                thumbnail: book.imageLinks ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x192?text=No+Image'
            };

            fetch('/api/library/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookData),
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Book added to your library!');
                } else {
                    alert('Failed to add book to library: ' + data.message);
                }
            })
            .catch(error => {
                console.error('Error adding book to library:', error);
                alert('Error adding book to library.');
            });
        })
        .catch(error => {
            console.error('Error fetching book data:', error);
            alert('Error fetching book data.');
        });
}



async function fetchAndDisplayReviews(isbn) {
    const loggedInUsername = localStorage.getItem('username'); // Add this line at the top
    try {
        const response = await fetch(`/api/reviews/books/${isbn}?loggedInUsername=${loggedInUsername}`);
        const data = await response.json();

        if (data.success && data.reviews.length > 0) {
            console.log('Reviews found:', data.reviews);
            displayReview(data.reviews);  // Display reviews in the UI
        } else {
            console.log('No reviews available or error:', data.message);
            displayNoReviewMessage(data.message);  // Show a message when no reviews are found
        }
    } catch (error) {
        console.error('Error fetching reviews:', error);
    }
}

async function displayReview(reviews) {
    console.log(reviews);

    reviewsContainer.innerHTML = ''; // Clear previous reviews if any

    // Separate friends-only reviews from public reviews
    const friendReviews = reviews.filter(review => review.visibility === 'friends');
    const publicReviews = reviews.filter(review => review.visibility === 'public');

    // Display friend reviews first, if any
    if (friendReviews.length > 0) {
        const friendsHeader = document.createElement('h4');
        friendsHeader.classList.add('text-lg', 'font-bold', 'mb-2');
        friendsHeader.textContent = 'Reviews from Friends';
        reviewsContainer.appendChild(friendsHeader);

        friendReviews.forEach(review => {
            const reviewElement = createReviewElement(review, true);
            reviewsContainer.appendChild(reviewElement);
        });
    }

    // Display public reviews
    if (publicReviews.length > 0) {
        const publicHeader = document.createElement('h4');
        publicHeader.classList.add('text-lg', 'font-bold', 'mt-4', 'mb-2');
        publicHeader.textContent = 'Public Reviews';
        reviewsContainer.appendChild(publicHeader);

        publicReviews.forEach(review => {
            console.log('Rendering Public Review:', review);  // Log each public review
            const reviewElement = createReviewElement(review, false);
            reviewsContainer.appendChild(reviewElement);
        });
    } else {
        reviewsContainer.innerHTML += '<p>No public reviews available.</p>';
    }
}
function createReviewElement(review, isFriend) {
    console.log('Creating Review Element:', review);  // Log the review object

    const reviewDiv = document.createElement('div');
    reviewDiv.classList.add('review', 'p-4', 'mb-4', 'border', 'rounded', 'bg-white', 'shadow-md');
    const gradientColor = getGradientColor(review.rating);
    reviewDiv.style.boxShadow = `0 0 10px 3px ${gradientColor}`; // Glowing effect


    // Apply the gradient color to the review's border
    reviewDiv.style.border = `2px solid ${gradientColor}`;
    // Add a background color and padding
    reviewDiv.style.backgroundColor = '#ffffff'; // White background
    reviewDiv.style.padding = '16px';
    reviewDiv.style.borderRadius = '8px';

    // Badge for public or friends visibility
    const visibilityBadge = isFriend 
        ? `<span class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-600 text-white">
                ✓ Friends
           </span>`
        : `<span class="ml-2 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-blue-600 text-white">
                🌍 Public
           </span>`;

    reviewDiv.innerHTML = `
    <div class="flex items-center">
        <a href="../html/profile.html?username=${review.username}" class= "text-lg font-semibold" style="display: inline-flex; text-decoration: none; color: #333; padding: 2px 4px;"
        onmouseover="this.style.textDecoration='underline'; this.style.color='#555';"
       onmouseout="this.style.textDecoration='none'; this.style.color='#333';">
${review.username}</a>  
            ${visibilityBadge}
    </div>

        <p class="text-sm text-gray-600 mb-2">Rating: <strong>${review.rating}/100 </strong></p>
        <p class="text-base mb-2 ml-2"> ${review.review}</p>
        <p class="text-xs text-gray-500">Reviewed on: ${new Date(review.reviewDate).toLocaleDateString()}</p>
    `;
    
    return reviewDiv;
}



function renderRecommendations(recommendations) {
    const recommendationsContainer = document.getElementById('recommendationsContainer');
    recommendationsContainer.innerHTML = ''; // Clear previous recommendations if any

    recommendations.slice(0, 5).forEach(book => {
        const bookElement = document.createElement('div');
        bookElement.classList.add('single-recommendation-card', 'book-card', 'relative', 'p-6', 'rounded-lg', 'shadow-lg', 'cursor-pointer', 'hover:shadow-2xl', 'transition', 'duration-300', 'ease-in-out');
        bookElement.style.width = '18.5%'; // Adjust this width to fit 7 books in the container
        bookElement.innerHTML = `
            <a href="../html/book.html?isbn=${book.isbn}" class="block relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition duration-300 ease-in-out group">
                <img src="${book.thumbnail}" alt="${book.title}" class="w-full h-64 object-cover rounded-t-lg">
                                <div class="absolute bottom-0 left-0 w-full p-4 bg-black bg-opacity-60 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out">
                                    <h2 class="text-lg font-bold">${book.title}</h2>
                                    <p class="text-gray-300">by ${book.authors}</p>
                                </div>
            </a>

        `;
        recommendationsContainer.appendChild(bookElement);
    });
}
function getGradientColor(value) {
    // Define the dark pastel colors for green and red with more aesthetic adjustment
    const darkPastelGreen = [32, 154, 32]; // RGB for dark pastel green
    const darkPastelYellow = [255, 193, 37];
    const darkPastelRed = [102, 0, 0]; // RGB for dark pastel red

    let r, g, b;
    /* add in case i want default border to be white if no rating
    if (value === undefined || value === null) {
        // Default to white if there is no rating
        return `rgb(255, 255, 255)`;
    }
    */
    if (value <= 50) {
        // Interpolate between red and yellow
        const factor = value / 50;
        r = darkPastelRed[0] + ((darkPastelYellow[0] - darkPastelRed[0]) * factor);
        g = darkPastelRed[1] + ((darkPastelYellow[1] - darkPastelRed[1]) * factor);
        b = darkPastelRed[2] + ((darkPastelYellow[2] - darkPastelRed[2]) * factor);
    } else {
        // Interpolate between yellow and green
        const factor = (value - 50) / 50;
        r = darkPastelYellow[0] + ((darkPastelGreen[0] - darkPastelYellow[0]) * factor);
        g = darkPastelYellow[1] + ((darkPastelGreen[1] - darkPastelYellow[1]) * factor);
        b = darkPastelYellow[2] + ((darkPastelGreen[2] - darkPastelYellow[2]) * factor);
    }

    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
}
