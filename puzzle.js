class MapPuzzle {
    constructor() {
        this.map = null;
        this.marker = null;
        this.puzzlePieces = [];
        this.gridSize = 2;
        this.correctPositions = 0;
        this.mapVisible = true;

        this.initNotifications();
        this.initMap();
        this.initLocationButton();
        this.initDownloadButton();
        this.initMapToggle();
        this.initPuzzleSizeSelector();
        this.setupDragAndDrop();
        
        // Set placeholder text for coordinates
        document.getElementById('coordinates').textContent = 'Click "My location to get coordinates"';
    }

    async initNotifications() {
        try {
            const permission = await Notification.requestPermission();
            if (permission !== 'granted') {
                console.log('Notification permission denied');
            }
        } catch (error) {
            console.error('Error requesting notification permission:', error);
        }
    }

    initMap() {
        this.map = L.map('map').setView([52.237049, 21.017532], 13);
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
            maxZoom: 19
        }).addTo(this.map);
    }

    initLocationButton() {
        document.getElementById('locationBtn').addEventListener('click', () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        const coords = `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`;
                        document.getElementById('coordinates').textContent = coords;

                        if (this.marker) {
                            this.marker.setLatLng([latitude, longitude]);
                        } else {
                            this.marker = L.marker([latitude, longitude]).addTo(this.map);
                        }
                        this.map.setView([latitude, longitude], 13);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        alert('Error getting location. Please check your permissions.');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }

    initDownloadButton() {
        document.getElementById('downloadBtn').addEventListener('click', async () => {
            try {
                // Get the selected grid size and calculate board size
                const gridSize = this.gridSize;
                // Use a base tile size (e.g. 150px per piece)
                const pieceSize = 150;
                const boardSize = gridSize * pieceSize;

                // Resize map container and board to match selected size
                document.getElementById('map').style.width = boardSize + 'px';
                document.getElementById('map').style.height = boardSize + 'px';
                document.getElementById('puzzleBoard').style.width = boardSize + 'px';
                document.getElementById('puzzleBoard').style.height = boardSize + 'px';

                // Wait for map to resize and tiles to load
                await new Promise(resolve => setTimeout(resolve, 400));

                // Get the current map bounds and size
                const bounds = this.map.getBounds();
                const size = { x: boardSize, y: boardSize };

                const staticMapUrl = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/export?bbox=${bounds.getWest()},${bounds.getSouth()},${bounds.getEast()},${bounds.getNorth()}&bboxSR=4326&layers=&layerDefs=&size=${size.x},${size.y}&imageSR=&format=png&transparent=false&dpi=&time=&layerTimeOptions=&dynamicLayers=&gdbVersion=&mapScale=&rotation=&datumTransformations=&layerParameterValues=&mapRangeValues=&layerRangeValues=&f=image`;

                // Load the static map image
                const img = new Image();
                img.crossOrigin = "Anonymous";
                img.onload = () => {
                    // Create a canvas and draw the image
                    const canvas = document.createElement('canvas');
                    canvas.width = size.x;
                    canvas.height = size.y;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, size.x, size.y);
                    this.createPuzzle(canvas);
                    this.toggleMap(false);
                };
                img.onerror = () => {
                    console.error('Error loading static map image');
                    alert('Error capturing map image. Please try again.');
                };
                img.src = staticMapUrl;
            } catch (error) {
                console.error('Error capturing map:', error);
                alert('Error capturing map image');
            }
        });
    }

    initMapToggle() {
        const toggleBtn = document.getElementById('toggleMapBtn');
        const mapContainer = document.getElementById('mapContainer');
        
        toggleBtn.addEventListener('click', () => {
            this.mapVisible = !this.mapVisible;
            this.toggleMap(this.mapVisible);
        });

        // Set initial height for smooth animation
        mapContainer.style.height = mapContainer.offsetHeight + 'px';
    }

    toggleMap(show) {
        const toggleBtn = document.getElementById('toggleMapBtn');
        const mapContainer = document.getElementById('mapContainer');
        
        if (show) {
            mapContainer.classList.remove('collapsed');
            toggleBtn.textContent = 'Ukryj mapę';
        } else {
            mapContainer.classList.add('collapsed');
            toggleBtn.textContent = 'Pokaż mapę';
        }
        this.mapVisible = show;
    }

    initPuzzleSizeSelector() {
        const sizeSelector = document.getElementById('puzzleSize');
        const board = document.getElementById('puzzleBoard');
        
        // Initialize board grid on load
        board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        
        sizeSelector.addEventListener('change', (e) => {
            this.gridSize = parseInt(e.target.value);
            // Update board grid
            board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
            board.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;
        });
    }

    createPuzzle(canvas) {
        const pieces = this.splitImage(canvas);
        const board = document.getElementById('puzzleBoard');
        const piecesContainer = document.getElementById('puzzlePieces');
        const totalPieces = this.gridSize * this.gridSize;
        
        // Clear previous puzzle
        board.innerHTML = '';
        piecesContainer.innerHTML = '';
        this.correctPositions = 0;

        // Update board grid
        board.style.gridTemplateColumns = `repeat(${this.gridSize}, 1fr)`;
        board.style.gridTemplateRows = `repeat(${this.gridSize}, 1fr)`;

        // Create board slots
        for (let i = 0; i < totalPieces; i++) {
            const slot = document.createElement('div');
            slot.className = 'puzzle-slot';
            slot.dataset.index = i;
            board.appendChild(slot);
        }

        // Create and shuffle pieces
        this.puzzlePieces = pieces.map((backgroundPosition, index) => ({
            id: index,
            backgroundPosition
        }));
        this.shuffleArray(this.puzzlePieces);

        // Calculate piece size based on grid
        const boardSize = 500;
        const pieceWidth = Math.floor(boardSize / this.gridSize);
        const pieceStyle = document.createElement('style');
        pieceStyle.textContent = `
            .puzzle-piece {
                width: ${pieceWidth - 4}px !important;
                height: ${pieceWidth - 4}px !important;
                background-size: ${boardSize}px ${boardSize}px !important;
            }
        `;
        document.head.appendChild(pieceStyle);

        // Add pieces to container
        this.puzzlePieces.forEach(piece => {
            const pieceElement = document.createElement('div');
            pieceElement.className = 'puzzle-piece';
            pieceElement.draggable = true;
            pieceElement.dataset.id = piece.id;
            pieceElement.style.backgroundImage = `url(${canvas.toDataURL()})`;
            pieceElement.style.backgroundPosition = piece.backgroundPosition;
            piecesContainer.appendChild(pieceElement);
        });
    }

    splitImage(canvas) {
        const tempCanvas = document.createElement('canvas');
        const boardSize = 500;
        tempCanvas.width = boardSize;
        tempCanvas.height = boardSize;
        
        const ctx = tempCanvas.getContext('2d');
        ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, boardSize, boardSize);
        
        const pieceWidth = boardSize / this.gridSize;
        const pieceHeight = boardSize / this.gridSize;
        const positions = [];

        for (let y = 0; y < this.gridSize; y++) {
            for (let x = 0; x < this.gridSize; x++) {
                positions.push(`-${x * pieceWidth}px -${y * pieceHeight}px`);
            }
        }

        canvas.width = boardSize;
        canvas.height = boardSize;
        canvas.getContext('2d').drawImage(tempCanvas, 0, 0);
        
        return positions;
    }
    
    setupDragAndDrop() {
        let draggedElement = null;

        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                draggedElement = e.target;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', e.target.dataset.id);
                e.target.style.opacity = '0.5';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('puzzle-piece')) {
                e.target.style.opacity = '1';
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.target.classList.contains('puzzle-slot') || e.target.id === 'puzzlePieces') {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
            }
        });

        document.addEventListener('drop', (e) => {
            const pieceId = parseInt(e.dataTransfer.getData('text/plain'));
            
            // Drop on puzzle slot
            if (e.target.classList.contains('puzzle-slot')) {
                e.preventDefault();
                const targetPosition = parseInt(e.target.dataset.index);
                
                // If slot already has a piece, do nothing
                if (e.target.children.length > 0) {
                    return;
                }
                
                // Check if placing in correct position
                const wasInCorrectPosition = draggedElement.parentElement.classList.contains('puzzle-slot') && 
                                            parseInt(draggedElement.parentElement.dataset.index) === pieceId;
                
                e.target.appendChild(draggedElement);
                
                // Update correct positions count
                if (pieceId === targetPosition) {
                    if (!wasInCorrectPosition) {
                        this.correctPositions++;
                    }
                } else {
                    if (wasInCorrectPosition) {
                        this.correctPositions--;
                    }
                }
                
                // Check for completion
                if (this.correctPositions === (this.gridSize * this.gridSize)) {
                    setTimeout(() => this.showCompletionNotification(), 100);
                }
            }
            // Drop back to pieces container
            else if (e.target.id === 'puzzlePieces') {
                e.preventDefault();
                
                // Check if removing from correct position
                const wasInCorrectPosition = draggedElement.parentElement.classList.contains('puzzle-slot') && 
                                            parseInt(draggedElement.parentElement.dataset.index) === pieceId;
                
                if (wasInCorrectPosition) {
                    this.correctPositions--;
                }
                
                e.target.appendChild(draggedElement);
            }
            
            draggedElement = null;
        });
    }

    showCompletionNotification() {
        if (Notification.permission === 'granted') {
            new Notification('Gratulacje!', {
                body: 'Układanka została ukończona poprawnie!',
                icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Openstreetmap_logo.svg/256px-Openstreetmap_logo.svg.png',
                requireInteraction: false
            });
        } else {
            // Fallback to alert if notification permission not granted
            alert('Gratulacje! Układanka została ukończona poprawnie!');
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialize the game when the page loads
window.addEventListener('load', () => {
    new MapPuzzle();
});
