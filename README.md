# PC-Build-App

The purpose of this application is to aid the user in building his own PC, giving him access to a large database of components and an ever-expanding network of suppliers.

The users can log in, select a bunch of components to be added to his configuration, and then send a request to the server to have the specific components provisioned.

The components the user seeks may be found in the local database or not. If all of the components aren't found, a message is published to an SNS topic to inform the suppliers of the missing stock, which connect to the broader system using SQS queues.

For any order that takes a while the user can be notified via SMS when the missing compoents are received.

*A Look inside the Application*

![image](https://github.com/AndreiM29/PC-Build-App/assets/72067795/25cb7fdd-b6eb-49c9-a81e-3e7f4856d6a9)


*The System Architecture in the PC-Build-App.*

![system](https://github.com/AndreiM29/PC-Build-App/assets/72067795/8b776ba2-4f8b-4dcb-ace3-f3a2e12f51bf)

*The main flow within the PC-Build-App.*


![flow1](https://github.com/AndreiM29/PC-Build-App/assets/72067795/27b2d1b1-2737-4aab-a636-ea5e1405fa17)

*Illustration of the component selector*


![selector](https://github.com/AndreiM29/PC-Build-App/assets/72067795/3758c17d-838d-4563-8e42-c430e2ad2119)

*A notification indicating that the components have been sent in the PC-Build-App.*

![sentc](https://github.com/AndreiM29/PC-Build-App/assets/72067795/c220c764-2814-49b6-9aa5-c5f3c7e2f576)

*The page where the user can see all of the ordered Configurations.*

![image](https://github.com/AndreiM29/PC-Build-App/assets/72067795/43476eb8-9a26-44be-8a39-cb697dce923a)






