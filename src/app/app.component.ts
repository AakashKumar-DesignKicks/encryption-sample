import { Component } from '@angular/core';

import * as CryptoJS from 'crypto-js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'encryption';
  plainText: string;
  encryptText: string;
  encPassword: string;
  decPassword: string;
  conversionEncryptOutput: string;
  conversionDecryptOutput: string;

  constructor() {
  }

  convertText(conversion: string): void {
      if (conversion === 'encrypt') {
        this.encrypWay2();
      }
      else {
        this.decryptWay2();
    }
  }

  private encrypWay1(): void {
    this.conversionEncryptOutput = CryptoJS.AES.encrypt(this.plainText.trim(), this.encPassword.trim()).toString();
  }

  private decryptWay1(): void {
    this.conversionDecryptOutput = CryptoJS.AES.decrypt(this.encryptText.trim(), this.decPassword.trim()).toString(CryptoJS.enc.Utf8);
  }

  /**
   * @description This is as per medium.com article
   * Link - https://sstarx.medium.com/encryption-and-decryption-in-angular-asp-net-core-application-1f55bfa3d8bd
   * WORKS
   */
  private encrypWay2(): void {
    // WORKS
    const salt = CryptoJS.lib.WordArray.random(128 / 8);
    const encryptSecretKey = this.encPassword.trim();
    const keySize = 256;

    const key = CryptoJS.PBKDF2(encryptSecretKey, salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    const ivParam = CryptoJS.lib.WordArray.random(128 / 8);

    const encrypted = CryptoJS.AES.encrypt(this.plainText.trim(), key, {
      iv: ivParam,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    // salt, iv will be hex 32 in length
    // append them to the ciphertext for use  in decryption
    const transitmessage = salt.toString() + ivParam.toString() + encrypted.toString();

    this.conversionEncryptOutput = transitmessage;
  }

  /**
   * @description This is as per medium.com article
   * Link - https://sstarx.medium.com/encryption-and-decryption-in-angular-asp-net-core-application-1f55bfa3d8bd
   * WORKS
   */
  private decryptWay2(): void {
    // WORKS
    const keySize = 256;

    const salt = CryptoJS.enc.Hex.parse(this.encryptText.substr(0, 32));
    const ivParam = CryptoJS.enc.Hex.parse(this.encryptText.substr(32, 32));
    const encrypted = this.encryptText.substring(64);

    const key = CryptoJS.PBKDF2(this.decPassword.trim(), salt, {
      keySize: keySize / 32,
      iterations: 100
    });

    const decrypted = CryptoJS.AES.decrypt(encrypted, key, {
      iv: ivParam,
      padding: CryptoJS.pad.Pkcs7,
      mode: CryptoJS.mode.CBC
    });

    this.conversionDecryptOutput = decrypted.toString(CryptoJS.enc.Utf8);

  }

}
