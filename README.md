## 暂停更新
此插件不再更新。


You can fork this repository, modify codes or fix bugs by yourself, and build a release.

Thanks.

------

# Overview

Welcome to the iPhoneOrder.2023 project, a comprehensive solution designed to automate the process of ordering an iPhone from the Apple China website. This project is a Chrome extension that leverages a variety of technologies to streamline the ordering process, from selecting the desired iPhone model to filling out personal information and payment details. It also includes features such as system notifications, a countdown before page refresh, and a popup window for user interaction. The extension is built with a focus on robustness and reliability, with error handling and retry mechanisms in place to ensure a smooth user experience.

The project is primarily built using JavaScript and Python, with a heavy reliance on the Next.js framework for server-side rendering and the React library for building user interfaces. It also uses Tailwind CSS for styling and the PIL library for image processing. The project structure includes a variety of scripts and configuration files, each serving a specific purpose. For instance, the middleware.ts file handles cross-origin requests for static HTML files, while the bunBuild.ts file is responsible for building scripts and removing files. The project also includes a service worker for handling browser events and a manifest file that defines the extension's permissions and resources.

# Technologies and Frameworks

- JavaScript
- Python
- Next.js
- React
- Tailwind CSS
- PIL (Python Imaging Library)
- Node.js (child_process module)
- Webpack (used in Next.js configuration)
- Chrome Extensions API
- Web Notifications API
- CSS (used in global styling and layout design)
- JSON (used in package and configuration files)
- SVG (used in icon generation)
- HTML (used in layout design)
- TypeScript (used in type definitions and configuration files)
# Installation

This guide will walk you through the steps to install and set up the project.

## Prerequisites

Before you start, make sure you have the following installed:

- Node.js and npm
- Python 3
- Next.js server
- Google Chrome browser

## Step 1: Clone the Repository

First, clone the repository to your local machine. You can do this by running the following command in your terminal:

```bash
git clone <repository_url>
```

Replace `<repository_url>` with the URL of the GitHub repository.

## Step 2: Install Dependencies

Navigate to the project directory and install the necessary dependencies by running:

```bash
npm install
```

This will install all the dependencies listed in the `package.json` file.

## Step 3: Install Python Dependencies

If you're planning to use the `icon_generator.py` script, you'll need to install the Python Imaging Library (PIL). You can do this by running:

```bash
pip install pillow
```

## Step 4: Set Up Environment Variables

The project requires a build type specified in the environment variable `BUILD_TYPE`. You can set this up in a `.env` file in the root directory of the project. 

```bash
echo "BUILD_TYPE=extension" > .env
```

## Step 5: Build the Project

You can now build the project by running:

```bash
npm run build
```

## Step 6: Run the Project

Finally, you can start the project by running:

```bash
npm run start
```

You should now be able to access the project at `http://localhost:3000`.
