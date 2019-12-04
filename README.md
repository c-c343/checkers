# Centipede-Army Checkers
 This will be a comprehensive guide on how to launch the server that houses the Centipede Army Checkers game. Additionally, we will discuss how to run the test script to make sure that the server is running properly, and how to tunnel the server to NGROK so as to bypass preexisting network restrictions when trying to run multiplayer. This guide will explain how to run the server for both Mac/Linux and Windows. This guide  will assume that you have the Git CLI installed, as well as NodeJS, NPM, Pip, and Python 3. 

## Mac/Linux Systems

1. Clone our repository

`git clone https://git.txstate.edu/CS-3398-001-Fall2018/centipede-army-repo.git`

2. *cd* into the cloned folder

`cd centipede-army-repo`

3. Create a binary executable for *compile.sh*

`chmod 755 compile.sh`

4. Run the binary executable. This will install all of the dependencies for the project and then launch the server on port 5000

`./compile`

5. In a separate terminal window, tunnel the local host to NKGROK. We will first have to register the Centipede Army NGROK account with the machine running the server, and then we will be able to tunnel. 

`./ngrok authtoken 6SaqL8BLwHvP528NrwRJN_73FZbARgJXcZD6opRHZi4`

`./ngrok http -subdomain=centipedecheckers 5000`

6. For the most accurate results, we recommend running the python automated test script after tunneling the server to NGROK, and before any client socket connections are made. First, install the python dependencies from requirements.txt in a third terminal window and then launch the script

`pip install -r requirements.txt`

`python main.py`

7. CONGRATULATIONS! You can now access Centipede Checkers at centipedecheckers.ngrok.io and get access to Singleplayer, Multiplayer, Spectator Mode and subscribe for real time text message updates. 

## Windows Systems

1. Download either Git Bash or CMDER so that you can run linux style commands in a windows environment. 

2. Install NGROK locally

3. Add NGROK to your PATH

4. Proceed with the Mac/Linux steps
