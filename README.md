# usask-multi-sync
client code that relies on the GT library to sync mouse and user activity across different web apps

# TO DO 

1) Dont expect connection IP from user - Automatically connect to sandbox server

2) Then Dont expect room - Automatically connect to the room that corresponds to the application (we get this from the URL)

3) Authenticate user with a random hexadecimal code, instead of asking them to set it. Also maintain a name map for all users. 

4) Store these in cookies or session storage to fingerprint a user, incase they reload the page they reconnect back with this ID.

5) Automatically maintain a div overlay that has mouses tracked across users. 


