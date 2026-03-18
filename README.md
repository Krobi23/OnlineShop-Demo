# OnlineShop-Demo with Node.js/Express
# Note: The UI of this project is currently only available in german
This project is a locally executable demo of a simple online shop, built for learning and demonstration purposes.
The goal of this project is to showcase basic shop functionality including account creation without using an external database or backend hosting.

# Features
- Product listing
- Account creation and login
- Shopping cart functionality
- Add/ remove Items
- Simulated checkout
- Data handled entirely in local memory (no database)

# Technical Approach
- Build with Node.js/Express
- Data stored only in local memory (objects and arrays)
- No persistend storage
- No external API integration
- All data is automatically deleted when the application is closed

# Installation and Run
Requirements:
  Node.js is installed (check with node --version in the terminal)
Steps:
  # Clone repository
  git clone https://github.com/Krobi23/OnlineShop-Demo
  # Navigate into project folder
  cd OnlineShop-Demo
  # Start application
  node app.js
  # Open the shown link into your browser
  http://localhost:8020
  # To close the local web-server type in the terminal
  ctrl + C
