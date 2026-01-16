# Conventional Commits Command

Create atomic git commits following conventional commits conventions with a Domain-Driven Design perspective.

## Instructions

1. **Analyze changes**: Run `git status` and `git diff` to understand what has been modified.

2. **Process arguments**:
   - If `$ARGUMENTS` is provided, evaluate it for:
     - Specific files to include/exclude
     - Any exceptions or special instructions
   - If `$ARGUMENTS` is empty, consider all modified files

3. **Group changes by domain concept**:
   - Analyze all modified files and group them by the domain concept or bounded context they belong to
   - Each group should represent a single logical change that can stand alone
   - Files that are tightly coupled (e.g., a component and its test, a feature and its types) belong in the same commit
   - Files affecting different domain concepts should be in separate commits

   Examples of groupings:
   - `src/lib/pricing/*` + `src/lib/pricing.test.ts` → one commit about pricing domain
   - `src/components/checkout/*` → one commit about checkout UI
   - `src/lib/auth.ts` + `src/hooks/useAuth.ts` → one commit about authentication
   - `README.md` + `docs/*` → one commit for documentation
   - Unrelated utility changes → separate commits

4. **Determine commit type** for each group based on the nature of changes:
   - `feat`: New capability or feature in a bounded context
   - `fix`: Correction of domain logic or behavior
   - `refactor`: Restructuring without changing domain behavior
   - `docs`: Documentation changes
   - `test`: Adding or updating tests
   - `chore`: Maintenance tasks outside domain logic
   - `perf`: Performance improvements
   - `style`: Code style changes (formatting, no logic change)

5. **Identify the domain scope**: Determine which bounded context, aggregate, or domain concept is affected (e.g., `feat(order):`, `fix(payment):`, `refactor(inventory):`)

6. **Write the commit message**:
   - Focus on **WHY** the change was made, not what changed
   - Frame it from domain concepts and business value
   - Keep the subject line under 72 characters
   - Use imperative mood ("add" not "added")
   - Do NOT include any reference to Claude, AI, or co-authors

7. **Commit format**:
   ```
   <type>(<scope>): <subject>

   <body - explain the domain reasoning and business context>
   ```

## Examples

Good commit messages (domain-focused WHY):
- `feat(checkout): enable guest users to complete purchases`
- `fix(pricing): ensure discount rules apply before tax calculation`
- `refactor(user): simplify authentication flow for better maintainability`

Bad commit messages (technical WHAT):
- `feat(checkout): add new function processGuestCheckout`
- `fix(pricing): fix bug in calculateTotal method`
- `refactor(user): move code from file A to file B`

## Arguments

$ARGUMENTS

## Execution

1. **Plan the commits**: Before committing, list the planned commits with:
   - Which files belong to each commit
   - The commit message for each
   - The order of commits (foundational changes first, dependent changes after)

2. **Execute commits sequentially**: For each logical group:
   - Stage only the files for that group: `git add <files>`
   - Create the commit with the appropriate message
   - Verify with `git status` before moving to the next group

3. **Respect dependencies**: If changes depend on each other, commit the dependency first. For example:
   - Shared types/interfaces before features using them
   - Core domain logic before UI components consuming it
   - Infrastructure changes before features relying on them

4. **Handle exceptions**: If arguments specify exclusions or specific files, adjust the groupings accordingly.

5. **Final verification**: Run `git log --oneline -n <number_of_commits>` to show the created commits.
