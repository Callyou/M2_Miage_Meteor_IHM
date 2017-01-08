import { Service } from 'angular-ecmascript/module-helpers';
import drawBoardTemplateUrl from '../../templates/drawBoardModal.html';


export default class DrawBoardService extends Service {
  constructor() {
    super(...arguments);

    this.templateUrl = drawBoardTemplateUrl;
  }

  showModal() {
    this.scope = this.$rootScope.$new();

    this.$ionicModal.fromTemplateUrl(this.templateUrl, {
      scope: this.scope
    })
    .then((modal) => {
      this.modal = modal;
      this.modal.show();
    });
  }

  hideModal() {
    this.scope.$destroy();
    this.modal.remove();
  }
}

DrawBoardService.$name = 'DrawBoard';
DrawBoardService.$inject = ['$rootScope', '$ionicModal'];
