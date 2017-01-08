import Ionic from 'ionic-scripts';
import { _ } from 'meteor/underscore';
import { Meteor } from 'meteor/meteor';
import { MeteorCameraUI } from 'meteor/okland:camera-ui';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats, Messages } from '../../../lib/collections';
import Angular from 'angular';

export default class ChatCtrl extends Controller {
  constructor() {
    super(...arguments);

    this.chatId = this.$stateParams.chatId;
    this.isIOS = Ionic.Platform.isWebView() && Ionic.Platform.isIOS();
    this.isCordova = Meteor.isCordova;

    this.helpers({
      messages() {
        return Messages.find({ chatId: this.chatId });
      },
      data() {
        return Chats.findOne(this.chatId);
      }
    });

    this.autoScroll();
  }

  sendPicture() {
    MeteorCameraUI.getPicture({}, (err, data) => {
      if (err) return this.handleError(err);
      console.log(data)
      this.callMethod('newMessage', {
        picture: data,
        type: 'picture',
        chatId: this.chatId
      });
    });
  }


  sendDraw() {
    var el = document.getElementById('canvas');

    this.callMethod('newMessage', {
      picture: el.toDataURL(),
      type: 'picture',
      chatId: this.chatId
    });
    //Clear the canvas image
    el.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
  }


  drawOnSelfie() {
    var el = document.getElementById('canvas');
    el.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
    MeteorCameraUI.getPicture({}, (err, data) => {
      if (err) return this.handleError(err);
      var img = new Image;
      img.src = data;
      console.log(img)
      var ctx = el.getContext('2d');
      ctx.drawImage(img, 0 , 0, el.width, el.height); // Or at whatever offset you like
    });
  }

  cleanCanvas() {
    var el = document.getElementById('canvas');
    el.getContext("2d").clearRect(0, 0, el.width, el.height);
  }

  sendMessage() {
    if (_.isEmpty(this.message)) return;

    this.callMethod('newMessage', {
      text: this.message,
      type: 'text',
      chatId: this.chatId
    });

    delete this.message;
  }

  inputUp () {
    if (this.isIOS) {
      this.keyboardHeight = 216;
    }

    this.scrollBottom(true);
  }

  inputDown () {
    if (this.isIOS) {
      this.keyboardHeight = 0;
    }

//    this.$ionicScrollDelegate.$getByHandle('chatScroll').resize(); //ligne du tuto de base qui ne fonctionne pas
  }

  closeKeyboard () {
    if (this.isCordova) {
      cordova.plugins.Keyboard.close();
    }
  }

  autoScroll() {
    let recentMessagesNum = this.messages.length;

    this.autorun(() => {
      const currMessagesNum = this.getCollectionReactively('messages').length;
      const animate = recentMessagesNum != currMessagesNum;
      recentMessagesNum = currMessagesNum;
      this.scrollBottom(animate);
    });
  }

  scrollBottom(animate) {
    this.$timeout(() => {
      this.$ionicScrollDelegate.$getByHandle('chatScroll').scrollBottom(animate);
    }, 300);
  }

  handleError(err) {
    if (err.error == 'cancel') return;
    this.$log.error('Profile save error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'Save failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

ChatCtrl.$name = 'ChatCtrl';
ChatCtrl.$inject = ['$stateParams', '$timeout', '$ionicScrollDelegate', '$ionicPopup', '$log'];
