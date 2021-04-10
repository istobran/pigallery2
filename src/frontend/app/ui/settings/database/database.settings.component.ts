import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../model/network/authentication.service';
import {Utils} from '../../../../../common/Utils';
import {NotificationService} from '../../../model/notification.service';
import {NavigationService} from '../../../model/navigation.service';
import {SettingsComponentDirective} from '../_abstract/abstract.settings.component';
import {DatabaseSettingsService} from './database.settings.service';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {ServerConfig} from '../../../../../common/config/private/PrivateConfig';

@Component({
  selector: 'app-settings-database',
  templateUrl: './database.settings.component.html',
  styleUrls: ['./database.settings.component.css',
    '../_abstract/abstract.settings.component.css'],
  providers: [DatabaseSettingsService],
})
export class DatabaseSettingsComponent extends SettingsComponentDirective<ServerConfig.DataBaseConfig> implements OnInit {

  public types = Utils.enumToArray(ServerConfig.DatabaseType);
  public DatabaseType = ServerConfig.DatabaseType;

  constructor(_authService: AuthenticationService,
              _navigation: NavigationService,
              _settingsService: DatabaseSettingsService,
              notification: NotificationService,
              i18n: I18n) {
    super(i18n('Database'), _authService, _navigation, _settingsService, notification, i18n, s => s.Server.Database);
  }

  ngOnInit() {
    super.ngOnInit();
  }


}



