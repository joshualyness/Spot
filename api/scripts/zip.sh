#!/bin/bash

# Define the base directory containing the lambdas
DIST_DIR="dist/lambdas"

# Check if the directory exists
if [ ! -d "$DIST_DIR" ]; then
  echo "Directory $DIST_DIR does not exist. Please ensure it is built before running this script."
  exit 1
fi

# Change to the target directory
cd "$DIST_DIR" || exit

# Iterate through all subdirectories
for dir in */; do
  # Check if the directory contains a "index.js" file
  if [ -f "${dir}index.js" ]; then
    # Create a zip file named after the directory
    ZIP_NAME="${dir%/}.zip" # Remove trailing slash from directory name
    echo "Zipping only ${dir}index.js into $ZIP_NAME..."

    # Zip only the index.js file
    cd "$dir" || exit
    zip "../$ZIP_NAME" "index.js" > /dev/null
    cd ..

    # Check if zipping was successful
    if [ $? -ne 0 ]; then
      echo "Error: Failed to zip ${dir}index.js."
      exit 1
    fi
  else
    echo "Skipping $dir because it does not contain index.js."
  fi
done

echo "All lambda handler directories have been zipped with only their index.js files successfully."
