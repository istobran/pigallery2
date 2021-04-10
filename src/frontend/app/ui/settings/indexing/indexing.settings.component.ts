import {Component, OnDestroy, OnInit} from '@angular/core';
import {IndexingSettingsService} from './indexing.settings.service';
import {AuthenticationService} from '../../../model/network/authentication.service';
import {NavigationService} from '../../../model/navigation.service';
import {NotificationService} from '../../../model/notification.service';
import {ErrorDTO} from '../../../../../common/entities/Error';
import {SettingsComponentDirective} from '../_abstract/abstract.settings.component';
import {Utils} from '../../../../../common/Utils';
import {I18n} from '@ngx-translate/i18n-polyfill';
import {ScheduledJobsService} from '../scheduled-jobs.service';
import {DefaultsJobs, JobDTO} from '../../../../../common/entities/job/JobDTO';
import {JobProgressStates} from '../../../../../common/entities/job/JobProgressDTO';
import {ServerConfig} from '../../../../../common/config/private/PrivateConfig';

@Component({
  selector: 'app-settings-indexing',
  templateUrl: './indexing.settings.component.html',
  styleUrls: ['./indexing.settings.component.css',
    '../_abstract/abstract.settings.component.css'],
  providers: [IndexingSettingsService],
})
export class IndexingSettingsComponent extends SettingsComponentDirective<ServerConfig.IndexingConfig, IndexingSettingsService>
  implements OnInit, OnDestroy {


  types: { key: number; value: string }[] = [];
  JobProgressStates = JobProgressStates;
  readonly indexingJobName = DefaultsJobs[DefaultsJobs.Indexing];
  readonly resetJobName = DefaultsJobs[DefaultsJobs['Database Reset']];

  constructor(_authService: AuthenticationService,
              _navigation: NavigationService,
              _settingsService: IndexingSettingsService,
              public jobsService: ScheduledJobsService,
              notification: NotificationService,
              i18n: I18n) {

    super(i18n('Folder indexing'),
      _authService,
      _navigation,
      _settingsService,
      notification,
      i18n,
      s => s.Server.Indexing);

  }

  get Progress() {
    return this.jobsService.progress.value[JobDTO.getHashName(DefaultsJobs[DefaultsJobs.Indexing])];
  }


  ngOnDestroy() {
    super.ngOnDestroy();
    this.jobsService.unsubscribeFromProgress();
  }

  async ngOnInit() {
    super.ngOnInit();
    this.jobsService.subscribeToProgress();
    this.types = Utils
      .enumToArray(ServerConfig.ReIndexingSensitivity);
    this.types.forEach(v => {
      switch (v.value) {
        case 'low':
          v.value = this.i18n('low');
          break;
        case 'medium':
          v.value = this.i18n('medium');
          break;
        case 'high':
          v.value = this.i18n('high');
          break;
      }
    });
  }


  async index() {
    this.inProgress = true;
    this.error = '';
    try {
      await this.jobsService.start(DefaultsJobs[DefaultsJobs.Indexing]);
      this.notification.info(this.i18n('Folder indexing started'));
      this.inProgress = false;
      return true;
    } catch (err) {
      console.log(err);
      if (err.message) {
        this.error = (<ErrorDTO>err).message;
      }
    }

    this.inProgress = false;
    return false;
  }

  async cancelIndexing() {
    this.inProgress = true;
    this.error = '';
    try {
      await this.jobsService.stop(DefaultsJobs[DefaultsJobs.Indexing]);
      this.notification.info(this.i18n('Folder indexing interrupted'));
      this.inProgress = false;
      return true;
    } catch (err) {
      console.log(err);
      if (err.message) {
        this.error = (<ErrorDTO>err).message;
      }
    }

    this.inProgress = false;
    return false;
  }

  async resetDatabase() {
    this.inProgress = true;
    this.error = '';
    try {
      await this.jobsService.start(DefaultsJobs[DefaultsJobs['Database Reset']]);
      this.notification.info(this.i18n('Resetting  database'));
      this.inProgress = false;
      return true;
    } catch (err) {
      console.log(err);
      if (err.message) {
        this.error = (<ErrorDTO>err).message;
      }
    }

    this.inProgress = false;
    return false;
  }


}



