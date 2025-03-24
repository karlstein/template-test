## Make
You need make to run make command. Here are some source to get make for windows:
1. [Recommended] Using [Chocolatey](https://chocolatey.org/install), by run this command:
   ```bash
   choco install make
   ``` 
2. Download it from [here](https://gnuwin32.sourceforge.net/packages/make.htm), then install it.

If you are linux user, just install it from your prefered repo and don't ask.


## Build and Run Frontend and API

First, run the development server:

```bash
# make sure you able to run make command
make build # to build and run both frontend and api
# or
make run-fe # to build and run frontend only
# or
make run-api # to build and run api only
```

Open [http://localhost:3004](http://localhost:3004) with your browser to open the frontend.
[http://localhost:3005](http://localhost:3005), this is the api url.


## VSCode extension - TODO Tree
You need install TODO Tree from your extension tab or from [TODO Tree](https://marketplace.visualstudio.com/items?itemName=Gruntfuggly.todo-tree)


## Ready For The Test
There are currently 6 simple TODO.

1. 1. Add login api call to BE on port 3005 to upsert user data and get token then assign the token into token.authToken or whatever you prefer
   1. Assign token.authToken or token.(whatever you prefer) into session.authToken
   3. Assign token into cache named auth_token
2. 1. Get project and updates with params, limit and offset.
   2. You should get project updates data here and to pass it into state.
3. Change this svg into react component that can be changed by assign new value into props.
