# #!/bin/bash

# # Colors for output
# RED='\033[0;31m'
# GREEN='\033[0;32m'
# YELLOW='\033[1;33m'
# NC='\033[0m' # No Color

# # Print colored output
# print_message() {
#     echo -e "${GREEN}[Task Timer Pro]${NC} $1"
# }

# print_error() {
#     echo -e "${RED}[Error]${NC} $1"
# }

# print_warning() {
#     echo -e "${YELLOW}[Warning]${NC} $1"
# }

# # Check if script is run with sudo
# if [ "$EUID" -ne 0 ]; then 
#     print_error "Please run this script with sudo"
#     exit 1
# fi

# # Check system requirements
# print_message "Checking system requirements..."

# # Check if Node.js is installed
# if ! command -v node &> /dev/null; then
#     print_message "Installing Node.js..."
#     curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
#     sudo apt-get install -y nodejs
# fi

# # Check if npm is installed
# if ! command -v npm &> /dev/null; then
#     print_message "Installing npm..."
#     sudo apt-get install -y npm
# fi

# # Create installation directory
# INSTALL_DIR="/opt/task-timer-pro"
# print_message "Creating installation directory..."
# sudo mkdir -p "$INSTALL_DIR"

# # Clone the repository
# print_message "Cloning the repository..."
# git clone https://github.com/dipakrasal2009/task-timer-pro.git /tmp/task-timer-pro

# # Navigate to the directory
# cd /tmp/task-timer-pro

# # Install dependencies
# print_message "Installing dependencies..."
# npm install

# # Build the application
# print_message "Building the application..."
# npm run dist

# # Install the .deb package
# if [ -f "dist/task-timer-pro_1.0.0_amd64.deb" ]; then
#     print_message "Installing Task Timer Pro..."
#     sudo dpkg -i dist/task-timer-pro_1.0.0_amd64.deb
    
#     # Fix any dependency issues
#     sudo apt-get install -f
# else
#     print_error "Build failed or .deb package not found!"
#     exit 1
# fi

# # Create desktop shortcut
# print_message "Creating desktop shortcut..."
# cat > ~/Desktop/task-timer-pro.desktop << EOL
# [Desktop Entry]
# Name=Task Timer Pro
# Comment=Professional Task Timer Application
# Exec=/usr/bin/task-timer-pro
# Icon=${INSTALL_DIR}/resources/app/src/assets/icon.png
# Terminal=false
# Type=Application
# Categories=Utility;ProjectManagement;
# EOL

# # Make the desktop file executable
# chmod +x ~/Desktop/task-timer-pro.desktop

# # Cleanup
# print_message "Cleaning up..."
# rm -rf /tmp/task-timer-pro

# # Final instructions
# print_message "Installation completed!"
# print_message "You can now start Task Timer Pro from your applications menu or desktop shortcut."
# print_message "To run from terminal, type: task-timer-pro"

# # Check if installation was successful
# if [ $? -eq 0 ]; then
#     print_message "Task Timer Pro has been successfully installed!"
#     print_message "Version: 1.0.0"
#     print_message "Support: dipakrasal2009@gmail.com"
# else
#     print_error "Installation failed! Please check the error messages above."
#     exit 1
# fi


#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_message() {
    echo -e "${GREEN}[Task Timer Pro]${NC} $1"
}

print_error() {
    echo -e "${RED}[Error]${NC} $1"
}

# Check if Node.js and npm are installed
if ! command -v node &> /dev/null || ! command -v npm &> /dev/null; then
    print_error "Node.js or npm not found. Installing..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Create installation directory
INSTALL_DIR="/opt/task-timer-pro"
print_message "Creating installation directory..."
sudo mkdir -p "$INSTALL_DIR"

# Copy project files
print_message "Copying project files..."
sudo cp -r ./* "$INSTALL_DIR/"

# Install dependencies
print_message "Installing dependencies..."
cd "$INSTALL_DIR"
sudo npm install

# Build application
print_message "Building application..."
sudo npm run dist

# Install the .deb package
if [ -f "dist/task-timer-pro_1.0.0_amd64.deb" ]; then
    print_message "Installing Task Timer Pro..."
    sudo dpkg -i dist/task-timer-pro_1.0.0_amd64.deb
    sudo apt-get install -f
else
    print_error "Build failed or .deb package not found!"
    exit 1
fi

print_message "Installation completed!"