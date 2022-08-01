type Message = {
  content: string;
  from: any;
  to: any;
};

type Notification = {  
  to: any;
  from:any;
  content: string;
  cardId: string;
  //is_read: boolean;
};

export default class InMemoryMessageStore {
  //can call from db when server restart, or save in local storage
  public messages: Array<Message>;
  public notifications: Array<Notification>;

  constructor() {
    this.messages = [];
    this.notifications = [];
  }

  saveMessage(message: Message) {
    this.messages.push(message);
  }

  findMessagesForUser(userID: string) {
    return this.messages.filter(
      ({ from, to }) =>
        (from.id as string) === userID || (to.id as string) === userID
    );
  }

  //search all message related to user including as sender or receiver
  findPrivateMessages(userID_first: string, userID_second: string) {
    return this.messages.filter(
      ({ from, to }) =>
        ((from.id as string) === userID_first &&
          (to.id as string) === userID_second) ||
        ((from.id as string) === userID_second &&
          (to.id as string) === userID_first)
    );
  }

  saveNotification(notification: Notification) {
    this.notifications.push(notification);
    console.log("Notification updated: ", this.notifications)
  }

  removeNotification(requestor_user_code: string, card_code: string) {
    let request_index = this.notifications.findIndex((t) => (
      t.from === requestor_user_code && t.cardId === card_code
    ))
    if(request_index > -1)
      this.notifications.splice(request_index, 1);
    console.log("Notification updated: ", this.notifications)
  }

  //all message will be wipe out after server restart
  findNotificationsForUser(username: string) {
    return this.notifications.filter(
      ({ to }) =>
        (to as string) === username
    );
  }

  findNotificationsForUserInGroup(user_code: string, requestor_code: string) {
    let user_notifications= this.notifications.filter(
      ({ to }) =>
        (to as string) === user_code
    );
    
    let content = ""
    if(user_notifications.length == 1) {
      content = user_notifications[0].content
    } else if(user_notifications.length > 1){
      content = `${user_notifications.length} new card requests to you`
    }

    let user_notification = {
      //to: user_code, 
      from: requestor_code,
      content: content
    };

    return user_notification
  }
}
