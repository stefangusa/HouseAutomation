HouseAutomation - a minimal Javascript application

This application simulates house automation, where the house is a 'svg' houseplan image and the 
server where the initial configuration is stored is a file - the configuration is the 'json' 
content of the file.

To run this application, run a simple HTTP server in the root directory of the project and 
query '/' or 'index.html'.

Technologies used in the application development are: HTML, CSS, Bootstrap, Javascript, jQuery (+ AJAX).


The components are the following:

1. index.html is the website, which consists of the control panel on the left and the houseplan image
on the right. The panel is created by 'app.js' script while the image is store locally by this file 
due to the fact that otherwise changing its attributes would have been more difficult.

2. css/app.css stores the styles of the website.

3. js/app.js is the Javascript file where the control panel is generated by querying the server and 
creating the room, each with their attributes which are customisable.

4. server/initialConfiguration.json is the server file.


The room attributes implemented are:
i)    light - when it is switched on, the colour of the room is brightened while when it is switched off, 
              the colour is darkened.
           
ii)   curtains - when they are opened, the colour of the room is brightened and they are not visible, 
                 while when they are closed, the colour of the room is darkend and the curtains are 
                 visible as red lines on the exterior walls.
                 
iii)  temperature - the initial temperature is 23oC, there are 2 button that can raise on lower it. 
                    The maximum temperature is 28oC, while the minimum is 16oC. It is also present 
                    on the image for each room.
                    
Important: The bathroom and the pantry do not have curtains as I have never visited a house with
curtains in those places. :)
