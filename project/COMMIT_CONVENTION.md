# 📝 Commit Message Convention

Use conventional commits for better organization and automated changelog generation.

## Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

## Types
- **feat**: New features
- **fix**: Bug fixes  
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **perf**: Performance improvements
- **test**: Adding or modifying tests
- **chore**: Maintenance tasks
- **ci**: CI/CD configuration changes

## Scopes (optional)
- **ui**: User interface components
- **api**: API related changes
- **data**: Data handling/mock data
- **maps**: Map functionality
- **search**: Search and filtering
- **mobile**: Mobile-specific changes
- **seo**: SEO optimizations

## Examples

### Good Examples
```bash
feat(search): add animal type filtering to opportunity search
fix(ui): resolve mobile navigation menu overlay issue
docs: update development setup instructions
refactor(maps): optimize coordinate calculation performance
style(ui): apply consistent spacing to animal cards
```

### Bad Examples
```bash
update stuff
fixed bug
wip
changes
```

## Breaking Changes
Add `BREAKING CHANGE:` in the footer for major changes:

```bash
feat(api): restructure opportunity data model

BREAKING CHANGE: opportunity.location is now opportunity.coordinates
```

## Tools
Consider using these tools for consistent commits:
- [Commitizen](https://github.com/commitizen/cz-cli)
- [Conventional Changelog](https://github.com/conventional-changelog/conventional-changelog)

---

**Keep it clear, keep it consistent! 🎯**
