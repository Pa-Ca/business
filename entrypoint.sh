#!/bin/bash

# Run the project_runner.sh script and store the exit status
EXIT_STATUS=$($PROJECT_RUNNER_SH_EXIT_STATUS=$$ ./project_runner.sh)

# Check the exit status and exit with the same status code
if [ $EXIT_STATUS -ne 0 ]; then
  exit $EXIT_STATUS
fi