# REBIRTH PWA — iPhone Setup

## Included
- Dark black + blue responsive dashboard
- Daily routine checklist and completion percentage
- Diet ideas, meal checkboxes, water counter and weight log
- 7-day consistency view
- Local export/import backup
- PWA manifest, offline service worker, iPhone icon assets
- No account, analytics, remote database or external API

## Important privacy note
App entries are saved in `localStorage` in the browser on this device. They are not synced to other devices. Clearing Safari website data may delete them. Use **Progress → Export backup** regularly. Do not use this app as the only record of medical instructions.

Medication tracker is intentionally a checklist only. It does not prescribe doses or confirm which prescription is current. Verify current medicines, dose and timing with your treating clinician/pharmacist.

Prayer times are not calculated in the app. Use a trusted local timetable; timings change by date and location. Exercise is optional and should follow clinician guidance if recovering from illness/hospitalization.

## Install on iPhone
A PWA needs to be served over HTTPS (or localhost for development). Opening `index.html` directly from Files will not provide a proper installable PWA experience.

### Option A — GitHub Pages
1. On a computer, sign in to GitHub and create a new repository named `rebirth-pwa`.
2. Upload all files and the `icons` folder from this package to the repository root.
3. Open repository **Settings → Pages**.
4. Select deployment from the main branch and root folder, then save.
5. Wait for GitHub Pages to publish the site. Copy its HTTPS URL.
6. On iPhone, open that URL in **Safari**.
7. Tap **Share → Add to Home Screen**. If shown, enable **Open as Web App**, then tap **Add**.

### Option B — Netlify
1. Extract the ZIP on a computer.
2. Open Netlify and deploy the extracted folder using its manual deploy/drag-and-drop option.
3. Open the provided HTTPS URL in Safari on iPhone and choose **Share → Add to Home Screen**.

## Updating
When files change, redeploy the folder. If an old version stays cached, close and reopen the app or clear the website data; export a backup first.

## Current routine defaults
The app uses flexible time labels based on the routine discussed: Tahajjud preparation, prayer reminders/checklist, factory 8 AM–6 PM, lunch 1–2 PM, evening shower, meals, skincare, haircare, exercise/recovery, medication verification and sleep. It does not send push notifications or calculate live prayer times.
