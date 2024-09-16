# Contributing to Biomedical IQ

Thank you for your interest in contributing to Biomedical IQ! We welcome contributions from developers, designers, and healthcare professionals to help us enhance and expand the platform. This document outlines the process for contributing to the project, including how to set up your development environment, guidelines for submitting changes, and best practices for collaboration.

## How to Contribute

### 1. Getting Started

To start contributing, you’ll need to set up your local development environment. Follow these steps:

1. **Fork the Repository**
   - Visit the [Biomedical IQ GitHub repository](https://github.com/kenzycodex/biomedical-iq-platform) and click the "Fork" button to create your own copy of the repository.

2. **Clone Your Fork**
   - Clone your forked repository to your local machine:
     ```bash
     git clone https://github.com/your-username/biomedical-iq-platform.git
     ```
   - Navigate to the project directory:
     ```bash
     cd biomedical-iq-platform
     ```

3. **Install Dependencies**
   - Install the required dependencies:
     ```bash
     npm install
     ```

4. **Run the Development Server**
   - Start the development server:
     ```bash
     npm run dev
     ```
   - Open your browser and navigate to `http://localhost:3000` to view the application.

### 2. Making Changes

Before making changes, please review the following guidelines:

- **Create a New Branch**
  - For each new feature or bug fix, create a new branch from `main`:
    ```bash
    git checkout -b feature/your-feature-name
    ```

- **Follow Code Standards**
  - Adhere to the coding standards and style guide specified in the project documentation.
  - Ensure that your code is well-documented and includes comments where necessary.

- **Write Tests**
  - If applicable, write tests for your changes to ensure code quality and functionality.

### 3. Submitting Changes

Once you have completed your changes, follow these steps to submit them:

1. **Commit Your Changes**
   - Use descriptive commit messages to explain your changes:
     ```bash
     git commit -m "Add feature for equipment tracking"
     ```

2. **Push to Your Fork**
   - Push your changes to your forked repository:
     ```bash
     git push origin feature/your-feature-name
     ```

3. **Create a Pull Request**
   - Go to the [Biomedical IQ GitHub repository](https://github.com/biomedical-iq/biomedical-iq-platform) and click on "New Pull Request."
   - Select your branch and provide a detailed description of your changes. Include relevant information about the problem addressed or the feature added.

### 4. Review Process

- **Code Review**
  - All pull requests will be reviewed by project maintainers. Feedback may be provided, and you may be asked to make additional changes.

- **Merging**
  - Once the pull request has been reviewed and approved, it will be merged into the `main` branch.

## Best Practices

- **Communicate**
  - Engage with the community through GitHub Discussions or our [community forum](https://github.com/kenzycodex/biomedical-iq-platform/discussions). Share your ideas and collaborate with others.

- **Stay Up-to-Date**
  - Regularly pull updates from the `main` branch to keep your fork in sync with the latest changes:
    ```bash
    git checkout main
    git pull upstream main
    ```

- **Respect the Code of Conduct**
  - Follow the [Code of Conduct](./CODE_OF_CONDUCT.md) to ensure a positive and respectful environment for all contributors.

## Reporting Issues & Feature Requests

- **Report Bugs**
  - If you encounter any bugs, please report them via the [Issues](https://github.com/kenzycodex/biomedical-iq-platform/issues) section. Provide as much detail as possible to help us address the issue effectively.

- **Request Features**
  - Suggest new features or enhancements through the [Issues](https://github.com/kenzycodex/biomedical-iq-platform/issues) section. Clearly describe the proposed feature and its benefits.

## Contact

For any questions or additional information, please contact us at:

- **Email**: biomedicaliq@gmail.com

Thank you for contributing to Biomedical IQ! Your efforts help us build a better platform for healthcare equipment management and maintenance.