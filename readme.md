# RemindMe2

Building a reminder app using an async architecture.


#### Starting eventstore
Download the ``adbrowne/eventstore`` docker image, and run the following:

```sh
docker run -i -p 2113:2113 -p 1113:1113 adbrowne/eventstore
```

### Email-receiver
The job of the email receiver is to just put receied emails onto the event stream

#### Docker

**Building**
```sh
docker build -t email-reciver ./email-reciver
```
**Running**
```sh
docker run -i -p 8080:8080 email-receiver
```

#### Todo
* [x] Put email-receiver in docker
* [x] Build and  manually launch eventstore and email-receiver to Digital Ocean
* [x] Get it to work manually, and reset event stream
* [x] Hook email-receiver to SendGrid incoming email API
* [ ] Change stream username and password, and remove it from code
* [ ] Secure the SendGrid webhook

### Email parser
Should read emails from the event stream and parse them and put them into a task stream.

* [ ] Define the task interface / format
