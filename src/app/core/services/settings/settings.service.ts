import { Injectable } from "@angular/core";
import { HttpClientService } from "../http/http.service";
import { BehaviorSubject, Subject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  public modelClosed = new Subject<boolean>();
  public dataChanged = new Subject<boolean>();
  public detailsArrived = new BehaviorSubject<any>(null);

  constructor(private http: HttpClientService) {}

  getMonthDays(body) {
    return this.http.get(`settings/custom-dates`, body);
  }

  getUserProfile() {
    return this.http.get(`users/profile`);
  }

  updateUserProfile(data) {
    return this.http.postFormData(data, `users/edit-profile`);
  }
  uploadDocs(data) {
    return this.http.postFormData(data, `property-owner-info/edit-create`);
  }

  toggleNotifcation() {
    return this.http.post({}, `settings/send-push`);
  }

  changePassword(data) {
    return this.http.post(data, `users/change-password`);
  }

  changePhone(data) {
    return this.http.post(data, `users/change-phone`);
  }
  changePhoneConfirmation(data) {
    return this.http.post(data, `users/verify-change-phone`);
  }
  changeEmail(data) {
    return this.http.post(data, `users/change-email`);
  }
  changeEmailConfirmation(data) {
    return this.http.post(data, `users/verify-change-email`);
  }
}
