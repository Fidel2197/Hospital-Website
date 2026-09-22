# FortunatoCare Hospital Website

FortunatoCare is a responsive multi-page hospital website built with HTML,
CSS, and JavaScript. It presents a patient-friendly healthcare experience with
dedicated pages for services, doctors, about information, contact, appointment
requests, and patient portal access.

## Links

- [Open FortunatoCare](https://hospital-website-psi-three.vercel.app/)
- [Repository](https://github.com/Fidel2197/Hospital-Website)

## Overview

The site organizes healthcare information into dedicated pages for visitors
exploring services, care programs, and specialists. Visitors can move between focused pages, request an
appointment, review care programs, learn about doctors, and use a browser-based
patient account flow.

## Features

- Multi-page navigation for Home, Services, About Us, Doctors, Contact, and Patient Portal
- Appointment request forms with client-side confirmation messages
- Patient portal account creation, security-code verification, sign-in, dashboard, and sign-out
- Service cards for diagnostics, health checks, physiotherapy, emergency support, primary care, and wellness counseling
- Doctor profile page with expanded specialist cards
- Information about employer and partner care programs
- Responsive layout for desktop, tablet, and mobile screens
- Local image assets, favicon, and FortunatoCare branding
- Static hosting-ready structure for Vercel, GitHub Pages, or any basic web host

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Local image assets
- Custom SVG favicon and brand symbol

## Project Structure

```text
Hospital-Website/
  index.html
  services.html
  about.html
  doctors.html
  contact.html
  portal.html
  Website.html
  styles.css
  app.js
  assets/
  about.jpg
  choose-us.webp
  doctor-2.jpeg
  us.jpg
  README.md
```

`Website.html` redirects to `index.html` so older links still open the site.

## Getting Started

Clone the repository:

```bash
git clone https://github.com/Fidel2197/Hospital-Website.git
```

Open `index.html` in a browser. No build step or package installation is
required.

## Forms and Patient Portal

Appointment forms show client-side confirmations; requests are not sent to a clinic. Patient accounts and verification run in the browser and do not provide secure backend authentication. This project is not connected to a healthcare provider or patient-record system.

## Deployment

This project can be deployed as a static site. Vercel can serve it directly
from the GitHub repository and will update when new changes are pushed to the
connected branch.

## Author

Built by Fidel Anyanwu.
