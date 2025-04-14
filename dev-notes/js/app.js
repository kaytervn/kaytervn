let notesConfig = {};
let recentNotes = [];
let bookmarkedNotes = [];
const MAX_RECENT_NOTES = 10;

async function loadMarkdownContent(id) {
    if (!notesConfig[id]) return;
    
    try {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        
        const clearSearch = document.getElementById('clearSearch');
        if (clearSearch) {
            clearSearch.style.display = 'none';
        }
        
        const response = await fetch(notesConfig[id].file);
        if (!response.ok) throw new Error(`Failed to load ${id} notes`);
        
        const markdown = await response.text();
        const html = marked.parse(markdown);
        
        const notesContent = document.getElementById('notesContent');
        if (!notesContent) {
            console.error('Element with ID "notesContent" not found');
            return;
        }
        
        notesContent.innerHTML = `
            <h1>${notesConfig[id].title}</h1>
            <div id="${id}-content">${html}</div>
        `;
        
        const contentElement = document.getElementById(`${id}-content`);
        if (contentElement) {
            Prism.highlightAllUnder(contentElement);
        }
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const noteLink = document.querySelector(`.nav-link[href="#${id}"]`);
        if (noteLink) {
            noteLink.classList.add('active');
        } else {
            console.warn(`Link for note "${id}" not found in the sidebar`);
        }
        
        window.location.hash = id;
    } catch (error) {
        console.error('Error loading content:', error);
        const notesContent = document.getElementById('notesContent');
        if (notesContent) {
            notesContent.innerHTML = `
                <div class="alert alert-danger">
                    Failed to load content: ${error.message}
                </div>
            `;
        }
    }
}


function generateTableOfContents(markdown) {
    const headingLines = markdown.split('\n').filter(line => line.startsWith('#'));
    if (headingLines.length <= 1) return ''; 
    
    const toc = ['<div class="table-of-contents">', '<h5><i class="fas fa-list-ul me-2"></i>Table of Contents</h5>', '<ul class="toc-list">'];
    
    headingLines.forEach(line => {
        const level = line.match(/^#+/)[0].length;
        if (level <= 3) {
            const title = line.replace(/^#+\s+/, '');
            const anchor = title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            toc.push(`<li style="margin-left:${(level-1)*15}px"><a href="#${anchor}">${title}</a></li>`);
        }
    });
    
    toc.push('</ul>', '</div>');
    return toc.join('\n');
}

function addToRecentNotes(id) {
    const existingIndex = recentNotes.findIndex(note => note.id === id);
    if (existingIndex !== -1) {
        recentNotes.splice(existingIndex, 1);
    }
    
    recentNotes.unshift({
        id: id,
        title: notesConfig[id].title,
        group: notesConfig[id].group,
        timestamp: new Date().getTime()
    });
    
    if (recentNotes.length > MAX_RECENT_NOTES) {
        recentNotes.pop();
    }
    
    localStorage.setItem('recentNotes', JSON.stringify(recentNotes));
    
    updateRecentNotesList();
}

function toggleBookmark(id) {
    const bookmarkBtn = document.getElementById('toggleBookmark');
    const isBookmarked = bookmarkedNotes.some(note => note.id === id);
    
    if (isBookmarked) {
        bookmarkedNotes = bookmarkedNotes.filter(note => note.id !== id);
        bookmarkBtn.classList.remove('btn-primary');
        bookmarkBtn.classList.add('btn-outline-secondary');
        bookmarkBtn.innerHTML = '<i class="far fa-bookmark"></i>';
        bookmarkBtn.title = 'Bookmark this note';
    } else {
        bookmarkedNotes.push({
            id: id,
            title: notesConfig[id].title,
            group: notesConfig[id].group
        });
        bookmarkBtn.classList.remove('btn-outline-secondary');
        bookmarkBtn.classList.add('btn-primary');
        bookmarkBtn.innerHTML = '<i class="fas fa-bookmark"></i>';
        bookmarkBtn.title = 'Remove bookmark';
    }
    
    localStorage.setItem('bookmarks', JSON.stringify(bookmarkedNotes));
    
    updateBookmarksList();
}

function updateRecentNotesList() {
    const recentList = document.getElementById('recentNotesList');
    if (!recentList) return;
    
    if (recentNotes.length === 0) {
        recentList.innerHTML = '<div class="text-center text-muted py-3">No recent notes</div>';
        return;
    }
    
    let html = '';
    recentNotes.forEach(note => {
        const timeAgo = getTimeAgo(note.timestamp);
        html += `
            <div class="recent-note-item">
                <a href="#${note.id}" onclick="loadMarkdownContent('${note.id}')">
                    ${note.title}
                </a>
                <span class="recent-note-time">${timeAgo}</span>
            </div>
        `;
    });
    
    recentList.innerHTML = html;
}

function getTimeAgo(timestamp) {
    const now = new Date().getTime();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    
    if (seconds < 60) {
        return 'just now';
    } else if (seconds < 3600) {
        const minutes = Math.floor(seconds / 60);
        return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (seconds < 86400) {
        const hours = Math.floor(seconds / 3600);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
        const days = Math.floor(seconds / 86400);
        return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
}

function updateBookmarksList() {
    const bookmarksList = document.getElementById('bookmarksList');
    const modalList = document.getElementById('bookmarksModalList');
    
    if (!bookmarksList || !modalList) return;
    
    if (bookmarkedNotes.length === 0) {
        bookmarksList.innerHTML = '<div class="text-center text-muted py-3">No bookmarks</div>';
        modalList.innerHTML = '<div class="text-center text-muted py-3">No bookmarks</div>';
        return;
    }
    
    let sidebarHtml = '';
    let modalHtml = '';
    
    bookmarkedNotes.forEach(note => {
        sidebarHtml += `
            <div class="bookmark-item">
                <a href="#${note.id}" onclick="loadMarkdownContent('${note.id}')">${note.title}</a>
                <span class="bookmark-remove" onclick="event.stopPropagation(); toggleBookmark('${note.id}');">
                    <i class="fas fa-times"></i>
                </span>
            </div>
        `;
        
        modalHtml += `
            <div class="d-flex justify-content-between align-items-center mb-2 p-2 border-bottom">
                <div>
                    <strong>${note.title}</strong>
                    <div><small class="text-muted">${note.group}</small></div>
                </div>
                <div>
                    <button class="btn btn-sm btn-primary" onclick="loadMarkdownContent('${note.id}'); $('#bookmarksModal').modal('hide');">
                        Open
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="toggleBookmark('${note.id}'); updateBookmarksList();">
                        Remove
                    </button>
                </div>
            </div>
        `;
    });
    
    bookmarksList.innerHTML = sidebarHtml;
    modalList.innerHTML = modalHtml;
}

async function fetchAvailableNotes() {
    try {
        const response = await fetch('notes/index.json');
        if (!response.ok) throw new Error('Failed to load notes index');
        
        const notesIndex = await response.json();
        
        for (const [groupName, notes] of Object.entries(notesIndex)) {
            notes.forEach(note => {
                const id = note.file.replace('.md', '');
                
                notesConfig[id] = {
                    title: note.name,
                    file: `notes/${note.file}`,
                    group: groupName
                };
            });
        }

        console.log('notesConfig:', notesConfig);
        
        generateSidebar(notesIndex);
        
        loadStoredData();
        
        handleHashChange();
        
        document.getElementById('loadingIndicator').style.display = 'none';
    } catch (error) {
        console.error('Error loading notes index:', error);
        document.getElementById('notesContent').innerHTML = `
            <div class="alert alert-danger">
                Failed to load notes list: ${error.message}
            </div>
        `;
    }
}

function loadStoredData() {
    try {
        const storedRecent = localStorage.getItem('recentNotes');
        if (storedRecent) {
            recentNotes = JSON.parse(storedRecent);
            updateRecentNotesList();
        }
    } catch (e) {
        console.error('Error loading recent notes', e);
        localStorage.removeItem('recentNotes');
    }
    try {
        const storedBookmarks = localStorage.getItem('bookmarks');
        if (storedBookmarks) {
            bookmarkedNotes = JSON.parse(storedBookmarks);
            updateBookmarksList();
        }
    } catch (e) {
        console.error('Error loading bookmarks', e);
        localStorage.removeItem('bookmarks');
    }
    
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
        if (document.getElementById('darkModeSwitch')) {
            document.getElementById('darkModeSwitch').checked = true;
        }
    }
    
    if (localStorage.getItem('autoToc') === 'false' && document.getElementById('autoTocSwitch')) {
        document.getElementById('autoTocSwitch').checked = false;
    }
}

function generateSidebar(notesIndex) {
    const sidebar = document.getElementById('notesList');
    sidebar.innerHTML = '';
    
    let groupCounter = 0;
    for (const [groupName, notes] of Object.entries(notesIndex)) {
        const groupId = `group-${groupCounter}`;
        groupCounter++;
        
        const groupDiv = document.createElement('div');
        groupDiv.className = 'mb-2';
        groupDiv.innerHTML = `
            <h6 class="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-2 mb-1">
                <span>${groupName}</span>
                <a class="link-secondary" data-bs-toggle="collapse" href="#${groupId}" role="button" aria-expanded="true">
                    <span class="chevron-icon">▼</span>
                </a>
            </h6>
            <div class="collapse show" id="${groupId}">
                <ul class="nav flex-column"></ul>
            </div>
        `;
        
        sidebar.appendChild(groupDiv);
        
        const chevron = groupDiv.querySelector('.chevron-icon');
        const collapseLink = groupDiv.querySelector('a[data-bs-toggle="collapse"]');
        collapseLink.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.getElementById(this.getAttribute('href').substring(1));
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            if (isExpanded) {
                target.classList.remove('show');
                this.setAttribute('aria-expanded', 'false');
                chevron.textContent = '►';
                chevron.classList.add('rotate-icon');
            } else {
                target.classList.add('show');
                this.setAttribute('aria-expanded', 'true');
                chevron.textContent = '▼';
                chevron.classList.remove('rotate-icon');
            }
        });
        
        const ul = groupDiv.querySelector('ul');
        notes.forEach(note => {
            const id = note.file.replace('.md', '');
            const li = document.createElement('li');
            li.className = 'nav-item';
            li.innerHTML = `<a class="nav-link" href="#${id}">${note.name}</a>`;
            ul.appendChild(li);
            
            li.querySelector('a').addEventListener('click', function(e) {
                e.preventDefault();
                loadMarkdownContent(id);
            });
        });
    }
}

function handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash && notesConfig[hash]) {
        loadMarkdownContent(hash);
    } else if (Object.keys(notesConfig).length > 0) {
        loadMarkdownContent(Object.keys(notesConfig)[0]);
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        
        clearSearch.style.display = searchTerm.length > 0 ? 'block' : 'none';
        
        if (searchTerm.length > 2) {
            searchAllNotes(searchTerm);
        } else if (searchTerm.length === 0) {
            handleHashChange();
        }
    });
    
    clearSearch.addEventListener('click', function() {
        searchInput.value = '';
        clearSearch.style.display = 'none';
        handleHashChange();
    });
}

async function searchAllNotes(searchTerm) {
    const results = [];
    const searchPromises = [];
    
    document.getElementById('notesContent').innerHTML = `
        <div id="searchLoadingIndicator" class="text-center">
            <div class="loading-spinner mb-3"></div>
            <p>Searching notes...</p>
        </div>
    `;
    
    for (const [id, config] of Object.entries(notesConfig)) {
        searchPromises.push(
            fetch(config.file)
                .then(response => response.text())
                .then(content => {
                    if (content.toLowerCase().includes(searchTerm)) {
                        const lines = content.split('\n');
                        const matchedLines = lines.filter(line => 
                            line.toLowerCase().includes(searchTerm)
                        );
                        
                        results.push({
                            id,
                            title: config.title,
                            group: config.group,
                            matches: matchedLines.slice(0, 3).map(line => {
                                return line.replace(
                                    new RegExp(`(${searchTerm})`, 'gi'),
                                    '<mark>$1</mark>'
                                );
                            })
                        });
                    }
                })
                .catch(error => console.error(`Error searching ${id}:`, error))
        );
    }
    
    await Promise.all(searchPromises);
    
    if (results.length > 0) {
        let resultsHtml = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h2>Search Results for "${searchTerm}"</h2>
                <span class="badge bg-primary rounded-pill">${results.length} results</span>
            </div>
            <div class="row">
        `;
        
        results.forEach(result => {
            resultsHtml += `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="search-result h-100">
                        <h5>
                            <a href="#${result.id}" onclick="loadMarkdownContent('${result.id}')">${result.title}</a>
                            <span class="badge-group">${result.group}</span>
                        </h5>
                        <hr>
                        <ul class="small text-muted">
                            ${result.matches.map(match => `<li>${match}</li>`).join('')}
                        </ul>
                        <div class="mt-3">
                            <button class="btn btn-sm btn-primary" onclick="loadMarkdownContent('${result.id}')">
                                <i class="fas fa-eye me-1"></i> View Note
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsHtml += `</div>`;
        document.getElementById('notesContent').innerHTML = resultsHtml;
    } else {
        document.getElementById('notesContent').innerHTML = `
            <div class="text-center my-5">
                <i class="fas fa-search fa-4x text-muted mb-3"></i>
                <h3>No results found</h3>
                <p class="text-muted">No results found for "${searchTerm}"</p>
                <button class="btn btn-outline-secondary mt-3" onclick="handleHashChange()">
                    <i class="fas fa-arrow-left me-2"></i> Back to Notes
                </button>
            </div>
        `;
    }
}

function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const darkModeSwitch = document.getElementById('darkModeSwitch');
    
    themeToggle.addEventListener('click', toggleDarkMode);
    
    if (darkModeSwitch) {
        darkModeSwitch.addEventListener('change', function() {
            if (this.checked) {
                enableDarkMode();
            } else {
                disableDarkMode();
            }
        });
    }
}

function toggleDarkMode() {
    if (document.body.classList.contains('dark-mode')) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
}

function enableDarkMode() {
    document.body.classList.add('dark-mode');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    localStorage.setItem('darkMode', 'true');
    if (document.getElementById('darkModeSwitch')) {
        document.getElementById('darkModeSwitch').checked = true;
    }
}

function disableDarkMode() {
    document.body.classList.remove('dark-mode');
    document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
    localStorage.setItem('darkMode', 'false');
    if (document.getElementById('darkModeSwitch')) {
        document.getElementById('darkModeSwitch').checked = false;
    }
}

function setupSidebarToggle() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('sidebar-collapsed');
        mainContent.classList.toggle('content-expanded');
    });
    
    if (window.innerWidth <= 768) {
        sidebar.classList.add('sidebar-collapsed');
        mainContent.classList.add('content-expanded');
    }
}

function setupBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

function setupCopyLink() {
    document.getElementById('copyLink').addEventListener('click', function(e) {
        e.preventDefault();
        
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
            const toast = new bootstrap.Toast(document.getElementById('linkCopiedToast'));
            toast.show();
        }).catch((error) => {
            console.error('Error copying link to clipboard:', error);
        });
    });
}

function setupSettings() {
    document.getElementById('openSettings').addEventListener('click', function(e) {
        e.preventDefault();
        const modal = new bootstrap.Modal(document.getElementById('settingsModal'));
        modal.show();
    });
    
    document.getElementById('saveSettings').addEventListener('click', function() {
        const autoToc = document.getElementById('autoTocSwitch').checked;
        localStorage.setItem('autoToc', autoToc);
        
        const codeTheme = document.getElementById('codeThemeSelect').value;
        const currentTheme = document.querySelector('link[href*="prism-"]');
        const themeBase = currentTheme.href.substring(0, currentTheme.href.lastIndexOf('/') + 1);
        currentTheme.href = themeBase + codeTheme + '.min.css';
        localStorage.setItem('codeTheme', codeTheme);
        
        const fontSize = document.getElementById('fontSizeSelect').value;
        document.documentElement.style.setProperty('--content-font-size', fontSize === 'small' ? '0.9rem' : fontSize === 'large' ? '1.1rem' : '1rem');
        localStorage.setItem('fontSize', fontSize);
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('settingsModal'));
        modal.hide();
        
        handleHashChange();
    });
    
    if (localStorage.getItem('codeTheme')) {
        document.getElementById('codeThemeSelect').value = localStorage.getItem('codeTheme');
    }
    
    if (localStorage.getItem('fontSize')) {
        document.getElementById('fontSizeSelect').value = localStorage.getItem('fontSize');
        document.documentElement.style.setProperty(
            '--content-font-size', 
            localStorage.getItem('fontSize') === 'small' ? '0.9rem' : 
            localStorage.getItem('fontSize') === 'large' ? '1.1rem' : '1rem'
        );
    }
}

function setupBookmarksModal() {
    document.getElementById('showBookmarks').addEventListener('click', function(e) {
        e.preventDefault();
        updateBookmarksList();
        const modal = new bootstrap.Modal(document.getElementById('bookmarksModal'));
        modal.show();
    });
}

function setupExportPDF() {
    document.getElementById('exportPDF').addEventListener('click', function(e) {
        e.preventDefault();
        window.print();
    });
}

document.addEventListener('DOMContentLoaded', function() {
    setupThemeToggle();
    setupSidebarToggle();
    setupBackToTop();
    setupCopyLink();
    setupSettings();
    setupBookmarksModal();
    setupExportPDF();
    
    fetchAvailableNotes();
    
    window.addEventListener('hashchange', handleHashChange);
    
    setupSearch();
});