#!/bin/bash

# Security scanning script for hardcoded credentials
echo "🔒 Running security scan for hardcoded credentials..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for issues found
ISSUES=0

# Function to check for patterns
check_pattern() {
    local pattern="$1"
    local description="$2"
    local files_found=$(grep -r -l -E "$pattern" src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" 2>/dev/null)
    
    if [ ! -z "$files_found" ]; then
        echo -e "${RED}❌ $description found in:${NC}"
        echo "$files_found" | while read file; do
            echo -e "   ${YELLOW}$file${NC}"
            grep -n -E "$pattern" "$file" | head -3 | while read line; do
                echo -e "     $line"
            done
        done
        echo ""
        ISSUES=$((ISSUES + 1))
    fi
}

# Check for various credential patterns
check_pattern "AIza[0-9A-Za-z_-]{35}" "Firebase API Key"
check_pattern "sk-[0-9A-Za-z]{48}" "OpenAI API Key"
check_pattern "pk_[0-9A-Za-z]{24}" "Stripe Public Key"
check_pattern "ya29\.[0-9A-Za-z_-]+" "Google OAuth Token"
check_pattern "1//[0-9A-Za-z_-]+" "Google OAuth Refresh Token"
check_pattern "mongodb://[^[:space:]'\"]+" "MongoDB Connection String"
check_pattern "postgres://[^[:space:]'\"]+" "PostgreSQL Connection String"
check_pattern "mysql://[^[:space:]'\"]+" "MySQL Connection String"
check_pattern "redis://[^[:space:]'\"]+" "Redis Connection String"
check_pattern "password[\\s]*=[\\s]*['\"][^'\"]+['\"]" "Hardcoded Password"
check_pattern "api[_-]?key[\\s]*=[\\s]*['\"][^'\"]+['\"]" "Hardcoded API Key"
check_pattern "secret[\\s]*=[\\s]*['\"][^'\"]+['\"]" "Hardcoded Secret"
check_pattern "token[\\s]*=[\\s]*['\"][^'\"]+['\"]" "Hardcoded Token"

# Check for environment variable usage (good practice)
echo -e "${GREEN}✅ Checking for proper environment variable usage...${NC}"
env_usage=$(grep -r "process\.env\." src/ --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" | wc -l)
echo "   Found $env_usage instances of environment variable usage"

# Summary
echo ""
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 Security scan completed successfully!${NC}"
    echo -e "${GREEN}   No hardcoded credentials found.${NC}"
    exit 0
else
    echo -e "${RED}⚠️  Security scan found $ISSUES potential issues!${NC}"
    echo -e "${YELLOW}   Please review and fix the issues above.${NC}"
    exit 1
fi