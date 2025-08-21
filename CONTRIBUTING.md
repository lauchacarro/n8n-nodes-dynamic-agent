# Contributing to N8N Custom AI Agent Node

Thank you for considering contributing to this project! This guide will help you get started.

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/custom-agent/n8n-nodes-custom-agent.git
   cd n8n-nodes-custom-agent
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development**:
   ```bash
   npm run dev
   ```

## Project Structure

```
├── nodes/
│   └── CustomAgent/
│       ├── CustomAgent.node.ts    # Main node definition
│       ├── robot.svg              # Node icon
│       └── utils/
│           ├── execute.ts         # Main execution logic
│           ├── message-processor.ts # System message handling
│           ├── token-calculator.ts  # Token usage calculation
│           ├── validators.ts      # Input validation
│           └── agent-factory.ts   # Agent creation (future)
├── package.json                   # NPM package configuration
├── tsconfig.json                  # TypeScript configuration
├── gulpfile.js                    # Build scripts
└── README.md                      # Documentation
```

## Development Guidelines

### Code Style
- Use TypeScript for all code
- Follow the existing code style and patterns
- Use meaningful variable and function names
- Add JSDoc comments for public functions
- Keep functions small and focused

### Commit Messages
- Use conventional commit format: `type(scope): description`
- Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`
- Example: `feat(agent): add support for custom temperature settings`

### Testing
- Test your changes locally with n8n
- Verify token usage calculations are accurate
- Test with various system message configurations
- Ensure error handling works correctly

## Making Changes

### Adding New Features
1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Implement your changes
3. Test thoroughly
4. Update documentation if needed
5. Submit a pull request

### Bug Fixes
1. Create a bugfix branch: `git checkout -b fix/issue-description`
2. Fix the issue
3. Add tests if applicable
4. Submit a pull request

### Documentation Updates
1. Update README.md for user-facing changes
2. Update code comments for internal changes
3. Keep examples up to date

## Pull Request Process

1. **Before submitting**:
   - Run `npm run lint` and fix any issues
   - Run `npm run build` to ensure it compiles
   - Test the node in a real n8n environment

2. **Pull Request Description**:
   - Clearly describe what changes you made
   - Explain why the changes are needed
   - Include screenshots for UI changes
   - Reference any related issues

3. **Review Process**:
   - Maintainers will review your PR
   - Address any feedback promptly
   - Once approved, your PR will be merged

## Feature Requests

We welcome feature requests! Please:

1. Check if a similar request already exists
2. Open an issue with the "enhancement" label
3. Clearly describe the feature and its use case
4. Provide examples if possible

## Bug Reports

When reporting bugs, please include:

1. **Environment details**:
   - n8n version
   - Node.js version
   - Operating system
   - Custom Agent node version

2. **Steps to reproduce**:
   - Clear, step-by-step instructions
   - Expected vs actual behavior
   - Screenshots if applicable

3. **Additional context**:
   - Error messages
   - Log entries
   - Workflow configuration

## Getting Help

- **Documentation**: Check the README and code comments
- **Issues**: Search existing issues first
- **Discussions**: Use GitHub Discussions for questions
- **Community**: Join the n8n community for general help

## Code of Conduct

By participating in this project, you agree to:

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on what is best for the community

Thank you for contributing to make this project better! 🚀
