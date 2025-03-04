import subprocess

# Define the path to the .txt file
file_path = 'requirment.txt'

# Open the file and read each line (command)
try:
    with open(file_path, 'r') as file:
        commands = file.readlines()

    # Execute each command in the file
    for command in commands:
        command = command.strip()  # Remove leading/trailing whitespaces/newlines
        if command:  # If the line is not empty
            print(f"Executing: {command}")
            try:
                # Execute the command
                result = subprocess.run(f"pip install {command}", shell=True, check=True, text=True, capture_output=True)
                # Print the output of the command
                print(f"Output:\n{result.stdout}")
                if result.stderr:
                    print(f"Error:\n{result.stderr}")
            except subprocess.CalledProcessError as e:
                print(f"Command failed: {e}")
except FileNotFoundError:
    print(f"The file {file_path} was not found.")
except Exception as e:
    print(f"An error occurred: {e}")
