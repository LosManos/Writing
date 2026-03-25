document.addEventListener('DOMContentLoaded', () => {

    // --- DOM Elements ---
    const tabGenerate = document.getElementById('tab-generate');
    const tabScan = document.getElementById('tab-scan');
    
    const viewGenerate = document.getElementById('view-generate');
    const viewScan = document.getElementById('view-scan');
    const viewAugment = document.getElementById('view-augment');
    
    const inputData = document.getElementById('data-input');
    const btnGenerate = document.getElementById('btn-generate');
    const qrDisplayContainer = document.getElementById('qr-display-container');
    const qrCanvas = document.getElementById('qr-canvas');
    
    const btnStopScan = document.getElementById('btn-stop-scan');
    
    const receivedText = document.getElementById('received-text');
    const augmentInput = document.getElementById('augment-input');
    const btnCombine = document.getElementById('btn-combine');
    const btnCancelAugment = document.getElementById('btn-cancel-augment');

    // --- State ---
    let qrCode = null;
    let html5QrcodeScanner = null;
    let lastReceivedPayload = {};

    // --- Tab Navigation ---
    tabGenerate.addEventListener('click', () => switchTab('generate'));
    tabScan.addEventListener('click', () => switchTab('scan'));

    function switchTab(tab) {
        // Reset scanner if active
        if (html5QrcodeScanner && html5QrcodeScanner.isScanning) {
            stopScanning();
        }

        if (tab === 'generate') {
            tabGenerate.classList.add('active');
            tabScan.classList.remove('active');
            
            viewGenerate.classList.add('active');
            viewGenerate.classList.remove('hidden');
            
            viewScan.classList.remove('active');
            viewScan.classList.add('hidden');
            
            viewAugment.classList.remove('active');
            viewAugment.classList.add('hidden');
        } else if (tab === 'scan') {
            tabScan.classList.add('active');
            tabGenerate.classList.remove('active');
            
            viewScan.classList.add('active');
            viewScan.classList.remove('hidden');
            
            viewGenerate.classList.remove('active');
            viewGenerate.classList.add('hidden');
            
            viewAugment.classList.remove('active');
            viewAugment.classList.add('hidden');
            
            startScanning();
        }
    }

    // --- Generation Logic ---
    function createBeautifulQR(dataString) {
        qrCanvas.innerHTML = ''; // Clear previous QR
        
        qrCode = new QRCodeStyling({
            width: 250,
            height: 250,
            type: "svg",
            data: dataString,
            imageOptions: {
                crossOrigin: "anonymous",
                margin: 0
            },
            dotsOptions: {
                color: "#1d1f2e", // Dark dots for contrast on white background
                type: "rounded"
            },
            backgroundOptions: {
                color: "transparent" // The canvas has white background via CSS
            },
            cornersSquareOptions: {
                color: "#7360ff", // Primary accent
                type: "extra-rounded"
            },
            cornersDotOptions: {
                color: "#ff476e", // Secondary accent
                type: "dot"
            }
        });
        
        qrCode.append(qrCanvas);
    }

    btnGenerate.addEventListener('click', () => {
        const textToShare = inputData.value.trim();
        if (!textToShare && !inputData.value.includes('[Combined Data Active]')) {
            alert("Please enter some data to generate a QR code.");
            return;
        }

        // Only override if we are user A
        let payloadStr = "";
        if (!inputData.value.includes('[Combined Data Active]')) {
             const payload = { a: textToShare };
             payloadStr = JSON.stringify(payload);
        } else {
             // We use the combined payload from augmentation
             // But for safety, keep the last one generated
             // We handle this more robustly below, but for now we'll just ignore if it's combined
             // assuming we already generated it.
             return; 
        }

        // Render 
        qrDisplayContainer.classList.remove('hidden');
        createBeautifulQR(payloadStr);
    });

    // --- Scanning Logic ---
    function startScanning() {
        btnStopScan.classList.remove('hidden');
        
        // Use a smaller qrbox for better targeting
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        
        if (!html5QrcodeScanner) {
            html5QrcodeScanner = new Html5Qrcode("qr-reader");
        }

        // Start scanning with rear camera if possible
        html5QrcodeScanner.start(
            { facingMode: "environment" },
            config,
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error(err);
            // Fallback to any available if environment fails
            html5QrcodeScanner.start(
                { facingMode: "user" },
                config,
                onScanSuccess,
                onScanFailure
            ).catch(err2 => {
                 console.error(err2);
                 alert("Could not start camera. Please grant camera permissions and ensure you are using HTTPS.");
                 btnStopScan.classList.add('hidden');
            });
        });
    }

    function stopScanning() {
        if (html5QrcodeScanner) {
            html5QrcodeScanner.stop().then(() => {
                btnStopScan.classList.add('hidden');
            }).catch(err => {
                console.error("Failed to stop scanning.", err);
            });
        }
    }

    btnStopScan.addEventListener('click', stopScanning);

    function onScanSuccess(decodedText, decodedResult) {
        // We found a QR code
        
        try {
            const data = JSON.parse(decodedText);
            
            // Basic validation
            if (data && data.a) {
                stopScanning();
                lastReceivedPayload = data;
                
                // Show Augment View
                viewScan.classList.remove('active');
                viewScan.classList.add('hidden');
                
                viewAugment.classList.add('active');
                viewAugment.classList.remove('hidden');
                
                // Format Received Text
                let displayStr = `User A: ${data.a}`;
                if (data.b) {
                    displayStr += `\nUser B: ${data.b}`;
                }
                receivedText.innerText = displayStr;
                
            } else {
                // Not our app's QR
                console.warn("Unrecognized JSON struct:", data);
            }
        } catch (e) {
            // Not JSON
            console.warn("Scanned non-JSON QR Code:", decodedText);
        }
    }

    function onScanFailure(error) {
        // Continuous loop failure handling
        // Do nothing to avoid spam
    }

    // --- Augmentation Logic ---
    btnCombine.addEventListener('click', () => {
        const myData = augmentInput.value.trim();
        if (!myData) {
             alert("Please add your data before combining, or cancel.");
             return;
        }
        
        // Merge data
        const combinedPayload = {
            ...lastReceivedPayload,
            b: myData
        };
        
        const payloadStr = JSON.stringify(combinedPayload);
        
        // Hide augment view
        viewAugment.classList.remove('active');
        viewAugment.classList.add('hidden');
        
        // Sync tabs to Generator
        tabGenerate.classList.add('active');
        tabScan.classList.remove('active');
        
        viewGenerate.classList.add('active');
        viewGenerate.classList.remove('hidden');
        
        // Show QR
        qrDisplayContainer.classList.remove('hidden');
        inputData.value = `[Combined Data Active]\n\nUser A: ${combinedPayload.a}\nUser B: ${combinedPayload.b}`;
        inputData.disabled = true; // Lock it since it's combined
        
        createBeautifulQR(payloadStr);
        
        augmentInput.value = ''; // Clean up
    });

    btnCancelAugment.addEventListener('click', () => {
         augmentInput.value = '';
         switchTab('scan');
    });

});
