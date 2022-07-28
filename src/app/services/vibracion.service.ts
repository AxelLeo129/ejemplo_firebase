import { Injectable } from '@angular/core';
import { DeviceFeedback } from '@ionic-native/device-feedback/ngx';
import { TapticEngine } from '@ionic-native/taptic-engine/ngx';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class VibracionService {

  constructor(
    private deviceFeedback: DeviceFeedback,
    private tapticEngine: TapticEngine,
    private platform: Platform

  ) { }

  vibrarAlerta() {
    if (this.platform.is("android")) {
      this.deviceFeedback.haptic(1)
    } else {
      this.tapticEngine.impact({ style: "light" })
    }
  }
  vibrarMedio() {
    if (this.platform.is("android")) {
      this.deviceFeedback.haptic(1)
    } else {
      this.tapticEngine.impact({ style: "medium" })
    }
  }
  vibrarImpacto() {
    if (this.platform.is("android")) {
      this.deviceFeedback.haptic(0)
    } else {
      this.tapticEngine.impact({ style: "heavy" })
    }
  }
  vibrarCorrecto() {
    if (this.platform.is("android")) {
      this.deviceFeedback.haptic(0)
    } else {
      this.tapticEngine.notification({ type: "success" })
    }
  }
  vibrarIncorrecto() {
    if (this.platform.is("android")) {
      this.deviceFeedback.haptic(0)
    } else {
      this.tapticEngine.notification({ type: "error" })
    }
  }
}
