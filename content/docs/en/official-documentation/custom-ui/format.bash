#!/bin/bash

# Script to update YAML frontmatter in markdown files
# Adds authors and url fields to existing frontmatter

DOCS_DIR="type-documentation"

# Check if directory exists
if [ ! -d "$DOCS_DIR" ]; then
    echo "Error: Directory '$DOCS_DIR' not found!"
    exit 1
fi

# Process each markdown file
find "$DOCS_DIR" -name "*.md" -type f | while read -r file; do
    echo "Processing: $file"
    
    # Check if frontmatter exists
    if ! head -n 1 "$file" | grep -q '^---$'; then
        echo "  Warning: No frontmatter found in $file, skipping..."
        continue
    fi
    
    # Check if authors already exist
    if grep -q '^authors:' "$file"; then
        echo "  Authors already exist, skipping..."
        continue
    fi
    
    # Add authors and url after the title line in frontmatter
    sed -i '/^title:/a\
authors:\
  - name: "Hypixel Studios Canada Inc."\
    url: "https://hytale.com"' "$file"
    
    # Check if OfficialDocumentationNotice already exists
    if ! grep -q '<OfficialDocumentationNotice />' "$file"; then
        # Find the line number of the second --- (closing frontmatter)
        line_num=$(awk '/^---$/{count++; if(count==2) print NR}' "$file")
        
        if [ -n "$line_num" ]; then
            # Add the component after the closing ---
            sed -i "${line_num}a\\<OfficialDocumentationNotice />\\n" "$file"
        fi
    fi
    
    echo "  Updated frontmatter in $file"
done

echo "Done!"
