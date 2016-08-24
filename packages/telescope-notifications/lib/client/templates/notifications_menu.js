var getNotifications = function () {
  return Herald.collection.find({userId: Meteor.userId(), read: false}, {sort: {timestamp: -1}}).fetch();
};

Template.notifications_menu.helpers({
  hasNotifications: function () {
    var notifications = getNotifications();
    return notifications.length;
  },
  menuLabel: function () {
    var notificationsCount;
    var notifications = getNotifications();

    if (this.zone === "mobileNav") {

      if(notifications.length === 0){
        notificationsCount = i18n.t('no_notifications');

      }else{
        notificationsCount = notifications.length+' '+ i18n.t('notifications');

      }


    }
    else{
      if(notifications.length === 0){
        notificationsCount = "<div class='dropdown'><i class='fa fa-bell-o fa-lg fa-fw'></i></div>";
      }else{
        notificationsCount = "<div class='dropdown'><i class='fa fa-bell-o fa-lg fa-fw'></i><div class='label label-danger'>"+notifications.length+"</div></div>";
      }

    }

    

    return notificationsCount;
  },
  menuItems: function () {
    var notifications = getNotifications();
    var markAllAsRead = [{
      template: 'notifications_mark_as_read'
    }];
    var menuItems;
    if (notifications.length) {
      menuItems = markAllAsRead.concat(_.map(notifications, function (notification) {
        return {
          template: "notification_item",
          data: notification
        };
      }));
    } else {
      menuItems = [];
    }
    return menuItems;
  },
  menuType: function () {
    if (this.zone === "mobileNav") {
      return 'collapsible';
    } else if (Settings.get('navLayout', 'top-nav') === 'top-nav') {
      return 'dropdown';
    } else {
      return 'collapsible';
    }
  }
});
