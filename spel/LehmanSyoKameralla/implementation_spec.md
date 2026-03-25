# LehmanSyoKameralla - Technical Implementation Specification

## Overview
This document outlines the requirements and implementation details for a purely client-side web application (HTML, CSS, JavaScript) that facilitates data exchange between two mobile devices using QR codes and the device cameras. NO backend server is required for data exchange.

## Core Workflow
1. **User A Initiation:** User A opens the app, inputs data into a form, and generates a QR code representing this data.
2. **User B Scanning:** User B opens the app on their device, activates the camera scanner, and scans User A's QR code.
3. **User B Augmentation:** User B's app decodes the data. User B then adds their own input to the data payload.
4. **User B Generation:** User B's app generates a new QR code containing the combined data.
5. **Closure:** User A scans User B's new QR code to receive the final payload.

## Technical Stack
* **Frontend Core:** HTML5, CSS3, Vanilla JavaScript (or a lightweight framework if preferred, but vanilla is sufficient).
* **QR Code Generation:** A client-side design library such as `qr-code-styling` (for advanced aesthetics like gradients, custom shapes, and embedded logos) rather than standard black-and-white barcodes.
* **QR Code Scanning:** A client-side library such as `html5-qrcode` or `jsQR`.
* **Hosting:** Any static file host (e.g., GitHub Pages, Vercel, Netlify). MUST be served over HTTPS.

## Implementation Details

### 1. The Data Payload
* The data exchanged must be kept as small as possible to ensure fast and reliable QR code scanning. 
* Suggest using a compact JSON structure or a delimited string.
* Example: `{"a":"UserA_Input","b":"UserB_Input"}`.

### 2. QR Code Generation (Generator Mode)
* Provide an input form for the user.
* On submit, serialize the data payload and pass it to the QR generation library (`qr-code-styling`).
* Render the aesthetically enhanced QR code prominently on the screen.
* **Design is key:** Use custom colors, gradients, rounded dot patterns, and even embed a logo in the center of the QR code. Make it look like a piece of art rather than a standard barcode.
* Note: While maximizing aesthetics, ensure there is still enough contrast for the scanner device to read it reliably.

### 3. QR Code Scanning (Scanner Mode)
* Utilize the `navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })` API to access the rear camera.
* **CRITICAL:** Camera access requires the site to be loaded via `HTTPS` or `localhost`.
* Stream the camera feed to a visible `<video>` element on the screen.
* Use the scanning library (`jsQR` / `html5-qrcode`) to continuously process frames from the video stream on an interval (e.g., via `requestAnimationFrame`).
* Provide visual feedback when scanning (e.g., a scanning line or bounding box) and on successful scan.

### 4. User Interface (UI/UX)
* The UI must be mobile-first and responsive.
* Provide a clear toggle or navigation between "Create/Send" (Generator) and "Scan/Receive" (Scanner) modes.
* Implement error handling (e.g., camera permission denied, QR code unreadable, data payload too large).
* Consider handling screen wake lock (`navigator.wakeLock.request('screen')`) to prevent the phone from sleeping while displaying or scanning a QR code.

## Step-by-Step Implementation Guide for the AI
1. **Setup:** Create `index.html`, `styles.css`, and `app.js` files.
2. **Dependencies:** Include the necessary CDN links for the chosen QR generation and scanning libraries in `index.html`.
3. **HTML Structure:** Build the basic UI with a section for the input form/QR generator and another section for the camera view.
4. **CSS Styling:** Apply basic, clean mobile styling (e.g., CSS Flexbox/Grid for layout, large touch targets).
5. **JavaScript - Generation:** Implement the logic to capture input, format the payload, and render the QR code.
6. **JavaScript - Scanning:** Implement the camera request, video stream routing, and continuous frame analysis loop for decoding.
7. **State Management:** Wire up the logic to handle the transition from scanning data -> displaying the form to add new data -> generating the compiled QR code.
8. **Refinement:** Add error handling, state resets, and UI instructions for the user.
