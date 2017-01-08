import { Meteor } from 'meteor/meteor';
import { Controller } from 'angular-ecmascript/module-helpers';
import { Chats } from '../../../lib/collections';

export default class DrawBoardCtrl extends Controller {
  constructor() {
    super(...arguments);
    console.log(this)

  }

  hideDrawBoardModal() {
    this.DrawBoard.hideModal();
  }

  handleError(err) {
    this.$log.error('New chat creation error ', err);

    this.$ionicPopup.alert({
      title: err.reason || 'New chat creation failed',
      template: 'Please try again',
      okType: 'button-positive button-clear'
    });
  }
}

DrawBoardCtrl.$name = 'DrawBoardCtrl';
DrawBoardCtrl.$inject = ['$state', 'DrawBoard', '$ionicPopup', '$log'];
